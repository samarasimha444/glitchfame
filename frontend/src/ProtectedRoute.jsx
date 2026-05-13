import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ allowedRole }) => {
  const { profile, isAuthenticated, isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    
    return <h3>Loading...</h3>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && profile?.role !== allowedRole) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet context={{ profile }} />;
};

export default ProtectedRoute;