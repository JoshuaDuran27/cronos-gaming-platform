from datetime import datetime
from app.extensions import db


class Wishlist(db.Model):
    __tablename__ = "wishlists"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="wishlist_items")
    game = db.relationship("Game", back_populates="wishlist_items")

    __table_args__ = (
        db.UniqueConstraint("user_id", "game_id", name="unique_game_per_user_wishlist"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "game": self.game.to_dict() if self.game else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }