import { useEffect, useState, type FormEvent } from "react";
import axiosClient from "../api/axiosClient";
import type { Category, Game } from "../types/game";

function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchGames = async () => {
    try {
      const response = await axiosClient.get("/games");
      setGames(response.data.games);
    } catch (error) {
      console.error("Error al cargar juegos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setDeveloper("");
    setPublisher("");
    setReleaseDate("");
    setCategoryId("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axiosClient.post("/games", {
        title,
        description,
        price: Number(price),
        imageUrl,
        developer,
        publisher,
        releaseDate,
        categoryId: Number(categoryId),
      });

      alert("Juego creado correctamente");
      resetForm();
      await fetchGames();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al crear juego";

      alert(message);
    }
  };

  const deleteGame = async (gameId: number) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este juego?");

    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/games/${gameId}`);
      await fetchGames();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al eliminar juego";

      alert(message);
    }
  };

  return (
    <main className="page-container">
      <h1>Dashboard Admin</h1>

      <section className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Crear nuevo juego</h2>

          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <label>Precio</label>
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />

          <label>URL de imagen</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />

          <label>Desarrollador</label>
          <input
            type="text"
            value={developer}
            onChange={(event) => setDeveloper(event.target.value)}
          />

          <label>Publisher</label>
          <input
            type="text"
            value={publisher}
            onChange={(event) => setPublisher(event.target.value)}
          />

          <label>Fecha de lanzamiento</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(event) => setReleaseDate(event.target.value)}
          />

          <label>Categoría</label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>

            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button className="primary-button" type="submit">
            Crear juego
          </button>
        </form>

        <section className="admin-list">
          <h2>Juegos registrados</h2>

          {games.map((game) => (
            <article className="admin-game-item" key={game.id}>
              <img src={game.imageUrl} alt={game.title} />

              <div>
                <h3>{game.title}</h3>
                <p>{game.category?.name}</p>
                <strong>${game.price} MXN</strong>
              </div>

              <button
                className="danger-button"
                onClick={() => deleteGame(game.id)}
              >
                Eliminar
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;