import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CrearPublicacion from "./pages/CrearPublicacion";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar_password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crear-publicacion" element={<CrearPublicacion />} />
        <Route path="/perfil/:registroAcademico" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;


