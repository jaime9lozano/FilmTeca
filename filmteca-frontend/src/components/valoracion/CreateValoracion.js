import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './CreateValoracion.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {useAuth} from "../../AuthContext";
import StarRating from "./StarRating";

const CreateValoracion = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener ID de la película de la ruta
    const { userId } = useAuth(); // Obtener el ID del usuario desde el contexto
    const [formData, setFormData] = useState({
        rating: '',
        review: ''
    });
    const [errors, setErrors] = useState({});
    const [movie, setMovie] = useState(null);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';
    const cloudinaryURL = 'https://res.cloudinary.com/dj0fdyymb/image/upload/';

    useEffect(() => {
        // Obtener información de la película
        axios.get(`${baseURL}/peliculas/${id}`)
            .then((response) => {
                setMovie(response.data);
            })
            .catch((error) => {
                toast.error('Error al obtener los detalles de la película');
            });
    }, [id, baseURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (value) => {
        setFormData((prev) => ({ ...prev, rating: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.rating) newErrors.rating = 'La calificación es obligatoria';
        else if (formData.rating < 1 || formData.rating > 10) newErrors.rating = 'La calificación debe estar entre 1 y 10';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = Cookies.get('auth_token');

        axios.post(`${baseURL}/valoraciones`, {
            rating: parseInt(formData.rating, 10),
            review: formData.review.trim() || '',
            peliculaId: parseInt(id, 10),
            userId: userId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success('Valoración creada con éxito', {
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
                }, 2000);
            })
            .catch(() => {
                toast.error('Error al crear la valoración');
            });
    };

    return (
        <div className="form-contenedor">
            <div className="background-image"
                 style={{backgroundImage: movie ? `url(https://res.cloudinary.com/dj0fdyymb/image/upload/${movie.image})` : 'none'}}>
            </div>
            <ToastContainer/>
            <form className="rating-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Crear Valoración</h2>
                {movie && (
                    <div className="movie-details">
                        <h3 className="movie-title">{movie.title}</h3>
                        <img src={`${cloudinaryURL}${movie.image}`} alt={movie.title} className="movie-image"/>
                    </div>
                )}
                <div className="form-fields">
                    <div className="field-group">
                        <label className="form-label">Calificación*</label>
                        <StarRating rating={formData.rating} onChange={handleRatingChange}/>
                        {errors.rating && <p className="error-message">{errors.rating}</p>}
                    </div>

                    <div className="field-group">
                        <label className="form-label">Reseña</label>
                        <textarea
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            className="form-textarea"
                        />
                    </div>
                </div>
                <div className="botones">
                    <button type="button" className="volverBoton" onClick={() => navigate(-1)}>Volver</button>
                    <button type="submit" className="enviarBoton">Crear Valoración</button>
                </div>
            </form>
        </div>
    );
};

export default CreateValoracion;