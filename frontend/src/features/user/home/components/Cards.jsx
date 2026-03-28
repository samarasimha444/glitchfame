import React from "react";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
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
      : liveSeason.length === 0 ?
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
          : <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {liveSeason?.map((item, index) => {
                const isFeatured = index === 0;

                return (
                  <Link
                    to={`/vote/${item.seasonId}`}
                    key={item.seasonId}
                    className={`
          relative w-full rounded-xs overflow-hidden border border-[#364354] 
           transition duration-300 flex flex-col
         
          ${
            isFeatured ?
              "col-span-2 lg:col-span-2 h-69.5 w-2xl md:h-[440px]"
            : "col-span-1 lg:col-span-1 h-69.5 w-[350px] md:h-[320px] mt-3"
          }
        `}
                  >
                    <img
                      src={`${item.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=800`}
                      alt={item.seasonName}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000f2] via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                        LIVE
                      </span>
                      {isFeatured && (
                        <span className="bg-primary text-black text-[9px] px-2 py-0.5 rounded-full font-bold">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 mt-auto p-4 w-full">
                      <div>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-wider opacity-90">
                          {item.category}
                        </p>
                        <h3
                          className={`text-white font-bold leading-tight line-clamp-2 
              ${isFeatured ? "text-lg md:text-2xl" : "text-sm md:text-base"}`}
                        >
                          {item.seasonName}
                        </h3>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2">
                        <div className="flex items-center gap-2 text-gray-300 text-[11px]">
                          <div className="w-5 h-5 rounded-full bg-primary" />
                          <p className="flex items-center gap-1">
                            <Timer size={12} className="text-gray-400" />
                            <span>{getTimeLeft(item.votingEndDate)}</span>
                          </p>
                        </div>

                        <span className="text-white text-[13px] font-bold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                          Vote
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>
          }
        </>
      }
    </div>
  );
};

export default Cards;
