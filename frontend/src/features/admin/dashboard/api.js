
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createSeason = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/seasons`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create season");
  }

  return res.json();
};