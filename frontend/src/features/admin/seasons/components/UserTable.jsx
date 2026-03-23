import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Search, Loader2 } from "lucide-react";
import {
  useDeleteContestant,
  useLiveContestants,
  useSearchContestants,
  useVoteContestant,
} from "../hook";
import VoteModal from "./VoteModel";
import toast from "react-hot-toast";

const ParticipantsTable = ({ className }) => {

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeParticipationId, setActiveParticipationId] = useState(null);

  const { data, isLoading } = useLiveContestants(page, 6);
  console.log(data)

  const { data: searchData, isLoading: searching } =
  useSearchContestants(debouncedSearch);

  const { mutate: vote } = useVoteContestant();
  const { mutate: deleteUser } = useDeleteContestant();

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const contestants =
    debouncedSearch && searchData ? searchData?.content : data?.content;

  const handleVote = (participationId, votes) => {
    vote(
      { participationId, value: votes },
      {
        onSuccess: () => {
          toast.success("Vote submitted successfully");
          setActiveParticipationId(null);
        },
        onError: () => {
          toast.error("Failed to submit vote");
        },
      }
    );
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

        <section className="flex items-center justify-between w-full mb-6">

          <h3 className="text-lg sm:text-xl flex items-center gap-2 font-semibold">
            <UserPlus /> Active Contestants
          </h3>

      
          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search contestant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 sm:w-60 h-9 pl-9 pr-8 text-sm bg-[#141821] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {searching && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
              />
            )}

          </div>
        </section>


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
              {contestants?.map((item) => (
                <tr
                  key={item.participationId}
                  className="border-b border-gray-800 hover:bg-[#141821] transition"
                >

                  <td className="py-3 sm:py-5 flex items-center gap-3 sm:gap-4">
                    <img
                      src={item?.participantPhotoUrl}
                      loading="lazy"
                      alt={item.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <span className="text-white text-[11px] sm:text-xs font-medium">
                      {item.participantName}
                    </span>
                  </td>

                  <td className="text-gray-400 text-[11px] sm:text-sm">
                    {item.seasonName}
                  </td>

                  <td className="text-blue-400 font-semibold text-[11px] sm:text-sm">
                    {item.totalVotes}
                  </td>

                  <td className="text-right">
                    <div className="flex flex-wrap justify-end gap-2 sm:gap-3">

                      <button
                        onClick={() =>
                          setActiveParticipationId(item.participationId)
                        }
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
                        onClick={() => handleDelete(item.participationId
)}
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

      
        <section className="flex justify-center items-center gap-2 mt-6 flex-wrap">

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