import './UserFavoritos.css';
import {FaStar} from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserFavoritos = () => {
    const { id } = useParams();
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showServerMessage, setShowServerMessage] = useState(false);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';
    const cloudinaryURL = 'https://res.cloudinary.com/dj0fdyymb/image/upload/';

    const fetchPeliculas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/favoritos/user/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('auth_token')}`
                }
            });

            // Mapea los datos para extraer la película y sus valoraciones
            const peliculasConValoraciones = response.data.map((favorito) => ({
                ...favorito.pelicula, // Extrae los datos de la película
                valoraciones: favorito.valoraciones, // Añade las valoraciones de la película
            }));

            setPeliculas(peliculasConValoraciones);
        } catch (error) {
            setError('Error consiguiendo las películas: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [baseURL, id]);

    // Fetch initial data with empty filters
    useEffect(() => {
        fetchPeliculas();
    }, [fetchPeliculas]);

    // Manejar el temporizador y el mensaje del servidor
    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setShowServerMessage(true);
            }, 2000);

            return () => clearTimeout(timer); // Limpiar temporizador al desmontar o cambiar loading
        } else {
            setShowServerMessage(false); // Ocultar el mensaje si loading es false
        }
    }, [loading]);

    const calculateAverageRating = (valoraciones) => {
        if (valoraciones.length === 0) return 0;
        const total = valoraciones.reduce((acc, { rating }) => acc + rating, 0);
        return (total / valoraciones.length).toFixed(1); // Devolver la media con un decimal
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                {showServerMessage ? (
                    <p>
                        El servidor es gratuito y se desactiva, necesita reactivarse y tarda unos minutos.
                        Por favor, espera un momento mientras se cargan los datos.
                    </p>
                ) : (
                    <p>Cargando películas...</p>
                )}
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="peliculas-container">
            <h2>Tus peliculas en favoritos</h2>
            <div className="peliculas-list">
                {peliculas.map(pelicula => (
                    <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id} className="pelicula-card-link">
                        <div className="pelicula-card"
                             style={{backgroundImage: `url(${cloudinaryURL}${pelicula.image})`}}>
                            <span className="pelicula-date">{pelicula.release_year}</span>
                            <div className="rating-container">
                                <FaStar className="rating-icon"/>
                                <span className="rating-value">
                                    {calculateAverageRating(pelicula.valoraciones)}
                                </span>
                            </div>
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
export default UserFavoritos;