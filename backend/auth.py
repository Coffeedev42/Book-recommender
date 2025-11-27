from flask import request, url_for
from db_config import session, User
import bcrypt
from config import serializer
from extensions import mail
from flask_mail import Message


def register_user(name, email, password, avatar_url, admin=False, verified=False):
    if not (name and email and password and avatar_url):
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
    # Force verified=False for new registrations unless explicitly overridden (e.g. by admin or tests)
    new_user = User(name=name, email=email, password=hashed_pw, admin=admin, avatar_url=avatar_url, verified=verified)
    session.add(new_user)
    session.commit()

    # Send verification email
    try:
        token = serializer.dumps(email, salt='email-confirm')
        link = url_for('auth.verify_email', token=token, _external=True)
        
        msg = Message('Confirm Your Email', sender='ui.yazir@gmail.com', recipients=[email])
        msg.body = f'Your link is {link}'
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        # Ideally we might want to rollback or mark user as needing email resend, 
        # but for now we proceed and user can request resend later.

    return True, f"User {email} registered successfully. Please check your email to verify."


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

    if not user.verified:
        return False, "Email not verified"

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


