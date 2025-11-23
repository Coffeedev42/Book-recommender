from flask import request
from db_config import session, User
import bcrypt
from config import serializer


def register_user(name, email, password, admin=False, verified=False):
    if not (name and email and password):
        return False, "Missing email or password fields"

    # Normalize email
    email = email.strip().lower()

    # Check if user already exists
    existing_user = session.query(User).filter_by(email=email).first()
    if existing_user:
        return False, f"User {email} already exists"

    # Hash password
    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Create new user
    new_user = User(name=name, email=email, password=hashed_pw, admin=admin, verified=verified)
    session.add(new_user)
    session.commit()

    return True, f"User {email} registered successfully"


def login_user(email, password):
    if not (email and password):
        return False, "Missing fields"

    # Normalize email
    email = email.strip().lower()

    # Check if user exists
    user = session.query(User).filter_by(email=email).first()
    if not user:
        return False, "Invalid email or password"

    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return False, "Invalid email or password"

    return True, user


# Check if a valid user is authenticated
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


