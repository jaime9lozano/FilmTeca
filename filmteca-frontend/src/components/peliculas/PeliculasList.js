import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PeliculasList.css'; // Asegúrate de crear este archivo CSS

const PeliculasList = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://filmteca.onrender.com/peliculas', { withCredentials: true })
            .then(response => {
                setPeliculas(response.data.data); // Accede a la propiedad 'data' del JSON
                setLoading(false);
            })
            .catch(error => {
                setError('Error consiguiendo las películas: ' + error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando películas...</p>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="peliculas-container">
            <h2>Películas</h2>
            <div className="peliculas-list">
                {peliculas.map(pelicula => (
                    <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id} className="pelicula-card-link">
                        <div className="pelicula-card">
                            <img src={pelicula.image} alt={pelicula.title} className="pelicula-image" />
                            <div className="pelicula-title">
                                <h3>{pelicula.title}</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PeliculasList;


