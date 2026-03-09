const BASE_URL = "http://localhost:3000"


const token = localStorage.getItem("token")

export const getVotersById = async (seasonId) => {
  const response = await fetch(`${BASE_URL}/contestants/season/${seasonId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response)
  if (!response.ok) {
    throw new Error("Failed to fetch season data");
  }

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
