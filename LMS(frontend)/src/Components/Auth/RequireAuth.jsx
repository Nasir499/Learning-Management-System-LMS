import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequireAuth({ allowedRoles }) {
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const location = useLocation();
    const currentRole = (role || '').trim();

    return isLoggedIn && allowedRoles.includes(currentRole) ? (
        <Outlet />
    ) : isLoggedIn ? (
        <Navigate to="/denied" replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth
