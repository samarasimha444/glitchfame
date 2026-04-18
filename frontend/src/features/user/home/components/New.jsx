import React from "react";
import ShimmerCard from "../../../../components/ShimmerCard";
import { useWinners } from "../hooks";
import { useIsMobile } from "../../../../lib/helper";
import { Star, Trophy } from 'lucide-react';




// const winners = [
//   {
//     participationId: "1",
//     contestantName: "Aarav Singh",
//     participantName: "Aarav Singh",
//     seasonName: "Season 1",
//     prizeMoney: 50000,
//     photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
//   },
//   {
//     participationId: "2",
//     contestantName: "Priya Sharma",
//     participantName: "Priya Sharma",
//     seasonName: "Season 2",
//     prizeMoney: 75000,
//     photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
//   },
//   {
//     participationId: "3",
//     contestantName: "Rohan Mehta",
//     participantName: "Rohan Mehta",
//     seasonName: "Season 3",
//     prizeMoney: 100000,
//     photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
//   },
//   {
//     participationId: "4",
//     contestantName: "Simran Kaur",
//     participantName: "Simran Kaur",
//     seasonName: "Season 4",
//     prizeMoney: 120000,
//     photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
//   }
// ];

const New = () => {
  
  const { data: winners = [], isLoading } = useWinners();
  const isMobile = useIsMobile();

  return (
    <>
 <div className="w-full b max-w-7xl mx-auto  sm:px-6 lg:px-8">
  
  <div className="flex justify-between items-start mb-8 sm:mb-14">
    <div className="space-y-4 sm:space-y-6">
      <h1 className="mobile-h2 md:home-h2 mt-1 flex items-center gap-3">
        hall of fame
      </h1>
      <p className="small-text">
       Honoring glitch architects who dominated eras and claimed grand prizes
      </p>
    </div>
  </div>

  
  <div
    className={`pt-6 mb-12 grid gap-4 sm:gap-6 lg:gap-8 ${
      isMobile 
        ? "grid-cols-2" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
    }`}
  >
    {isLoading ? (
      <>
        <ShimmerCard />
        <ShimmerCard />
        <ShimmerCard />
      </>
    ) : (
      <>
        {/* Render existing winner cards */}
        {winners.length > 0 ? (
          winners.map((item) => {
            return isMobile ? (
              /* MOBILE CARD */
              <div
                key={item.participationId}
                className="relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#16161D] w-full aspect-[4/5] shadow-xl"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/10">
                    <img
                      src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=200`}
                      alt={item.contestantName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 sm:right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-[#16161D] rounded-full shadow-lg shadow-green-500/20"></span>
                </div>

                <div className="text-center w-full">
                  <h3 className="text-white font-bold text-[10px] sm:text-sm uppercase tracking-wider truncate px-1">
                    {item.participantName || item.contestantName}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Trophy size={10} className="text-gray-500" />
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-tight">
                      {item.seasonName}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 border-t border-white/5 w-full">
                    <p className="text-primary font-black text-xs sm:text-sm tracking-tighter">
                      ${item.prizeMoney} <span className="text-[8px] sm:text-[10px] opacity-70">WON</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
          
              <div
                key={item.participationId}
                className="relative rounded-2xl overflow-hidden border border-[#2A323C] bg-[#111418] w-full max-w-[410px] aspect-[4/5]"
              >
                <img
                  src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=600`}
                  alt={item.contestantName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm text-gray-300 mb-1">{item.seasonName}</p>
                  <h3 className="text-lg font-semibold tracking-wide text-white">{item.contestantName}</h3>
                  <p className="text-gray-400 text-xs mt-1">Prize ₹{item.prizeMoney}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-sm py-10 col-span-full text-center">
            Winners will appear here after the season ends.
          </div>
        )}

        {/* MOBILE ONLY COMING SOON CARD */}
        {isMobile && winners?.length > 0 && (
          <div className="relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-dashed border-white/20 bg-[#16161D]/50 w-full aspect-[4/5] shadow-xl">
            <div className="relative mb-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 border-dashed border-white/10 bg-white/5">
                 <Star size={24} className="text-gray-600 animate-pulse" />
              </div>
            </div>

            <div className="text-center w-full">
              <h3 className="text-gray-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider">
                Coming Soon
              </h3>

              <div className="flex items-center justify-center gap-1 mt-1">
                <p className="text-[8px] sm:text-[10px] text-gray-600 font-medium uppercase tracking-tight">
                  Next Architect
                </p>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 border-t border-white/5 w-full">
                <p className="text-gray-700 font-black text-xs sm:text-sm tracking-tighter">
                  $??? <span className="text-[8px] sm:text-[10px] opacity-50">TBD</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>

  <div className="flex sm:hidden items-center justify-center mb-10">
    <div className="relative flex flex-col items-center justify-center w-full py-6 border border-dashed border-gray-700 rounded-xl bg-white/5 overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-10">
         <Star size={80} />
      </div>
      <Star size={24} className="text-gray-600 mb-3" strokeWidth={1.5} />
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

  <div className="hidden md:flex justify-between items-center border-t border-[#2A323C] pt-6 pb-10">
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      New season coming soon.
    </div>
    <button className="bg-primary text-black px-6 py-2 rounded-sm text-sm font-semibold hover:opacity-90 transition transform active:scale-95">
      HALL OF FAME
    </button>
  </div>
</div>
    </>
  );
};

export default New;
