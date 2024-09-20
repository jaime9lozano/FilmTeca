import React from 'react';
import { Link } from 'react-router-dom';
import './Forbidden.css';

const Forbidden = () => {
    return (
        <div className="forbidden-container">
            <h1 className="forbidden-title">Acceso Denegado</h1>
            <Link to="/" className="forbidden-button">Volver a Inicio</Link>
        </div>
    );
};

export default Forbidden;