// src/components/footer/Footer.js
import React from 'react';
import './Footer.css';
import {FaGithub, FaLink} from "react-icons/fa"; // Importa el CSS si quieres estilizar el footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="https://github.com/jaime9lozano" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={20} /> Github
                </a>
                <span> | </span>
                <a href="https://portfolio-jaime-lozano.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <FaLink size={20} /> Porfolio personal
                </a>
            </div>
            <p className="footer-text">© 2024 FilmTeca. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
