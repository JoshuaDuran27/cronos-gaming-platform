from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.game import Game
from app.models.wishlist import Wishlist

wishlist_bp = Blueprint("wishlist", __name__)


@wishlist_bp.route("", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = int(get_jwt_identity())

    items = Wishlist.query.filter_by(user_id=user_id).order_by(
        Wishlist.created_at.desc()
    ).all()

    return jsonify({
        "wishlist": [item.to_dict() for item in items]
    }), 200


@wishlist_bp.route("/items", methods=["POST"])
@jwt_required()
def add_to_wishlist():
    user_id = int(get_jwt_identity())

    data = request.get_json()
    game_id = data.get("gameId")

    if not game_id:
        return jsonify({"message": "El campo gameId es obligatorio"}), 400

    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    existing_item = Wishlist.query.filter_by(
        user_id=user_id,
        game_id=game_id
    ).first()

    if existing_item:
        return jsonify({"message": "El juego ya está en tu wishlist"}), 409

    item = Wishlist(
        user_id=user_id,
        game_id=game_id
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Juego agregado a wishlist",
        "wishlistItem": item.to_dict()
    }), 201


@wishlist_bp.route("/items/<int:game_id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist(game_id):
    user_id = int(get_jwt_identity())

    item = Wishlist.query.filter_by(
        user_id=user_id,
        game_id=game_id
    ).first()

    if not item:
        return jsonify({"message": "El juego no está en tu wishlist"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "message": "Juego eliminado de wishlist"
    }), 200