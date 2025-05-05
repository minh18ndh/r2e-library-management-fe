import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUserRole, isLoggedIn } from '../utils/auth';

const ProtectedLayout = ({ allowedRoles }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = getUserRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;