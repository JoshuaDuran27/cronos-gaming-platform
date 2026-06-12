from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.cart import Cart, CartItem
from app.models.purchase import Purchase, PurchaseItem
from app.models.library import Library

checkout_bp = Blueprint("checkout", __name__)


@checkout_bp.route("", methods=["POST"])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or len(cart.items) == 0:
        return jsonify({"message": "El carrito está vacío"}), 400

    total = sum(item.game.price for item in cart.items)

    purchase = Purchase(
        user_id=user_id,
        total_amount=total,
        status="COMPLETED",
        payment_method="SIMULATED_PAYMENT"
    )

    db.session.add(purchase)
    db.session.flush()

    for item in cart.items:
        purchase_item = PurchaseItem(
            purchase_id=purchase.id,
            game_id=item.game_id,
            price_at_purchase=item.game.price
        )

        db.session.add(purchase_item)

        existing_library_item = Library.query.filter_by(
            user_id=user_id,
            game_id=item.game_id
        ).first()

        if not existing_library_item:
            library_item = Library(
                user_id=user_id,
                game_id=item.game_id
            )
            db.session.add(library_item)

    CartItem.query.filter_by(cart_id=cart.id).delete()

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Error al procesar la compra"}), 500

    return jsonify({
        "message": "Compra simulada realizada correctamente",
        "purchase": purchase.to_dict()
    }), 201