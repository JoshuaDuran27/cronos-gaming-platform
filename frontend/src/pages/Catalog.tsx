import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import GameCard from "../components/GameCard";
import type { Category, Game } from "../types/game";

function Catalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (categoryId) {
        params.append("categoryId", categoryId);
      }

      const queryString = params.toString();

      const response = await axiosClient.get(
        queryString ? `/games?${queryString}` : "/games"
      );

      setGames(response.data.games);
    } catch (error) {
      console.error("Error al cargar juegos:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGames();
  }, [search, categoryId]);

  return (
    <main className="page-container">
      <div className="catalog-header">
        <div>
          <h1>Catálogo de Videojuegos</h1>
          <p>Explora juegos por nombre o categoría.</p>
        </div>
      </div>

      <section className="catalog-filters">
        <input
          type="text"
          placeholder="Buscar videojuego..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Todas las categorías</option>

          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={clearFilters}>
          Limpiar filtros
        </button>
      </section>

      {loading ? (
        <h2 className="loading">Cargando catálogo...</h2>
      ) : games.length === 0 ? (
        <section className="empty-cart">
          <h2>No se encontraron juegos</h2>
          <p>Intenta cambiar la búsqueda o limpiar los filtros.</p>
        </section>
      ) : (
        <section className="games-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Catalog;