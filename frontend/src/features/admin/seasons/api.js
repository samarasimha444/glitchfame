const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token")





export const getContestants = async ({pageParam = 0,status = "PENDING",size = 5,
}) => {
  const response = await fetch(
    `${BASE_URL}/admin/contestants/live?status=${status}&page=${pageParam}&size=${size}`,
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


//custom vote
export const voteContestant = async ({ participationId, value }) => {

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

  return res.json();
};



export const getLiveContestants = async (page = 0, size = 6) => {
  const response = await fetch(
    `http://localhost:3000/admin/contestants/live?page=${page}&size=${size}`,
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