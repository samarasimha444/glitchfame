import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiveUpcomingSeasons } from "../hooks";
import { isSeasonLive } from "../../../../lib/helper";



const Cards = () => {

  const navigate = useNavigate()

   const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();

  if (isLoading) return <p>Loading seasons...</p>;

  
  const liveSeasons = seasons.filter(isSeasonLive);
  console.log(liveSeasons)

  return (

    <div className="w-full max-w-screen mx-auto px-4 sm:px-6 md:px-10 lg:px-20">

     
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
        className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-full"
      />
    </div>

    <button className="px-4 py-2 border border-[#1E232B] rounded-lg text-sm text-white hover:bg-[#111418] transition">
      LATEST
    </button>

  </section>

</div>
        
      </section>

     
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">

        {liveSeasons?.map((item) => (
          
          <Link to={`/arena/${item.seasonId}`} onClick={()=>navigate("/arena")}
            key={item.seasonsId}
            className="bg-[#181B20] rounded-lg  overflow-hidden border border-[#232A33] hover:border-purple-500 transition duration-300"
          >
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.cW0wzJYojHH-xxW35Wj7dQHaHa?pid=Api&P=0&h=180"
              alt={item.seasonName}
              className="w-full h-[25vh] sm:h-72 object-cover"
            />

            <div className="flex flex-col justify-between  p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-white text-[18px] font-semibold md:text-sm sm:text-base">
                  {item.seasonName}
                </h4>
                <span className="text-[#BE5EED] hidden sm:flex text-sm font-medium">
                  {item.prizeMoney}
                </span>
              </div>

              <div className="flex gap-4 text-gray-400 text-xs sm:text-sm">
                <span>{item.votes} votes</span>
                <span className="text-orange-300">{item.timeLeft} 20left</span>
              </div>
            </div>

            <button className="w-full md:hidden  bg-black py-3 mb-2 border-gray-600 border">View Details</button>

          </Link>
        ))}
      </section>

      
    </div>
  );
};

export default Cards;