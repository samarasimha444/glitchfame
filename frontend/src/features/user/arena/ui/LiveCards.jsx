import React from "react";

import { Trophy, Users, Clock } from "lucide-react";
import { useLiveUpcomingSeasons } from "../../home/hooks";
import { getTimeLeft } from "../../../../lib/helper";
import { Link } from "react-router-dom";

const LiveCards = ({seasons}) => {
 

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">

      {seasons?.map((e, idx) => (
        <Link to={`/vote/${e.seasonId}`}
          key={idx}
          className="
      w-42.75 h-52.75 
      md:w-full md:h-75
      bg-[#111418] border border-[#1E232B]
      rounded-2xl p-4 text-white flex flex-col relative justify-between
      hover:border-purple-500 transition-all
      "
        >
          <div>
            <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">
              fame
            </span>

          <span className="absolute  right-3 top-7  w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>


            <h3 className="mt-1 text-[15px] md:text-[16px] font-semibold leading-tight">
              {e.seasonName}
            </h3>

            <div className="border-b border-[#262B33] my-2"></div>

            <div className="space-y-1 text-[11px] md:text-[12px] text-gray-300">
              <div className="flex items-center gap-2">
                <Trophy size={12} />
                {e.prizeMoney} USD
              </div>

              <div className="flex items-center gap-2">
                <Users size={12} />
                423 Entries
              </div>

              <div className="flex items-center gap-2 text-red-400">
                <Clock size={12} />
                {getTimeLeft(e.votingEndDate)}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 tracking-widest">
            LIVE NOW
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LiveCards;
