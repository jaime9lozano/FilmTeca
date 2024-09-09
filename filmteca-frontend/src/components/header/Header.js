// src/components/header/Header.js
import React from 'react';
import './Header.css';
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom"; // Importa el CSS si quieres estilizar el header

function Header() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <img src={'FilmTeca-4.png'} alt="Logo" className="header-logo" onClick={() => navigate('/')} />
            </div>
            <div className="header-center">
                <h1 className="header-title" onClick={() => navigate('/')}>FilmTeca</h1>
            </div>
            <div className="header-right">
                <button className="header-icon" onClick={() => navigate('/login')}>
                    <FaUser size={24} />
                </button>
            </div>
        </header>
    );
}

export default Header;
