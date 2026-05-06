import React, { useState, useEffect } from "react";
import { Star, ArrowRight } from 'lucide-react';
import { useWinners } from "../hooks";

// High-quality golden trophy PNG
const GOLDEN_TROPHY_IMG = "https://pngimg.com/d/trophy_PNG20015.png";



const New = () => {
    const {data:winners,isLoading}= useWinners()
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
      
  {/* REVOLVING TROPHY LAYER */}
  {winners?.length > 1 && (
    <div className="hidden sm:flex absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
      <div 
        className="relative transition-transform duration-100 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute inset-0 bg-yellow-600/10 blur-[100px] rounded-full scale-150" />
        
        <img 
          src="https://www.freeiconspng.com/uploads/trophy-png-23.png"
          alt="Revolving Trophy" 
          className="h-[40vh] sm:h-[65vh] w-auto object-contain opacity-20 brightness-90"
        />
      </div>
    </div>
  )}

  {/* CONTENT */}
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

          {(winners?.length ? winners : [1, 2]).map((item, index) => {
            const isFlipped = index % 2 !== 0;
            const isFake = !winners?.length;

            return (
              <div
                key={isFake ? index : item.participationId}
                className="w-full md:w-[40%] lg:w-[35%] md:max-w-104.5"
              >
                <div className={`flex w-full md:flex-col items-center md:items-start gap-6 sm:gap-10 md:gap-4 ${isFlipped ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* IMAGE BOX */}
                  <div className="relative w-[60%] md:w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] group shadow-2xl shrink-0">
                    <img
                      src={
                        isFake
                          ? "https://png.pngtree.com/png-vector/20240824/ourmid/pngtree-golden-trophy-cup-with-red-ribbon-and-stars-winner-clip-art-png-image_13605947.png"
                          : `${item.photoUrl}?auto=compress&cs=tinysrgb&w=800`
                      }
                      alt={isFake ? "Coming Soon" : item.contestantName}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                        isFake ? "opacity-40 grayscale" : "md:group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4">
                      <p className="text-yellow-500 font-black text-xs sm:text-lg tracking-tighter bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                        {isFake ? "COMING SOON" : `$${item.prizeMoney.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                 
                  <div className={`w-[40%] md:w-full flex flex-col justify-center ${isFlipped ? "text-right md:text-left" : "text-left"}`}>
                    <div className="space-y-1 sm:space-y-3">
                      <p className="text-yellow-500/80 text-[9px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                        {isFake ? "Upcoming Winner" : item.seasonName}
                      </p>
                      <h3 className="text-white font-black text-sm sm:text-3xl lg:text-2xl uppercase leading-none tracking-tighter">
                        {isFake
                          ? "Stay Tuned"
                          : item.participantName || item.contestantName}
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