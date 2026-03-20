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

  const data = await res.json();
  console.log(data)

  if (!res.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
};