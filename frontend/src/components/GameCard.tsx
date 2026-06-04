import type {Game} from "../types/game";

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card">
      <img src={game.imageUrl} alt={game.title} />

      <div className="game-card-content">
        <span className="game-category">{game.category?.name}</span>
        <h3>{game.title}</h3>
        <p>{game.description}</p>

        <div className="game-card-footer">
          <strong>${game.price} MXN</strong>
          <button>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;