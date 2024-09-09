import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './PeliculaDetail.css'; // Asegúrate de tener este archivo CSS

axios.defaults.withCredentials = true;

const PeliculaDetail = () => {
    const { id } = useParams(); // Obtén el ID de la película desde la URL
    const [pelicula, setPelicula] = useState(null);

    const [loadingPelicula, setLoadingPelicula] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar detalles de la película
        axios.get(`http://localhost:8000/peliculas/${id}`)
            .then(response => {
                const peliculaData = response.data;
                setPelicula(peliculaData);
                setLoadingPelicula(false);
            })
            .catch(error => {
                setError('Error consiguiendo los detalles de la película: ' + error.message);
                setLoadingPelicula(false);
            });
    }, [id]);

    const handleDelete = () => {
        axios.delete(`http://localhost:8000/peliculas/${id}`)
            .then(() => {
                alert('Película eliminada con éxito');
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error al eliminar la película:', error.response || error.message);
                alert('Error al eliminar la película: ' + (error.response ? error.response.data.message : error.message));
            });
    };

    if (loadingPelicula) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando detalles de la película...</p>
            </div>
        );
    }


    if (error) {
        return <p>{error}</p>;
    }

    if (!pelicula) {
        return <p>No se encontraron detalles para esta película.</p>;
    }

    return (
        <div className="pelicula-detail-container">
            <Link to="/" className="back-button">Volver</Link>
            <button onClick={handleDelete} className="delete-button">Eliminar</button>
            <h1 className="pelicula-title">{pelicula.title}</h1>
            <div className="pelicula-detail-content">
                <img src={pelicula.image} alt={pelicula.title} className="pelicula-detail-image"/>
                <div className="pelicula-detail-info">
                    <p><strong>Sinopsis:</strong> {pelicula.sinopsis}</p>

                    <p><strong>Año de estreno:</strong> {pelicula.release_year}</p>

                    <p><strong>Duración:</strong> {pelicula.duration} minutos</p>

                    <p><strong>País de origen:</strong> {pelicula.country_of_origin}</p>

                    <p><strong>Música:</strong> {pelicula.music_by}</p>

                    <p><strong>Fotografía:</strong> {pelicula.photography_by}</p>
                </div>
            </div>
        </div>
    );
};

export default PeliculaDetail;


