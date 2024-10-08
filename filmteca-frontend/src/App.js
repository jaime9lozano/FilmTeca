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
import AdminPeliculas from "./components/admin/AdminPeliculas";
import AdminGeneros from "./components/admin/AdminGeneros";
import AdminActores from "./components/admin/AdminActores";
import AdminDirectores from "./components/admin/AdminDirectores";
import AdminPremios from "./components/admin/AdminPremios";
import AdminValoraciones from "./components/admin/AdminValoraciones";
import AdminUsuarios from "./components/admin/AdminUsuarios";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Comprobar la preferencia del sistema al cargar
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDarkMode);

        // Aplicar el modo oscuro si está habilitado
        document.body.classList.toggle('dark-mode', prefersDarkMode);

        // Guardar la preferencia en localStorage
        localStorage.setItem('darkMode', prefersDarkMode);
    }, []);

    useEffect(() => {
        // Actualizar la clase del body cuando cambie darkMode
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
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
                        <Route path="/admin/peliculas" element={<ProtectedRoute element={<AdminPeliculas />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/generos" element={<ProtectedRoute element={<AdminGeneros />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/actores" element={<ProtectedRoute element={<AdminActores />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/directores" element={<ProtectedRoute element={<AdminDirectores />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/premios" element={<ProtectedRoute element={<AdminPremios />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/valoraciones" element={<ProtectedRoute element={<AdminValoraciones />} allowedRoles={['ADMIN']} />} />
                        <Route path="/admin/usuarios" element={<ProtectedRoute element={<AdminUsuarios />} allowedRoles={['ADMIN']} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
