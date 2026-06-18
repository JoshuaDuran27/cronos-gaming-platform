import { useEffect, useState, type FormEvent } from "react";
import axiosClient from "../api/axiosClient";

interface Category {
  id: number;
  name: string;
  description: string;
}

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  const loadCategoryToEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (editingCategory) {
        await axiosClient.put(
          `/categories/${editingCategory.id}`,
          {
            name,
            description,
          }
        );

        alert("Categoría actualizada");
      } else {
        await axiosClient.post("/categories", {
          name,
          description,
        });

        alert("Categoría creada");
      }

      resetForm();
      await fetchCategories();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Error al guardar categoría"
      );
    }
  };

  const deleteCategory = async (id: number) => {
    const confirmDelete = confirm(
      "¿Eliminar categoría?"
    );

    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/categories/${id}`);

      await fetchCategories();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Error al eliminar categoría"
      );
    }
  };

  return (
    <main className="page-container">
      <h1>Administrar Categorías</h1>

      <section className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>
            {editingCategory
              ? "Editar Categoría"
              : "Crear Categoría"}
          </h2>

          <label>Nombre</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label>Descripción</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            className="primary-button"
            type="submit"
          >
            {editingCategory
              ? "Guardar cambios"
              : "Crear categoría"}
          </button>

          {editingCategory && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </form>

        <section className="admin-list">
          <h2>Categorías</h2>

          {categories.map((category) => (
            <article
              key={category.id}
              className="admin-category-item"
            >
              <div>
                <h3>{category.name}</h3>

                <p>
                  {category.description}
                </p>
              </div>

              <div className="admin-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    loadCategoryToEdit(category)
                  }
                >
                  Editar
                </button>

                <button
                  className="danger-button"
                  onClick={() =>
                    deleteCategory(category.id)
                  }
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

export default AdminCategories;