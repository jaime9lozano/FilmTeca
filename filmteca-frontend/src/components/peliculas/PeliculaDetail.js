import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './PeliculaDetail.css'; // Asegúrate de tener este archivo CSS

axios.defaults.withCredentials = true;

const PeliculaDetail = () => {
    const { id } = useParams(); // Obtén el ID de la película desde la URL
    const [pelicula, setPelicula] = useState(null);
    const [director, setDirector] = useState(null);
    const [generos, setGeneros] = useState([]);
    const [actores, setActores] = useState([]);
    const [premios, setPremios] = useState([]);

    const [loadingPelicula, setLoadingPelicula] = useState(true);
    const [loadingGeneros, setLoadingGeneros] = useState(true);
    const [loadingActores, setLoadingActores] = useState(true);
    const [loadingPremios, setLoadingPremios] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar detalles de la película
        axios.get(`http://localhost:8000/api/peliculas/${id}`)
            .then(response => {
                const peliculaData = response.data.data;
                setPelicula(peliculaData);

                // Cargar director
                axios.get(`http://localhost:8000/api/directores/${peliculaData.director_id}`)
                    .then(response => {
                        setDirector(response.data.data);
                    })
                    .catch(error => {
                        setError('Error consiguiendo los detalles del director: ' + error.message);
                    });

                // Cargar géneros
                axios.get(`http://localhost:8000/api/peliculas/${id}/generos`)
                    .then(response => {
                        setGeneros(response.data.data);
                    })
                    .catch(error => {
                        setError('Error consiguiendo los géneros: ' + error.message);
                    })
                    .finally(() => setLoadingGeneros(false));

                // Cargar actores
                axios.get(`http://localhost:8000/api/peliculas/${id}/actores`)
                    .then(response => {
                        setActores(response.data.data);
                    })
                    .catch(error => {
                        setError('Error consiguiendo los actores: ' + error.message);
                    })
                    .finally(() => setLoadingActores(false));

                // Cargar premios
                axios.get(`http://localhost:8000/api/peliculas/${id}/premios`)
                    .then(response => {
                        setPremios(response.data.data);
                    })
                    .catch(error => {
                        setError('Error consiguiendo los premios: ' + error.message);
                    })
                    .finally(() => setLoadingPremios(false));

                setLoadingPelicula(false);
            })
            .catch(error => {
                setError('Error consiguiendo los detalles de la película: ' + error.message);
                setLoadingPelicula(false);
            });
    }, [id]);

    const handleDelete = () => {
        axios.get('http://localhost:8000/sanctum/csrf-cookie')
            .then(() => {
                axios.delete(`http://localhost:8000/api/peliculas/${id}`)
                    .then(() => {
                        alert('Película eliminada con éxito');
                        window.location.href = '/';
                    })
                    .catch(error => {
                        console.error('Error al eliminar la película:', error.response || error.message);
                        alert('Error al eliminar la película: ' + (error.response ? error.response.data.message : error.message));
                    });
            })
            .catch(error => {
                console.error('Error al obtener el token CSRF:', error.response || error.message);
                alert('Error al obtener el token CSRF: ' + (error.response ? error.response.data.message : error.message));
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

                    <p>
                        <strong>Géneros:</strong> {loadingGeneros ? 'Cargando géneros...' : (generos.length > 0 ? generos.map(genero => genero.name).join(', ') : 'No tiene géneros')}
                    </p>

                    <p>
                        <strong>Actores:</strong> {loadingActores ? 'Cargando actores...' : (actores.length > 0 ? actores.map(actor => actor.name).join(', ') : 'No tiene actores')}
                    </p>

                    <p><strong>Año de estreno:</strong> {pelicula.release_year}</p>

                    <p><strong>Director:</strong> {director ? director.name : 'Cargando director...'}</p>

                    <p><strong>Duración:</strong> {pelicula.duration} minutos</p>

                    <p><strong>País de origen:</strong> {pelicula.country_of_origin}</p>

                    <p><strong>Música:</strong> {pelicula.music_by}</p>

                    <p><strong>Fotografía:</strong> {pelicula.photography_by}</p>

                    <p>
                        <strong>Premios:</strong> {loadingPremios ? 'Cargando premios...' : (premios.length > 0 ? premios.map(premio => premio.name).join(', ') : 'No tiene premios')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PeliculaDetail;


