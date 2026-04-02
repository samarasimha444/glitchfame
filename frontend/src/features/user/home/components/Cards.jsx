import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Timer } from "lucide-react";
import { getTimeLeft, useIsMobile } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";

const Cards = ({ liveSeason, isLoading }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full   max-w-screen mx-auto  sm:px-6 md:px-10 lg:px-20">
      {isLoading ?
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <ShimmerCard />
          <ShimmerCard />
        </section>
      : liveSeason?.length === 0 ?
        <div className="w-full text-center py-20 text-gray-400 text-xl">
          No live seasons found.
        </div>
      : <>
          {isMobile ?
            <section className="grid grid-cols-2 gap-3 sm:gap-6 ">
              {liveSeason?.map((item) => (
                <Link
                  to={`/vote/${item.seasonId}`}
                  key={item.seasonId}
                  className="w-full h-[278px] bg-[#181B20] rounded-2xl overflow-hidden border border-[#364354] hover:border-white transition duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={`${item.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=600`}
                      alt={item.seasonName}
                      className="h-[163px] w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-medium">
                      ● LIVE
                    </span>
                  </div>

                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <p className="text-[11px] text-primary uppercase tracking-wide">
                        {item.category}
                      </p>

                      <h3 className="text-white text-[14px] font-semibold mt-1 line-clamp-2">
                        {item.seasonName}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <p className="flex items-center gap-1">
                        <Timer size={14} />
                        <span>{getTimeLeft(item.votingEndDate)}</span>
                      </p>

                      <span className="text-primary font-medium">Vote</span>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. THE LIVE SEASON CARD (Zoom Effect Added) */}
              {liveSeason?.[0] && (
                <Link
                  to={`/vote/${liveSeason[0].seasonId}`}
                  key={liveSeason[0].seasonId}
                  className="group relative w-full h-[320px] rounded-xl overflow-hidden border border-gray-800 transition duration-500 ease-in-out flex flex-col"
                >
                  {/* Zooming Image Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={`${liveSeason[0].seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=800`}
                      alt={liveSeason[0].seasonName}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                  
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto p-5 w-full">
                    <p className="text-[10px] text-primary uppercase font-black tracking-[0.15em] mb-1">
                      {liveSeason[0].category}
                    </p>
                    <h3 className="text-white font-bold leading-tight line-clamp-2 text-lg">
                      {liveSeason[0].seasonName}
                    </h3>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2 text-gray-300 text-[11px]">
                        <Timer size={14} className="text-primary" />
                        <span>{getTimeLeft(liveSeason[0].votingEndDate)}</span>
                      </div>

                      <span className="text-white text-[13px] font-bold bg-white/10 px-4 py-1.5 rounded-lg backdrop-blur-md border border-white/10 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                        Vote Now
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <Link
                to="/live"
                className="group relative w-full h-[320px] rounded-xl overflow-hidden border border-gray-800 bg-gray-900 flex flex-col items-center justify-center transition duration-500 ease-in-out"
              >
                {/* Background Image Zoom (Optional: Use a generic crowd or studio image) */}
                <div className="absolute inset-0 opacity-30 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                    className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110"
                    alt="View all"
                  />
                </div>

                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />

                <div className="relative z-10 flex flex-col items-center text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <ArrowRight size={28} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    View All Seasons
                  </h3>
                  <p className="text-gray-400 text-sm max-w-[200px]">
                    Explore the full archive of competitions
                  </p>
                </div>
              </Link>
            </div>
          }
        </>
      }
    </div>
  );
};

export default Cards;
