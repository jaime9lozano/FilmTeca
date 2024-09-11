import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersInfo.css';
import Cookies from "js-cookie"; // Importamos los estilos

axios.defaults.withCredentials = true;

const UsersInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000' // URL para desarrollo
        : 'https://filmteca.onrender.com'; // URL para producción

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('auth_token'); // Obtener el token de la cookie
                const response = await axios.get(`${baseURL}/users/me/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
            } catch (err) {
                setError('Error al cargar la información del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [baseURL]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando películas...</p>
            </div>
        );
    }

    if (error) {
        return <div className="user-info-error">{error}</div>;
    }

    return (
        <div className="user-info-container">
            {userInfo ? (
                <div className="user-card">
                    <h2 className="user-name">{userInfo.nombre}</h2>
                    <p className="user-username">@{userInfo.username}</p>
                    <p className="user-email">Correo: {userInfo.email}</p>
                    <p className="user-roles">Roles: {userInfo.roles.join(', ')}</p>
                    <p className="user-date">Cuenta creada: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
                    <p className="user-date">Última actualización: {new Date(userInfo.updatedAt).toLocaleDateString()}</p>
                </div>
            ) : (
                <div className="user-info-error">No se encontró la información del usuario.</div>
            )}
        </div>
    );
};

export default UsersInfo;