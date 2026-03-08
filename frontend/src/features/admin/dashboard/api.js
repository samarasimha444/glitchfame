
const BASE_URL = import.meta.env.VITE_BASE_URL;

const token =localStorage.getItem("token")

export const createSeason = async (formData) => {
  const res = await fetch(
    `${BASE_URL}/admin/seasons/create`,
    {
      method: "POST",
     headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
 
  const response = await fetch(`${BASE_URL}/admin/seasons`, {
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