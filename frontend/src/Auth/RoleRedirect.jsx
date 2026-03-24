import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const token = localStorage.getItem("token");

 
  if (!token) {
    return <Navigate to="/vote" replace />;
  }

  return <Navigate to="/vote" replace />;
};

export default HomeRedirect;