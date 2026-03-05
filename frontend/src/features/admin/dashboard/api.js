
const BASE_URL = import.meta.env.VITE_BASE_URL;

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1MTQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjcwMDg0MywiZXhwIjoxNzcyNzA0NDQzfQ.YIYZabbRt06NVEhF89beUlhSFYXB4F_aZdctQCGlinA"

export const createSeason = async (formData) => {
  const res = await fetch(
    "http://localhost:3000/admin/seasons/create",
    {
      method: "POST",
      body: formData, 
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create season");
  }

  return res.text(); 
};

export const fetchSeasons = async () => {
 
  const response = await fetch("http://localhost:3000/seasons", {
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