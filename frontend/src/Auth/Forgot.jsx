import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useSendOtp,
  useResetPassword,
} from "../features/user/arena/hooks";

const ForgotPasswordModal = ({ isOpen, onClose }) => {

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");

  const [timer, setTimer] = useState(0);

  const inputsRef = useRef([]);

  const { mutate: sendOtpMutation, isPending: sendingOtp } = useSendOtp();
  const { mutate: resetPasswordMutation, isPending: resetting } =
    useResetPassword();

  const resetState = () => {
    setStep(1);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setTimer(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };


  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  
  const handleSendOtp = () => {
    if (!email) {
      return toast.error("Please enter email");
    }

    sendOtpMutation(email, {
      onSuccess: () => {
        toast.success("OTP sent to your email");
        setStep(2);
        setTimer(30);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleResetPassword = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6 || !newPassword) {
      return toast.error("Fill all fields");
    }

    resetPasswordMutation(
      {
        email,
        otp: finalOtp,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          handleClose();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="relative bg-[#1a1a1a] w-full max-w-md rounded-xl p-6 text-white shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

      
        {step === 1 && (
          <div className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="bg-[#11161f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
            />

            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90"
            >
              {sendingOtp ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Send OTP"
              )}
            </button>

          </div>
        )}

      
        {step === 2 && (
          <div className="flex flex-col gap-4">

            
            <div className="flex justify-between gap-2">

              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el)=>inputsRef.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e)=>handleOtpChange(e.target.value, index)}
                  className="w-10 h-12 text-center text-lg bg-[#11161f] border border-gray-700 rounded-lg focus:border-purple-500 outline-none"
                />
              ))}

            </div>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              className="bg-[#11161f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
            />

            <button
              onClick={handleResetPassword}
              disabled={resetting}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90"
            >
              {resetting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center text-sm text-gray-400">

              {timer > 0 ? (
                `Resend OTP in ${timer}s`
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Resend OTP
                </button>
              )}

            </div>

          </div>
        )}

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>

      </div>

    </div>
  );
};

export default ForgotPasswordModal;