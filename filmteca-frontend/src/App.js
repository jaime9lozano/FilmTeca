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

function App() {
    return (
        <Router>
            <div className="app">
                <Header/>
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
                    </Routes>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
