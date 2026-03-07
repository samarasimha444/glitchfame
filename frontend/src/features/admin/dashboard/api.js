
const BASE_URL = import.meta.env.VITE_BASE_URL;

const token ="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjgiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI4MzA5MzIsImV4cCI6MTc3MjgzNDUzMn0.VxVcItyvNwqIlTq-WQbVXYTB-ZqpleUFmdcU3rnq4G8"

export const createSeason = async (formData) => {
  const res = await fetch(
    "http://localhost:3000/admin/seasons/create",
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
 
  const response = await fetch("http://localhost:3000/admin/seasons", {
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