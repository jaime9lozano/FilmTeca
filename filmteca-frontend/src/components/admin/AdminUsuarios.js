import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Switch} from "@mui/material";
import {MdToggleOff, MdToggleOn} from "react-icons/md";
import {FaUserEdit} from "react-icons/fa";
import './AdminUsuarios.css';
import Cookies from "js-cookie";

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://filmteca.onrender.com';

    // Obtener usuarios desde el servidor
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = Cookies.get('auth_token');
                const response = await axios.get(`${baseURL}/users`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
                setUsuarios(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, [baseURL]);

    // Cambiar el estado de activado/desactivado del usuario
    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            // PUT request para actualizar el campo deleted_at
            const token = Cookies.get('auth_token');
            const updatedDeletedAt = currentStatus ? null : new Date().toISOString();
            await axios.put(`${baseURL}/users/${userId}`, { deleted_at: updatedDeletedAt}, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });

            // Actualizar el estado local
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((usuario) =>
                    usuario.id === userId ? { ...usuario, deleted_at: updatedDeletedAt } : usuario
                )
            );
        } catch (error) {
            console.error('Error al actualizar estado del usuario:', error);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="gestion-usuarios">
            <h2>Gestión de Usuarios</h2>
            <table className="usuarios-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map((usuario) => (
                    <tr key={usuario.id} className={usuario.deleted_at ? 'usuario-desactivado' : 'usuario-activo'}>
                        <td data-label="ID">{usuario.id}</td>
                        <td data-label="Nombre">{usuario.name}</td>
                        <td data-label="Email">{usuario.email}</td>
                        <td data-label="Activo">
                            <Switch
                                checked={!usuario.deleted_at}
                                onChange={() => toggleUserStatus(usuario.id, usuario.deleted_at)}
                                icon={<MdToggleOff size={24} />}
                                checkedIcon={<MdToggleOn size={24} />}
                                color="success"
                            />
                        </td>
                        <td data-label="Acciones">
                            <Button variant="contained" color="primary" startIcon={<FaUserEdit />}>
                                Editar
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminUsuarios;