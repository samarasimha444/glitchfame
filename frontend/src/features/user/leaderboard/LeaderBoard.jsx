import React from "react";

const leaderboard = [
  { id: 1, name: "Harold Rhodes", score: 2300, img: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: 2, name: "Phyllis Woods", score: 2127, img: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 3, name: "Frank Guy", score: 1982, img: "https://randomuser.me/api/portraits/men/31.jpg" },
  { id: 4, name: "Connie Gregg", score: 1943, img: "https://randomuser.me/api/portraits/women/41.jpg" },
  { id: 5, name: "Alex Woods", score: 1884, img: "https://randomuser.me/api/portraits/men/51.jpg" },
];

const Leaderboard = () => {
  return (
    <div className="w-full min-h-screen bg-black  flex justify-center py-10">

      <div className="w-full max-w-6xl bg-black text-white rounded-xl shadow-2xl overflow-hidden">

        
        <div className="flex items-center justify-between px-6 py-5 md:hidden border-b border-gray-800">
          <span className="text-xl cursor-pointer">←</span>
          <h2 className="font-semibold text-lg md:text-3xl">Leaderboard</h2>
          <span></span>
        </div>

  
        <div className="flex justify-center md:justify-between items-end px-6 pt-10 pb-10 gap-6">

         
          <div className="flex flex-col items-center text-center">
            <img
              src={leaderboard[1]?.img}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300"
            />
            <p className="mt-2 text-sm md:text-base">{leaderboard[1]?.name}</p>
            <p className="text-gray-300">{leaderboard[1]?.score}</p>
          </div>

          <div className="flex flex-col items-center text-center px-5 py-5 rounded-xl shadow-lg -mt-8 bg-[#111]">
            <span className="text-yellow-400 text-3xl">👑</span>

            <img
              src={leaderboard[0]?.img}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 mt-2"
            />

            <p className="mt-2 font-semibold text-base md:text-lg">
              {leaderboard[0]?.name}
            </p>

            <p className="text-yellow-300 font-semibold">
              {leaderboard[0]?.score}
            </p>
          </div>

        
          <div className="flex flex-col items-center text-center">
            <img
              src={leaderboard[2]?.img}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-400"
            />
            <p className="mt-2 text-sm md:text-base">{leaderboard[2]?.name}</p>
            <p className="text-gray-300">{leaderboard[2]?.score}</p>
          </div>

        </div>

        <div className="px-4 md:px-8 pb-8 space-y-3">

          {leaderboard.slice(3).map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-[#111] hover:bg-[#1a1a1a] transition rounded-lg px-4 py-3"
            >

              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-6">
                  {index + 4}
                </span>

                <img
                  src={player.img}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />

                <p className="text-sm md:text-base">
                  {player.name}
                </p>
              </div>

              <p className="font-semibold text-sm md:text-base">
                {player.score}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Leaderboard;