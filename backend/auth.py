from flask import request
from db_config import session, User
import bcrypt
from config import serializer


def register_user(name, email, password, admin=False, verified=False):
    """
    Registers a new user.
    admin: bool, default False
    """
    # Basic validation
    if not (name and email and password):
        return False, "Missing fields"

    # Normalize email
    email = email.strip().lower()

    # Check if user already exists
    existing_user = session.query(User).filter_by(email=email).first()
    if existing_user:
        return False, "User already exists"

    # Hash password
    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Create new user with optional admin flag
    new_user = User(name=name, email=email, password=hashed_pw, admin=admin, verified=verified)
    session.add(new_user)
    session.commit()

    return True, "User registered successfully"


def login_user(email, password):
    if not (email and password):
        return False, "Missing fields"

    email = email.strip().lower()
    user = session.query(User).filter_by(email=email).first()
    if not user:
        return False, "Invalid email or password"

    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return False, "Invalid email or password"

    return True, user


def get_current_user():
    cookie_value = request.cookies.get("user_id")
    if not cookie_value:
        return None
    try:
        user_id = serializer.loads(cookie_value)
        user = session.query(User).get(user_id)
        return user
    except:
        return None


