from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.user import User
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


@cart_bp.route("/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    cart = get_or_create_cart(user_id)

    total = sum(float(item.game.price) for item in cart.items)

    return jsonify({
        "cart": cart.to_dict(),
        "total": total
    }), 200


@cart_bp.route("/<int:user_id>/items", methods=["POST"])
def add_item_to_cart(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

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


@cart_bp.route("/<int:user_id>/items/<int:game_id>", methods=["DELETE"])
def remove_item_from_cart(user_id, game_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

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


@cart_bp.route("/<int:user_id>/clear", methods=["DELETE"])
def clear_cart(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"message": "Carrito no encontrado"}), 404

    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()

    return jsonify({
        "message": "Carrito vaciado correctamente"
    }), 200