import React, {useEffect, useState} from 'react';
import './Header.css';
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

function Header() {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [generosAnchorEl, setGenerosAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openGenerosMenu = Boolean(generosAnchorEl);
    const [isAdmin, setIsAdmin] = useState(false);

    // Obtener los géneros al cargar el componente
    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const baseURL = process.env.NODE_ENV === 'development'
                    ? 'http://localhost:8000'
                    : 'https://filmteca.onrender.com';
                const response = await axios.get(`${baseURL}/generos`);
                setGeneros(response.data); // Asume que el endpoint devuelve un array de géneros
            } catch (error) {
                console.error('Error al obtener los géneros:', error);
            }
        };

        // Obtener el token JWT desde la cookie
        const token = Cookies.get('auth_token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decodificar el token JWT
                const roles = decodedToken.role; // Obtener roles del token
                setIsAdmin(roles.includes('ADMIN')); // Verificar si el usuario es ADMIN
            } catch (err) {
                console.error('Error decodificando el token JWT:', err);
            }
        }

        fetchGeneros();
    }, []);

    const handleLoginClick = () => {
        const token = Cookies.get('auth_token');
        if (!token) {
            navigate('/login'); // Redirige al login si no hay token
        } else {
            navigate('/user'); // Redirige a la página de inicio si ya estás logueado
        }
    };

    const handleLogout = () => {
        Cookies.remove('auth_token'); // Borra el token de la cookie
        window.location.reload();
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

    const token = Cookies.get('auth_token');
    const isLoggedIn = Boolean(token);

    return (
        <header className="header">
            <div className="header-left">
                <IconButton onClick={handleMenuOpen} color="inherit">
                    <MenuIcon />
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
                        Géneros
                    </MenuItem>
                    {isAdmin && ( // Mostrar el MenuItem solo si el usuario es admin
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
                            Crear Película
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
                {isLoggedIn ? (
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

