import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import type { Game } from "../types/game";

function GameDetail() {
  const { id } = useParams();
    const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = 1;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axiosClient.get(`/games/${id}`);
        setGame(response.data.game);
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
          <span className="game-category">{game.category?.name}</span>

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

          <button className="primary-button detail-button" onClick={addToCart}>
            Agregar al carrito
          </button>
        </div>
      </section>
    </main>
  );
}

export default GameDetail;