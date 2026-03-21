import { useParticipation, useSearchContestants } from "./hooks";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import VotingHeader from "./ui/VotingHeader";
import ArenaCard from "./ui/ArenaCard";
import { Search } from "lucide-react";
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
  const debouncedSearch = useDebounce(searchQuery, 500);

 
  const {
    data: participationData,
    isLoading: isLoadingParticipation,
    isFetching: isFetchingParticipation,
  } = useParticipation(seasonId);
  
  console.log(participationData)

  
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
  } = useSearchContestants(seasonId, debouncedSearch, 0, 20);

 
  const contestants = debouncedSearch
    ? searchData?.content || []          
    : participationData?.participants?.content || [];


  const seasonInfo = participationData?.season;

  
  useSeasonVotes(!isLoadingParticipation ? seasonInfo?.seasonId : null);

  const isLoadingState =
    isLoadingParticipation || isFetchingParticipation || isLoadingSearch || isFetchingSearch;

  const isEmpty = !isLoadingState && contestants.length === 0;

  return (
    <div className="flex flex-col w-full m-auto max-w-400 px-5 min-h-screen">
      
      <VotingHeader season={seasonInfo} id={seasonId} />

     
      <div className="md:flex md:px-12 flex-col md:flex-row gap-4 mb-5 md:mt-10 md:mb-8">
        <div className="flex items-center bg-[#323843] border border-[#1E232B] rounded-xl px-7 w-full py-3.5 flex-1">
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

     
      <section className="md:px-12 min-h-[50dvh]">
        {isEmpty ? (
          <div className="text-gray-400 text-center mt-6">No contestants found.</div>
        ) : (
          <ArenaCard
            seasonId={seasonInfo?.seasonId}
            data={contestants}
            isLoading={isLoadingState}
          />
        )}
      </section>

      <p className="mt-5 py-12 flex w-full items-center justify-center">
        View all Candidates
      </p>
    </div>
  );
};

export default Vote;
























