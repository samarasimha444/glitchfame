import React, { useState } from "react";

const VoteModal = ({ open, onClose, onSubmit }) => {
  const [votes, setVotes] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!votes || Number(votes) <= 0) return;
    onSubmit(Number(votes));
    setVotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      <div className="bg-[#111418] w-[380px] p-6 rounded-2xl shadow-xl border border-gray-700">
        
    
        <h2 className="text-lg font-semibold text-white mb-6">
          Add Custom Votes
        </h2>
/}
        <input
          type="number"
          placeholder="Enter votes"
          value={votes}
          onChange={(e) => setVotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1f26] border border-gray-600 text-white placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#1a1f26]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoteModal;