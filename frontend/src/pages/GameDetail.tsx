import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import type { Game, Review } from "../types/game";

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = 1;

  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    if (!id) return;

    try {
      const response = await axiosClient.get(`/games/${id}/reviews`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;

      try {
        const response = await axiosClient.get(`/games/${id}`);
        setGame(response.data.game);
        await fetchReviews();
      } catch (error) {
        console.error("Error al cargar detalle del juego:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const addToCart = async () => {
    if (!game) return;

    try {
      await axiosClient.post(`/cart/${userId}/items`, {
        gameId: game.id,
      });

      alert(`${game.title} agregado al carrito`);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al agregar al carrito";

      alert(message);
    }
  };

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();

    if (!game) return;

    try {
      await axiosClient.post(`/games/${game.id}/reviews`, {
        userId,
        rating,
        comment,
      });

      alert("Reseña publicada correctamente");

      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al publicar reseña";

      alert(message);
    }
  };

  if (loading) {
    return <h2 className="loading">Cargando juego...</h2>;
  }

  if (!game) {
    return <h2 className="loading">Juego no encontrado</h2>;
  }

  return (
    <main className="page-container">
      <div className="detail-header">
        <button
          className="back-button"
          onClick={() => navigate("/catalog")}
        >
          ← Catálogo
        </button>
      </div>

      <section className="game-detail">
        <div className="game-detail-image">
          <img src={game.imageUrl} alt={game.title} />
        </div>

        <div className="game-detail-content">
          <span className="game-category">
            {game.category?.name}
          </span>

          <h1>{game.title}</h1>

          <p className="game-detail-description">
            {game.description}
          </p>

          <div className="game-info-grid">
            <div>
              <span>Desarrollador</span>
              <strong>{game.developer}</strong>
            </div>

            <div>
              <span>Publisher</span>
              <strong>{game.publisher}</strong>
            </div>

            <div>
              <span>Fecha de lanzamiento</span>
              <strong>{game.releaseDate}</strong>
            </div>

            <div>
              <span>Precio</span>
              <strong>${game.price} MXN</strong>
            </div>
          </div>

          <button
            className="primary-button detail-button"
            onClick={addToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </section>

      <section className="reviews-section">
        <h2>Opiniones de jugadores</h2>

        <form className="review-form" onSubmit={submitReview}>
          <label>Calificación</label>

          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            <option value={5}>5 - Excelente</option>
            <option value={4}>4 - Muy bueno</option>
            <option value={3}>3 - Bueno</option>
            <option value={2}>2 - Regular</option>
            <option value={1}>1 - Malo</option>
          </select>

          <label>Comentario</label>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Escribe tu opinión sobre este juego..."
            required
          />

          <button className="primary-button" type="submit">
            Publicar reseña
          </button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="empty-reviews">
              Aún no hay reseñas para este juego.
            </p>
          ) : (
            reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-header">
                  <strong>
                    {review.user.firstName} {review.user.lastName}
                  </strong>

                  <span>{"★".repeat(review.rating)}</span>
                </div>

                <p>{review.comment}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default GameDetail;