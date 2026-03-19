import { Await } from "react-router-dom";

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


export const fetchSeasonParticipation = async (seasonId) => {
  console.log("Season ID:", seasonId);

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/seasons/${seasonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch season details");
  }

  const response = await res.json() 
  console.log("API RESPONSE:", response);

  return response; 
};

export const fetchLeaderboards = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}leaderboard/live`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboards");
  }

  return res.json();
};

