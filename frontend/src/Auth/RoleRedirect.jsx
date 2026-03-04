import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
const token = localStorage.getItem("token");
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/profile/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  
  if (!res.ok) {
    throw new Error("Unauthorized");
  }
  
  console.log(res.json())
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
    enabled: !!token,   // important
    retry: false,
  });

  if (isLoading) return <h3>Loading...</h3>;

  if (isError) return <Navigate to="/login" replace />;

  if (profile?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (profile?.role === "USER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;