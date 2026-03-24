import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Search, Loader2 } from "lucide-react";
import {
  useDeleteContestant,
  useLiveContestants,
  useSearchContestants,
  useVoteContestant,
} from "../hook";
import VoteModal from "./VoteModel";
import toast from "react-hot-toast";
import { TableShimmer } from "../../../../components/TableShimmer";
import NeonLoader from "../../../../components/Loader";
import { TableRow } from "./TableRow";

const ParticipantsTable = ({ className,setLive }) => {

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeParticipationId, setActiveParticipationId] = useState(null);

  const { data, isLoading:liveLoading } = useLiveContestants(page, 6);



 const total = data?.totalElements;
  setLive(total)



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

 const handleVote = useCallback((participationId, votes) => {
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
}, [vote]);


const handleDelete = useCallback((id) => {
  deleteUser(id);
}, [deleteUser]);

  const totalPages = data?.totalPages || 0;

  const isLoading = liveLoading 



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

          <h3 className="text-[16px] sm:text-xl flex items-center gap-2 font-semibold">
            <UserPlus /> Active <br /> Contestants
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
              className="w-32 sm:w-60 h-9 pl-9 pr-8 text-sm bg-[#141821] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {searching && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
              />
            )}

          </div>
        </section>


        <div className="overflow-x-auto max-h-[70vh] sm:max-h-none">


  <table className="w-full text-left border-collapse min-w-[150px] sm:min-w-full">

    <thead>
      <tr className="border-b border-gray-700 text-gray-400 text-xs sm:text-sm">
        <th className="py-3 sm:py-4">Contestant</th>
        <th className="py-3 sm:py-4 hidden sm:table-cell">Season</th>
        <th className="py-3 sm:py-4">Votes</th>
        <th className="py-3 sm:py-4 text-right">Actions</th>
      </tr>
    </thead>

   <tbody>
  {isLoading ? (
    <tr>
      <td colSpan="4" className="text-center py-10">
        <div className="flex ">
          <NeonLoader />
        </div>
      </td>
    </tr>
  ) : contestants?.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center text-gray-400 py-6">
        No contestants found
      </td>
    </tr>
  ) : (
    contestants?.map((item) => (
    <TableRow
    key={item.participationId}
    item={item}
    onVote={handleVote}
    onDelete={handleDelete}
    setActive={setActiveParticipationId}
  />
    ))
  )}
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