import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [newPassword,setNewPassword] = useState("");

  const [otpStage,setOtpStage] = useState(false);

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  // ===== send OTP =====
  const handleSendOtp = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try{

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password?email=${email}`,
        { method:"POST" }
      );

      const message = await response.text();

      if(response.status === 200){

        setOtpStage(true);

      }else{

        setError(message);

      }

    }catch{

      setError("Network error");

    }finally{

      setLoading(false);

    }

  };


  // ===== reset password =====
  const handleResetPassword = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try{

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`,
        { method:"POST" }
      );

      const message = await response.text();

      if(response.status === 200){

        alert("Password reset successful");

        navigate("/login");

      }else{

        setError(message);

      }

    }catch{

      setError("Network error");

    }finally{

      setLoading(false);

    }

  };


  return(

    <div>

      <h2>Forgot Password</h2>

      {error && <p style={{color:"red"}}>{error}</p>}

      {!otpStage ? (

        <form onSubmit={handleSendOtp}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <br/>

          <button disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

      ) : (

        <form onSubmit={handleResetPassword}>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            required
          />

          <br/>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            required
          />

          <br/>

          <button disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      )}

    </div>

  );
}