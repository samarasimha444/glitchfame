import React, { useEffect, useRef, useState } from "react";
import { useLeaderboard } from "../arena/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { createLeaderboardSocket } from "../../../lib/stompLeaderBoard";
import { buildLeaderboard } from "../../../lib/helper";

const Leaderboard = () => {

  const { data: users, isLoading, error } = useLeaderboard();
  const queryClient = useQueryClient();

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    if (!users || users.length === 0) return;
    if (clientRef.current) return;

    const client = createLeaderboardSocket({
      users,
      queryClient,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false)
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };

  }, [users, queryClient]);

  if (isLoading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error loading leaderboard</p>;

  const leaderboard = buildLeaderboard(users);

  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  return (

    <div className="w-full min-h-screen bg-black flex justify-center py-10">
      

      <div className="w-full max-w-6xl bg-black text-white rounded-xl shadow-2xl overflow-hidden">

        <div className="text-center text-xs py-2 text-gray-500 border-b border-gray-800">
          WebSocket {connected ? "🟢 Live" : "🔴 Offline"}
        </div>

        <div className="flex justify-center md:justify-between items-end px-6 pt-10 pb-10 md:gap-6">

          {second && (
            <div className="flex flex-col items-center text-center">
              <img src={second.img} className="w-20 h-20 object-cover  rounded-full border-4 border-gray-300"/>
              <p className="mt-2">{second.name}</p>
              <p>{second.score}</p>
            </div>
          )}

          {first && (
            <div className="flex flex-col items-center text-center px-5 py-5 rounded-xl -mt-12 ">
              <span className="text-yellow-400 text-3xl">👑</span>
              <img src={first.img} className="w-24 h-24 object-cover rounded-full border-4 border-yellow-400 mt-2"/>
              <p className="mt-2 font-semibold">{first.name}</p>
              <p className="text-yellow-300 font-semibold">{first.score}</p>
            </div>
          )}

          {third && (
            <div className="flex flex-col items-center text-center">
              <img src={third.img} className="w-20 h-20 object-cover rounded-full border-4 border-gray-400"/>
              <p className="mt-2">{third.name}</p>
              <p>{third.score}</p>
            </div>
          )}

        </div>

        <div className="px-4 md:px-8 pb-8 space-y-3">

          <AnimatePresence>

          {leaderboard.slice(3).map(player => (

            <motion.div
              key={player.id}
              layout
              initial={{opacity:0,y:40}}
              animate={{opacity:1,y:0}}
              exit={{opacity:0}}
              transition={{type:"spring",stiffness:500,damping:40}}
              className="flex items-center justify-between bg-[#111] hover:bg-[#1a1a1a] rounded-lg px-4 py-3"
            >

              <div className="flex items-center gap-4">

                <span className="text-gray-400 w-6">
                  #{player.rank}
                </span>

                <img
                  src={player.img}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <p>{player.name}</p>

              </div>

              <p className="font-semibold">
                {player.score}
              </p>

            </motion.div>

          ))}

          </AnimatePresence>

        </div>

      </div>

    </div>

  );
};

export default Leaderboard;