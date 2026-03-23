import { apiClient } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token")





export const getContestants = async ({pageParam = 0,status = "PENDING",size = 5,
}) => {
   const token = localStorage.getItem("token")
  const response = await fetch(
    `${BASE_URL}/admin/participations/live?status=${status}&page=${pageParam}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contestants");
  }

  return response.json();
};



export const voteContestant = async ({ participationId, value }) => {
  const token = localStorage.getItem("token");

  console.log(participationId, value);

  const response = await fetch(
    `${BASE_URL}/admin/votes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        participationId: participationId,
        voteDelta: value, 
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to vote");
  }

  const data = await response.text(); // or res.json() if backend returns JSON
  console.log(data);

  return data;
};

export const deleteContestant = async (participationId) => {
  try {
    const res = await apiClient(
      `${BASE_URL}/participations/${participationId}`,
      {
        method: "DELETE",
      }
    );

    console.log("Delete Success:", res.data);

    return res.data;
  } catch (err) {
    console.error("Delete Error:", err.message);
    throw err; // let React Query handle it
  }
};


//approve reject 
export const updateContestantStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  console.log(id,status)

  console.log("Updating contestant:", id, status);

  const res = await fetch(
    `${BASE_URL}/admin/participations/${id}/status?status=${status}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

 

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
     console.log(errorData);
    throw new Error(
      errorData.message || "Failed to update contestant status"
      
    );
    
  }

  return res.text(); 
};



export const getLiveContestants = async (page = 0, size = 6) => {
   const token = localStorage.getItem("token")
  const response = await fetch(
    `${BASE_URL}/admin/participations/live?status=APPROVED&page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contestants");
  }

  return response.json();
};



export const searchContestants = async ({ name, seasonId }) => {
   const token = localStorage.getItem("token")
  console.log(name)
  const params = new URLSearchParams({
    name,
  });

  if (seasonId) {
    params.append("seasonId", seasonId);
  }

  const response = await fetch(
    `${BASE_URL}/admin/contestants/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response)

  if (!response.ok) {
    throw new Error("Failed to fetch contestants");
  }

  return response.json();
};