
const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log(BASE_URL)


const token = localStorage.getItem("token")
console.log(token)


export const getLiveUpcomingSeasons = async () => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/seasons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to fetch seasons");
  }

  return res.json();
};
  

  

export const submitEntry = async (formData) => {
   const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/contestants/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log(response)
  const data = await response.text();

  if (!response.ok) {
    console.error("Server error:", data);
    throw new Error(data.message || "Failed to add entry");
  }

  return data;
};

export const getWinners = async () => {
   const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/winners`, {
    method: "GET",
     headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch winners");
  }

  return response.json();
};


export const getSeasonById = async (id) => {
   const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/seasons/${id}`, {
    method: "GET",
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch winners");
  }

  return response.json();
};


export const fetchSeasonParticipation= async()=>{

}