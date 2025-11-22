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

    user_id = data.get("user_id")
    profile = data.get("profile")
    count = data.get("rec_count")

    # Calculate credit cost
    credit_cost = count * 5

    # Check if enough credit to proceed
    credit_balance = get_user_credit(user_id)

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
    ok, msg = deduct_user_credit(user_id, credit_cost)

    if not ok:
        return jsonify({"success": False, "error": msg}), 402  # payment required / insufficient credits

    # 4 — Return recommendations
    return jsonify({
        "success": True,
        "credits_message": msg,
        "results": [r.model_dump() for r in results]
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
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    try:
        user_id = str(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400

    lists = get_user_lists(user_id)
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
    user_id = data.get("user_id")
    list_name = data.get("list_name")
    if not user_id or not list_name:
        return jsonify({"error": "user_id and list_name are required"}), 400
    try:
        user_id = str(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400

    new_list = create_list(user_id, list_name)
    return jsonify({"message": f"List '{list_name}' created.", "list_id": new_list.id}), 200

# -------------------------------
# Add Book to a List
# -------------------------------
@app.route("/lists/add", methods=["POST"])
def add_book():
    """
    Add a Google Book ID to a user's list.
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

    add_book_to_list(user_id, list_name, book_id)
    return jsonify({"message": f"Book '{book_id}' added to list '{list_name}'"}), 200

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
