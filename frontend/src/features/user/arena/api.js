const BASE_URL = import.meta.env.VITE_BASE_URL;


const token = localStorage.getItem("token")

export const getVotersById = async ( seasonId, page = 0, size = 4, name = "")=> {

  const url = name
    ? `${BASE_URL}/contestants/season/${seasonId}/search?name=${name}&page=${page}&size=${size}`
    : `${BASE_URL}/contestants/season/${seasonId}?page=${page}&size=${size}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};


export const getContestantDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/contestants/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contestant details");
  }

  return response.json();
};


export const toggleVote = async (participationId) => {
  console.log()
  const response = await fetch(`${BASE_URL}/votes/toggle/${participationId}`, {
    method: "POST", 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response)
  if (!response.ok) {
    throw new Error("Failed to toggle vote");
  }

  return response.json();
};

export const getLeaderboard = async () => {
  
  const response = await fetch(`${BASE_URL}/leaderboard`, {
    method: "GET", 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response)
  if (!response.ok) {
    throw new Error("Failed to toggle vote");
  }

  return response.json();
};


