from flask import Flask, request, jsonify, make_response, render_template
from config import serializer
from datetime import datetime,timedelta, timezone
from flask_cors import CORS
from auth import register_user, login_user, get_current_user
from recommender import get_recommendations
from db_config import session, User
from db_functions import (
    create_list,
    add_book_to_list,
    remove_book_from_list,
    get_user_lists,
    get_books_from_list,
    delete_list,
    deduct_user_credit,
    get_user_credit
)

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173"])

# -------------------------------
# Home Route
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    """Simple health check to ensure the server is running."""
    return "<h1>Server Running...</h1>", 200


@app.route("/dashboard")
def dashboard():
    user = get_current_user()

    # User must be logged in
    if not user:
        return "You are not logged in!"

    # User must be admin
    if not user.admin:
        return "You are not allowed here!"

    # ----- Metrics -----
    metrics = {
        "total_users": session.query(User).count()
    }

    return jsonify(metrics), 200


# -------------------------------
# Register Route
# -------------------------------
@app.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    Request JSON: { "name": str, "email": str, "password": str, "admin": bool (optional) }
    Response: success or error message
    """
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    admin = data.get("admin", False)  # default to False if not provided
    verified = data.get("verified", False)  # default to False if not provided

    if not (name and email and password):
        return jsonify({"error": "Missing required fields"}), 400

    # Call your db function and pass the admin flag
    success, message = register_user(name, email, password, admin=admin, verified=verified)

    if success:
        return jsonify({"success": message}), 200
    return jsonify({"error": message}), 400


# -------------------------------
# Login Route
# -------------------------------
@app.route("/login", methods=["POST"])
def login():
    """
    Login an existing user.
    Request JSON: { "email": str, "password": str }
    Response: user info on success, error on failure
    """
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"error": "Email and password are required"}), 400

    success, user_or_message = login_user(email, password)
    if success:
        user = user_or_message

        # Sign the user ID and set as cookie
        cookie_value = serializer.dumps(user.id)
        resp = make_response(jsonify({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "verified": user.verified,
            "admin": user.admin,
            "avatar_url": user.avatar_url,
            "credit_limit": user.credit_limit
        }))

        cookies_expires_at = datetime.now(timezone.utc) + timedelta(days=2)
        resp.set_cookie(
            "user_id",
            cookie_value,
            httponly=True,
            samesite="Lax",
            expires=cookies_expires_at
        )
        return resp, 200

    return jsonify({"error": user_or_message}), 400


@app.route("/auth/check", methods=["GET"])
def auth_check():
    user = get_current_user()
    if user:
        return jsonify({"authenticated": True}), 200
    return jsonify({"authenticated": False}), 401

@app.route("/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"message": "Logged out"}))
    resp.set_cookie(
        "user_id",
        "",
        expires=0,
        httponly=True,
        samesite="Lax"
    )
    return resp, 200


# -------------------------------
# Recommendations Route
# -------------------------------
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json

    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    profile = data.get("profile")
    count = data.get("rec_count")

    # Calculate credit cost
    credit_cost = count * 5

    # Check if enough credit to proceed
    credit_balance = user.credit_limit

    if(not credit_balance >= credit_cost):
        return jsonify({"error": "Not enough credits"}), 400

    # 1 — Run the recommender
    results = get_recommendations(profile, count, scrape=False)

    # 2 — Check for failure
    if isinstance(results, dict) and "error" in results:
        return jsonify({
            "success": False,
            "error": results["error"],
            "details": results.get("details", "")
        }), 500

    # 3 — Deduct credits ONLY after success
    ok, msg = deduct_user_credit(user, amount=credit_cost)

    if not ok:
        return jsonify({"success": False, "error": msg}), 402  # payment required / insufficient credits

    # 4 — Return recommendations
    return jsonify({
        "success": True,
        "credits_message": msg,
        "results": [r.model_dump() for r in results]
    })

@app.route("/dummy-recommend", methods=["POST"])
def dummy_recommend():
    results = [
        {
            "author": "Alex Michaelides",
            "genre": [
                "Psychological Thriller",
                "Mystery",
                "Suspense"
            ],
            "genre_match": 0.9,
            "match_score": 0.875,
            "mood_match": 0.9,
            "pacing_match": 0.9,
            "scrape_data": {},
            "similarity_to_liked_books": "Most similar to 'Gone Girl' due to its psychological suspense, unreliable narrators (in a way), and focus on a shocking crime within a relationship. The constant unraveling of truth aligns with the mystery aspect.",
            "summary": "Alicia Berenson, a famous painter, shoots her fashion photographer husband Gabriel five times in the face and then never speaks another word. Theo Faber, a psychotherapist, is convinced he can unravel the mystery of why Alicia committed the murder and get her to speak again, leading him down a dark path into her past and his own.",
            "theme_match": 0.8,
            "title": "The Silent Patient",
            "total_score": 0.89,
            "why_it_matches": "If you enjoyed the intricate plot, shocking twists, and deep psychological exploration of marriage and deceit in 'Gone Girl', 'The Silent Patient' will captivate you. It delves into the dark corners of the human mind and keeps you guessing until the very end."
        },
        {
            "author": "Hermann Hesse",
            "genre": [
                "Philosophical Fiction",
                "Spiritual Journey",
                "Classic"
            ],
            "genre_match": 0.9,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.6,
            "scrape_data": {},
            "similarity_to_liked_books": "Strongly aligns with 'The Alchemist' in its genre, mood, and core themes of a spiritual quest, self-realization, and finding meaning in life's journey. It's a classic with enduring philosophical insights, similar to 'To Kill a Mockingbird's' classic status for moral reflection.",
            "summary": "The story of a young man's quest for enlightenment, set in ancient India during the time of the Buddha. Siddhartha leaves his privileged life to seek truth through various spiritual paths, experiencing asceticism, the pleasures of the material world, and finally, finding wisdom through observation and acceptance.",
            "theme_match": 0.9,
            "title": "Siddhartha",
            "total_score": 0.84,
            "why_it_matches": "If 'The Alchemist' resonated with your desire for a philosophical journey of self-discovery, spiritual growth, and the pursuit of one's personal truth, 'Siddhartha' offers a profound and contemplative exploration of similar themes. It is a classic of spiritual literature that encourages deep reflection on the meaning of life."
        },
        {
            "author": "Khaled Hosseini",
            "genre": [
                "Literary Fiction",
                "Historical Fiction",
                "Coming-of-Age"
            ],
            "genre_match": 0.8,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Shares 'To Kill a Mockingbird's' deep emotional impact, exploration of social and ethnic divisions, and focus on justice and redemption. It also features a complex moral landscape and a coming-of-age narrative.",
            "summary": "The unforgettable story of Amir, a wealthy Pashtun boy, and Hassan, the son of his father's Hazara servant, set against a backdrop of tumultuous events in Afghanistan from the 1970s to the early 2000s. It is a powerful narrative of friendship, betrayal, and the quest for redemption.",
            "theme_match": 0.9,
            "title": "The Kite Runner",
            "total_score": 0.82,
            "why_it_matches": "For readers who appreciated 'To Kill a Mockingbird's' profound exploration of morality, social injustice, and the complexities of human relationships through a child's perspective, 'The Kite Runner' offers a similarly poignant and emotionally resonant journey. It tackles themes of guilt, forgiveness, and the long shadow of past actions, while offering a rich cultural backdrop."
        },
        {
            "author": "Donna Tartt",
            "genre": [
                "Literary Fiction",
                "Dark Academia",
                "Psychological Suspense"
            ],
            "genre_match": 0.8,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Combines the psychological intensity and moral ambiguity of 'Gone Girl' with the literary quality and exploration of societal/group dynamics found in 'To Kill a Mockingbird'. It features a complex cast of characters and a mystery at its core.",
            "summary": "A group of eccentric and intense classics students at an elite New England college fall under the spell of their charismatic professor, leading them down a path of intellectual obsession, moral ambiguity, and eventually, murder.",
            "theme_match": 0.9,
            "title": "The Secret History",
            "total_score": 0.82,
            "why_it_matches": "If you are drawn to the psychological depth and moral questioning found in 'Gone Girl' and the insightful character studies and profound themes of 'To Kill a Mockingbird', 'The Secret History' will appeal. It masterfully builds suspense not just through plot, but through the intricate psychology of its characters and their descent into darkness."
        },
        {
            "author": "Yann Martel",
            "genre": [
                "Philosophical Fiction",
                "Adventure",
                "Magical Realism"
            ],
            "genre_match": 0.8,
            "match_score": 0.8,
            "mood_match": 0.8,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Similar to 'The Alchemist' in its philosophical underpinnings and allegorical style, focusing on a character's transformative journey. The intense survival aspect and unexpected twists also have a distant echo of the gripping nature of 'Gone Girl'.",
            "summary": "The incredible tale of Pi Patel, a young Indian boy who survives a shipwreck in the Pacific Ocean and is cast adrift on a lifeboat with a Bengal tiger, a hyena, an orangutan, and a zebra. It is a story of survival, faith, and the power of storytelling.",
            "theme_match": 0.9,
            "title": "Life of Pi",
            "total_score": 0.79,
            "why_it_matches": "For those who enjoyed the allegorical nature and philosophical depth of 'The Alchemist', 'Life of Pi' presents a thrilling adventure that is equally rich in symbolic meaning and spiritual contemplation. It's a journey of profound self-discovery and survival against impossible odds, prompting questions about belief and reality."
        }
    ]

    return jsonify({
        "success": True,
        "credits_message": "Using Dummy Recommender",
        "results": results
    })


# -------------------------------
# Get All Lists for a User
# -------------------------------
@app.route("/lists", methods=["GET"])
def get_lists():
    """
    Fetch all book lists for a user.
    Query Params: user_id (int)
    Response: { list_name: [book_ids] }
    """
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    lists = get_user_lists(user)
    return jsonify(lists), 200

# -------------------------------
# Create a New Book List
# -------------------------------
@app.route("/lists", methods=["POST"])
def create_new_list():
    """
    Create a new book list for a user.
    Request JSON: { user_id: int, list_name: str }
    Response: success message and list ID
    """
    data = request.json or {}
    
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    list_name = data.get("list_name")

    if not user or not list_name:
        return jsonify({"error": "user and list_name are required"}), 400

    new_list = create_list(user, list_name)
    return jsonify({"message": f"List '{list_name}' created.", "list_id": new_list.id}), 200

# -------------------------------
# Add Book to a List
# -------------------------------
@app.route("/lists/add", methods=["POST"])
def add_book():
    """
    Add a Book To A User List
    Request JSON: { 
        user: obj, 
        list_name: str, 
        list_id: str, 
        book: {
            img: str
            title: str,
            author: str,
            year: str,
            genres: list,
            summary: str,
        } 
    }
    Response: success message
    """
    data = request.json or {}

    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    list_name = data.get("list_name")
    list_id = data.get("list_id")
    book = data.get("book")

    if not (user and list_id and book and list_name):
        return jsonify({"error": "user, list_name, list_id, and book are required"}), 400


    add_book_to_list(user, list_name, list_id, book)
    return jsonify({"message": f"Book '{book['title']}' added to list '{list_name}'"}), 200

# -------------------------------
# Remove Book from a List
# -------------------------------
@app.route("/lists/remove", methods=["POST"])
def remove_book():
    """
    Remove a Google Book ID from a user's list.
    Request JSON: { user_id: int, list_name: str, book_id: str }
    Response: success message
    """
    data = request.json or {}
    user_id = data.get("user_id")
    list_name = data.get("list_name")
    book_id = data.get("book_id")
    if not (user_id and list_name and book_id):
        return jsonify({"error": "user_id, list_name, and book_id are required"}), 400
    try:
        user_id = str(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400

    remove_book_from_list(user_id, list_name, book_id)
    return jsonify({"message": f"Book '{book_id}' removed from list '{list_name}'"}), 200

# -------------------------------
# Get All Books from a List
# -------------------------------
@app.route("/lists/books", methods=["GET"])
def list_books():
    """
    Fetch all Google Book IDs from a user's list.
    Query Params: user_id (int), list_name (str)
    Response: list of book IDs
    """
    user_id = request.args.get("user_id")
    list_name = request.args.get("list_name")
    if not user_id or not list_name:
        return jsonify({"error": "user_id and list_name are required"}), 400
    try:
        user_id = str(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400

    books = get_books_from_list(user_id, list_name)
    return jsonify(books), 200

# -------------------------------
# Delete a Book List
# -------------------------------
@app.route("/lists/delete", methods=["POST"])
def delete_book_list():
    """
    Delete a user's book list completely.
    Request JSON: { user_id: int, list_name: str }
    Response: success or error message
    """
    data = request.json or {}
    user_id = data.get("user_id")
    list_name = data.get("list_name")

    if not (user_id and list_name):
        return jsonify({"error": "user_id and list_name are required"}), 400
    try:
        user_id = str(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400

    success = delete_list(user_id, list_name)
    if success:
        return jsonify({"message": f"List '{list_name}' deleted successfully"}), 200
    return jsonify({"error": f"List '{list_name}' not found"}), 404

# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
