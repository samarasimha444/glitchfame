import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = ({ setMode }) => {

  const navigate = useNavigate();

  const inputFields = useMemo(() => [
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
  ], []);

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




  const handleApiError = (message) => {
  if (!message) {
    toast.error("Something went wrong ❌");
    return;
  }

  const msg = message.toLowerCase();

  if (msg.includes("email")) {
    toast.error("Email already registered ");
  } else if (msg.includes("phone")) {
    toast.error("Phone number already registered ");
  } else {
   
    toast.error(message);
  }
};

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSignup = useCallback(async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            mobile: formData.mobileNumber, 
            password: formData.password,
          }),
        }
      );

      const message = await response.text();

      if (response.ok) {

        setOtpStage(true);

      } else {
          console.log(message)
        handleApiError(message)

      }

    } catch {

      toast.error("Network error. Please try again.");

    } finally {

      setLoading(false);

    }

  }, [formData]);

  const handleVerifyOtp = useCallback(async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-signup?otp=${otp}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            mobile: formData.mobileNumber, 
            password: formData.password,
          }),
        }
      );

      const message = await response.text();

      if (response.ok) {

        setMode("login");

      } else {

        toast.error ("OTP verification failed");

      }

    } catch {

      toast.error("Network error. Please try again.");

    } finally {

      setLoading(false);

    }

  }, [otp, formData]);

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
                focus:outline-none focus:border-white"
              />

            </div>

          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl
            bg-primary
            text-black font-medium
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
            focus:outline-none focus:border-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r bg-primary
            text-black font-medium"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      )}

    </div>

  );
};

export default Signup;