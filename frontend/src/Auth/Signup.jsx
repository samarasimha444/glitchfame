import { useState } from "react";
import { useNavigate } from "react-router-dom";


 const inputFields = [
    {
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "vote@glitchfame.com",
    },
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Enter username",
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "text",
      placeholder: "+91 ...",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter password",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm password",
    },
  ];

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({email: "",username: "",mobileNumber: "",password: "",confirmPassword: "",});

  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {

    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            mobileNumber: formData.mobileNumber,
            password: formData.password,
          }),
        }
      );

      const message = await response.text();

      if (response.status === 200) {

        setOtpStage(true);

      } else {

        setError(message);

      }

    } catch {

      setError("Network error. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  const handleVerifyOtp = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-otp?email=${formData.email}&otp=${otp}`,
        {
          method: "POST",
        }
      );

      const message = await response.text();

      if (response.status === 201) {

        navigate("/login");

      } else {

        setError(message);

      }

    } catch {

      setError("Network error. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (

  <div className="space-y-2">

    {error && (
      <p className="text-red-500 text-sm">
        {error}
      </p>
    )}

    {!otpStage ? (

      <form onSubmit={handleSignup} className="space-y-4">

        {inputFields.map((field) => (

          <div key={field.name}>

            <label className="text-xs text-gray-400 uppercase">
              {field.label}
            </label>

            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="mt-1 w-full bg-[#111418] border border-[#1E232B]
              rounded-lg px-4 py-1 text-white placeholder-gray-500
              focus:outline-none focus:border-purple-500"
            />

          </div>

        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl
          bg-gradient-to-r from-purple-500 to-pink-500
          text-white font-medium
          hover:opacity-90 transition"
        >
          {loading ? "Sending OTP..." : "Sign Up"}
        </button>

      </form>

    ) : (

      <form onSubmit={handleVerifyOtp} className="space-y-4">

        <h3 className="text-lg font-medium text-white">
          Verify Email
        </h3>

        <p className="text-gray-400 text-sm">
          Enter the OTP sent to {formData.email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full bg-[#111418] border border-[#1E232B]
          rounded-lg px-4 py-3 text-white placeholder-gray-500
          focus:outline-none focus:border-purple-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl
          bg-gradient-to-r from-purple-500 to-pink-500
          text-white font-medium"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </form>

    )}

    <button
      type="button"
      onClick={() => navigate("/forgot")}
      className="text-sm text-purple-400 hover:text-purple-300"
    >
      Forgot Password?
    </button>

  </div>

  );
};

export default Signup;