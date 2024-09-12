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

function App() {
    return (
        <Router>
            <div className="app">
                <Header/>
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={<PeliculasList/>}/>
                        <Route path="/pelicula/:id" element={<PeliculaDetail/>}/>
                        <Route path="/genero/:id" element={<PeliculasByGenero/>}/>
                        <Route path="/user" element={<UsersInfo/>}/>
                    </Routes>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
