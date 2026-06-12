from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.library import Library

library_bp = Blueprint("library", __name__)


@library_bp.route("", methods=["GET"])
@jwt_required()
def get_user_library():
    user_id = int(get_jwt_identity())

    library_items = Library.query.filter_by(user_id=user_id).all()

    return jsonify({
        "library": [item.to_dict() for item in library_items]
    }), 200