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
   const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/admin/seasons/${id}/season-lock`, {
    method: "PATCH",
   headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
   console.log(res)
  return res.text();
};

export const toggleVoteLock = async (id) => {
   const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}/admin/seasons/${id}/vote-lock`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const res = await fetch(
    `${BASE_URL}/admin/seasons/${id}/participation-lock`,
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


export const updateRegistrationDates = async ({ id, start, end }) => {
  const response = await fetch(
    `${BASE_URL}/admin/seasons/${id}/registration-dates?start=${start}&end=${end}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update registration dates");
  }

  return response.json();
};