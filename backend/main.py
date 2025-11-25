from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_mail import Mail, Message
from config import serializer
from datetime import datetime,timedelta, timezone
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
from dotenv import load_dotenv
import os


load_dotenv()

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173"])

# Mailjet SMTP settings
app.config['MAIL_SERVER'] = 'in-v3.mailjet.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True


app.config['MAIL_USERNAME'] = os.getenv('MAILJET_API_KEY')
app.config['MAIL_PASSWORD'] = os.getenv('MAILJET_SECRET_KEY')

mail = Mail(app)


# Home Route
@app.route("/", methods=["GET"])
def home():
    """Simple health check to ensure the server is running."""
    return "<h1>Server Running...</h1>", 200


# Dashbaord Route
@app.route("/dashboard")
def dashboard():
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    if not user.admin:
        return "You are not allowed here!"

    metrics = {
        "total_users": session.query(User).count()
    }

    return jsonify(metrics), 200



# Register Route
@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}

    print(data)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    avatar_url= data.get("avatar_url")
    admin = data.get("admin", False)  # Remove this in productions
    verified = data.get("verified", False) # Remove this in productions

    if not (name and email and password and avatar_url):
        return jsonify({"error": "Missing required fields"}), 400

    success, message = register_user(name, email, password, avatar_url=avatar_url, admin=admin, verified=verified)

    if success:
        return jsonify({"success": message}), 200
    return jsonify({"error": message}), 400



# Login Route
@app.route("/login", methods=["POST"])
def login():
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

        cookies_expires_at = datetime.now(timezone.utc) + timedelta(days=5)
        resp.set_cookie(
            "user_id",
            cookie_value,
            httponly=True,
            samesite="Lax",
            expires=cookies_expires_at
        )
        return resp, 200

    return jsonify({"error": user_or_message}), 400


# Get user profile
@app.route("/auth/profile", methods=["POST"])
def get_profile():
    user = get_current_user()
    
    if user:
        profile = {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "verified": user.verified,
            "admin": user.admin,
            "avatar_url": user.avatar_url,
            "credit_limit": user.credit_limit
        }
        return jsonify({"authenticated": True, "profile": profile}), 200
    
    return jsonify({"authenticated": False}), 401


# Check if logged in
@app.route("/auth/check", methods=["POST"])
def auth_check():
    user = get_current_user()
    if user:
        return jsonify({"authenticated": True}), 200
    return jsonify({"authenticated": False}), 401


# Logout
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



# Recommendations Route
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json

    # Check if user is authenticated
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

# Dummy Recommender For Testing
@app.route("/dummy-recommend", methods=["POST"])
def dummy_recommend():

    data = request.json

    # Check if user is authenticated
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



# Get All Book Lists for a User
@app.route("/lists", methods=["GET"])
def get_lists():
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    lists = get_user_lists(user)
    return jsonify(lists), 200



# Create a New Book List for a user
@app.route("/lists", methods=["POST"])
def create_new_list():
    data = request.json or {}
    
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    list_name = data.get("list_name")

    if not user or not list_name:
        return jsonify({"error": "user and list_name are required"}), 400

    new_list = create_list(user, list_name)
    return jsonify({"success": True, "list_name": list_name, "list_id": new_list.id}), 200


# Add Book to a List
@app.route("/lists/add", methods=["POST"])
def add_book():
    """
    Request JSON: { 
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
    """
    data = request.json or {}

    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    list_name = data.get("list_name")
    list_id = data.get("list_id")
    book = data.get("book")

    if not (user and list_name and list_id and book):
        return jsonify({"error": "user, list_name, list_id, and book are required"}), 400


    add_book_to_list(user, list_name, list_id, book)
    return jsonify({"success": True, "message" :  f"added to list {list_name}"}), 200


# Remove Book from a List
@app.route("/lists/remove", methods=["POST"])
def remove_book():
    data = request.json or {}

    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    list_id = data.get("list_id")
    book = data.get("book")

    if not (user and list_id and book):
        return jsonify({"error": "user, list_id, and book are required"}), 400

    remove_book_from_list(user, list_id, book)
    return jsonify({"success": True, "message" :  f"removed from list {list_id}"}), 200


# Get All Books from a List
@app.route("/lists/books", methods=["GET"])
def list_books():
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    list_id = request.args.get("list_id")
    if not user or not list_id:
        return jsonify({"error": "user and list_id are required"}), 400

    books = get_books_from_list(user, list_id)
    return jsonify(books), 200


# Delete a Book List
@app.route("/lists/delete", methods=["POST"])
def delete_book_list():
    data = request.json or {}

    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    list_id = data.get("list_id")

    if not (user and list_id):
        return jsonify({"error": "user, list_id, and book are required"}), 400

    success = delete_list(user, list_id)
    if success:
        return jsonify({"success": True, "message" :  f"Deleted list {list_id}"}), 200

    return jsonify({"error": f"List '{list_id}' not found"}), 404


@app.route("/test-email")
def test_email():
    msg = Message(
        "Mailjet Test Email",
        sender="ui.yazir@gmail.com",
        recipients=["yazfeatz@gmail.com"],
        body="Hello! If you received this, Mailjet is working."
    )
    mail.send(msg)
    return "Email sent!"



if __name__ == "__main__":
    app.run(debug=True)
