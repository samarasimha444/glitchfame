import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Search, Loader2 ,ListFilter,ChevronDown} from "lucide-react";
import {useDeleteContestant,useLiveContestants,useSearchContestants,useVoteContestant,
} from "../hook";
import VoteModal from "./VoteModel";
import toast from "react-hot-toast";
import { TableShimmer } from "../../../../components/TableShimmer";
import NeonLoader from "../../../../components/NeonLoader";
import { TableRow } from "./TableRow";

const ParticipantsTable = ({ className,setLive }) => {

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc")
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
  console.log(votes)
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

        <section className="flex flex-wrap items-center justify-between w-full mb-6 gap-3">
  <h3 className="text-[16px] sm:text-xl flex items-center gap-2 font-semibold">
    <UserPlus /> Active <br className="xs:hidden" /> Contestants
  </h3>

  <div className="flex items-center gap-2">
    {/* Search Input */}
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-28 sm:w-60 h-9 pl-9 pr-8 text-sm bg-[#141821] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
      />
      {searching && (
        <Loader2
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-teal-400"
        />
      )}
    </div>

    {/* Sort Button */}
    <button
      onClick={() => setOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
      className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#141821] border border-gray-700 text-gray-400 hover:text-teal-400 hover:border-teal-500/50 transition-all active:scale-95"
    >
      <ListFilter size={15} />
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider min-w-[55px] text-left">
        {order === "desc" ? "Trending" : "Rookie"}
      </span>
      <ChevronDown 
        size={14} 
        className={`transition-transform duration-300 ${order === "asc" ? "rotate-180" : ""}`} 
      />
    </button>
  </div>
</section>


        <div className="overflow-x-auto max-h-[70vh] sm:max-h-none">


  <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#0f121a]/50 backdrop-blur-sm">
  <table className="w-full text-left border-collapse">
  <thead>
    <tr className="border-b border-gray-800 bg-gray-900/30 text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest">
      
      <th className="px-4 py-4 font-bold">Contestant</th>

     
      <th className="py-4 hidden sm:table-cell font-bold text-right px-2">Season </th>

      
      <th className="py-4 font-bold text-right px-">Stats</th>

      
      <th className="px-4 py-4 text-right font-bold">Manage</th>
    </tr>
  </thead>

    <tbody className="divide-y divide-gray-800/50">
      {isLoading ? (
        <tr>
          <td colSpan="4" className="py-20">
            <div className="flex justify-center items-center">
              <NeonLoader />
            </div>
          </td>
        </tr>
      ) : contestants?.length === 0 ? (
        <tr>
          <td colSpan="4" className="text-center text-gray-500 py-12 italic">
            No contestants active in this category
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