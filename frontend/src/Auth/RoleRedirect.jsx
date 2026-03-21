import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const token = localStorage.getItem("token");

  // First time user OR no token → go to vote page
  if (!token) {
    return <Navigate to="/vote" replace />;
  }

  // If token exists → go to role redirect
  return <Navigate to="/vote" replace />;
};

export default HomeRedirect;