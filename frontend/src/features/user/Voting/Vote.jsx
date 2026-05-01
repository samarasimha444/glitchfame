import { useParticipation, useSearchContestants } from "./hooks";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, lazy, Suspense } from "react";
import VotingHeader from "./ui/VotingHeader";
const ArenaCard = lazy(() => import("./ui/ArenaCard"));
import { Search, ListFilter, ChevronDown } from "lucide-react";
import { useSeasonVotes } from "./hooks";


const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Vote = () => {
  const { id: seasonId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Reset page when search OR order changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, order]);

  
  const {
    data: participationData,
    isLoading: isLoadingParticipation,
    isFetching: isFetchingParticipation,
    isError: isParticipationError,
  } = useParticipation(seasonId, page, order, !debouncedSearch);

  
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    isError: isSearchError,
  } = useSearchContestants(seasonId, debouncedSearch, 0, 20);

  const contestants =
    debouncedSearch
      ? searchData?.content || []
      : participationData?.participants?.content || [];

  const seasonInfo = participationData?.season;
  const totalPages = participationData?.participants?.totalPages || 0;

  useSeasonVotes(!isLoadingParticipation ? seasonInfo?.seasonId : null);

  const isLoadingState =
    isLoadingParticipation ||
    isFetchingParticipation ||
    isLoadingSearch ||
    isFetchingSearch;

  const isError = isParticipationError || isSearchError;
  const isEmpty = !isLoadingState && contestants.length === 0;

  return (
    <div className="flex flex-col w-full m-auto max-w-400 min-h-screen">
      <section className="bg-black pt-20">
        <VotingHeader season={seasonInfo} id={seasonId} />

        <div className="md:flex md:px-12 flex-col md:flex-row gap-4 mb-5 sm:mt-4 md:mb-8">
          <div className="flex justify-center w-full px-4">
            <div className="flex items-center w-full max-w-4xl h-12 md:h-14 bg-[#1A1A23] border border-white/10 focus-within:border-teal-500/50 rounded-xl px-2 shadow-2xl shadow-black/40 group">

             
              <div className="flex items-center flex-1 px-3">
                <Search size={18} className="text-gray-500 mr-3" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contestants by name..."
                  className="bg-transparent outline-none text-gray-200 text-sm w-full placeholder:text-gray-600"
                />
              </div>

              <div className="w-[1px] h-6 bg-white/10 mx-1" />

              
         <button
  disabled={!!debouncedSearch}
  onClick={() => setOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
  className="flex items-center gap-1.5 h-9 px-2 sm:px-3 rounded-lg text-gray-400 hover:text-teal-400 disabled:opacity-40 bg-gray-800/50"
>
  <ListFilter size={16} className="shrink-0" />
  
  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
    {order === "desc" ? "Trending" : "Quiet"}
  </span>

  <ChevronDown 
    size={14} 
    className={`transition-transform duration-200 ${order === "asc" ? "rotate-180" : ""}`} 
  />
</button>
            </div>
          </div>
        </div>
      </section>


      <section className="md:px-12 mt-2 min-h-[50dvh]">
        <Suspense fallback={<div className="text-center mt-10 text-gray-400">Loading...</div>}>

          {isError && (
            <div className="text-red-400 text-center mt-6">
              Something went wrong. Try again.
            </div>
          )}

          {isEmpty && (
            <div className="text-gray-400 text-center mt-6">
              No contestants found.
            </div>
          )}

          {!isEmpty && !isError && (
            <ArenaCard
              seasonId={seasonInfo?.seasonId}
              data={contestants}
              isLoading={isLoadingState}
            />
          )}

        </Suspense>
      </section>

      {/* PAGINATION */}
      {!debouncedSearch && totalPages > 1 && (
        <div className="flex justify-center mt-10 mb-10">
          <div className="flex items-center gap-2 bg-[#1E232B] px-4 py-2 rounded-xl border border-[#323843]">

            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-2 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              if (
                i === 0 ||
                i === totalPages - 1 ||
                (i >= page - 1 && i <= page + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      page === i
                        ? "bg-primary text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              }

              if (i === page - 2 || i === page + 2) {
                return <span key={i}>...</span>;
              }

              return null;
            })}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
              className="px-2 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote;