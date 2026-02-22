import { Navigate } from "react-router-dom";
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

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};

const RoleRedirect = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: false,
  });

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <Navigate to="/login" replace />;

  if (profile.role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (profile.role === "USER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;