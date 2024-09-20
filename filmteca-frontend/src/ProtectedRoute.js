import { Navigate } from 'react-router-dom';
import {useAuth} from "./AuthContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { roles } = useAuth();

    // Verifica si el usuario tiene al menos un rol permitido
    const hasAccess = roles.some(role => allowedRoles.includes(role));
    const token = Cookies.get('auth_token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!hasAccess) {
        return <Navigate to="/forbidden" />;
    }

    return element;
};
export default ProtectedRoute;