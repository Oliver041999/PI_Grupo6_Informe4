import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [registroAcademico, setRegistroAcademico] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registroAcademico, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Bienvenido ${data.nombres}`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("registroAcademico", registroAcademico);
        navigate("/home")
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        <form onSubmit={Login} className="space-y-4">
          <div>
            <label className="block text-gray-700">Registro Académico</label>
            <input
              type="text"
              value={registroAcademico}
              onChange={(e) => setRegistroAcademico(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-blue-600">
          <button onClick={() => navigate("/registro")}>Registrarse</button> &nbsp;&nbsp;
          <button onClick={() => navigate("/recuperar_password")}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
}