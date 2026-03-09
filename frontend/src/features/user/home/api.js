
const BASE_URL = import.meta.env.VITE_BASE_URL;



const token = localStorage.getItem("token")
console.log(token)

export const getLiveUpcomingSeasons = async () => {
  const res = await fetch(`${BASE_URL}/seasons/live-upcoming`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch seasons");
  }

  return res.json();
};

export const submitEntry = async()=>{

  const response = await fetch(`${BASE_URL}/contestants/apply`,{
      headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if(!response.ok){
     throw new Error("Failed to add entry");
  }
  console.log(response)
  return response.json()

}

export const getWinners = async () => {
  const response = await fetch(`${BASE_URL}/winners`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch winners");
  }

  return response.json();
};