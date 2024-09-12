import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersInfo.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const UsersInfo = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState({});
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('auth_token');
                const response = await axios.get(`${baseURL}/users/me/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
                setEditForm(response.data);
            } catch (err) {
                setError('Error al cargar la información del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [baseURL]);

    const validateForm = () => {
        const newErrors = {};
        if (!editForm.nombre) newErrors.nombre = 'Nombre no puede estar vacío';
        if (!editForm.username) newErrors.username = 'Username no puede estar vacío';
        if (!editForm.email) newErrors.email = 'Email no puede estar vacío';
        else if (!/\S+@\S+\.\S+/.test(editForm.email)) newErrors.email = 'Email debe ser válido';
        if (!editForm.password) newErrors.password = 'Password no puede estar vacío';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(editForm.password))
            newErrors.password = 'Password no es válido, debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = async () => {
        try {
            const token = Cookies.get('auth_token');
            await axios.delete(`${baseURL}/users/me/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Cookies.remove('auth_token');
            navigate('/');
        } catch (err) {
            setError('Error al eliminar la información del usuario.');
        }
    };

    const handleSaveClick = async () => {
        if (!validateForm()) return; // Solo guarda si la validación es correcta

        try {
            const token = Cookies.get('auth_token');
            await axios.put(`${baseURL}/users/me/profile`, editForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(editForm);
            setIsEditing(false);
        } catch (err) {
            setError('Error al guardar la información del usuario.');
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditForm(userInfo); // Restablece el formulario a los datos originales
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando información...</p>
            </div>
        );
    }

    if (error) {
        return <div className="user-info-error">{error}</div>;
    }

    return (
        <div className="user-info-container">
            <div className="user-actions">
                {!isEditing && (
                    <>
                        <button className="btn-edit" onClick={handleEditClick}>Editar</button>
                        <button className="btn-delete" onClick={handleDeleteClick}>Eliminar</button>
                    </>
                )}
            </div>
            {isEditing ? (
                <div className="user-card">
                    <div className="user-info-row">
                        <span className="user-info-label">Nombre:</span>
                        <input
                            type="text"
                            name="nombre"
                            value={editForm.nombre || ''}
                            onChange={handleChange}
                        />
                        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Username:</span>
                        <input
                            type="text"
                            name="username"
                            value={editForm.username || ''}
                            onChange={handleChange}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Correo:</span>
                        <input
                            type="email"
                            name="email"
                            value={editForm.email || ''}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Contraseña:</span>
                        <input
                            type="password"
                            name="password"
                            value={editForm.password || ''}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Roles:</span>
                        <span>{editForm.roles.join(', ')}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Cuenta creada:</span>
                        <span>{new Date(editForm.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Última actualización:</span>
                        <span>{new Date(editForm.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="user-card-actions">
                        <button className="btn-save" onClick={handleSaveClick}>Guardar</button>
                        <button className="btn-cancel" onClick={handleCancelClick}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="user-card">
                    <div className="user-info-row">
                        <span className="user-info-label">Nombre:</span>
                        <span>{userInfo.nombre}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Username:</span>
                        <span>{userInfo.username}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Correo:</span>
                        <span>{userInfo.email}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Roles:</span>
                        <span>{userInfo.roles.join(', ')}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Cuenta creada:</span>
                        <span>{new Date(userInfo.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="user-info-row">
                        <span className="user-info-label">Última actualización:</span>
                        <span>{new Date(userInfo.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersInfo;


