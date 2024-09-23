import React, {useEffect, useState} from 'react';
import './Header.css';
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { Menu, MenuItem, IconButton } from '@mui/material';
import {FaFilm, FaStar, FaUser, FaHeart, FaMoon, FaSun} from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAuth } from "../../AuthContext";
import { IoMdList } from "react-icons/io";

function Header({ toggleDarkMode, darkMode }) {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [generosAnchorEl, setGenerosAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openGenerosMenu = Boolean(generosAnchorEl);
    const { isAuthenticated, userId, roles, updateAuthState } = useAuth();
    const isSuperUser = roles && roles.includes('SUPERUSER');

    // Obtener los géneros al cargar el componente
    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const baseURL = process.env.NODE_ENV === 'development'
                    ? 'http://localhost:8000'
                    : 'https://filmteca.onrender.com';

                const response = await axios.get(`${baseURL}/generos`, { withCredentials: true });
                setGeneros(response.data); // Asume que el endpoint devuelve un array de géneros

            } catch (error) {
                if (error.response) {
                    // El servidor respondió con un código de estado fuera del rango 2xx
                    console.error('Error en la respuesta del servidor:', error.response.data);
                    console.error('Estado:', error.response.status);
                    console.error('Encabezados:', error.response.headers);
                } else if (error.request) {
                    // La solicitud fue hecha pero no se recibió respuesta (error de red o servidor inactivo)
                    console.error('No se recibió respuesta del servidor:', error.request);
                } else {
                    // Otro tipo de error al configurar la solicitud
                    console.error('Error al hacer la solicitud:', error.message);
                }
                console.error('Detalles completos del error:', error.config);
            }
        };
        fetchGeneros();
    }, []);

    const handleLoginClick = () => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirige al login si no hay token
        } else {
            navigate('/user'); // Redirige a la página de inicio si ya estás logueado
        }
    };

    const handleLogout = () => {
        Cookies.remove('auth_token'); // Borra el token de la cookie
        updateAuthState();
        navigate('/login');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setGenerosAnchorEl(null); // Cerrar el menú de géneros al cerrar el menú principal
    };

    const handleGenerosMenuOpen = (event) => {
        setGenerosAnchorEl(event.currentTarget);
    };

    const handleGenerosMenuClose = () => {
        setGenerosAnchorEl(null);
        setAnchorEl(null);
    };

    const handleCreatePeliculaClick = () => {
        navigate('/createPelicula'); // Redirigir a la página de creación de películas
        handleMenuClose(); // Cerrar el menú
    };

    const handleValoracionesClick = () => {
        navigate(`/userValoraciones/${userId}`); // Redirigir a la página de creación de películas
        handleMenuClose(); // Cerrar el menú
    };

    const handleFavoritosClick = () => {
        navigate(`/userFavoritos/${userId}`); // Redirigir a la página de creación de películas
        handleMenuClose(); // Cerrar el menú
    };

    return (
        <header className="header">
            <div className="header-left">
                <IconButton onClick={handleMenuOpen} color="inherit">
                    <MdMenu />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: '#282c34',
                            color: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            border: '1px solid #003d00',
                            transition: 'transform 0.3s ease-in-out',
                            transform: 'scale(0.9)',
                            width: '150px',
                            height: 'auto',
                            '@media (max-width: 768px)': {
                                width: '120px',
                                fontSize: '14px',
                            },
                            '@media (max-width: 480px)': {
                                width: '100px',
                                fontSize: '12px',
                            },
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleGenerosMenuOpen}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#003d00',
                                color: '#FDC1DA',
                                transition: 'background-color 0.3s ease, color 0.3s ease'
                            },
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            '@media (max-width: 768px)': {
                                padding: '6px 12px',
                                fontSize: '12px',
                            },
                            '@media (max-width: 480px)': {
                                padding: '4px 8px',
                                fontSize: '10px',
                            },
                        }}
                    >
                        <IoMdList style={{ marginRight: '8px' }} />
                        Géneros
                    </MenuItem>
                    {isSuperUser && (
                        <MenuItem
                            onClick={handleCreatePeliculaClick}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#003d00',
                                    color: '#FDC1DA',
                                    transition: 'background-color 0.3s ease, color 0.3s ease'
                                },
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                '@media (max-width: 768px)': {
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                },
                                '@media (max-width: 480px)': {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                },
                            }}
                        >
                            <FaFilm style={{ marginRight: '8px' }} />
                            Crear Película
                        </MenuItem>
                    )}
                    {isAuthenticated && (
                        <MenuItem
                            onClick={handleValoracionesClick}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#003d00',
                                    color: '#FDC1DA',
                                    transition: 'background-color 0.3s ease, color 0.3s ease'
                                },
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                '@media (max-width: 768px)': {
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                },
                                '@media (max-width: 480px)': {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                },
                            }}
                        >
                            <FaStar style={{ marginRight: '8px' }} />
                            Valoraciones
                        </MenuItem>
                    )}
                    {isAuthenticated && (
                        <MenuItem
                            onClick={handleFavoritosClick}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#003d00',
                                    color: '#FDC1DA',
                                    transition: 'background-color 0.3s ease, color 0.3s ease'
                                },
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                '@media (max-width: 768px)': {
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                },
                                '@media (max-width: 480px)': {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                },
                            }}
                        >
                            <FaHeart style={{ marginRight: '8px' }} />
                            Favoritos
                        </MenuItem>
                    )}
                    <Menu
                        anchorEl={generosAnchorEl}
                        open={openGenerosMenu}
                        onClose={handleGenerosMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#282c34',
                                color: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                width: '150px',
                                height: 'auto',
                                '@media (max-width: 768px)': {
                                    width: '120px',
                                },
                                '@media (max-width: 480px)': {
                                    width: '100px',
                                },
                            },
                        }}
                    >
                        {generos.length > 0 ? (
                            generos.map((genero) => (
                                <MenuItem
                                    key={genero.id}
                                    onClick={handleGenerosMenuClose}
                                    sx={{
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#003d00',
                                            color: '#FDC1DA',
                                            transition: 'background-color 0.3s ease, color 0.3s ease'
                                        },
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        '@media (max-width: 768px)': {
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                        },
                                        '@media (max-width: 480px)': {
                                            padding: '4px 8px',
                                            fontSize: '10px',
                                        },
                                    }}
                                >
                                    <Link
                                        to={{
                                            pathname: `/genero/${genero.id}`,
                                            state: { generoName: genero.name }
                                        }}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'block',
                                        }}
                                    >
                                        {genero.name}
                                    </Link>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem
                                onClick={handleGenerosMenuClose}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#003d00',
                                        color: '#FDC1DA',
                                        transition: 'background-color 0.3s ease, color 0.3s ease'
                                    },
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    '@media (max-width: 768px)': {
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                    },
                                    '@media (max-width: 480px)': {
                                        padding: '4px 8px',
                                        fontSize: '10px',
                                    },
                                }}
                            >
                                No hay géneros disponibles
                            </MenuItem>
                        )}
                    </Menu>
                </Menu>
                <img
                    src={'FilmTeca-4.png'}
                    alt="Logo"
                    className="header-logo"
                    onClick={() => navigate('/')}
                />
            </div>
            <div className="header-center">
                <h1
                    className="header-title"
                    onClick={() => navigate('/')}
                >
                    FilmTeca
                </h1>
            </div>
            <div className="header-right">
                {/* Botón para alternar el modo oscuro */}
                <button className="header-icon" onClick={toggleDarkMode}>
                    {darkMode ? <FaSun size={24}/> : <FaMoon size={24}/>}
                </button>
                {isAuthenticated ? (
                    <>
                        <button className="header-icon" onClick={() => navigate('/user')}>
                            <FaUser size={24}/>
                        </button>
                        <button className="header-icon" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="header-icon" onClick={handleLoginClick}>
                        <FaUser size={24}/>
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;

