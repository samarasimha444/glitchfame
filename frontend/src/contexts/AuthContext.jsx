import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    throw new Error("Unauthorized");
  }

  if (!res.ok) throw new Error("Something went wrong");
  return res.json();
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  const token = localStorage.getItem("token");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["authProfile"],
    queryFn: fetchProfile,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isLoading) setIsInitialized(true);
  }, [isLoading]);

  const profile = useMemo(() => {
    if (data?.data) {
      localStorage.setItem("profile", JSON.stringify(data.data));
      return data.data;
    }
    const stored = localStorage.getItem("profile");
    return stored ? JSON.parse(stored) : null;
  }, [data]);

  const isAuthenticated = !!token && !isError && !!profile;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    queryClient.clear();
    window.location.href = "/auth";
  };

  const value = useMemo(
    () => ({
      profile,
      isAuthenticated,
      isLoading,
      isError,
      error,
      logout,
      isInitialized,
    }),
    [profile, isAuthenticated, isLoading, isError, error, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
