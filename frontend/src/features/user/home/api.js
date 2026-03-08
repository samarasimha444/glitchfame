
const BASE_URL = import.meta.env.VITE_BASE_URL;


<<<<<<< HEAD
const token = localStorage.getItem("token")
=======
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjgiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI5MjU0ODksImV4cCI6MTc3MjkyOTA4OX0.CunBTsVPbP7Pl4uoRUnsxdW91hGFnFJII6x7lg3-Iyo"
>>>>>>> 50dc5ee (user)

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