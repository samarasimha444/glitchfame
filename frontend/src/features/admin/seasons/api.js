
const BASE_URL = import.meta.env.VITE_BASE_URL;


const token = localStorage.getItem("token")

export const getContestants = async () => {

  const response = await fetch(`${BASE_URL}/admin/contestants`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contestant data");
  }

  const data = await response.json();
  return data;
};


export const get = async () => {

  const response = await fetch(`${BASE_URL}/admin/contestants`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contestant data");
  }

  const data = await response.json();
  return data;
};