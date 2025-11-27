from flask import Blueprint, jsonify
from auth import get_current_user
from db_config import session, User

dashboard_bp = Blueprint('dashboard', __name__)

# Dashbaord Route
@dashboard_bp.route("/dashboard")
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
