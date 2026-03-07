const BASE_URL = "http://localhost:3000"; // 


const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjgiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI4NDQ2MzksImV4cCI6MTc3Mjg0ODIzOX0.qDpgCMmAp2bMq25KAJ8O7rShPPIS1fy3C9RlMn-pDVY"

export const getVotersById = async (seasonId) => {
    console.log()
  

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