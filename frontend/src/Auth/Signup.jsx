import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

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

        // OTP sent
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
    <div>

      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!otpStage ? (

        <form onSubmit={handleSignup}>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <br />

          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>

        </form>

      ) : (

        <form onSubmit={handleVerifyOtp}>

          <h3>Enter OTP sent to your email</h3>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
         

        </form>

      )}
       <button type="button"
  onClick={() => navigate("/forgot")}
>
  Forgot Password?
</button>

    </div>
  );
};

export default Signup;