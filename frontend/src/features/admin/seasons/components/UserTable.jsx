import React, { useState } from "react";
import { UserPlus, Trash2, Search } from "lucide-react";
import { useDeleteContestant, useVoteContestant } from "../hook";
import VoteModal from "./VoteModel";

const ParticipantsTable = ({ data, className }) => {
  const [page, setPage] = useState(1);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { mutate: vote, isLoading: voteLoading } = useVoteContestant();
  const { mutate: deleteUser, isLoading: deleteLoading } = useDeleteContestant();

  const handleVote = (contestantId, votes) => {
    vote({ contestantId, votes });
  };

  const handleCustomClick = (contestant) => {
    setSelectedContestant(contestant);
    setShowModal(true);
  };

  const handleCustomSubmit = (votes) => {
    if (!selectedContestant) return;
    handleVote(selectedContestant.id, votes);
  };

  const handleDelete = (id) => {
    deleteUser(id);
  };

  const totalPages = Math.ceil(20 / 3); 

  return (
    <div className={`flex flex-col ${className || "w-full"}`}>
      {showModal && (
        <VoteModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCustomSubmit}
        />
      )}

      <div className="relative w-full mt-12 border border-gray-700 p-4 sm:p-8 rounded-lg bg-[#111418]">
    
        <h3 className="text-xl flex gap-3 font-semibold mb-4 sm:mb-6">
          <UserPlus /> Active Contestants
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs sm:text-sm">
                <th className="py-4">Contestant</th>
                <th className="py-4">Season</th>
                <th>Votes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-[#141821] transition">
                  <td className="py-3 sm:py-5 flex items-center gap-3 sm:gap-4">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                    <span className="text-white text-[11px] sm:text-xs font-medium">{item.name}</span>
                  </td>
                  <td className="text-gray-400 text-[11px] sm:text-sm">{item.location}</td>
                  <td className="text-blue-400 font-semibold text-[11px] sm:text-sm">{item.votes.toLocaleString()}</td>
                  <td className="text-right">
                    <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => handleCustomClick(item)}
                        className="bg-[#141821] border border-gray-700 text-gray-300 text-xs sm:text-[12px] px-2 sm:px-3 py-1 rounded-md hover:border-gray-500 transition"
                      >
                        Custom
                      </button>
                      <button
                        onClick={() => handleVote(item.id, 10)}
                        className="bg-[#141821] border border-gray-700 text-gray-300 text-xs sm:text-[12px] px-2 sm:px-3 py-1 rounded-md hover:border-gray-500 transition"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <section className="flex justify-center items-center gap-2 mt-4 sm:mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === pageNumber ? "bg-blue-500 text-white" : "bg-[#141821] text-gray-300 hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default ParticipantsTable;