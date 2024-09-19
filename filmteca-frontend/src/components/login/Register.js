import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    // Función para validar el formulario
    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Nombre no puede estar vacío';
        if (!username) newErrors.username = 'Username no puede estar vacío';
        if (!email) newErrors.email = 'Email no puede estar vacío';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email debe ser válido';
        if (!password) newErrors.password = 'Password no puede estar vacío';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            newErrors.password = 'Password no es válido. Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número';
        }

        // Validación para confirmar que las contraseñas coinciden
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debe repetir la contraseña';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setError(newErrors);
        // Retorna true si no hay errores, es decir, si el objeto `newErrors` está vacío
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Si la validación no pasa, no enviamos la solicitud
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const baseURL = process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000'
            : 'https://filmteca.onrender.com';

        try {
            await axios.post(`${baseURL}/auth/register`, {
                name,
                username,
                email,
                password,
            });

            // Muestra una notificación de éxito con el nombre del usuario
            toast.success(`¡Registro exitoso, ${name}!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Redirige al login después de un breve retraso
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            const validationErrors = err.response?.data?.message || {};
            setError(validationErrors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Regístrate</h2>
            <form onSubmit={handleRegister} className="login-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {error.name && <p className="error-message">{error.name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error.username && <p className="error-message">{error.username}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error.email && <p className="error-message">{error.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error.password && <p className="error-message">{error.password}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Repetir Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error.confirmPassword && <p className="error-message">{error.confirmPassword}</p>}
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p className="register-link">
                ¿Ya estás registrado?{' '}
                <span onClick={() => navigate('/login')} className="register-button">
                    Inicia sesión aquí
                </span>
            </p>
            <ToastContainer/>
        </div>
    );
};

export default Register;

