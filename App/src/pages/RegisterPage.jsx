import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    registroAcademico: "",
    nombres: "",
    apellidos: "",
    correo: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const LlenarDatos = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const Registro = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:4000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Usuario registrado exitosamente");
        setForm({ registroAcademico: "", nombres: "", apellidos: "", correo: "", password: "" });
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h1>

        <form onSubmit={Registro} className="space-y-4">
          <input type="text" name="registroAcademico" placeholder="Registro Académico"
            value={form.registroAcademico} onChange={LlenarDatos}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="text" name="nombres" placeholder="Nombres"
            value={form.nombres} onChange={LlenarDatos}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="text" name="apellidos" placeholder="Apellidos"
            value={form.apellidos} onChange={LlenarDatos}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="email" name="correo" placeholder="Correo electrónico"
            value={form.correo} onChange={LlenarDatos}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="password" name="password" placeholder="Contraseña"
            value={form.password} onChange={LlenarDatos}
            className="w-full px-3 py-2 border rounded-lg" required />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Registrarse
          </button>
          <div className="flex justify-between mt-4 text-sm text-blue-600">
            <button onClick={() => navigate("/")}>Volver</button>
          </div>
        </form>
      </div>
    </div>
  );
}