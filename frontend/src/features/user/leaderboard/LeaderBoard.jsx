import React from "react";
import { Trophy, Flame } from "lucide-react";
import { PodiumCard } from "./ui/PodiumCard";

const leaderboardData = [
  { rank: 4, name: "Luna Spark", score: "782.1K", change: "+12" },
  { rank: 5, name: "Void Walker", score: "740.5K", change: "+8" },
  { rank: 6, name: "Neon Nexus", score: "690.2K", change: "+5" },
  { rank: 7, name: "Ghost Pro", score: "650.0K", change: "+3" },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-6 md:px-20 py-16">


      <section className="flex flex-col md:flex-row justify-center items-end gap-8 mb-20">

        <PodiumCard position="2nd" name="Luna Spark" score="842.5K" />
        <PodiumCard position="1st" name="Xander Glitch" score="1.2M" large />
        <PodiumCard position="3rd" name="Void Walker" score="790.1K" />

      </section>

      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-wide">
            RANKED FEED
          </h2>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#11161D] border border-[#1F2A35] rounded-lg text-sm">
              Showing 1–50
            </button>
            <button className="px-4 py-2 bg-[#0E1C23] text-cyan-400 rounded-lg text-sm">
              Verified Only
            </button>
          </div>
        </div>

        <div className="bg-[#11161D] border border-[#1F2A35] rounded-2xl overflow-hidden">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className="flex justify-between items-center px-6 py-4 border-b border-[#1F2A35] hover:bg-[#151C24] transition"
            >
              <div className="flex items-center gap-6">
                <span className="text-gray-400 w-6">
                  #{player.rank}
                </span>
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-xs text-gray-500">
                    Votes Aggregated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <span className="font-semibold">
                  {player.score}
                </span>

                <span className="text-green-400 text-sm flex items-center gap-1">
                  <Flame size={14} />
                  {player.change}
                </span>

                <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition">
                  Boost
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Leaderboard;