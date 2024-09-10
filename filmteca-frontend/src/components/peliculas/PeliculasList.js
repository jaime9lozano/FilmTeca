import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PeliculasList.css';
import { FaTimes } from 'react-icons/fa';

const PeliculasList = () => {
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
    });
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [searchParams, setSearchParams] = useState({});
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';

    const fetchPeliculas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            // Construir los parámetros de búsqueda
            const params = {
                page: page,
                ...searchParams,
            };

            const response = await axios.get(`${baseURL}/peliculas`, {
                params: params,
                withCredentials: true,
            });
            setPeliculas(response.data.data);
            setPagination({
                currentPage: response.data.meta.currentPage,
                totalPages: response.data.meta.totalPages,
                totalItems: response.data.meta.totalItems,
                itemsPerPage: response.data.meta.itemsPerPage,
            });
        } catch (error) {
            setError('Error consiguiendo las películas: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [baseURL, searchParams]);

    // Fetch initial data with empty filters
    useEffect(() => {
        fetchPeliculas();
    }, [fetchPeliculas]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({
            search: searchTitle || undefined,
            'filter.release_year': searchYear || undefined,
        });
        fetchPeliculas(); // Fetch data with new filters
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) return;
        fetchPeliculas(page);
    };

    const clearSearchTitle = () => setSearchTitle('');
    const clearSearchYear = () => setSearchYear('');

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando películas...</p>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="peliculas-container">
            <h2>Películas</h2>
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar por título"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="search-input"
                        />
                        {searchTitle && (
                            <button type="button" className="clear-button" onClick={clearSearchTitle}>
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <div className="search-input-container">
                        <input
                            type="number"
                            placeholder="Buscar por año"
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                            className="search-input"
                        />
                        {searchYear && (
                            <button type="button" className="clear-button" onClick={clearSearchYear}>
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <button type="submit" className="search-button">Buscar</button>
                </form>
            </div>
            <div className="peliculas-list">
                {peliculas.map(pelicula => (
                    <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id} className="pelicula-card-link">
                        <div className="pelicula-card">
                            <img src={pelicula.image} alt={pelicula.title} className="pelicula-image" />
                            <div className="pelicula-title">
                                <h3>{pelicula.title}</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Anterior
                </button>
                <span className="pagination-info">
                    Página {pagination.currentPage} de {pagination.totalPages} - {pagination.totalItems} películas en total
                </span>
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default PeliculasList;










