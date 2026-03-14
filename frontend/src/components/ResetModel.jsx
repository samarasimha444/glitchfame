import React, { useState } from "react";

const ResetModal = ({ isOpen, onClose,  }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ oldPassword, newPassword });
  };

  return (
 <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">

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
        className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-purple-600 transition text-sm"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-purple-600 transition text-sm"
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
        className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition"
      >
        Change
      </button>

    </div>

  </div>

</div>
  );
};

export default ResetModal;