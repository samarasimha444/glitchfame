import React, { useState } from "react";
import { useChangePassword } from "../features/user/home/hooks";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import NeonLoader from "./NeonLoader";

const ResetModal = ({ isOpen, onClose,  }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

   const { mutateAsync, isPending } = useChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  if (!isOpen) return null;
 
    const handleError = (error) => {
    if (error.message === "Current password is incorrect") {
      toast.error("Your current password is wrong ");
    } else if (error.message === "New password cannot be same as current password") {
      toast.error("New password must be different ");
    } else {
      toast.error("Something went wrong ");
    }
  };

 const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill both fields ");
      return;
    }

    try {
      const data = await mutateAsync({
        currentPassword: oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully ");
      setOldPassword("");
      setNewPassword("");
      onClose();
    } catch (err) {
      handleError(err);
    }
  };
  return (
 <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      {isPending && <NeonLoader />}

      <div className="bg-[#0b0f16] w-full max-w-sm p-5 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-white text-base font-semibold mb-1">
          Reset Password
        </h2>

        <p className="text-gray-400 text-xs mb-4">
          Enter your old and new password.
        </p>

        <div className="space-y-3">
          {/* 🔐 Old Password */}
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              maxLength={12}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-white transition text-sm"
            />

            <button
              type="button"
              onClick={() => setShowOld((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* 🔐 New Password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              maxLength={12}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-white transition text-sm"
            />

            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 rounded-lg bg-primary text-black text-sm hover:opacity-90 transition"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;