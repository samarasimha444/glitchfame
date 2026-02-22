import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");

  // 🚫 No token → straight to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!token,           // Only run if token exists
    retry: false,               // No retry loop
    staleTime: 1000 * 60 * 5,   // Cache for 5 minutes
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    // ⚠️ Do NOT remove token blindly
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role check
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={{ profile }} />;
};

export default ProtectedRoute;