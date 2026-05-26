from datetime import datetime
from app.extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="reviews")
    game = db.relationship("Game", back_populates="reviews")

    __table_args__ = (
        db.UniqueConstraint("user_id", "game_id", name="unique_review_per_user_game"),
        db.CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "gameId": self.game_id,
            "rating": self.rating,
            "comment": self.comment,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "user": {
                "id": self.user.id,
                "firstName": self.user.first_name,
                "lastName": self.user.last_name,
            } if self.user else None,
        }