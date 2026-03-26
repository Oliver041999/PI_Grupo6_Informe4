import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../publi.css";

export default function CrearPublicacion() {
  const [tipo, setTipo] = useState("");
  const [valorId, setValorId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCursos();
    fetchCatedraticos();
  }, []);

  const fetchCursos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cursos");
      const data = await res.json();
      setCursos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCatedraticos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/catedraticos");
      const data = await res.json();
      setCatedraticos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const subir = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!tipo || !valorId || !mensaje) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/publicaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          valorId,
          mensaje,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error al crear publicación");
      } else {
        setSuccess("Publicación creada correctamente");
        setTipo("");
        setValorId("");
        setMensaje("");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="crear-publicacion-page p-6 bg-gray-100 min-h-screen flex justify-center items-start">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Crear Publicación</h1>

        <form onSubmit={subir} className="space-y-4">
          <select
            value={tipo}
            onChange={(e) => { setTipo(e.target.value); setValorId(""); }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Selecciona tipo</option>
            <option value="curso">Curso</option>
            <option value="catedratico">Catedrático</option>
          </select>

          {tipo === "curso" && (
            <select
              value={valorId}
              onChange={(e) => setValorId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Selecciona un curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          )}

          {tipo === "catedratico" && (
            <select
              value={valorId}
              onChange={(e) => setValorId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Selecciona un catedrático</option>
              {catedraticos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          )}

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje"
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Publicar
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}


