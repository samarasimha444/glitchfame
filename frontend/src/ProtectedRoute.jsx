import { Outlet, Navigate } from "react-router-dom";
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

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
   console.log(res.json())
  return res.json();
};

const ProtectedRoute = ({ allowedRole }) => {

  const token = localStorage.getItem("token");
  console.log(token)

  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <Navigate to="/auth" replace />;
  }


  if (allowedRole && profile?.role !== allowedRole) {
    return <Navigate to="/auth" replace />;
  }
   console.log(profile)
  return <Outlet context={{ profile }} />;
};

export default ProtectedRoute;