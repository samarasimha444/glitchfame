const BASE_URL = import.meta.env.VITE_BASE_URL;


const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1MTQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjcwMDg0MywiZXhwIjoxNzcyNzA0NDQzfQ.YIYZabbRt06NVEhF89beUlhSFYXB4F_aZdctQCGlinA";

export const fetchSeasonById = async (seasonId) => {

  const response = await fetch(`${BASE_URL}/seasons/${seasonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch season data");
  }

  const data = await response.json();
  return data;
};


export const toggleSeasonLock = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/season-lock`, {
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

export const toggleVoteLock = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/vote-lock`, {
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

export const updateVotingDates = async (id, start, end) => {
  const params = new URLSearchParams();

  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const res = await fetch(
    `${BASE_URL}/${id}/voting-dates?${params.toString()}`,
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

export const updateRegistrationDates = async (id, start, end) => {
  const params = new URLSearchParams();

  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const res = await fetch(
    `${BASE_URL}/${id}/registration-dates?${params.toString()}`,
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