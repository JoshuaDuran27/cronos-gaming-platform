from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.game import Game
from app.models.review import Review
from app.models.library import Library

review_bp = Blueprint("reviews", __name__)


@review_bp.route("/games/<int:game_id>/reviews", methods=["GET"])
def get_game_reviews(game_id):
    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    reviews = Review.query.filter_by(game_id=game_id).order_by(
        Review.created_at.desc()
    ).all()

    return jsonify({
        "reviews": [review.to_dict() for review in reviews]
    }), 200


@review_bp.route("/games/<int:game_id>/reviews", methods=["POST"])
@jwt_required()
def create_review(game_id):
    user_id = int(get_jwt_identity())

    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    data = request.get_json()

    rating = data.get("rating")
    comment = data.get("comment")

    if not rating or not comment:
        return jsonify({"message": "rating y comment son obligatorios"}), 400

    library_item = Library.query.filter_by(
        user_id=user_id,
        game_id=game_id
    ).first()

    if not library_item:
        return jsonify({
            "message": "Solo puedes reseñar juegos que tienes en tu biblioteca"
        }), 403

    existing_review = Review.query.filter_by(
        user_id=user_id,
        game_id=game_id
    ).first()

    if existing_review:
        return jsonify({
            "message": "Ya publicaste una reseña para este juego"
        }), 409

    if rating < 1 or rating > 5:
        return jsonify({
            "message": "La calificación debe estar entre 1 y 5"
        }), 400

    review = Review(
        user_id=user_id,
        game_id=game_id,
        rating=rating,
        comment=comment
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({
        "message": "Reseña publicada correctamente",
        "review": review.to_dict()
    }), 201