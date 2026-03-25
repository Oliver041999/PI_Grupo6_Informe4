import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Perfil() {
  const { registroAcademico } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [todosLosCursos, setTodosLosCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [totalCreditos, setTotalCreditos] = useState(0);

  useEffect(() => {
    // Obtener datos del usuario
    fetch(`http://localhost:4000/api/usuarios/${registroAcademico}`)
      .then(res => {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
      })
      .then(setUsuario)
      .catch(err => setError(err.message));

    // Obtener cursos aprobados
    fetch(`http://localhost:4000/api/usuarios/${registroAcademico}/cursos`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudieron cargar los cursos aprobados");
        return res.json();
      })
      .then(data => {
        console.log("Cursos aprobados desde backend:", data.cursos);
        setCursosAprobados(data.cursos);
        setTotalCreditos(data.totalCreditos);
      })
      .catch(console.error);

    // Obtener todos los cursos disponibles
    fetch(`http://localhost:4000/api/cursos`)
      .then(res => res.json())
      .then(setTodosLosCursos)
      .catch(console.error);
  }, [registroAcademico]);

  const agregarCursoAprobado = () => {
    if (!cursoSeleccionado) return alert("Selecciona un curso");

    fetch(`http://localhost:4000/api/usuarios/${registroAcademico}/cursos-aprobados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cursoId: cursoSeleccionado }),
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 409) {
            throw new Error("Este curso ya fue aprobado por el usuario");
          }
          throw new Error("Error al agregar curso aprobado");
        }
        return res.json();
      })
      .then(nuevoCurso => {
        setCursosAprobados([...cursosAprobados, nuevoCurso]);
        setCursoSeleccionado("");
      })
      .catch(err => alert(err.message));
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!usuario) return <p>Cargando...</p>;
  const cursosDisponibles = todosLosCursos.filter(
    (curso) => !cursosAprobados.some((aprobado) => aprobado.id === curso.id)
  );
  const token = localStorage.getItem("token");
  let registroLogueado = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      registroLogueado = decoded.registroAcademico;
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  }
  const esMiPerfil = registroLogueado === usuario.registro_academico;



  return (
    <div className="perfil-container p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Perfil de {usuario.nombres} {usuario.apellidos}</h2>
      <p><strong>Registro Académico:</strong> {usuario.registro_academico}</p>
      <p><strong>Correo:</strong> {usuario.correo}</p>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Cursos Aprobados</h3>
      {cursosAprobados.length === 0 ? (
        <p>No hay cursos aprobados aún.</p>
      ) : (
        <ul className="list-disc list-inside mb-4">
          {cursosAprobados.map((curso) => (
            <li key={curso.id}>{curso.nombre}</li>
          ))}
        </ul>
      )}
      <p className="text-gray-700 mb-2">Total de créditos: <strong>{totalCreditos}</strong></p>

      <div className="flex justify-between mt-4 text-sm text-blue-600">
        <button onClick={() => window.history.back()}>Volver</button>
      </div>

      {esMiPerfil && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Agregar curso aprobado</h4>

          {cursosDisponibles.length === 0 ? (
            <p className="text-green-600">¡Todos los cursos han sido aprobados!</p>
          ) : (
            <>
              <select
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full mb-3"
              >
                <option value="">-- Selecciona un curso --</option>
                {cursosDisponibles.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>

              <button
                onClick={agregarCursoAprobado}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
              >
                Cursos Aprobados
              </button>
            </>
          )}
        </div>
      )}


    </div>
  );
}
