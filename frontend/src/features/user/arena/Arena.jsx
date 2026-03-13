import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import LiveCards from "./ui/LiveCards";
import { useLiveUpcomingSeasons } from "../home/hooks";
import { isVotingLive } from "../../../lib/helper";



const Arena = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: live = [], isLoading } = useLiveUpcomingSeasons("live");

  

  const liveSeasons = live.filter(isVotingLive);

 
  useEffect(() => {
    if (search === "") {
      setDebouncedSearch("");
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 500); 

    return () => clearTimeout(handler);
  }, [search]);

  const filteredSeasons = liveSeasons.filter((season) =>
    season.seasonName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="bg-black w-full text-white py-12 md:py-20 px-4 sm:px-6 min-h-screen">
      
      <section className="hidden md:flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs tracking-widest text-purple-400 mb-3">
          LIVE COMPETITIONS
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Explore Active <span className="text-purple-500">Seasons</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          Step into the arena where the world's most talented digital artists
          compete for seasonal glory and massive prize pools.
        </p>
      </section>

      
      <div className="flex justify-center max-w-6xl mx-auto mb-8">
        <div className="relative w-full md:w-1/2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Find a specific season..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0e0e11] border border-gray-700 rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:border-purple-500"
          />
        </div>
      </div>

    
      {isSearching && (
        <p className="text-gray-400 text-center mb-4">Searching...</p>
      )}

     
      <div className="max-w-6xl mx-auto">
        {!isLoading && <LiveCards seasons={filteredSeasons} />}
        {!isLoading && filteredSeasons.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No seasons found.</p>
        )}
      </div>
    </div>
  );
};

export default Arena;