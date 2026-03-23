import React, { useEffect } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginRequiredModal = ({ onCancel }) => {
  const navigate = useNavigate();

   useEffect(() => {
    document.body.style.overflow = "hidden"; 

    return () => {
      document.body.style.overflow = ""; 
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 ">
      <div className="bg-[#1C1C1C] rounded-xl shadow-lg w-full max-w-[350px] sm:max-w-xl - p-6 sm:p-4 relative">
        
       
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition"
        >
          ✕
        </button>

        <div className="flex items-center justify-center w-12 h-12 bg-[#2E2E2E] rounded-full mx-auto mb-4">
          <Lock className="text-[#9DE2E2]" size={24} />
        </div>

        <h2 className="text-white text-lg sm:text-base font-semibold text-center mb-2">
          Login required
        </h2>

        <p className="text-gray-400 text-xs text-center mb-6 sm:mb-4">
          To access this feature, please log in or create an account to continue.
        </p>

      
        <div className="flex flex-col sm:flex-row md:mt-8 gap-3 mb-4">
          <button
            onClick={() => navigate("/auth")}
            className="flex-1 bg-teal-200 text-black py-2 rounded-lg font-medium hover:bg-teal-300 transition"
          >
            Log in
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-black border border-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Cancel
          </button>
        </div>

   
        <p className="text-center text-gray-400 text-sm sm:text-xs">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/auth")}
            className="text-teal-300 hover:underline font-medium"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRequiredModal;