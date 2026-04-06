import React from "react";
import { Zap, Flame, Activity, Star } from "lucide-react";
import { useLeaderboard, useLeaderboardSocket } from "./hooks";
import Countup from "./ui/Countup";
import LeaderboardLoading from "./ui/LeaderBoardCarousel";

const Leaderboard = () => {
  const { data, isLoading, error } = useLeaderboard();
  const PRIMARY_COLOR = "#9DE2E2";
  console.log(data)

  useLeaderboardSocket(data);

  if (isLoading) {
    return (
      <div className="text-white max-w-screen  flex justify-center items-center h-screen">
        <LeaderboardLoading />
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

 
  const mergedData = data?.merged
    ? [...data.merged].sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="min-h-screen pt-28 text-white flex justify-center py-8 px-4 font-sans relative overflow-hidden">
    
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9DE2E2] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9DE2E2] opacity-[0.03] blur-[120px]" />

      <div className="w-full max-w-md lg:max-w-6xl z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end px-6 mb-8 gap-4">
          <div className="text-left w-full">
            <div className="flex items-center gap-3 mb-1">
              <Zap size={24} fill={PRIMARY_COLOR} stroke={PRIMARY_COLOR} className="animate-pulse" />
              <h1 className="text-2xl  sm:text-4xl tracking-tighter font-black uppercase  leading-none">
                GlitchFame  <span style={{ color: PRIMARY_COLOR, marginLeft:3 }}> Leaders</span>
              </h1>
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">
              The Digital Elite • Updated Real-Time
            </p>
          </div>
        </div>

        
        <div className="mx-4 mb-10 bg-white/3 backdrop-blur-md rounded-3xl p-5 border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full relative"></div>
              </div>
              <div>
                <span className="text-xs md:text-lg font-black tracking-widest uppercase">
                  Live Global Feed
                </span>
                <div className="flex gap-3 text-[9px] text-gray-500 font-bold uppercase mt-0.5">
                  <span className="flex items-center gap-1">
                    <Activity size={10} /> 1.2k Viewing
                  </span>
                  <span className="hidden sm:inline">• Server: Asia-01</span>
                </div>
              </div>
            </div>
            <div className="flex items-center bg-black/40 rounded-full px-4 py-2 border border-white/5">
              <Flame size={18} style={{ color: PRIMARY_COLOR }} className="mr-2" />
              <span className="text-xs font-bold">TRENDING</span>
            </div>
          </div>
        </div>

        {/* Full Leaderboard List */}
        <div className="px-4 py-2 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3">
          {mergedData.map((item, index) => (
            <div key={item.participantId} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-[#9DE2E2]/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black w-5 text-gray-600 group-hover:text-[#9DE2E2] transition-colors">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="relative">
                 <img
  src={
    item.participantPhoto
      ? `${item.participantPhoto}?auto=compress&cs=tinysrgb`
      : "/avatar.png" 
  }
  srcSet={item.participantPhoto
      ? `${item.participantPhoto}?w=80&q=60 80w,
      ${item.participantPhoto}?w=120&q=70 120w,
      ${item.participantPhoto}?w=160&q=80 160w`
      : "/avatar.png"
  }
       sizes="(max-width: 640px) 48px, 56px"
       alt="participant"
       loading="lazy"
       decoding="async"
       className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border
        border-white/10 group-hover:border-[#9DE2E2]/50 transition-all"/>
        
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 shadow-lg">
                      <Star size={14} fill={index === 0 ? "#FBBF24" : PRIMARY_COLOR} stroke="none" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-lg font-bold uppercase tracking-tighter leading-tight">{item.participantName}</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{item.seasonName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-2xl font-black italic tracking-tighter group-hover:scale-110 transition-transform origin-right" style={{ color: "white" }}>
                  <Countup end={item.score} duration={1000} />
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div>
                  <span className="text-[10px] font-black text-red-500 uppercase italic">Live</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="text-center py-16">
          <div className="inline-block h-[1px] w-20 bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold">End of Rankings</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;