import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiveUpcomingSeasons } from "../hooks";
import { Timer } from "lucide-react";
import { isSeasonLive } from "../../../../lib/helper";
import { getTimeLeft } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";


const liveSeasons =[
  {
    "seasonId": 1,
    "seasonName": "Summer Battle 2026",
    "seasonPhotoUrl": "https://images.pexels.com/photos/7005759/pexels-photo-7005759.jpeg",
    "prizeMoney": "$10,000",
    "votingEndDate": "2026-03-15T18:00:00Z",
    "timeLeft": "6d 12h"
  },
  {
    "seasonId": 2,
    "seasonName": "Winter Clash 2026",
    "seasonPhotoUrl": "https://images.pexels.com/photos/13923711/pexels-photo-13923711.jpeg",
    "prizeMoney": "$7,500",
    "votingEndDate": "2026-03-20T20:00:00Z",
    "timeLeft": "11d 14h"
  },
  {
    "seasonId": 3,
    "seasonName": "Spring Showdown 2026",
    "seasonPhotoUrl": "https://images.pexels.com/photos/6632526/pexels-photo-6632526.jpeg",
    "prizeMoney": "$12,000",
    "votingEndDate": "2026-03-25T22:00:00Z",
    "timeLeft": "16d 16h"
  },
  {
    "seasonId": 4,
    "seasonName": "Autumn Arena 2026",
    "seasonPhotoUrl": "https://images.pexels.com/photos/6806082/pexels-photo-6806082.jpeg",
    "prizeMoney": "$5,000",
    "votingEndDate": "2026-03-18T15:00:00Z",
    "timeLeft": "9d 9h"
  }
]


const Cards = () => {

  const navigate = useNavigate();

const [isLoading, setIsLoading] = useState(false);

  // const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();



  // const liveSeasons = seasons.filter(isSeasonLive);
  // console.log(liveSeasons);

  return (
     <>
    <div className="w-full max-w-screen mx-auto px-4 sm:px-6 md:px-10 lg:px-20">

      {/* Header */}
      <section className="w-full py-12 md:py-16">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-3 w-full">
            <p className="text-white text-xl md:text-[#BE5EED] md:text-[12px] md:tracking-widest font-semibold uppercase">
              Active Feed
            </p>
            <h2 className="text-4xl hidden md:flex md:text-5xl font-extrabold text-white tracking-tight">
              THE FEED
            </h2>
          </div>

          <section className="hidden md:flex mt-10 items-center gap-3">
            <div className="flex items-center bg-[#0F141B] border border-[#1E232B] rounded-lg px-4 py-2 w-[300px]">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Find your vibe..."
                className="bg-transparent outline-none py-1 text-sm text-white placeholder-gray-500 w-full"
              />
            </div>

            <button className="px-4 py-3 border border-[#1E232B] rounded-lg text-sm text-white hover:bg-[#111418] transition">
              LATEST
            </button>
          </section>
        </div>
      </section>

      {isLoading ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          <ShimmerCard />
          <ShimmerCard />
        </section>
      ) : liveSeasons.length === 0 ? (
        <div className="w-full text-center py-20 text-gray-400 text-xl">
          No live seasons found.
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          {liveSeasons.map((item) => (
            <Link
              to={`/arena/${item.seasonId}`}
              onClick={() => navigate("/arena")}
              key={item.seasonsId}
              className="bg-[#181B20] rounded-lg md:w-[374px] md:h-[403px] overflow-hidden border border-[#282e36] hover:border-purple-500 transition duration-300"
            >
              <img
                src={item.seasonPhotoUrl}
                alt={item.seasonName}
                className="w-full h-[25vh] sm:h-72 object-cover"
              />

              <div className="flex flex-col justify-between space-y-3">
                <div className="flex justify-between sm:py-5 px-3 items-center">
                  <h4 className="text-white text-[18px] font-semibold md:text-[19px] sm:text-base">
                    {item.seasonName}
                  </h4>
                  <span className="text-[#BE5EED] hidden sm:flex text-sm font-medium">
                    {item.prizeMoney}
                  </span>
                </div>

                <div className="flex gap-4 sm:bg-[#1D2127] text-center sm:py-2 h-full text-gray-400 text-xs sm:text-sm">
                  <p className="flex pl-3 space-x-2 text-center text-xs items-center">
                    <Timer size={15} /> <span>{getTimeLeft(item.votingEndDate)}</span>
                  </p>
                  <span className="text-orange-300 text-xs">{item.timeLeft}</span>
                </div>
              </div>

              <button className="w-full md:hidden bg-black py-3 mb-1 border-gray-600 border">
                View Details
              </button>
            </Link>
          ))}
        </section>
      )}
    </div>
      </>
  );
};

export default Cards;