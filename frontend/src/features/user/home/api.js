

const BASE_URL = import.meta.env.VITE_BASE_URL;






export const getLiveUpcomingSeasons = async () => {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/seasons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 

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




export const fetchLeaderboards = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}leaderboard/live`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboards");
  }

  return res.json();
};

