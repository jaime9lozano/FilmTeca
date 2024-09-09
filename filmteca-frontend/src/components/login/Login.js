// src/components/login/Login.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const getCsrfToken = async () => {
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        } catch (error) {
            console.error('Error al obtener el token CSRF:', error);
            setError('Error al obtener el token CSRF: ' + error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtener el token CSRF
        await getCsrfToken();

        // Enviar la solicitud de inicio de sesión
        axios.post('http://localhost:8000/login', {
            email: email,
            password: password
        }, { withCredentials: true })
            .then(response => {
                // Manejar la respuesta exitosa
                console.log(response.data);
                localStorage.setItem('auth_token', response.data.token);
                navigate('/');
            })
            .catch(error => {
                // Manejar el error de autenticación
                console.error('Error de autenticación:', error);
                setError('Error de autenticación: ' + error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;

