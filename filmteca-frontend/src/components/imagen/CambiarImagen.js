import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './CambiarImagen.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const CambiarImagen = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [pelicula, setPelicula] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';

    useEffect(() => {
        // Cargar detalles de la película
        axios.get(`${baseURL}/peliculas/${id}`)
            .then(response => {
                setPelicula(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error consiguiendo los detalles de la película: ' + error.message);
                setLoading(false);
            });
    }, [id, baseURL]);

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]); // Actualiza la imagen seleccionada
    };

    const handleSubmit = () => {
        if (!newImage) {
            toast.error('Por favor selecciona una imagen para subir.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', newImage);

        const token = Cookies.get('auth_token'); // Obtener el token de la cookie

        axios.patch(`${baseURL}/peliculas/${id}/imagen`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`, // Incluir el token de autenticación
            }
        }).then(() => {
            toast.success('Imagen cambiada con éxito', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                navigate(`/pelicula/${id}`); // Redirige a la página de detalles de la película
            }, 3000);

        }).catch(error => {
            toast.error('Error al cambiar la imagen: ' + error.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    };


    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="cambiar-imagen-container">
            <ToastContainer />
            <h1>Cambiar Imagen de {pelicula.title}</h1>
            <div className="cambiar-imagen-content">
                <img
                    src={`${baseURL}/storage/${pelicula.image}`}
                    alt={pelicula.title}
                    className="pelicula-detail-image"
                />
                <div className="cambiar-imagen-form">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="botones">
                        <button className="volver-button">
                            <Link to={`/pelicula/${id}`}>Volver</Link>
                        </button>
                        <button className="cambiar-button" onClick={handleSubmit}>
                            Cambiar Imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CambiarImagen;
