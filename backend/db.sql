DROP DATABASE IF EXISTS practica_web;
CREATE DATABASE IF NOT EXISTS practica_web;
USE practica_web;

/* Tabla para almacenar los usuarios */
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabla para almacenar los cursos */

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    creditos INT NOT NULL
);

/* Tabla para almacenar los catedráticos */

CREATE TABLE catedraticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

/* Tabla para almacenar las publicaciones */

CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) NOT NULL,
    curso_id INT NULL,
    catedratico_id INT NULL,
    mensaje TEXT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registro_academico) REFERENCES usuarios(registro_academico) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL,
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id) ON DELETE SET NULL
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    registro_academico VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (registro_academico) REFERENCES usuarios(registro_academico) ON DELETE CASCADE
);

CREATE TABLE cursos_aprobados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) NOT NULL,
    curso_id INT NOT NULL,
    creditos INT DEFAULT 0,
    FOREIGN KEY (registro_academico) REFERENCES usuarios(registro_academico) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_curso (registro_academico, curso_id)
);

INSERT INTO cursos (nombre, creditos) VALUES
('Análisis y Diseño de Sistemas 1', 6),
('Análisis y Diseño de Sistemas 2', 7),
('Arquitectura de Computadoras y Ensambladores 1', 5),
('Arquitectura de Computadoras y Ensambladores 2', 5),
('Bases de Datos 1', 6),
('Bases de Datos 2', 7),
('Economía', 3),
('Estructura de Datos', 6),
('Gerenciales 2', 6),
('Inteligencia Artificial 1', 7),
('Introducción a la Programación y Computación 1', 6),
('Introducción a la Programación y Computación 2', 6),
('Introducción a los Algoritmos y Flujos de Datos', 4),
('Lenguajes Formales y de Programación', 4),
('Logica de Sistemas', 3),
('Manejo e Implementacion de Archivos', 5),
('Modelación y Simulación 1', 5),
('Modelación y Simulación 2', 6),
('Organización Computacional', 4),
('Organización de Lenguajes y Compiladores 2', 6),
('Organización Lenguajes y Compiladores 1', 6),
('Programación Comercial 1', 4),
('Programación de Computadoras 1', 3),
('Programación de Computadoras 2', 4),
('Redes de Computadoras 1', 5),
('Redes de Computadoras 2', 6),
('Seminario de Sistemas 1', 5),
('Seminario de Sistemas 2', 5),
('Sistemas Operativos 1', 6),
('Sistemas Operativos 2', 4),
('Sistemas Organizaciones y Gerenciales 1', 5),
('Software Avanzado', 8),
('Teoria de Sistemas 1', 4),
('Teoria de Sistemas 2', 4);

INSERT INTO catedraticos (nombre) VALUES
('Allan Alberto Morataya'),
('Alvaro Giovanni Longo Morales'),
('Alvaro Obrayan Hernandez Garcia'),
('Bayron Wosvely Lopez Lopez'),
('Cesar Augusto Fernandez Caceres'),
('Claudia Liceth Rojas Morales'),
('Damaris Campos De López'),
('David Estuardo Morales'),
('Edgar Francisco Rodas Robledo'),
('Edgar Rene Ornelis Hoil'),
('Edgar Ruben Saban Raxon'),
('Edwin Estuardo Zapeta Gómez'),
('Everest Darwin Medinilla Rodriguez'),
('Fernando José Paz González'),
('Florizza Felipa Avila Pesquera De Medinilla'),
('Freiry Javiver Gramajo López'),
('Gabriel Alejandro Díaz López'),
('Guippsy Jeannira Menendez Perez'),
('Herman Igor Veliz Linares'),
('Ileana Guisela Ralda Recinos'),
('Jorge Luis Alvarez Mejia'),
('Jose Anibal Silva De Los Angeles'),
('Jose Manuel Ruiz Juarez'),
('Juan Alvaro Diaz Ardavin'),
('Jurgen Andoni Ramirez Ramirez'),
('Luis Alberto Arias'),
('Luis Alberto Vettorazzi Espana'),
('Luis Carlos Corleto Marroquin'),
('Luis Fernando Espino Barrios'),
('Manuel Fernando Lopez Fernandez'),
('Manuel Haroldo Castillo Reyna'),
('Marco Tulio Aldana Prillwitz'),
('Mario Jose Bautista Fuentes'),
('Marlon Antonio Pérez Türk'),
('Marlon Francisco Orellana Lopez'),
('Miguel Angel Cancinos Rendon'),
('Mirna Ivonne Aldana Larrazabal'),
('Moises Eduardo Velasquez Oliva'),
('Neftali De Jesus Calderon Mendez'),
('Oscar Alejandro Paz Campos'),
('Otto Amilcar Rodriguez Acosta'),
('Otto Rene Escobar Leiva'),
('Pedro Pablo Hernandez Ramirez'),
('Sergio Arnaldo Mendez Aguilar'),
('Stanly Barrios'),
('Virginia Victoria Tala Ayerdi'),
('William Estuardo Escobar Argueta'),
('William Samuel Guevara Orellana'),
('Zulma Karina Aguirre Ordonez');

select * from cursos;
select * from catedraticos;
select * from comentarios;
select * from usuarios;
select * from publicaciones;
select * from cursos_aprobados;