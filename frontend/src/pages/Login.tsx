import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate("/catalog");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";

      alert(message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleSubmit}>
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="primary-button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;