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
        
        msg = Message('Fred.ai - Verify Your Email', sender='ui.yazir@gmail.com', recipients=[email])
        
        # HTML email template
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f3f4f6;
                }}
                .container {{
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #D55414 0%, #B9562D 100%);
                    padding: 40px 20px;
                    text-align: center;
                }}
                .logo {{
                    width: 120px;
                    height: auto;
                    margin-bottom: 10px;
                }}
                .header-text {{
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0;
                }}
                .content {{
                    padding: 40px 30px;
                    color: #374151;
                }}
                .greeting {{
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 20px;
                }}
                .message {{
                    font-size: 16px;
                    line-height: 1.6;
                    color: #4b5563;
                    margin-bottom: 30px;
                }}
                .button-container {{
                    text-align: center;
                    margin: 30px 0;
                }}
                .verify-button {{
                    display: inline-block;
                    background-color: #D55414;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }}
                .verify-button:hover {{
                    background-color: #B9562D;
                }}
                .footer {{
                    background-color: #f9fafb;
                    padding: 20px 30px;
                    text-align: center;
                    font-size: 14px;
                    color: #6b7280;
                    border-top: 1px solid #e5e7eb;
                }}
                .note {{
                    font-size: 14px;
                    color: #6b7280;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="header-text">Fred.ai</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Your Personal Book Recommender</p>
                </div>
                
                <div class="content">
                    <p class="greeting">Hello {name}! 👋</p>
                    
                    <p class="message">
                        Welcome to Fred.ai! We're excited to have you join our community of book lovers.
                    </p>
                    
                    <p class="message">
                        To get started with personalized book recommendations, please verify your email address by clicking the button below:
                    </p>
                    
                    <div class="button-container">
                        <a href="{link}" class="verify-button">Verify Email Address</a>
                    </div>
                    
                    <p class="note">
                        <strong>Note:</strong> This verification link will expire in 1 hour for security reasons.
                        <br><br>
                        If you didn't create an account with Fred.ai, you can safely ignore this email.
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 0;">© 2024 Fred.ai - Your Personal Librarian</p>
                    <p style="margin: 10px 0 0 0;">Discover your next favorite book</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        # Fallback plain text version
        msg.body = f'''
Hello {name}!

Welcome to Fred.ai! We're excited to have you join our community of book lovers.

To get started with personalized book recommendations, please verify your email address by clicking the link below:

{link}

Note: This verification link will expire in 1 hour for security reasons.

If you didn't create an account with Fred.ai, you can safely ignore this email.

© 2024 Fred.ai - Your Personal Librarian
        '''
        
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


