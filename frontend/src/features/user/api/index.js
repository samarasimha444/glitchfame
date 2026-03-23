import { apiClient } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_BASE_URL;


// login singup otp form home mutate basic apis will be here





export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  // 🔥 read body ONLY ONCE
  const text = await res.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // fallback plain text
  }

  console.log("Response:", data);

  if (!res.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
      data ||
      "Failed to change password"
    );
  }

  return data;
};



export const fetchMyApplications = async () => {
  const response = await apiClient(
    `${BASE_URL}/participations/my-applications`,
    {
      method: "GET",
    }
  );

  console.log("My Applications:", response.data);
  return response.data;
};