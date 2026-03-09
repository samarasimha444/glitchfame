
const BASE_URL = import.meta.env.VITE_BASE_URL;


const token = localStorage.getItem("token")

export const getContestants = async ({ pageParam = 0 }) => {
  const response = await fetch(
    `${BASE_URL}/admin/contestants/live?page=${pageParam}&size=10`,
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


export const voteContestant = async ({ contestantId, value }) => {

  const response = await fetch(
    `${BASE_URL}/admin/votes/${contestantId}?value=${value}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to vote");
  }

  return response.json();
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