from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import mail

# Import Blueprints
from routes.auth import auth_bp
from routes.lists import lists_bp
from routes.recommendations import recommendations_bp
from routes.dashboard import dashboard_bp

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

mail.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(lists_bp)
app.register_blueprint(recommendations_bp)
app.register_blueprint(dashboard_bp)

# Home Route
@app.route("/", methods=["GET"])
def home():
    """Simple health check to ensure the server is running."""
    return "<h1>Server Running...</h1>", 200

@app.route("/test-email")
def test_email():
    from flask_mail import Message
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
