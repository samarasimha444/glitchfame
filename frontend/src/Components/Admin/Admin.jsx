import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SeasonForm from "./SeasonForm";

export default function Admin() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    // 1️⃣ No token → go to login
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const role = decoded.role; // must match backend claim name

      // 2️⃣ If not admin → go to dashboard
      if (role !== "ADMIN") {
        navigate("/dashboard");
      }

    } catch (error) {
      // Invalid token → remove & redirect
      localStorage.removeItem("token");
      navigate("/login");
    }

  }, [navigate]);

  return (
    <div>
      <SeasonForm />
    </div>
  );
}