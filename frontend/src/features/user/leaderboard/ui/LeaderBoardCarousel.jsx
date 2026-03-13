import React from "react";

const LeaderboardLoading = () => {
  return (
    <div className="w-full min-h-screen bg-black sm:bg-[#181B20] flex justify-center py-10">
      <div className="w-full max-w-6xl bg-black text-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-center text-xs py-2 text-gray-500 border-b border-gray-800">
        🟢 Live
        </div>

        {/* Top 3 podium */}
        <div className="flex justify-center md:justify-between items-end px-6 pt-10 pb-10 md:gap-6">
          {/* Second */}
          <div className="flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 bg-gray-700 rounded-full border-4 border-gray-600" />
            <div className="h-4 w-16 bg-gray-700 rounded mt-2" />
            <div className="h-4 w-10 bg-gray-600 rounded mt-1" />
          </div>

          {/* First */}
          <div className="flex flex-col items-center text-center px-5 py-5 rounded-xl -mt-12 animate-pulse">
            <span className="text-yellow-400 text-3xl">👑</span>
            <div className="w-24 h-24 bg-gray-700 rounded-full border-4 border-yellow-400 mt-2" />
            <div className="h-4 w-20 bg-gray-700 rounded mt-2" />
            <div className="h-4 w-12 bg-yellow-600 rounded mt-1" />
          </div>

          {/* Third */}
          <div className="flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 bg-gray-700 rounded-full border-4 border-gray-600" />
            <div className="h-4 w-16 bg-gray-700 rounded mt-2" />
            <div className="h-4 w-10 bg-gray-600 rounded mt-1" />
          </div>
        </div>

        {/* Rest of the list */}
        <div className="px-4 md:px-8 pb-8 space-y-3">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#111] rounded-lg px-4 py-3 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-6 h-4 bg-gray-600 rounded" />
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                <div className="h-4 w-24 bg-gray-600 rounded" />
              </div>
              <div className="h-4 w-10 bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardLoading;