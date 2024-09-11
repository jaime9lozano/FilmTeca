// src/components/header/Header.js
import React, {useEffect, useState} from 'react';
import './Header.css';
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [generosAnchorEl, setGenerosAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openGenerosMenu = Boolean(generosAnchorEl);

    // Obtener los géneros al cargar el componente
    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const baseURL = process.env.NODE_ENV === 'development'
                    ? 'http://localhost:8000'
                    : 'https://filmteca.onrender.com';
                const response = await axios.get(`${baseURL}/generos`);
                setGeneros(response.data.data); // Asume que el endpoint devuelve un array de géneros
            } catch (error) {
                console.error('Error al obtener los géneros:', error);
            }
        };

        fetchGeneros();
    }, []);

    const handleLoginClick = () => {
        const token = Cookies.get('auth_token');
        if (!token) {
            navigate('/login'); // Redirige al login si no hay token
        } else {
            navigate('/'); // Redirige a la página de inicio si ya estás logueado
        }
    };

    const handleLogout = () => {
        Cookies.remove('auth_token'); // Borra el token de la cookie
        navigate('/login'); // Redirige al login después de cerrar sesión
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
                            backgroundColor: '#282c34', // Fondo oscuro
                            color: 'white', // Color blanco para el texto
                            borderRadius: '8px', // Bordes redondeados
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Sombra
                            border: '1px solid #003d00', // Borde verde oscuro
                            transition: 'transform 0.3s ease-in-out', // Transición suave
                            transform: 'scale(0.9)', // Escalar para el efecto de apertura
                            width: '150px', // Ajusta el ancho del menú
                            height: 'auto', // Altura automática para adaptarse al contenido
                            '@media (max-width: 768px)': {
                                width: '120px', // Ajusta el ancho del menú en pantallas pequeñas
                                fontSize: '14px', // Tamaño de fuente más pequeño
                            },
                            '@media (max-width: 480px)': {
                                width: '100px', // Ajusta aún más el ancho en pantallas muy pequeñas
                                fontSize: '12px', // Tamaño de fuente aún más pequeño
                            },
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleGenerosMenuOpen}
                        sx={{
                            color: 'white', // Color blanco para el texto
                            '&:hover': {
                                backgroundColor: '#003d00', // Verde más oscuro para el hover
                                color: '#FDC1DA', // Color rosado para el texto en hover
                                transition: 'background-color 0.3s ease, color 0.3s ease' // Transición suave en hover
                            },
                            borderRadius: '8px', // Bordes redondeados para el ítem del menú
                            padding: '8px 16px', // Espaciado interno más pequeño
                            fontWeight: 'bold', // Texto en negrita
                            fontSize: '14px', // Tamaño de fuente más pequeño
                            '@media (max-width: 768px)': {
                                padding: '6px 12px', // Espaciado interno más pequeño en pantallas pequeñas
                                fontSize: '12px', // Tamaño de fuente aún más pequeño en pantallas pequeñas
                                '&:hover': {
                                    backgroundColor: 'transparent', // Sin efecto de hover en pantallas pequeñas
                                    color: 'white', // Color blanco para el texto en pantallas pequeñas
                                }
                            },
                            '@media (max-width: 480px)': {
                                padding: '4px 8px', // Espaciado interno aún más pequeño en pantallas muy pequeñas
                                fontSize: '10px', // Tamaño de fuente aún más pequeño en pantallas muy pequeñas
                                '&:hover': {
                                    backgroundColor: 'transparent', // Sin efecto de hover en pantallas muy pequeñas
                                    color: 'white', // Color blanco para el texto en pantallas muy pequeñas
                                }
                            },
                        }}
                    >
                        Géneros
                    </MenuItem>
                    <Menu
                        anchorEl={generosAnchorEl}
                        open={openGenerosMenu}
                        onClose={handleGenerosMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#282c34', // Fondo oscuro
                                color: 'white', // Color blanco para el texto
                                borderRadius: '8px', // Bordes redondeados
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Sombra
                                width: '150px', // Ajusta el ancho del menú
                                height: 'auto', // Altura automática para adaptarse al contenido
                                '@media (max-width: 768px)': {
                                    width: '120px', // Ajusta el ancho en pantallas pequeñas
                                },
                                '@media (max-width: 480px)': {
                                    width: '100px', // Ajusta aún más el ancho en pantallas muy pequeñas
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
                                        color: 'white', // Color blanco para el texto
                                        '&:hover': {
                                            backgroundColor: '#003d00', // Verde más oscuro para el hover
                                            color: '#FDC1DA', // Color rosado para el texto en hover
                                            transition: 'background-color 0.3s ease, color 0.3s ease' // Transición suave en hover
                                        },
                                        borderRadius: '8px', // Bordes redondeados para el ítem del menú
                                        padding: '8px 16px', // Espaciado interno más pequeño
                                        fontSize: '14px', // Tamaño de fuente más pequeño
                                        '@media (max-width: 768px)': {
                                            padding: '6px 12px', // Espaciado interno más pequeño en pantallas pequeñas
                                            fontSize: '12px', // Tamaño de fuente aún más pequeño en pantallas pequeñas
                                            '&:hover': {
                                                backgroundColor: 'transparent', // Sin efecto de hover en pantallas pequeñas
                                                color: 'white', // Color blanco para el texto en pantallas pequeñas
                                            }
                                        },
                                        '@media (max-width: 480px)': {
                                            padding: '4px 8px', // Espaciado interno aún más pequeño en pantallas muy pequeñas
                                            fontSize: '10px', // Tamaño de fuente aún más pequeño en pantallas muy pequeñas
                                            '&:hover': {
                                                backgroundColor: 'transparent', // Sin efecto de hover en pantallas muy pequeñas
                                                color: 'white', // Color blanco para el texto en pantallas muy pequeñas
                                            }
                                        },
                                    }}
                                >
                                    <Link
                                        to={`/genero/${genero.id}`} // Enlace con el ID del género
                                        style={{
                                            textDecoration: 'none', // Sin subrayado
                                            color: 'inherit', // Hereda el color del ítem del menú
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
                                    color: 'white', // Color blanco para el texto
                                    '&:hover': {
                                        backgroundColor: '#003d00', // Verde más oscuro para el hover
                                        color: '#FDC1DA', // Color rosado para el texto en hover
                                        transition: 'background-color 0.3s ease, color 0.3s ease' // Transición suave en hover
                                    },
                                    borderRadius: '8px', // Bordes redondeados para el ítem del menú
                                    padding: '8px 16px', // Espaciado interno más pequeño
                                    fontSize: '14px', // Tamaño de fuente más pequeño
                                    '@media (max-width: 768px)': {
                                        padding: '6px 12px', // Espaciado interno más pequeño en pantallas pequeñas
                                        fontSize: '12px', // Tamaño de fuente aún más pequeño en pantallas pequeñas
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Sin efecto de hover en pantallas pequeñas
                                            color: 'white', // Color blanco para el texto en pantallas pequeñas
                                        }
                                    },
                                    '@media (max-width: 480px)': {
                                        padding: '4px 8px', // Espaciado interno aún más pequeño en pantallas muy pequeñas
                                        fontSize: '10px', // Tamaño de fuente aún más pequeño en pantallas muy pequeñas
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Sin efecto de hover en pantallas muy pequeñas
                                            color: 'white', // Color blanco para el texto en pantallas muy pequeñas
                                        }
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
                        <button className="header-icon" onClick={() => navigate('/')}>
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
