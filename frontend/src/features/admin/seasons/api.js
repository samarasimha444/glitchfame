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
   const token = localStorage.getItem("token")

  console.log(participationId,value)
  const response = await fetch(
    `${BASE_URL}/admin/votes/${participationId}?value=${value}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to vote");
  }

  const data = await response.text(); 
  console.log(data);

  return data;
};

export const deleteContestant = async (contestantId) => {
   const token = localStorage.getItem("token")
  const response = await fetch(
    `${BASE_URL}/admin/contestants/${contestantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete contestant");
  }

  return response.json();
};



//approve reject 
export const updateContestantStatus = async (id, action) => {
   const token = localStorage.getItem("token")
  console.log("Updating contestant:", id, action);

  const res = await fetch(`${BASE_URL}/admin/contestants/status/${id}?action=${action}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}), 
  });

  console.log(res)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update contestant status");
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