import { useEffect, useState, type FormEvent } from "react";
import axiosClient from "../api/axiosClient";
import type { Category, Game } from "../types/game";

function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

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
    setEditingGame(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setDeveloper("");
    setPublisher("");
    setReleaseDate("");
    setCategoryId("");
  };

  const loadGameToEdit = (game: Game) => {
    setEditingGame(game);
    setTitle(game.title);
    setDescription(game.description);
    setPrice(String(game.price));
    setImageUrl(game.imageUrl || "");
    setDeveloper(game.developer || "");
    setPublisher(game.publisher || "");
    setReleaseDate(game.releaseDate || "");
    setCategoryId(String(game.category?.id || ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      title,
      description,
      price: Number(price),
      imageUrl,
      developer,
      publisher,
      releaseDate,
      categoryId: Number(categoryId),
    };

    try {
      if (editingGame) {
        await axiosClient.put(`/games/${editingGame.id}`, payload);
        alert("Juego actualizado correctamente");
      } else {
        await axiosClient.post("/games", payload);
        alert("Juego creado correctamente");
      }

      resetForm();
      await fetchGames();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (editingGame ? "Error al actualizar juego" : "Error al crear juego");

      alert(message);
    }
  };

  const deleteGame = async (gameId: number) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este juego?");

    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/games/${gameId}`);
      await fetchGames();

      if (editingGame?.id === gameId) {
        resetForm();
      }
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
          <h2>{editingGame ? "Editar juego" : "Crear nuevo juego"}</h2>

          {editingGame && (
            <p className="editing-indicator">
              Editando: <strong>{editingGame.title}</strong>
            </p>
          )}

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
            {editingGame ? "Guardar cambios" : "Crear juego"}
          </button>

          {editingGame && (
            <button
              className="secondary-button"
              type="button"
              onClick={resetForm}
            >
              Cancelar edición
            </button>
          )}
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

              <div className="admin-actions">
                <button
                  className="secondary-button"
                  onClick={() => loadGameToEdit(game)}
                >
                  Editar
                </button>

                <button
                  className="danger-button"
                  onClick={() => deleteGame(game.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;