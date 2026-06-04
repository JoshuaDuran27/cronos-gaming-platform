from flask import Blueprint, jsonify

from app.models.user import User
from app.models.library import Library

library_bp = Blueprint("library", __name__)


@library_bp.route("/<int:user_id>", methods=["GET"])
def get_user_library(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    library_items = Library.query.filter_by(user_id=user_id).all()

    return jsonify({
        "library": [item.to_dict() for item in library_items]
    }), 200