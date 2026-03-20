import React, { useState } from "react";
import { useChangePassword } from "../features/user/home/hooks";
import toast from "react-hot-toast";
import NeonLoader from "./Loader";

const ResetModal = ({ isOpen, onClose,  }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

   const { mutateAsync, isPending } = useChangePassword();

  if (!isOpen) return null;
 
    const handleError = (error) => {
    if (error.message === "Current password is incorrect") {
      toast.error("Your current password is wrong ");
    } else if (error.message === "New password cannot be same as current password") {
      toast.error("New password must be different ");
    } else {
      toast.error(error.message || "Something went wrong ");
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

  {isPending && <NeonLoader/>}

  <div className="bg-[#0b0f16] w-full max-w-sm p-5 rounded-xl border border-gray-800 shadow-xl">

    <h2 className="text-white text-base font-semibold mb-1">
      Reset Password
    </h2>

    <p className="text-gray-400 text-xs mb-4">
      Enter your old and new password.
    </p>

    <div className="space-y-3">

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-white transition text-sm"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-white transition text-sm"
      />

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
        className="px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-purple-700 transition"
      >
        Change
      </button>

    </div>

  </div>

</div>
  );
};

export default ResetModal;