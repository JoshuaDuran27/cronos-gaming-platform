import axiosClient from "../api/axiosClient";
import type {Game} from "../types/game";

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  const handleAddToCart = async () => {
    try {
      const userId = 1;

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

  return (
    <div className="game-card">
      <img src={game.imageUrl} alt={game.title} />

      <div className="game-card-content">
        <span className="game-category">{game.category?.name}</span>

        <h3>{game.title}</h3>

        <p>{game.description}</p>

        <div className="game-card-footer">
          <strong>${game.price} MXN</strong>

          <button onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;