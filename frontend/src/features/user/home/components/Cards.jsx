import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Timer, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";
import { getTimeLeft, useIsMobile } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";

const liveSeason = [
  {
    seasonId: "season-001",
    seasonName: "Neon Overload: Zero Hour",
    category: "Gaming",
    seasonPhotoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    votingEndDate: "2026-05-01T23:59:59Z",
    entries: 1200,
    prize: 5000,
  },
  {
    seasonId: "season-002",
    seasonName: "Code Clash Championship",
    category: "Development",
    seasonPhotoUrl:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    votingEndDate: "2026-05-05T23:59:59Z",
    entries: 850,
    prize: 3000,
  },
];

// const Cards = ({ liveSeason, isLoading }) => {
const Cards = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

return (
    <div className="w-full relative">

      {isLoading ? (
        <div className="flex flex-col border-t border-white/10">
          <div className="h-64 border-b border-white/10 animate-pulse bg-white/5" />
          <div className="h-64 border-b border-white/10 animate-pulse bg-white/5" />
        </div>
      ) : liveSeason?.length === 0 ? (

        <div className="py-20 text-center border-y border-white/10">
          <p className="text-[10px] tracking-[0.5em] text-gray-600 uppercase">
            No Active Seasons Found
          </p>
        </div>

      ) : (

  <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
  
  <div className="flex flex-wrap w-full gap-6 content-start">
    {liveSeason.map((season) => (
      <div
        key={season.seasonId}
        className="flex items-center gap-4 sm:block w-full sm:w-[calc(50%-12px)]"
      >
        
        <div className="sm:hidden w-1/2">
          <h3 className="text-white text-xs font-bold uppercase leading-tight">
            {season.seasonName}
          </h3>
          <p className="text-[10px] text-primary mt-2 uppercase tracking-widest font-medium">
            {getTimeLeft?.(season.votingEndDate)}
          </p>
        </div>

        
        <Link
          to={`/vote/${season.seasonId}`}
          className="group relative flex flex-col w-full aspect-7/10 border border-white/10 overflow-hidden bg-black transition-colors"
        >
          

          <div className="flex justify-between items-center px-4 py-2 bg-[#0A0A0A] border-b border-white/10 z-20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                Live_Season
              </span>
            </div>
            <span className="text-[9px] text-gray-600 uppercase font-bold">
              Ref. 2026
            </span>
          </div>


         
          <div className="relative grow overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
            <img
              src={`${season.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=800`}
              alt={season.seasonName}
              className="w-full h-full object-cover object-center brightness-[0.4] group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
            />

         
            <div className="hidden sm:flex absolute inset-0 flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
              <h3 className="text-white font-black text-3xl md:text-5xl lg:text-6xl leading-[0.8] tracking-[-0.05em] uppercase group-hover:scale-110 transition-transform duration-500">
                {season.seasonName}
              </h3>
              <div className="mt-6 px-4 py-1 border border-white/20 backdrop-blur-sm">
                <p className="text-[9px] text-primary font-bold uppercase tracking-[0.3em]">
                  {getTimeLeft?.(season.votingEndDate)}
                </p>
              </div>
            </div>
          </div>



        
          <div className="flex justify-between items-center p-5 bg-black border-t border-white/10 group-hover:bg-primary transition-all duration-300">
            <span className="text-[10px] font-black text-white group-hover:text-black uppercase tracking-widest">
              Enter Arena
            </span>
            <ArrowRight size={16} className="text-white group-hover:text-black transition-colors" />
          </div>
        </Link>
      </div>
    ))}

   
   {/* 🔥 VIEW ALL SEASONS - SYNCHRONIZED CLASSES */}
<div className="flex items-center gap-4 sm:block w-full sm:w-[calc(50%-12px)]">
  
  {/* MOBILE INFO SIDEBAR (Matching the map layout) */}
  <div className="sm:hidden w-1/2">
    <h3 className="text-white text-xs font-bold uppercase leading-tight">
      Archive
    </h3>
    <p className="text-[10px] text-primary mt-2 uppercase tracking-widest">
      History [01-99]
    </p>
  </div>

  <Link
    to="/arena"
    className="group relative flex flex-col w-full aspect-[7/10] border border-white/10 overflow-hidden bg-black transition-colors"
  >
    {/* TOP BAR */}
    <div className="flex justify-between items-center px-4 py-2 bg-[#0A0A0A] border-b border-white/10 z-20">
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
        Database_Archive
      </span>
      <span className="text-[9px] text-gray-600 uppercase font-bold">
        Vol. 01
      </span>
    </div>

    {/* BODY / IMAGE */}
    <div className="relative flex-grow overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
      <img
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
        className="w-full h-full object-cover object-center opacity-20 brightness-50 group-hover:opacity-40 transition-all duration-700"
        alt="View all"
      />
      
      {/* CENTER OVERLAY */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
        <h3 className="text-white font-black text-3xl md:text-5xl lg:text-6xl uppercase leading-[0.85] tracking-tight group-hover:scale-110 transition-transform duration-500">
          View All <br /> Seasons
        </h3>
        <p className="mt-4 text-primary text-[9px] font-bold uppercase tracking-[0.4em]">
          Explore History
        </p>
      </div>
    </div>

    {/* FOOTER */}
    <div className="flex justify-between items-center p-5 bg-black border-t border-white/10 group-hover:bg-white transition-all duration-300">
      <span className="text-[10px] font-black text-white group-hover:text-black uppercase tracking-widest">
        Explore All
      </span>
      <ArrowRight size={16} className="text-white group-hover:text-black transition-colors" />
    </div>
  </Link>
</div>
  </div>

 
  <div className="hidden md:block w-full max-w-87.5">
    <div className="sticky top-32 mt-[40%]">
      <p className="text-xl font-extrabold italic text-white/90 leading-relaxed">
        "We live in an age where everything is everywhere, all the time.
        The real challenge is no longer visibility, but meaning.
        GlitchFame exists to build authentic connections."
      </p>
    </div>
  </div>
</div>
      )}
    </div>
  );
};

export default Cards;
