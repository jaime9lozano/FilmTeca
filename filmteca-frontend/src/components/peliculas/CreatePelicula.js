import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePelicula.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Select from 'react-select';

const CreatePelicula = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        sinopsis: '',
        duration: '',
        release_year: '',
        country_of_origin: '',
        music_by: '',
        photography_by: '',
        image: '',
        generos: [],
        directores: [],
        actores: [],
        premios: []
    });
    const [errors, setErrors] = useState({});
    const [generos, setGeneros] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [actores, setActores] = useState([]);
    const [premios, setPremios] = useState([]);

    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';

    // Fetch géneros, directores, actores, premios
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [generosData, directoresData, actoresData, premiosData] = await Promise.all([
                    axios.get(`${baseURL}/generos`),
                    axios.get(`${baseURL}/directores`),
                    axios.get(`${baseURL}/actores`),
                    axios.get(`${baseURL}/premios`)
                ]);

                setGeneros(generosData.data.map(g => ({ value: g.id, label: g.name })));
                setDirectores(directoresData.data.map(d => ({ value: d.id, label: d.name })));
                setActores(actoresData.data.map(a => ({ value: a.id, label: a.name })));
                setPremios(premiosData.data.map(p => ({ value: p.id, label: p.name })));
            } catch (error) {
                toast.error('Error al cargar los datos para el formulario.');
            }
        };

        fetchData();
    }, [baseURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData((prev) => ({ ...prev, [name]: values }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'El título es obligatorio';
        if (!formData.sinopsis) newErrors.sinopsis = 'La sinopsis es obligatoria';
        if (!formData.duration) newErrors.duration = 'La duración es obligatoria';
        if (!formData.release_year) newErrors.release_year = 'El año de estreno es obligatorio';
        if (!formData.country_of_origin) newErrors.country_of_origin = 'El país de origen es obligatorio';
        if (!formData.image) newErrors.image = 'La imagen es obligatoria';
        if (formData.generos.length === 0) newErrors.generos = 'Debe seleccionar al menos un género';
        if (formData.directores.length === 0) newErrors.directores = 'Debe seleccionar al menos un director';
        if (formData.actores.length === 0) newErrors.actores = 'Debe seleccionar al menos un actor';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = Cookies.get('auth_token');

        // Convertir valores a números enteros donde sea necesario
        const updatedFormData = {
            ...formData,
            duration: parseInt(formData.duration, 10), // Asegurarse de que es un número entero
            release_year: parseInt(formData.release_year, 10), // Asegurarse de que es un número entero
            music_by: formData.music_by.trim() || '', // Asegurarse de que no sea una cadena vacía si es opcional
            photography_by: formData.photography_by.trim() || '', // Asegurarse de que no sea una cadena vacía si es opcional
            generos: formData.generos.map(id => parseInt(id, 10)), // Convertir IDs a números enteros
            directores: formData.directores.map(id => parseInt(id, 10)), // Convertir IDs a números enteros
            actores: formData.actores.map(id => parseInt(id, 10)), // Convertir IDs a números enteros
            premios: formData.premios.map(id => parseInt(id, 10)) // Convertir IDs a números enteros
        };

        axios.post(`${baseURL}/peliculas`, updatedFormData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success('Pelicula creada con éxito', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Opcional: Añadir un retraso antes de navegar
            })
            .catch(() => {
                toast.error('Error al crear la película');
            });
    };

    return (
        <div className="film-info-container">
            <ToastContainer/>
            <form className="film-card" onSubmit={handleSubmit}>
                <div className="film-info-row">
                    <label className="film-info-label">Título*:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange}/>
                    {errors.title && <p className="error-message">{errors.title}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Sinopsis*:</label>
                    <textarea name="sinopsis" value={formData.sinopsis} onChange={handleChange}></textarea>
                    {errors.sinopsis && <p className="error-message">{errors.sinopsis}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Duración*:</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange}/>
                    {errors.duration && <p className="error-message">{errors.duration}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Año de Estreno*:</label>
                    <input type="number" name="release_year" value={formData.release_year} onChange={handleChange}/>
                    {errors.release_year && <p className="error-message">{errors.release_year}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">País de Origen*:</label>
                    <input type="text" name="country_of_origin" value={formData.country_of_origin}
                           onChange={handleChange}/>
                    {errors.country_of_origin && <p className="error-message">{errors.country_of_origin}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Imagen*:</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange}/>
                    {errors.image && <p className="error-message">{errors.image}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Musica:</label>
                    <input type="text" name="music_by" value={formData.music_by} onChange={handleChange}/>
                    {errors.music_by && <p className="error-message">{errors.music_by}</p>}
                </div>

                <div className="film-info-row">
                    <label className="film-info-label">Fotografía:</label>
                    <input type="text" name="photography_by" value={formData.photography_by} onChange={handleChange}/>
                    {errors.photography_by && <p className="error-message">{errors.photography_by}</p>}
                </div>

                {/* Géneros */}
                <div className="film-info-row">
                    <label className="film-info-label">Géneros*:</label>
                    <Select
                        isMulti
                        name="generos"
                        options={generos}
                        value={generos.filter(g => formData.generos.includes(g.value))}
                        onChange={(selectedOptions) => handleMultiSelectChange('generos', selectedOptions)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    {errors.generos && <p className="error-message">{errors.generos}</p>}
                </div>

                {/* Directores */}
                <div className="film-info-row">
                    <label className="film-info-label">Directores*:</label>
                    <Select
                        isMulti
                        name="directores"
                        options={directores}
                        value={directores.filter(d => formData.directores.includes(d.value))}
                        onChange={(selectedOptions) => handleMultiSelectChange('directores', selectedOptions)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    {errors.directores && <p className="error-message">{errors.directores}</p>}
                </div>

                {/* Actores */}
                <div className="film-info-row">
                    <label className="film-info-label">Actores*:</label>
                    <Select
                        isMulti
                        name="actores"
                        options={actores}
                        value={actores.filter(a => formData.actores.includes(a.value))}
                        onChange={(selectedOptions) => handleMultiSelectChange('actores', selectedOptions)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    {errors.actores && <p className="error-message">{errors.actores}</p>}
                </div>

                {/* Premios */}
                <div className="film-info-row">
                    <label className="film-info-label">Premios:</label>
                    <Select
                        isMulti
                        name="premios"
                        options={premios}
                        value={premios.filter(p => formData.premios.includes(p.value))}
                        onChange={(selectedOptions) => handleMultiSelectChange('premios', selectedOptions)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    {errors.premios && <p className="error-message">{errors.premios}</p>}
                </div>

                <button type="submit" className="submit-button">Crear Película</button>
            </form>
        </div>
    );
};

export default CreatePelicula;


