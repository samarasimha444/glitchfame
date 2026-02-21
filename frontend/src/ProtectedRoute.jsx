import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token");

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};

const ProtectedRoute = ({ allowedRole }) => {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: false,
  });

  if (isLoading) return <h3>Loading...</h3>;

  if (isError) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  if (profile.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return <Outlet context={{ profile }} />;
};

export default ProtectedRoute;