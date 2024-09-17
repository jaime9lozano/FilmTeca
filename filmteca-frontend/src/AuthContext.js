import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateAuthState = () => {
        const token = Cookies.get('auth_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRoles(decodedToken.role || []);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decodificando el token:', error);
                setIsAuthenticated(false);
                setRoles([]);
            }
        } else {
            setIsAuthenticated(false);
            setRoles([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        updateAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, roles, loading, updateAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


