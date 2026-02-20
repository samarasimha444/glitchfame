import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const Dashboard = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    // If no token → redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // If admin → redirect to admin dashboard
      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      // Invalid token → clear and redirect
      localStorage.removeItem("token");
      navigate("/login");
    }

  }, [navigate]);

  return (
    <div>
      <h2>This is User Dashboard</h2>
    </div>
  );
};

export default Dashboard;