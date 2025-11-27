from flask import Blueprint, request, jsonify, make_response
from config import serializer
from datetime import datetime, timedelta, timezone
from auth import register_user, login_user, get_current_user
import os

auth_bp = Blueprint('auth', __name__)

# Register Route
@auth_bp.route("/register", methods=["POST"])
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
@auth_bp.route("/login", methods=["POST"])
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
@auth_bp.route("/auth/profile", methods=["POST"])
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
@auth_bp.route("/auth/check", methods=["POST"])
def auth_check():
    user = get_current_user()
    if user:
        return jsonify({"authenticated": True}), 200
    return jsonify({"authenticated": False}), 401


# Logout
@auth_bp.route("/logout", methods=["POST"])
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


@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)
    except Exception as e:
        return jsonify({"error": "The confirmation link is invalid or has expired."}), 400

    from db_config import session, User
    user = session.query(User).filter_by(email=email).first()
    
    if user:
        if user.verified:
             return jsonify({"message": "Account already verified. Please login."}), 200
        
        user.verified = True
        session.add(user)
        session.commit()
        return jsonify({"message": "You have confirmed your account. Thanks!"}), 200
    
    return jsonify({"error": "User not found"}), 404
