import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // STEP 1 → SEND OTP
  // ==============================
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
        `${import.meta.env.VITE_BASE_URL}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
          }),
        }
      );

      const message = await response.text();

      if (response.status === 200) {
        // OTP sent → switch UI
        setOtpStep(true);
      } else if (response.status === 409) {
        setError(message);
      } else {
        setError("Something went wrong.");
      }

    } catch (err) {
      setError("Network error.");
    }

    setLoading(false);
  };

  // ==============================
  // STEP 2 → VERIFY OTP
  // ==============================
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/verifysignup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );

      const message = await response.text();

      if (response.status === 201) {
        navigate("/login");
      } else {
        setError(message);
      }

    } catch (err) {
      setError("Network error.");
    }

    setLoading(false);
  };

  // ==============================
  // OTP SCREEN (Same Route)
  // ==============================
  if (otpStep) {
    return (
      <div>
        <h2>Verify OTP</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>OTP sent to {formData.email}</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <br />

        <button onClick={handleVerifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    );
  }

  // ==============================
  // SIGNUP FORM
  // ==============================
  return (
    <div>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;