// src/components/header/Header.js
import React from 'react';
import './Header.css';
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom"; // Importa el CSS si quieres estilizar el header
import Cookies from 'js-cookie';

function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        const token = Cookies.get('auth_token');
        if (!token) {
            navigate('/login'); // Redirige al login si no hay token
        } else {
            navigate('/'); // Redirige a la página de inicio si ya estás logueado
        }
    };

    const handleLogout = () => {
        Cookies.remove('auth_token'); // Borra el token de la cookie
        navigate('/login'); // Redirige al login después de cerrar sesión
    };

    const token = Cookies.get('auth_token');
    const isLoggedIn = Boolean(token);

    return (
        <header className="header">
            <div className="header-left">
                <img
                    src={'FilmTeca-4.png'}
                    alt="Logo"
                    className="header-logo"
                    onClick={() => navigate('/')}
                />
            </div>
            <div className="header-center">
                <h1
                    className="header-title"
                    onClick={() => navigate('/')}
                >
                    FilmTeca
                </h1>
            </div>
            <div className="header-right">
                {isLoggedIn ? (
                    <>
                        <button className="header-icon" onClick={() => navigate('/')}>
                            <FaUser size={24} />
                        </button>
                        <button className="header-icon" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="header-icon" onClick={handleLoginClick}>
                        <FaUser size={24} />
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
