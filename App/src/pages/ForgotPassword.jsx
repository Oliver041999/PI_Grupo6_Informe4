import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    registroAcademico: "",
    correo: "",
    nuevaPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subir = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:4000/api/recuperar_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Contraseña restablecida correctamente");
        setForm({ registroAcademico: "", correo: "", nuevaPassword: "" });
        navigate("/")
      } else {
        setError(data.message || "Error al restablecer contraseña");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h1>

        <form onSubmit={subir} className="space-y-4">
          <input type="text" name="registroAcademico" placeholder="Registro Académico"
            value={form.registroAcademico} onChange={cambio}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="email" name="correo" placeholder="Correo electrónico"
            value={form.correo} onChange={cambio}
            className="w-full px-3 py-2 border rounded-lg" required />

          <input type="password" name="nuevaPassword" placeholder="Nueva contraseña"
            value={form.nuevaPassword} onChange={cambio}
            className="w-full px-3 py-2 border rounded-lg" required />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}