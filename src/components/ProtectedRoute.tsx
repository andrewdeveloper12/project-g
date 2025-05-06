import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string;
  showLoader?: boolean;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  showLoader = true,
  requiredRoles = []
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading && showLoader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check roles if required
  if (requiredRoles.length > 0 && user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;