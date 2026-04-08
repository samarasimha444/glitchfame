import React from "react";

import ShimmerCard from "../../../../components/ShimmerCard";
import { useWinners } from "../hooks";

const New = () => {
  // ✅ Fetch from backend
  const { data: winners = [], isLoading } = useWinners();

  return (
    <>
     
      <div className="w-full hidden bg-[#1E2229] sm:block text-white px-6 md:px-20 py-20">
        
        <div className="flex justify-between items-start sm:mb-14">
          <div>
            <h1 className="text-white flex  text-lg sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
              PAST <span className="text-gray-500 ml-2">WINNERS</span>
            </h1>

            <p className="text-gray-400 mt-4 max-w-xl text-sm">
              Celebrating the top-tier creators who defined the standards of the
              GlitchFame community.
            </p>
          </div>
        </div>

       
        <div className="flex justify-center items-end gap-8 mb-16">
          
          {isLoading ? (
            <>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </>
          ) : winners.length > 0 ? (
            winners.slice(0, 3).map((item, index) => {
              const size = index === 0 ? "large" : "small";

              return (
                <div
                  key={item.contestantId}
                  className={`relative rounded-2xl overflow-hidden border border-[#2A323C] bg-[#111418]
                  ${
                    size === "large"
                      ? "w-[420px] h-[520px]"
                      : "w-[320px] h-[420px]"
                  }`}
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
                    {index === 0
                      ? "1ST"
                      : index === 1
                      ? "2ND"
                      : "3RD"}
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

        {/* FOOTER */}
        <div className="flex justify-between items-center border-t border-[#2A323C] pt-6">
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