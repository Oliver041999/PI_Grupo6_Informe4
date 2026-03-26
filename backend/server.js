import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conectar con MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "usuario1",
  database: process.env.DB_NAME || "practica_web",
  port: Number(process.env.DB_PORT || 3306)
});

db.connect((err) => {
  if (err) {
    console.error("No se pudo conectar a MySQL:", err.message);
    process.exit(1);
  }
  console.log("Conectado a MySQL");
  startServer();
});

// Registro de usuarios
app.post("/api/registro", async (req, res) => {
  const { registroAcademico, nombres, apellidos, correo, password } = req.body;

  if (!registroAcademico || !nombres || !apellidos || !correo || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO usuarios (registro_academico, nombres, apellidos, correo, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [registroAcademico, nombres, apellidos, correo, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Usuario o correo ya registrado" });
        }
        return res.status(500).json({ message: "Error en el servidor" });
      }
      res.json({ message: "Usuario registrado exitosamente" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// Login
app.post("/api/login", (req, res) => {
  const { registroAcademico, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE registro_academico = ?";
  db.query(sql, [registroAcademico], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { registroAcademico: usuario.registro_academico },
      "variable_secreta",
      { expiresIn: "1h" }
    );

    res.json({ nombres: usuario.nombres, token });
  });
});

// Recuperar contraseña
app.post("/api/recuperar_password", (req, res) => {
  const { registroAcademico, correo, nuevaPassword } = req.body;

  if (!registroAcademico || !correo || !nuevaPassword) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const sql = "SELECT * FROM usuarios WHERE registro_academico = ? AND correo = ?";
  db.query(sql, [registroAcademico, correo], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });

    if (results.length === 0) {
      return res.status(404).json({ message: "Datos incorrectos" });
    }

    try {
      const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
      const updateSql = "UPDATE usuarios SET password = ? WHERE registro_academico = ? AND correo = ?";
      db.query(updateSql, [hashedPassword, registroAcademico, correo], (err2) => {
        if (err2) return res.status(500).json({ message: "Error al actualizar contraseña" });
        res.json({ message: "Contraseña actualizada correctamente" });
      });
    } catch (error) {
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });
});

// Obtener todas las publicaciones
app.get("/api/publicaciones", (req, res) => {
  const sql = `
    SELECT 
      p.id,
      u.nombres AS usuario,
      cursos.nombre AS curso,
      catedraticos.nombre AS catedratico,
      p.mensaje,
      p.fechaCreacion
    FROM publicaciones p
    JOIN usuarios u ON p.registro_academico = u.registro_academico
    LEFT JOIN cursos ON p.curso_id = cursos.id
    LEFT JOIN catedraticos ON p.catedratico_id = catedraticos.id
    ORDER BY p.fechaCreacion DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener publicaciones:", err);
      return res.status(500).json({ message: "Error al obtener publicaciones" });
    }
    res.json(results);
  });
});

// Crear una publicación
app.post("/api/publicaciones", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "variable_secreta");
    const { tipo, valorId, mensaje } = req.body;

    if (!mensaje || !tipo || !valorId) {
      return res.status(400).json({ message: "Faltan datos para la publicación" });
    }

    const fechaCreacion = new Date();

    if (tipo === "curso") {
      const sql = `
        INSERT INTO publicaciones (registro_academico, curso_id, mensaje, fechaCreacion)
        VALUES (?, ?, ?, ?)
      `;
      db.query(sql, [decoded.registroAcademico, valorId, mensaje, fechaCreacion], (err) => {
        if (err) {
          console.error("Error al crear publicación por curso:", err);
          return res.status(500).json({ message: "Error al crear publicación" });
        }
        res.json({ message: "Publicación por curso creada correctamente" });
      });

    } else if (tipo === "catedratico") {
      const sql = `
        INSERT INTO publicaciones (registro_academico, catedratico_id, mensaje, fechaCreacion)
        VALUES (?, ?, ?, ?)
      `;
      db.query(sql, [decoded.registroAcademico, valorId, mensaje, fechaCreacion], (err) => {
        if (err) {
          console.error("Error al crear publicación por catedrático:", err);
          return res.status(500).json({ message: "Error al crear publicación" });
        }
        res.json({ message: "Publicación por catedrático creada correctamente" });
      });

    } else {
      return res.status(400).json({ message: "Tipo de publicación no válido" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
});

// Obtener comentarios de una publicación
app.get("/api/publicaciones/:postId/comentarios", (req, res) => {
  const { postId } = req.params;
  const sql = `
    SELECT c.id, c.mensaje, c.fechaCreacion, u.nombres AS usuario
    FROM comentarios c
    JOIN usuarios u ON c.registro_academico = u.registro_academico
    WHERE c.publicacion_id = ?
    ORDER BY c.fechaCreacion DESC
  `;
  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error("Error al obtener comentarios:", err);
      return res.status(500).json({ message: "Error al obtener comentarios" });
    }
    res.json(results);
  });
});

// Crear un comentario en una publicación
app.post("/api/publicaciones/:postId/comentarios", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "variable_secreta");
    const postId = req.params.postId;
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ message: "Mensaje es obligatorio" });
    }

    const sql = `
      INSERT INTO comentarios (publicacion_id, registro_academico, mensaje)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [postId, decoded.registroAcademico, mensaje], (err) => {
      if (err) {
        console.error("Error al insertar comentario:", err);
        return res.status(500).json({ message: "Error al agregar comentario" });
      }
      res.json({ message: "Comentario agregado correctamente" });
    });

  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
});

// Obtener perfil por registro académico
app.get("/api/usuarios/:registroAcademico", (req, res) => {
  const { registroAcademico } = req.params;
  const sql = "SELECT registro_academico, nombres, apellidos, correo FROM usuarios WHERE registro_academico = ?";

  db.query(sql, [registroAcademico], (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener usuario" });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(results[0]);
  });
});

// Obtener cursos aprobados de un usuario
app.get("/api/usuarios/:registroAcademico/cursos", (req, res) => {
  const { registroAcademico } = req.params;

  const sql = `
    SELECT 
      c.id,
      c.nombre AS nombre,
      c.creditos
    FROM cursos_aprobados ca
    JOIN cursos c ON ca.curso_id = c.id
    WHERE ca.registro_academico = ?
  `;

  db.query(sql, [registroAcademico], (err, cursos) => {
    if (err) {
      console.error("Error al obtener cursos aprobados:", err);
      return res.status(500).json({ message: "Error al obtener cursos" });
    }

    const totalCreditos = cursos.reduce((sum, curso) => sum + curso.creditos, 0);

    res.json({
      cursos,
      totalCreditos
    });
  });
});
// Obtener todos los cursos
app.get("/api/cursos", (req, res) => {
  const sql = "SELECT id, nombre FROM cursos";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener cursos" });
    res.json(results);
  });
});

// Obtener todos los catedráticos
app.get("/api/catedraticos", (req, res) => {
  const sql = "SELECT id, nombre FROM catedraticos";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener catedráticos" });
    res.json(results);
  });
});

// Agregar curso aprobado a un usuario
app.post("/api/usuarios/:registroAcademico/cursos-aprobados", (req, res) => {
  const { registroAcademico } = req.params;
  const { cursoId } = req.body;

  if (!cursoId) {
    return res.status(400).json({ message: "cursoId es requerido" });
  }

  // 1. Obtener los créditos del curso
  const getCreditosSql = "SELECT nombre, creditos FROM cursos WHERE id = ?";
  db.query(getCreditosSql, [cursoId], (err1, results) => {
    if (err1) return res.status(500).json({ message: "Error al obtener curso" });
    if (results.length === 0) return res.status(404).json({ message: "Curso no encontrado" });

    const { creditos, nombre } = results[0];

    // 2. Insertar el curso aprobado con los créditos
    const insertSql = `
      INSERT INTO cursos_aprobados (registro_academico, curso_id, creditos)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [registroAcademico, cursoId, creditos], (err2) => {
      if (err2) {
        if (err2.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Este curso ya fue aprobado por el usuario." });
        }
        return res.status(500).json({ message: "Error al guardar curso aprobado" });
      }

      // 3. Enviar el curso agregado como respuesta
      res.status(201).json({ id: cursoId, nombre, creditos });
    });
  });
});

// Iniciar el servidor en el puerto especificado localhost:4000
function startServer() {
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}



