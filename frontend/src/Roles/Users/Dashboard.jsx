import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Seasons from "./Seasons.jsx";

const Dashboard = () => {

  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // 🔥 Expiration check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // 🔥 Admin redirect
      if (decoded.role === "ADMIN") {
        navigate("/admin-dashboard");
        return;
      }

      fetchSeasons(token);

    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }

  }, [navigate]);

  const fetchSeasons = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/seasons`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert("Access denied.");
        return;
      }

      const data = await response.json();
      setSeasons(data);

    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading seasons...</h3>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <Seasons seasons={seasons} />
    </div>
  );
};

export default Dashboard;