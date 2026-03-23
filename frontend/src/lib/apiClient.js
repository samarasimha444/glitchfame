



export const apiClient = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method: options.method || "GET",
      ...options,
      headers: {
        "Content-Type": "application/json", 
        ...(token && { Authorization: `Bearer ${token}` }), 
        ...(options.headers || {}),
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

    // ❌ error handling
    if (!res.ok) {
      throw new Error(
        (typeof data === "object" && data?.message) ||
          data ||
          `Request failed with status ${res.status}`
      );
    }

    return response;
  } catch (err) {
    console.error("🔥 API Error:", err.message);
    throw err;
  }
};