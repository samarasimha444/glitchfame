import React from "react";

const ChallengeDetail = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">

      <div className="w-full max-w-[1200px]">

        {/* HERO + MAIN SECTION */}
        <div className="flex flex-col md:flex-row">

          {/* HERO IMAGE */}
          <div className="relative md:w-1/2 h-[260px] md:h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              className="w-full h-full object-cover"
              alt="challenge"
            />

            <span className="absolute top-4 left-4 bg-red-500 text-xs px-3 py-1 rounded-full">
              LIVE NOW
            </span>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="md:w-1/2 px-5 md:px-10 py-6 space-y-5">

            {/* TAGS */}
            <div className="flex gap-2 text-xs text-gray-300">
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">
                Photography
              </span>
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">
                Cyberpunk
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-2xl md:text-4xl font-bold">
              NEON NIGHTS SEOUL
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm md:text-base text-gray-400">
              Capture the electric pulse of Seoul after midnight.
              Focus on high contrast, low light aesthetics,
              and the interaction between human tech and city life.
            </p>

            {/* PRIZE + ENTRIES */}
            <div className="flex gap-4">

              <div className="flex-1 bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-400">PRIZE POOL</p>
                <p className="text-lg md:text-xl font-bold">$2,500</p>
              </div>

              <div className="flex-1 bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-400">ENTRIES</p>
                <p className="text-lg md:text-xl font-bold">1.4K</p>
              </div>

            </div>

            <div className="space-y-2">

              <p className="text-sm text-gray-400">
                Time Remaining
              </p>

              <div className="flex gap-3">

                {["DAYS", "HRS", "MINS", "SECS"].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#0f0f0f] border border-gray-800 w-[70px] md:w-[80px] py-3 rounded-lg text-center"
                  >
                    <p className="text-lg font-bold">02</p>
                    <p className="text-xs text-gray-400">{item}</p>
                  </div>
                ))}

              </div>

            </div>

            {/* REGISTER BUTTON */}
            <button className="w-full md:w-fit bg-purple-600 px-8 py-3 rounded-lg font-semibold">
              Register Now
            </button>

          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 px-5 md:px-10">

          <div className="flex border-b border-gray-800 text-sm max-w-[600px]">

            <button className="flex-1 py-3 text-purple-500 border-b-2 border-purple-500">
              Details
            </button>

            <button className="flex-1 py-3 text-gray-400">
              Rules
            </button>

            <button className="flex-1 py-3 text-gray-400">
              Feed
            </button>

          </div>

        </div>

        {/* OVERVIEW */}
        <div className="px-5 md:px-10 py-6 max-w-[700px] space-y-4">

          <h2 className="text-lg font-semibold">
            ⚡ Challenge Overview
          </h2>

          <p className="text-gray-400 text-sm md:text-base">
            We are looking for the most evocative night photography from
            Seoul. Whether it’s neon lights of Gangnam or quiet alleys of
            Bukchon Hanok Village, capture the essence of the Sleepless City.
          </p>

          {/* RULE CARDS */}

          <div className="space-y-3">

            <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Original Work Only
              </p>
              <p className="text-xs text-gray-400">
                Submissions must be your own photography.
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Resolution
              </p>
              <p className="text-xs text-gray-400">
                Minimum 3000px on the longest side.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChallengeDetail;