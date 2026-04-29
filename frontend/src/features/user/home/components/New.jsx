import React, { useState } from "react";
import ShimmerCard from "../../../../components/ShimmerCard";
import { useWinners } from "../hooks";
import { useIsMobile } from "../../../../lib/helper";
import { Star, Trophy,ArrowRight } from 'lucide-react';




const winners = [
  {
    participationId: "1",
    contestantName: "Aarav Singh",
    participantName: "Aarav Singh",
    seasonName: "Season 1",
    prizeMoney: 50000,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    participationId: "2",
    contestantName: "Priya Sharma",
    participantName: "Priya Sharma",
    seasonName: "Season 2",
    prizeMoney: 75000,
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    participationId: "3",
    contestantName: "Rohan Mehta",
    participantName: "Rohan Mehta",
    seasonName: "Season 3",
    prizeMoney: 100000,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
  },
  {
    participationId: "4",
    contestantName: "Simran Kaur",
    participantName: "Simran Kaur",
    seasonName: "Season 4",
    prizeMoney: 120000,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
  }
];

const New = () => {
 const [isLoading, setIsLoading] = useState(false);
  
  // const { data: winners = [], isLoading } = useWinners();
  const isMobile = useIsMobile();

  return (
    <>
<div className="w-full relative">

    <div className="flex justify-between items-start mb-8 sm:mb-14">
    <div className="space-y-4 sm:space-y-6">
      <h1 className="home-h2 mt-1 flex items-center gap-3">
        hall of fame
      </h1>
      <p className="small-text">
       Honoring glitch architects who dominated eras and claimed grand prizes
      </p>
    </div>
  </div>
  {isLoading ? (
    <div className="flex flex-col border-t border-white/10 p-4">
      <div className="h-64 animate-pulse bg-white/5 rounded-xl mb-4" />
      <div className="h-64 animate-pulse bg-white/5 rounded-xl" />
    </div>
  ) : (
    <div className="w-full max-w-7xl mx-auto px-4">
      
      {/* Container: 2 cards per row on desktop with spacing between */}
      <div className="flex flex-wrap gap-y-12 sm:gap-y-20 md:justify-between justify-start py-8">
        {winners.map((item, index) => {
          const isFlipped = index % 2 !== 0;

          return (
            <div
              key={item.participationId}
              
              className="w-full md:w-[35%] md:max-w-[450px]"
            >
              {/* Mobile: Original Row/Reverse | Desktop: Stacked Column */}
              <div className={`flex w-full md:flex-col items-center md:items-start gap-4 sm:gap-8 md:gap-4 ${isFlipped ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* 1. IMAGE BOX 
                    Mobile: 60% width 
                    Desktop: Full width of container, max height 550px 
                */}
                <div className="relative w-[60%] sm:max-w- md:w-full aspect-[4/5] md:max-h-[550px] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] group shadow-2xl shrink-0">
                  <img
                    src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=800`}
                    alt={item.contestantName}
                    className="absolute inset-0 w-full h-full object-cover md:group-hover:grayscale-0 md:transition-all duration-700 md:group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6">
                    <p className="text-primary font-black text-[10px] sm:text-lg tracking-tighter bg-black/80 sm:backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/10">
                      ${item.prizeMoney.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 2. TEXT CONTENT 
                    Mobile: 40% width 
                    Desktop: Full width, always left-aligned 
                */}
                <div className={`w-[40%] md:w-full flex flex-col justify-center ${isFlipped ? "text-right md:text-left" : "text-left"}`}>
                  <div className="space-y-1 sm:space-y-3">
                    <p className="text-primary text-[8px] sm:text-xs font-black uppercase tracking-[0.3em]">
                      {item.seasonName}
                    </p>
                    <h3 className="text-white font-black text-xs sm:text-2xl lg:text-4xl uppercase leading-[0.85] tracking-tighter break-words">
                      {item.participantName || item.contestantName}
                    </h3>
                  </div>

                  {/* Supplemental Info Line */}
                  <div className={`mt-4 pt-4 border-t border-white/10 flex flex-col ${isFlipped ? "items-end md:items-start" : "items-start"}`}>
                    <span className="text-[7px] sm:text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] opacity-80">
                      Ref. Hall_Of_Fame
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-white/40 uppercase font-bold tracking-widest mt-1">
                      Finalist_2026
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MINIMAL FOOTER */}
      <div className="mt-12 py-10 border-t border-white/5 flex items-center justify-between">
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.6em]">GlitchFame Arena</p>
        <div className="h-px flex-1 mx-12 bg-white/5"></div>
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.6em]">Archive 01</p>
      </div>
      
    </div>
  )}
</div>
    </>
  );
};

export default New;
