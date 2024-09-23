import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import PeliculasList from "./components/peliculas/PeliculasList";
import PeliculaDetail from "./components/peliculas/PeliculaDetail";
import Login from "./components/login/Login";
import PeliculasByGenero from "./components/peliculas/GeneroPeliculas";
import UsersInfo from "./components/usuario/UsersInfo";
import Register from "./components/login/Register";
import CreatePelicula from "./components/peliculas/CreatePelicula";
import CambiarImagen from "./components/imagen/CambiarImagen";
import CreateValoracion from "./components/valoracion/CreateValoracion";
import UserValoraciones from "./components/usuario/UserValoraciones";
import ProtectedRoute from "./ProtectedRoute";
import Forbidden from "./components/errores/Forbidden";
import UserFavoritos from "./components/favoritos/UserFavoritos";
import {useEffect, useState} from "react";

function App() {
    // Estado para controlar el modo oscuro
    const [darkMode, setDarkMode] = useState(false);

    // Efecto para añadir o quitar la clase del modo oscuro
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Función para alternar entre el modo oscuro y claro
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Router>
            <div className={`app ${darkMode ? 'dark' : ''}`}>
                {/* Pasamos la función y el estado al Header */}
                <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                <div className="content">
                    <Routes>
                        <Route path="/forbidden" element={<Forbidden />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PeliculasList />} />
                        <Route path="/pelicula/:id" element={<PeliculaDetail />} />
                        <Route path="/createPelicula" element={<ProtectedRoute element={<CreatePelicula />} allowedRoles={['SUPERUSER']} />} />
                        <Route path="/createValoracion/:id" element={<ProtectedRoute element={<CreateValoracion />} allowedRoles={['USER']} />} />
                        <Route path="/cambiarImagen/:id" element={<ProtectedRoute element={<CambiarImagen />} allowedRoles={['SUPERUSER']} />} />
                        <Route path="/genero/:id" element={<PeliculasByGenero />} />
                        <Route path="/user" element={<ProtectedRoute element={<UsersInfo />} allowedRoles={['USER']} />} />
                        <Route path="/userValoraciones/:id" element={<ProtectedRoute element={<UserValoraciones />} allowedRoles={['USER']} />} />
                        <Route path="/userFavoritos/:id" element={<ProtectedRoute element={<UserFavoritos />} allowedRoles={['USER']} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
