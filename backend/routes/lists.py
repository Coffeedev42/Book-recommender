from flask import Blueprint, request, jsonify
from auth import get_current_user
from db_functions import (
    create_list,
    add_book_to_list,
    remove_book_from_list,
    get_user_lists,
    get_books_from_list,
    delete_list
)

lists_bp = Blueprint('lists', __name__)

# Get All Book Lists for a User
@lists_bp.route("/lists", methods=["GET"])
def get_lists():
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    lists = get_user_lists(user)
    return jsonify(lists), 200


# Create a New Book List for a user
@lists_bp.route("/lists", methods=["POST"])
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
@lists_bp.route("/lists/add", methods=["POST"])
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
            why_it_matches: str
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
@lists_bp.route("/lists/remove", methods=["POST"])
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
@lists_bp.route("/lists/books", methods=["GET"])
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
@lists_bp.route("/lists/delete", methods=["POST"])
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
