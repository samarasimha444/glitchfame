import React, { useState } from "react";
import Modal from "./VoteModel";

const VoteModal = ({ open, onClose, onSubmit }) => {
  const [votes, setVotes] = useState("");

  const handleSubmit = () => {
    if (!votes || Number(votes) <= 0) return;
    onSubmit(Number(votes));
    setVotes("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Custom Votes">
      <div className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Enter votes"
          value={votes}
          onChange={(e) => setVotes(e.target.value)}
          className="border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 rounded hover:opacity-90 transition"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default VoteModal;