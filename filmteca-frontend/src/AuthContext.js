import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateAuthState = () => {
        const token = Cookies.get('auth_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRoles(decodedToken.role || []);
                setUserId(decodedToken.id);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decodificando el token:', error);
                setIsAuthenticated(false);
                setRoles([]);
                setUserId(null);
            }
        } else {
            setIsAuthenticated(false);
            setRoles([]);
            setUserId(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        updateAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, roles, loading, updateAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};