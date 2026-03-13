import React, { useState, useEffect, useCallback, useMemo } from "react";
import VotingHeader from "./VotingHeader";
import ArenaCard from "../arena/ui/ArenaCard";
import { useParams } from "react-router-dom";
import { useContestantsById } from "../arena/hooks";
import { Search } from "lucide-react";


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
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const size = 8;
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: contestantsData,
    isLoading,
    isError,
  } = useContestantsById(seasonId, page, size, debouncedSearch);

  const totalPages = useMemo(() => contestantsData?.totalPages || 0, [contestantsData]);

  const handleNext = useCallback(() => {
    if (page + 1 < totalPages) setPage((prev) => prev + 1);
  }, [page, totalPages]);

  const handlePrev = useCallback(() => {
    if (page > 0) setPage((prev) => prev - 1);
  }, [page]);

  
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col bg-black sm:bg-[#181B20] w-full m-auto max-w-400 px-1 min-h-screen">
      <VotingHeader id={seasonId} />

      <div className="md:flex md:px-12 max-w-[290px] flex-col md:flex-row gap-4 mt-4 mb-5 md:mt-10 md:mb-8">
        <div className="flex items-center bg-[#111418] border border-[#1E232B] rounded-lg px-7 md:min-w-xl w-full py-3 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="search"
            autoComplete="off"
            placeholder="Search contestants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      
      <section className="md:px-12">
        {/* {isError && (
          <div className="text-red-500 text-center mt-4">
            Failed to load contestants.
          </div>
        )} */}

        {!isLoading && contestantsData?.items?.length === 0 && (
          <div className="text-gray-400 text-center mt-6">
            No contestants found.
          </div>
        )}

        <ArenaCard
          contestantsData={contestantsData}
          isLoading={isLoading}
        />
      </section>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6 mb-10">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-colors duration-200 ${
              page === 0
                ? "bg-gray-700 cursor-not-allowed text-gray-300"
                : "bg-purple-600 text-white hover:bg-purple-500"
            }`}
          >
            &#8592; Prev
          </button>

          <div className="flex items-center gap-2 bg-[#1E1E2F] px-3 py-1.5 rounded-full text-white font-medium shadow-md">
            Page <span className="font-bold px-1">{page + 1}</span> of{" "}
            <span className="font-bold px-1">{totalPages}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={page + 1 >= totalPages}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-colors duration-200 ${
              page + 1 >= totalPages
                ? "bg-gray-700 cursor-not-allowed text-gray-300"
                : "bg-pink-400 text-black hover:bg-purple-500"
            }`}
          >
            Next &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default Vote;