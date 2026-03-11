import React, { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {
  useDeleteContestant,
  useLiveContestants,
  useVoteContestant,
} from "../hook";
import VoteModal from "./VoteModel";

const ParticipantsTable = ({ className }) => {
  const [page, setPage] = useState(0);
  const [activeParticipationId, setActiveParticipationId] = useState(null);

  const { data, isLoading, error } = useLiveContestants(page, 6);
  const { mutate: vote } = useVoteContestant();
  const { mutate: deleteUser } = useDeleteContestant();

  const handleVote = (participationId, votes) => {
    console.log(participationId,votes)
    vote(
      {
        participationId,
        value: votes,
      },
      {
        onSuccess: () => {
          alert("Vote submitted successfully");
          setActiveParticipationId(null);
        },
        onError: () => {
          alert("Failed to submit vote");
        },
      }
    );
  };

  const handleCustomClick = (participationId) => {
    setActiveParticipationId(participationId);
  };

  const handleDelete = (id) => {
    deleteUser(id);
  };

  const totalPages = data?.totalPages || 0;

  return (
    <div className={`flex flex-col ${className || "w-full"}`}>

      <VoteModal
        open={activeParticipationId !== null}
        participationId={activeParticipationId}
        onClose={() => setActiveParticipationId(null)}
        onSubmit={handleVote}
      />

      <div className="relative w-full mt-12 border border-gray-700 p-4 sm:p-8 rounded-lg bg-[#111418]">
        <h3 className="text-xl flex gap-3 font-semibold mb-4 sm:mb-6">
          <UserPlus /> Active Contestants
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150 sm:min-w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs sm:text-sm">
                <th className="py-4">Contestant</th>
                <th className="py-4">Season</th>
                <th>Votes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.content?.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-800 hover:bg-[#141821] transition"
                >
                  <td className="py-3 sm:py-5 flex items-center gap-3 sm:gap-4">
                    <img
                      src={item?.seasonPhotoUrl}
                      loading="lazy"
                      alt={item.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <span className="text-white text-[11px] sm:text-xs font-medium">
                      {item.seasonName}
                    </span>
                  </td>

                  <td className="text-gray-400 text-[11px] sm:text-sm">
                    {item.location}
                  </td>

                  <td className="text-blue-400 font-semibold text-[11px] sm:text-sm">
                    {item.voteCount}
                  </td>

                  <td className="text-right">
                    <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => handleCustomClick(item.participationId)}
                        className="bg-[#141821] border border-gray-700 text-gray-300 text-xs sm:text-[12px] px-2 sm:px-3 py-1 rounded-md hover:border-gray-500 transition"
                      >
                        Custom
                      </button>

                      <button
                        onClick={() =>
                          handleVote(item.participationId, 10)
                        }
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

     
        <section className="flex justify-center items-center gap-2 mt-4 sm:mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-3 py-1 rounded-md text-sm ${
                page === index
                  ? "bg-blue-500 text-white"
                  : "bg-[#141821] text-gray-300 hover:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ParticipantsTable;