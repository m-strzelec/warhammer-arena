import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import NoAccessPage from '../../pages/NoAccessPage';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false, onlyGuest = false }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Accessing login/register while logged in
    if (onlyGuest) {
        if (user) {
            return <Navigate to="/" replace />;
        }
        return children;
    }

    // Not logged in user
    if (!user) {
        if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
            return children;
        }
        return <Navigate to="/login" replace />;
    }

    // Logged in user trying to access admin-only route
    if (adminOnly && user.type !== 'ADMIN') {
        return <NoAccessPage />;
    }

    return children;
};

export default ProtectedRoute;