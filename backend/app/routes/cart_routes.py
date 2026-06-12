from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.game import Game
from app.models.cart import Cart, CartItem

cart_bp = Blueprint("cart", __name__)


def get_or_create_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    return cart


@cart_bp.route("", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())

    cart = get_or_create_cart(user_id)

    total = sum(float(item.game.price) for item in cart.items)

    return jsonify({
        "cart": cart.to_dict(),
        "total": total
    }), 200


@cart_bp.route("/items", methods=["POST"])
@jwt_required()
def add_item_to_cart():
    user_id = int(get_jwt_identity())

    data = request.get_json()
    game_id = data.get("gameId")

    if not game_id:
        return jsonify({"message": "El campo gameId es obligatorio"}), 400

    game = Game.query.get(game_id)

    if not game:
        return jsonify({"message": "Juego no encontrado"}), 404

    cart = get_or_create_cart(user_id)

    existing_item = CartItem.query.filter_by(
        cart_id=cart.id,
        game_id=game_id
    ).first()

    if existing_item:
        return jsonify({"message": "El juego ya está en el carrito"}), 409

    cart_item = CartItem(
        cart_id=cart.id,
        game_id=game_id
    )

    db.session.add(cart_item)
    db.session.commit()

    return jsonify({
        "message": "Juego agregado al carrito",
        "cart": cart.to_dict()
    }), 201


@cart_bp.route("/items/<int:game_id>", methods=["DELETE"])
@jwt_required()
def remove_item_from_cart(game_id):
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"message": "Carrito no encontrado"}), 404

    item = CartItem.query.filter_by(
        cart_id=cart.id,
        game_id=game_id
    ).first()

    if not item:
        return jsonify({"message": "El juego no está en el carrito"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "message": "Juego eliminado del carrito"
    }), 200


@cart_bp.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"message": "Carrito no encontrado"}), 404

    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()

    return jsonify({
        "message": "Carrito vaciado correctamente"
    }), 200