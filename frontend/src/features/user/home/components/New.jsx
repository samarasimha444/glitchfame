import React from "react";
import ShimmerCard from "../../../../components/ShimmerCard";
import { useWinners } from "../hooks";
import { useIsMobile } from "../../../../lib/helper";
import { Star, Trophy } from 'lucide-react';

const New = () => {
  const { data: winners = [], isLoading } = useWinners();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="w-full max-w-296 mx-auto px-4 sm:px-0">
        <div className="flex justify-between items-start sm:mb-14">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="mobile-h2 md:home-h2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Hall of Fame
            </h1>
            <p className="small-text w-full max-w-xl leading-relaxed opacity-80">
              Immortalizing the architects of the glitch. These champions
              dominated their eras and walked away with the grand prize.
            </p>
          </div>
        </div>

        {/* Mobile: Scrollable Row | Desktop: Flex Gap */}
        <div className={`flex pt-6 items-end gap-5 mb-12 
          ${isMobile ? "overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar" : "justify-center gap-8"}`}>
          
          {isLoading ? (
            <>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </>
          ) : winners.length > 0 ? (
            winners.map((item, index) => {
              return isMobile ? (
                /* CLEANER MOBILE CARD */
                <div
                  key={item.participationId}
                  className="relative flex-shrink-0 snap-center flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 bg-[#16161D] w-[200px] h-[260px] shadow-xl"
                >
                  <div className="relative mb-4">
                    {/* Removed Gradient Ring - Simple Border instead */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10">
                      <img
                        src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=200`}
                        alt={item.contestantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-1 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-[#16161D] rounded-full shadow-lg shadow-green-500/20"></span>
                  </div>

                  <div className="text-center w-full">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider truncate px-2">
                      {item.participantName || item.contestantName}
                    </h3>

                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <Trophy size={10} className="text-gray-500" />
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">
                        {item.seasonName}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 w-full">
                      <p className="text-primary font-black text-sm tracking-tighter">
                        ${item.prizeMoney} <span className="text-[10px] opacity-70">WON</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* DESKTOP CARD (REMAINS UNCHANGED) */
                <div
                  key={item.participationId}
                  className="relative rounded-2xl overflow-hidden border border-[#2A323C] bg-[#111418] w-[410px] h-[510px]"
                >
                  <img
                    src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=600`}
                    alt={item.contestantName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {index === 0 ? "1ST" : index === 1 ? "2ND" : "3RD"}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <p className="text-sm text-gray-300 mb-2">{item.seasonName}</p>
                    <h3 className="text-lg font-semibold tracking-wide">{item.contestantName}</h3>
                    <p className="text-gray-400 text-xs mt-2">Prize ₹{item.prizeMoney}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-sm py-10 w-full text-center">
              Winners will appear here after the season ends.
            </div>
          )}
        </div>

        {/* Call to Action Box */}
        <div className="flex sm:hidden items-center justify-center px-4">
          <div className="relative flex flex-col items-center justify-center w-full py-6 border border-dashed border-gray-700 rounded-xl bg-white/5 overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
               <Star size={80} />
            </div>
            <Star
              size={24}
              className="text-gray-600 mb-3"
              strokeWidth={1.5}
            />
            <div className="text-center">
              <h2 className="text-[14px] font-bold tracking-widest text-white uppercase">
                Your Name Here?
              </h2>
              <p className="mt-1 text-[9px] font-medium tracking-widest text-gray-500 uppercase">
                Join Next Season to Qualify
              </p>
            </div>
          </div>
        </div>

        {/* Footer section (Desktop Only) */}
        <div className="hidden md:flex justify-between items-center border-t border-[#2A323C] pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            New season coming soon.
          </div>
          <button className="bg-primary text-black px-6 py-2 rounded-xs text-sm font-semibold hover:opacity-90 transition transform active:scale-95">
            HALL OF FAME
          </button>
        </div>
      </div>
    </>
  );
};

export default New;
