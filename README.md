**Universidad San Carlos de Guatemala**  
**Guatemala**  
**Facultad de Ingeniería**  
**Escuela de Sistemas**  
**Practicas iniciales**  


## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web tipo **cliente-servidor** que permite a los estudiantes de la Facultad de Ingeniería (Escuela de Ciencias y Sistemas) compartir opiniones y experiencias sobre catedráticos, auxiliares y cursos del área de sistemas. La plataforma busca ofrecer una alternativa más organizada y especializada al grupo de Facebook actual, proporcionando un sistema de publicaciones y comentarios para fomentar la retroalimentación entre estudiantes.


## Objetivos del Pyoyecto

- Relacionar al estudiante con **frameworks de desarrollo** para aplicaciones web (React/Angular + Node.js).
- Fomentar el uso de **repositorios** (GitHub) para la administración del código y el trabajo colaborativo.
- Administrar información en un **gestor de base de datos** (MySQL).

## Tecnologías Utilizadas

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| **Frontend**  | React.js (o Angular, según tu grupo) |
| **Backend**   | Node.js + Express (REST API)        |
| **Base de Datos** | MySQL (local o en la nube)        |
| **Control de Versiones** | Git + GitHub                |


## Funcionalidades Principales

### Autenticación de Usuarios
- Registro de nuevos usuarios (Registro Académico, nombres, apellidos, correo, contraseña).
- Inicio de sesión con credenciales.
- Recuperación de contraseña mediante validación de Registro Académico y correo.

### Pantalla Principal (Feed)
- Muestra todas las publicaciones ordenadas por fecha.
- Filtros disponibles:
  - Por curso.
  - Por catedrático.
  - Por nombre del curso.
  - Por nombre del catedrático.
 

### Gestión de Publicaciones
- Crear publicaciones sobre un **catedrático** o un **curso**.
- Cada publicación contiene:
  - Usuario autor.
  - Curso o catedrático asociado.
  - Mensaje.
  - Fecha de creación.


### Comentarios
- Cada publicación permite agregar comentarios, para que más estudiantes puedan aportar su opinión.


### Perfil de Usuario
- Ver perfil propio o de otros usuarios mediante búsqueda por Registro Académnico.
- En el perfil propio se puede editar la información personal (excepto el Registro Académico).
- **Cursos Aprobados**:
  - Visualización de cursos aprobados y créditos totales.
  - Solo el usuario autenticado puede administrar (agregar/eliminar) sus propios cursos aprobados.


## Arquitectura del Proyecto

El sistema sigue una arquitectura **cliente-servidor**:

1. **Cliente**: Aplicación SPA que consume los endpoints de la API REST.
2. **Servidor**: API REST construida con Node.js que maneja la lógica de negocio y la comunicación con la base de datos.
3. **Base de Datos**: MySQL para almacenar usuarios, publicaciones, comentarios, cursos, catedráticos y relación con cursos aprobados.


## Instalación y Ejecución Local

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (v8 o superior)
- Git


## Integrantes

- Luis Armando Gaitan Lazaro - 202404079  
- Sofia Gutierrez Rogel - 202404463  
- Kevin Emanuel Ramirez Revolorio - 201907719  
- Julio Fernando Efraín Chamorro Cajchum - 201632179  
- Mario Jacobo Gonzalez Ixcayau - 202307811 
- Oliverio Macz Coc - 202002019  

## Tutores

- Thanya Mazariegos  
- María Fernanda Morales
- Brandon Marroquín

