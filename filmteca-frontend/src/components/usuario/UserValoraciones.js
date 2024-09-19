import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import './UserValoraciones.css'; // Asumimos que tienes un archivo CSS
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar } from 'react-icons/fa';

axios.defaults.withCredentials = true;

const UserValoraciones = () => {
    const { id } = useParams(); // Obtén el ID del usuario desde la URL
    const [valoraciones, setValoraciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
    });
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000' // URL para desarrollo
        : 'https://filmteca.onrender.com'; // URL para producción

    const cloudinaryURL = 'https://res.cloudinary.com/dj0fdyymb/image/upload/';

    const fetchValoraciones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            // Construir los parámetros de búsqueda
            const params = {
                page: page,
            };

            // Llamada a la API con la paginación y credenciales
            const response = await axios.get(`${baseURL}/valoraciones/${id}/user`, {
                params: params,
                withCredentials: true,
            });

            // Actualizar valoraciones y paginación
            setValoraciones(response.data.data);
            setPagination({
                currentPage: response.data.meta.currentPage,
                totalPages: response.data.meta.totalPages,
                totalItems: response.data.meta.totalItems,
                itemsPerPage: response.data.meta.itemsPerPage,
            });
        } catch (error) {
            // Manejo de errores
            const errorMessage = 'Error cargando las valoraciones: ' + error.message;
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    }, [baseURL, id]);

// Ejecutar la función de carga de valoraciones cuando el componente se monte o cuando cambien `id` o `fetchValoraciones`
    useEffect(() => {
        fetchValoraciones();
    }, [fetchValoraciones]);


    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando valoraciones...</p>
            </div>
        );
    }

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) return;
        fetchValoraciones(page);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (valoraciones.length === 0) {
        return <p>No hay valoraciones para este usuario.</p>;
    }

    return (
        <div className="user-valoraciones-container">
            <ToastContainer/>
            <h1>Valoraciones de {valoraciones[0]?.user?.name}</h1>
            <div className="valoraciones-list">
                {valoraciones.map((valoracion) => (
                    <Link
                        key={valoracion.id}
                        to={`/pelicula/${valoracion.pelicula.id}`}
                        className="valoracion-link"
                    >
                    <div key={valoracion.id} className="valoracion-card">
                        <h2>{valoracion.pelicula.title}</h2>
                        {/* Imagen de la película */}
                        <div className="valoracion-image-container">
                            <img
                                src={`${cloudinaryURL}${valoracion.pelicula.image}`}
                                alt={`Imagen de ${valoracion.pelicula.title}`}
                                className="valoracion-pelicula-image"
                            />
                        </div>

                        <p className="valoracion-rating">
                            <FaStar className="star-icon"/> {valoracion.rating}
                        </p>
                        <p className="valoracion-review">{valoracion.review}</p>
                        <p className="valoracion-date">
                            Fecha: {new Date(valoracion.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Anterior
                </button>
                <span className="pagination-info">
                    Página {pagination.currentPage} de {pagination.totalPages} - {pagination.totalItems} películas en total
                </span>
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );

};

export default UserValoraciones;