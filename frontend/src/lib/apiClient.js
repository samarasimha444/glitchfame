


export const apiClient = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    const text = await res.text();
    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }


    const response = {
      status: res.status,
      ok: res.ok,
      data,
    };

    if (!res.ok) {
      throw new Error(
        (typeof data === "object" && data?.message) || data || "Something went wrong"
      );
    }

    return response;
  } catch (err) {
    console.error("API Error:", err);
    throw err; 
  }
};