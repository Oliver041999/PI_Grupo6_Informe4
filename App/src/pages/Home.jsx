import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [error, setError] = useState("");
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const navigate = useNavigate();

  const CerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Recuperar registro académico del usuario logueado
  const registroLogueado = localStorage.getItem("registroAcademico");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/publicaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar publicaciones");
      const data = await response.json();
      data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const filtrarPosts = () => {
    if (!filtroTipo) return posts;

    return posts.filter((post) => {
      if (filtroTipo === "curso") {
        if (!filtroValor) return !!post.curso;
        return post.curso?.toLowerCase().includes(filtroValor.toLowerCase());
      }
      if (filtroTipo === "catedratico") {
        if (!filtroValor) return !!post.catedratico;
        return post.catedratico?.toLowerCase().includes(filtroValor.toLowerCase());
      }
      return true;
    });
  };


  const BuscarUsuario = () => {
    if (busquedaUsuario.trim() === "") return;
    navigate(`/perfil/${busquedaUsuario}`);
  };

  const DesplegarComentarios = async (postId) => {
    const visibles = comentariosVisibles[postId];
    if (visibles) {
      // Ocultar comentarios
      setComentariosVisibles(prev => ({ ...prev, [postId]: false }));
    } else {
      // Mostrar comentarios, cargar si no están cargados
      if (!comentarios[postId]) {
        await fetchComentarios(postId);
      }
      setComentariosVisibles(prev => ({ ...prev, [postId]: true }));
    }
  };

  const fetchComentarios = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/publicaciones/${postId}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar comentarios");
      const data = await response.json();
      setComentarios(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      setError(err.message);
    }
  };

  const NuevoComentario = (postId, texto) => {
    setNuevoComentario(prev => ({ ...prev, [postId]: texto }));
  };

  const AgregarComentario = async (postId) => {
    const texto = nuevoComentario[postId];
    if (!texto || texto.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/publicaciones/${postId}/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje: texto }),
      });
      if (!response.ok) throw new Error("Error al agregar comentario");
      setNuevoComentario(prev => ({ ...prev, [postId]: "" }));
      fetchComentarios(postId); // recargar comentarios actualizados
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home-container p-6 bg-gray-100 min-h-screen">
      <div className="vermiperfil">
        <button
          onClick={() => navigate(`/perfil/${registroLogueado}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          title="Ver mi perfil"
        >
          <span>Mi Perfil</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </button>
        <div>
          <button onClick={CerrarSesion} className="logout">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar usuario por registro"
          value={busquedaUsuario}
          onChange={(e) => setBusquedaUsuario(e.target.value)}
          className="panelbusqueda"
        />
        <button onClick={BuscarUsuario} className="botonbuscar">
          Buscar
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-center">Pantalla Principal</h1>
      <div className="flex justify-center gap-2 mb-6 max-w-xl mx-auto">
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setFiltroValor("");
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filtrar por...</option>
          <option value="curso">Curso</option>
          <option value="catedratico">Catedrático</option>
        </select>

        {filtroTipo && (
          <input
            type="text"
            placeholder={`Ingrese ${filtroTipo}`}
            value={filtroValor}
            onChange={(e) => setFiltroValor(e.target.value)}
            className="buscando"
          />
        )}
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/crear-publicacion")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Crear Publicación
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="post">
        {filtrarPosts().length === 0 && (
          <p className="text-center text-gray-500">No hay publicaciones</p>
        )}
        {filtrarPosts().map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="fechapost">{new Date(post.fechaCreacion).toLocaleString()}</p>
            <p className="usuariopost">{post.usuario}</p>
            <p className="cursocatedraticopost">{post.curso || post.catedratico}</p>
            <p>{post.mensaje}</p>

            <input
              type="button"
              value={comentariosVisibles[post.id] ? "Ocultar Comentarios" : "Comentarios"}
              className="button"
              onClick={() => DesplegarComentarios(post.id)}
            />

            {comentariosVisibles[post.id] && (
              <div className="comentarios">
                {comentarios[post.id]?.length === 0 && (
                  <p className="text-gray-500">Sin comentarios aún.</p>
                )}
                {comentarios[post.id]?.map((com) => (
                  <div key={com.id} className="comentariosusuario">
                    <p className="nombreusuario">{com.usuario}</p>
                    <p>{com.mensaje}</p>
                  </div>
                ))}

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Agregar un comentario..."
                    value={nuevoComentario[post.id] || ""}
                    onChange={(e) => NuevoComentario(post.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md flex-grow"
                  />
                  <button
                    onClick={() => AgregarComentario(post.id)}
                    className="agregarcomentario"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




