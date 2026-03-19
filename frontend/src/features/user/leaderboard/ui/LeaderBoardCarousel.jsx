import React from "react";

const LeaderboardLoading = () => {
  return (
    <div className="min-h-screen text-white w-full py-4 px-2 sm:px-6">
      
      {/* CONTAINER */}
      <div className="w-full sm:max-w-6xl sm:mx-auto rounded-[20px] sm:rounded-[40px] overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 pt-8 pb-4">
          <div className="text-center w-full">
            <div className="h-4 w-40 mx-auto bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* LIVE BOX */}
        <div className="mx-2 sm:mx-4 bg-[#1C2128] rounded-2xl p-4 border border-[#2D333B] animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <div className="h-3 w-24 bg-gray-600 rounded" />
            </div>
            <div className="h-3 w-16 bg-gray-600 rounded" />
          </div>

          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-gray-600 rounded" />
            <div className="w-5 h-5 bg-gray-600 rounded" />
          </div>
        </div>

        {/* LIST */}
        <div className="px-2 sm:px-4 py-2 space-y-2">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-[#111] animate-pulse"
            >
              <div className="flex items-center gap-4">
                
                {/* rank */}
                <div className="w-4 h-3 bg-gray-600 rounded" />

                {/* avatar */}
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-700 rounded-full" />

                {/* name + season */}
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-600 rounded" />
                  <div className="h-2 w-16 bg-gray-700 rounded" />
                </div>
              </div>

              {/* votes */}
              <div className="text-right space-y-2">
                <div className="h-3 w-10 bg-gray-600 rounded ml-auto" />
                <div className="h-2 w-8 bg-gray-700 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LeaderboardLoading;