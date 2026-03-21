import { apiClient } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const token =localStorage.getItem("token")

export const createSeason = async (formData) => {
  try {
    const data = await apiClient(`${BASE_URL}/seasons`, {
      method: "POST",
      body: formData,
    });

    console.log("Response:", data); 
    return data;
  } catch (err) {
    console.error("Error creating season:", err.message);
    throw err;
  }
};

export const fetchSeasons = async () => {
   const token = localStorage.getItem("token")
 
  const response = await fetch(`${BASE_URL}/seasons`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch seasons");
  }

  return response.json();
};

