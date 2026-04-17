import React from "react";

import ShimmerCard from "../../../../components/ShimmerCard";
import { useWinners } from "../hooks";
import { useIsMobile } from "../../../../lib/helper";
import { Star } from 'lucide-react';

const New = () => {
  const { data: winners = [], isLoading } = useWinners();
  const isMobile = useIsMobile();
  

  return (
 <>
  <div className="w-full max-w-296 mx-auto ">
    <div className="flex justify-between items-start sm:mb-14">
      <div className="space-y-6">
        <h1 className="text-white hidden md:flex text-lg sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
          PAST <span className="text-gray-500 ml-2">WINNERS</span>
        </h1>

        <h1 className="mobile-h2 md:home-h2">Hall of Fame</h1>
        <p className="small-text w-full max-w-xl">
          Immortalizing the architects of the glitch. These champions
          dominated their eras and walked away with the grand prize.
        </p>
      </div>
    </div>

    <div className="flex justify-center pt-6 items-end gap-8 mb-12">
      {isLoading ? (
        <>
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </>
      ) : winners.length > 0 ? (
        winners.map((item, index) => {
          return isMobile ? (
            <div
              key={item.participationId}
              className="relative flex flex-col items-center justify-center p-6 rounded-lg border border-white/10 bg-[#181820] w-[185px] h-[220px] transition-all hover:border-purple-500/50"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700">
                  <img
                    src={`${item.photoUrl}?auto=compress&cs=tinysrgb&w=200`}
                    alt={item.contestantName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#0B0E11] rounded-full"></span>
              </div>

              <div className="text-center">
                <h3 className="text-white font-bold text-sm uppercase tracking-tight">
                  {item.participantName}
                </h3>

                <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
                  {item.seasonName}:{" "}
                  <span className="text-gray-400">
                    {item.score || "GLITCH"}
                  </span>
                </p>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-primary font-bold text-xs">
                    ${item.prizeMoney} WON
                  </p>
                </div>
              </div>
            </div>
          ) : (
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Rank Badge */}
              <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                {index === 0 ? "1ST" : index === 1 ? "2ND" : "3RD"}
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6">
                <p className="text-sm text-gray-300 mb-2">
                  {item.seasonName}
                </p>

                <h3 className="text-lg font-semibold tracking-wide">
                  {item.contestantName}
                </h3>

                <p className="text-gray-400 text-xs mt-2">
                  Prize ₹{item.prizeMoney}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-400 text-sm">
          Winners will appear here after the season ends.
        </div>
      )}
    </div>

    <div className="flex sm:hidden items-center justify-center ">
      <div className="relative flex flex-col items-center justify-center w-full max-w-85.5 border-2 border-dashed py-8 border-gray-700 rounded-lg bg-transparent transition-all sm:hover:border-gray-500 group">
        <div className="">
          <Star
            size={32}
            className="text-gray-500 sm:group-hover:text-teal-300 transition-colors duration-300"
            strokeWidth={1.5}
          />
        </div>

        <div className="text-center">
          <h2 className="text-[14px] font-bold tracking-tight text-white uppercase sm:text-4xl">
            Your Name Here?
          </h2>
          <p className="mt-2 text-[10px] font-medium tracking-wide text-gray-400 uppercase">
            Join Next Season to Qualify
          </p>
        </div>
      </div>
    </div>

    <div className="hidden md:flex justify-between items-center border-t border-[#2A323C] pt-6">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        New season coming soon.
      </div>

      <button className="bg-primary text-black px-6 py-2 rounded-xs text-sm font-semibold hover:opacity-90 transition">
        HALL OF FAME
      </button>
    </div>
  </div>
</>
  );
};

export default New;
