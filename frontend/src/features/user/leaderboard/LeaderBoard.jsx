import React from "react";
import { ChevronLeft, MoreVertical, Flame, ArrowUp } from "lucide-react";
import { useLeaderboard, useLeaderboardSocket } from "./hooks";


const Leaderboard = () => {
  
  const { data, isLoading, error } = useLeaderboard();


  useLeaderboardSocket(data);

  if (isLoading) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 flex justify-center items-center h-screen">
        Failed to load leaderboard
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white flex justify-center py-4 px-2 font-sans">
      <div className="w-full max-w-md sm:max-w-6xl   rounded-[40px] overflow-hidden ">

     
        <div className="flex justify-between items-center px-6 pt-8 pb-4">
        
          <div className="text-center">
            <h1 className="text-xs sm:text-xl tracking-[0.2em] font-bold uppercase italic">
              GlitchFame Leaders
            </h1>
           
          </div>
          
        </div>

        <div className="mx-4 bg-[#1C2128] rounded-2xl p-4 border border-[#2D333B]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-800 rounded-full text-red-700 animate-pulse"></div>
              <span className="text-[10px] md:text-2xl font-bold text-primary">
                LIVE RANKING
              </span>
            </div>
            <span className="text-[10px] text-gray-400">REAL TIME</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm font-bold">Top Performers</p>
            <Flame size={20} className="text-[#00F5D4]" />
          </div>
        </div>

      
        <div className="px-4 py-2 space-y-1">
          {data?.merged.map((item, index) => {
            return (
              <div
                key={item.participantId}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-bold w-4 ${
                      index < 3 ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="relative">
                    <img
                      src={item.participantPhoto}
                      className="w-10 h-10 sm:w-16 object-cover sm:h-16 rounded-full border border-gray-700"
                    />
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full border-2 border-[#161B22]"></div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      {item.participantName}
                    </p>
                    <p className="text-[10px] text-[#00F5D4]/70">
                      {item.seasonName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-[#00F5D4]">
                    {item.votes}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[9px] text-primary">
                    <ArrowUp size={8} />
                    LIVE
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <button className="text-[10px] font-bold text-primary border-b  pb-0.5 hover:text-white">
            View Full Ranking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;