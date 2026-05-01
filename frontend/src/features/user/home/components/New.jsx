import React, { useState, useEffect } from "react";
import { Star, ArrowRight } from 'lucide-react';

// High-quality golden trophy PNG
const GOLDEN_TROPHY_IMG = "https://pngimg.com/d/trophy_PNG20015.png";

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
  const [rotation, setRotation] = useState(0);

  // Scroll logic to revolve the trophy
  useEffect(() => {
    const handleScroll = () => {
      // Adjust the divisor (0.2) to make it spin faster or slower
      const scrolled = window.scrollY * 0.2;
      setRotation(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-[#050505] overflow-x-hidden">
      
      {/* REVOLVING TROPHY LAYER 
          - Only shows if there are multiple winners
          - Fixed in center, rotates based on scroll state
      */}
      {winners.length > 1 && (
       <div className="hidden sm:flex absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div 
            className="relative transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Ambient Golden Glow */}
            <div className="absolute inset-0 bg-yellow-600/10 blur-[100px] rounded-full scale-150" />
            
            <img 
              src="https://www.freeiconspng.com/uploads/trophy-png-23.png"
              alt="Revolving Trophy" 
              className="h-[40vh] sm:h-[65vh] w-auto object-contain opacity-20 brightness-90"
            />
          </div>
        </div>
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        
        <div className="flex justify-between items-start pt-16 mb-8 sm:mb-14">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-white text-5xl sm:text-7xl font-black uppercase tracking-tighter">
              hall of fame
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.4em]">
              Honoring glitch architects who dominated eras
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 animate-pulse bg-white/5 rounded-3xl" />
        ) : (
          <div className="w-full">
            <div className="flex flex-wrap gap-y-16 sm:gap-y-32 md:justify-between justify-start py-12">
              {winners.map((item, index) => {
                const isFlipped = index % 2 !== 0;

                return (
                  <div
                    key={item.participationId}
                    className="w-full md:w-[40%] lg:w-[35%] md:max-w-[450px]"
                  >
                    <div className={`flex w-full md:flex-col items-center md:items-start gap-6 sm:gap-10 md:gap-4 ${isFlipped ? "flex-row-reverse" : "flex-row"}`}>
                      
                      {/* IMAGE BOX */}
                      <div className="relative w-[60%] md:w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] group shadow-2xl shrink-0">
                        <img
                          src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=800`}
                          alt={item.contestantName}
                          className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute bottom-4 left-4">
                          <p className="text-yellow-500 font-black text-xs sm:text-lg tracking-tighter bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                            ${item.prizeMoney.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* TEXT CONTENT */}
                      <div className={`w-[40%] md:w-full flex flex-col justify-center ${isFlipped ? "text-right md:text-left" : "text-left"}`}>
                        <div className="space-y-1 sm:space-y-3">
                          <p className="text-yellow-500/80 text-[9px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                            {item.seasonName}
                          </p>
                          <h3 className="text-white font-black text-sm sm:text-3xl lg:text-2xl uppercase leading-none tracking-tighter">
                            {item.participantName || item.contestantName}
                          </h3>
                        </div>

                      
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

           
          </div>
        )}
      </div>
    </div>
  );
};

export default New;