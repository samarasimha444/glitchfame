import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

 

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
      'https://glitchfame.onrender.com/auth/login',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text(); // assuming backend returns token directly

      if (!response.ok) {
        setError(data || "Login failed");
        return;
      }

      console.log("TOKEN:", data);

      // Save token
      localStorage.setItem("token", data);

      // Decode token
      const decoded = jwtDecode(data);
      console.log("DECODED:", decoded);

      const role = decoded.role;

      
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  return (
    // <div className="">
    //   <h2>Login</h2>

    //   {error && <p style={{ color: "red" }}>{error}</p>}

    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Enter your email"
    //       onChange={handleChange}
    //       required
    //     />
    //     <br />

    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Enter your password"
    //       onChange={handleChange}
    //       required
    //     />
    //     <br />

    //     <button type="submit">Login</button>
    //   </form>
    // </div>


    <div className="space-y-6 w-full max-w-100">


  {error && (
    <p className="text-red-500 text-sm">
      {error}
    </p>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">

 
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        Email Address
      </label>

      <input
        type="email"
        name="email"
        placeholder="vote@glitchfame.com"
        onChange={handleChange}
        required
        className="mt-1 w-full bg-[#111418] border border-[#1E232B]
        rounded-lg px-4 py-3 text-white placeholder-gray-500
        focus:outline-none focus:border-purple-500"
      />
    </div>

    {/* PASSWORD */}
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        Password
      </label>

      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        onChange={handleChange}
        required
        className="mt-1 w-full bg-[#111418] border border-[#1E232B]
        rounded-lg px-4 py-3 text-white placeholder-gray-500
        focus:outline-none focus:border-purple-500"
      />
    </div>

    {/* BUTTON */}
    <button
      type="submit"
      className="w-full py-3 mt-4 rounded-xl
      bg-[#BE5EED]
      text-white font-medium
      hover:opacity-90 transition"
    >
      Login
    </button>

  </form>

</div>

  );
};

export default Login;