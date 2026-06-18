from flask import Blueprint, jsonify
from sqlalchemy import func, desc

from app.extensions import db
from app.models.user import User
from app.models.game import Game
from app.models.purchase import Purchase, PurchaseItem
from app.utils.admin_required import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def get_admin_stats():
    total_users = User.query.count()
    total_games = Game.query.count()
    total_purchases = Purchase.query.count()

    total_revenue = db.session.query(
        func.coalesce(func.sum(Purchase.total_amount), 0)
    ).scalar()

    top_games_query = (
        db.session.query(
            Game.id,
            Game.title,
            Game.image_url,
            func.count(PurchaseItem.id).label("sales")
        )
        .join(PurchaseItem, PurchaseItem.game_id == Game.id)
        .group_by(Game.id)
        .order_by(desc("sales"))
        .limit(5)
        .all()
    )

    top_games = [
        {
            "id": game.id,
            "title": game.title,
            "imageUrl": game.image_url,
            "sales": game.sales
        }
        for game in top_games_query
    ]

    return jsonify({
        "totalUsers": total_users,
        "totalGames": total_games,
        "totalPurchases": total_purchases,
        "totalRevenue": float(total_revenue),
        "topGames": top_games
    }), 200