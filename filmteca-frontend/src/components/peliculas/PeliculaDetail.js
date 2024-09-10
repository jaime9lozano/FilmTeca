import {useParams, Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './PeliculaDetail.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

axios.defaults.withCredentials = true;

const PeliculaDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtén el ID de la película desde la URL
    const [pelicula, setPelicula] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loadingPelicula, setLoadingPelicula] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000' // URL para desarrollo
        : 'https://filmteca.onrender.com'; // URL para producción

    useEffect(() => {
        // Obtener el token JWT desde la cookie
        const token = Cookies.get('auth_token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decodificar el token JWT
                const roles = decodedToken.role; // Obtener roles del token
                setIsAdmin(roles.includes('ADMIN')); // Verificar si el usuario es ADMIN
            } catch (err) {
                console.error('Error decodificando el token JWT:', err);
            }
        }

        // Cargar detalles de la película
        axios.get(`${baseURL}/peliculas/${id}`)
            .then(response => {
                const peliculaData = response.data;
                setPelicula(peliculaData);
                setLoadingPelicula(false);
            })
            .catch(error => {
                const errorMessage = 'Error consiguiendo los detalles de la película: ' + error.message;
                setError(errorMessage);
                setLoadingPelicula(false);
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                });
            });
    }, [id]);

    const handleDelete = () => {
        setDeleting(true); // Activar estado de eliminación
        const token = Cookies.get('auth_token'); // Obtener el token de la cookie

        axios.delete(`${baseURL}/peliculas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en el encabezado
            }
        })
            .then(() => {
                toast.success('Película eliminada con éxito', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Navegar después de que se cierra la notificación
            })
            .catch(error => {
                console.error('Error al eliminar la película:', error.response || error.message);
                toast.error('Error al eliminar la película: ' + (error.response ? error.response.data.message : error.message), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                });
                setDeleting(false); // Reiniciar el estado de eliminación en caso de error
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
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="delete-button"
                    disabled={deleting} // Deshabilita el botón si está en proceso de eliminación
                >
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
            )}
            <ToastContainer/>
            <h1 className="pelicula-title">{pelicula.title}</h1>
            <div className="pelicula-detail-content">
                <img src={pelicula.image} alt={pelicula.title} className="pelicula-detail-image"/>
                <div className="pelicula-detail-info">
                    <p><strong>Sinopsis:</strong> {pelicula.sinopsis}</p>

                    <p><strong>Director:</strong> {pelicula.directores && pelicula.directores.length > 0
                        ? pelicula.directores.map(director => director.name).join(', ')
                        : 'No tiene directores'}</p>

                    <p><strong>Actores:</strong> {pelicula.actores && pelicula.actores.length > 0
                        ? pelicula.actores.map(actor => actor.name).join(', ')
                        : 'No tiene Actores'}</p>

                    <p><strong>Géneros:</strong> {pelicula.generos && pelicula.generos.length > 0
                        ? pelicula.generos.map(genero => genero.name).join(', ')
                        : 'No tiene géneros'}</p>

                    <p><strong>Año de estreno:</strong> {pelicula.release_year}</p>

                    <p><strong>Duración:</strong> {pelicula.duration} minutos</p>

                    <p><strong>País de origen:</strong> {pelicula.country_of_origin}</p>

                    <p><strong>Música:</strong> {pelicula.music_by}</p>

                    <p><strong>Fotografía:</strong> {pelicula.photography_by}</p>

                    <p><strong>Premios:</strong> {pelicula.premios && pelicula.premios.length > 0
                        ? pelicula.premios.map(premio => premio.name).join(', ')
                        : 'No tiene premios'}</p>
                </div>
            </div>
        </div>
    );
};

export default PeliculaDetail;


