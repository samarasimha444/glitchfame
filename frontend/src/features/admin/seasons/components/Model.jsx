import React, { useState } from "react";

const Model = ({ isOpen, onClose, onSubmit }) => {
  const [voteAmount, setVoteAmount] = useState("");

  if (!isOpen) return null; // modal hidden if not open

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voteAmount) return;
    onSubmit(voteAmount); // call parent function
    setVoteAmount(""); // reset input
    onClose(); // close modal
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose} 
    >
      <div
        className="bg-white dark:bg-[#1C1E24] p-6 rounded-2xl w-80 md:w-96 shadow-lg shadow-black/30 relative transform transition-transform duration-200 hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-[#BE5EED] text-lg font-bold transition"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Increase User Votes
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vote Amount
          </label>
          <input
            type="number"
            value={voteAmount}
            onChange={(e) => setVoteAmount(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 dark:border-[#2A323C] text-gray-900 dark:text-white bg-gray-50 dark:bg-[#1B1E25] focus:outline-none focus:ring-2 focus:ring-[#BE5EED]"
            placeholder="Enter vote amount"
          />

          <button
            type="submit"
            className="bg-[#BE5EED] text-black py-3 rounded-xl font-semibold hover:bg-[#9a42c9] transition"
          >
            Add Votes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Model;