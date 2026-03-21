import { apiClient } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_BASE_URL;


const token =localStorage.getItem("token")

export const fetchSeasonById = async (seasonId) => {
   const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/seasons/${seasonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response)

  if (!response.ok) {
    throw new Error("Failed to fetch season data");
  }

  const data = await response.json();
  return data;
};


export const toggleSeasonLock = async (id) => {
  console.log("toggleSeasonLock called with id:", id);

  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    // Check if token exists
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("Authentication token missing");
    }

    // Build full URL
    const url = `${BASE_URL}/seasons/${id}/season-lock`;
    console.log("Full URL:", url);

    // Make the PATCH request
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw fetch response:", res);

    // Check if response is ok (status 2xx)
    if (!res.ok) {
      console.error("Response not OK:", res.status, res.statusText);
      const errorText = await res.text();
      console.error("Error response body:", errorText);
      throw new Error(errorText || "Failed to toggle season lock");
    }

    // Read response as text
    const data = await res.text();
    console.log("Response body:", data);

    return data;
  } catch (err) {
    console.error("Error toggling season lock:", err);
    throw err;
  }
};




export const toggleVoteLock = async (id) => {
  console.log(id)
   const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/admin/seasons/${id}/vote-lock`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(res)

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.text();
};





export const deleteSeason = async (id) => {
   const token = localStorage.getItem("token")
  console.log(id)
  const res = await fetch(`${BASE_URL}/admin/seasons/${id}`, {
    method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to delete season");
  }

  return res.json();
};



export const endSeasonNow = async ({ id }) => {
   const token = localStorage.getItem("token")
  console.log(id)
  const res = await fetch(
    `${BASE_URL}/admin/seasons/${id}/end-now`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("this is it" ,res)

  if (!res.ok) {
    throw new Error(await res.text());
  }
 
  return res.text();
};


export const updatePrizePool = async ({ id, prizeMoney }) => {
  const res = await fetch(
    `${BASE_URL}/admin/seasons/${id}/prize-money?prizeMoney=${prizeMoney}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.text();
};


export const participationLock = async ({ id}) => {
   const token = localStorage.getItem("token")
  const res = await fetch(
    `${BASE_URL}/admin/participations/${id}/participation-lock`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res)
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.text();
};


export const updateSeasonDates = async ({ id, type, start, end}) => {

 const token = localStorage.getItem("token")

  const response = await fetch(
    `${BASE_URL}/admin/seasons/${id}/${type}-dates?start=${start}&end=${end}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response)
  if (!response.ok) {
    throw new Error(`Failed to update ${type} dates`);
  }

  return response.text();
};