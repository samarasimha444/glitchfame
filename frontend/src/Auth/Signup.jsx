import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

const Signup = ({ setMode }) => {
  const inputFields = useMemo(() => [
    { label: "Email", name: "email", type: "email", placeholder: "vote@glitchfame.com", colSpan: "sm:col-span-2" },
    { label: "Username", name: "username", type: "text", placeholder: "Username", colSpan: "sm:col-span-1" },
    { label: "Mobile", name: "mobileNumber", type: "text", placeholder: "10-digit number", colSpan: "sm:col-span-1" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••", colSpan: "sm:col-span-1" },
    { label: "Confirm", name: "confirmPassword", type: "password", placeholder: "••••••••", colSpan: "sm:col-span-1" },
  ], []);

  const [formData, setFormData] = useState({
    email: "", username: "", mobileNumber: "", password: "", confirmPassword: "",
  });
  
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApiError = (message) => {
    if (!message) {
      toast.error("Something went wrong ");
      return;
    }
    const msg = message.toLowerCase();
    if (msg.includes("email")) toast.error("Email already registered");
    else if (msg.includes("phone")) toast.error("Phone number already registered");
    else toast.error(message);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber" && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));

    
  }, []);


  const validatePassword = (password) => {
  return /^(?=.*\d).{6,}$/.test(password);
};

  const handleSignup = useCallback(async (e) => {
    e.preventDefault();
    if (formData.mobileNumber.length !== 10) return setError("Mobile number must be 10 digits");

     if (!validatePassword(formData.password))
    return setError("Password must be at least 6 characters and include a number");

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          mobile: formData.mobileNumber,
          password: formData.password,
        }),
      });

      const message = await response.text();
      if (response.ok) {
        setOtpStage(true);
        toast.success("OTP sent to your email!");
      } else {
        handleApiError(message);
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
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify-signup?otp=${otp}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          mobile: formData.mobileNumber,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success("Account verified!");
        setMode("login");
      } else {
        toast.error("OTP verification failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, formData, setMode]);

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {error && <p className="text-red-500 text-[11px] mb-2 font-medium uppercase tracking-wider">{error}</p>}

      {!otpStage ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inputFields.map((field) => (
              <div key={field.name} className={`${field.colSpan} space-y-1`}>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                   maxLength={
                   field.name === "password" || field.name === "confirmPassword" ? 12 : field.name === "username" ? 20 : undefined}
                  className="w-full bg-[#111418] border border-[#1E232B] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9DE2E2] transition-all"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-lg bg-[#9DE2E2] text-[#062424] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5 py-4 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <h2 className="text-white font-bold tracking-tight">Verify Identity</h2>
            <p className="text-gray-500 text-[11px]">Code sent to {formData.email}</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-[#111418] border border-[#1E232B] rounded-lg py-4 text-center text-xl tracking-[0.8em] font-mono text-[#9DE2E2] focus:outline-none focus:border-[#9DE2E2]"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#9DE2E2] text-[#062424] font-bold text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm OTP"}
            </button>
            
            <button 
              type="button"
              onClick={() => setOtpStage(false)}
              className="w-full text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition"
            >
              ← Back 
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;