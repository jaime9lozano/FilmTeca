// src/components/login/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"; // Asegúrate de crear este archivo CSS
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const baseURL = process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000'
            : 'https://filmteca.onrender.com';

        try {
            const response = await axios.post(`${baseURL}/auth/login`, {
                username,
                password,
            });

            const { access_token } = response.data;

            // Guardar el token en una cookie
            Cookies.set('auth_token', access_token, { expires: 7 }); // Expira en 7 días
            navigate('/'); // Cambia a la ruta que desees y refresca
            window.location.reload();

        } catch (error) {
            setError('Nombre de usuario o contraseña inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <p className="register-link">
                ¿No tienes cuenta?{' '}
                <span onClick={() => navigate('/register')} className="register-button">
                    Regístrate aquí
                </span>
            </p>
        </div>
    );

};

export default Login;

