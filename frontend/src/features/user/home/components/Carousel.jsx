import { useEffect, useState } from "react";
import { useLiveUpcomingSeasons } from "../hooks";
import { Link } from "react-router-dom";

export default function FeaturedCarousel({season}) {

  console.log(season);

  const fallback =
    "https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg";

 

  return (
    <div className="w-full relative mt-6 md:mt-3 flex justify-center items-center max-w-400 mx-auto h-full md:h-[95dvh]">

      <section className="border border-gray-600 rounded-xl w-full max-w-90 md:max-w-screen md:w-280 h-62.5 md:h-160 relative overflow-hidden aspect-16\/9">
        <img
          src={`${season?.seasonPhotoUrl || fallback}?auto=compress&cs=tinysrgb&w=1600`}
          alt="event"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = fallback)}
        />
  <div className="absolute hidden md:flex inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <section className="absolute hidden md:flex  inset-0 flex-col items-center justify-center text-center text-white px-6">
          <span className="border border-purple-400 max-w-xs text-purple-300 text-xs px-4 py-1 rounded-full backdrop-blur bg-black/30">
            NEXT CHALLENGE ANNOUNCEMENT
          </span>

          <h1 className="uppercase mt-6 font-extrabold leading-tight max-w-xl text-6xl lg:text-7xl">
            THE{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {season?.seasonName}
            </span>
          </h1>

          {/* <h1 className="font-extrabold text-6xl lg:text-7xl">
            FRONTIER
          </h1> */}

          <p className="text-gray-300 mt-4 max-w-xl text-sm">
            {season?.seasonDesc}
          </p>

          <Link
            to={`/enter/${season?.seasonId}`}
            className="mt-6 bg-[#BE5EED] hover:opacity-90 transition text-black font-semibold px-6 py-3 rounded-full"
          >
            Register Now →
          </Link>

          <div className="flex items-center gap-8 mt-6 text-sm text-gray-300">
            <span>₹{season?.prizeMoney?.toLocaleString()}</span>
            <span>time left will come here</span>
          </div>
        </section>

        <section className="absolute sm:hidden bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <span className="border border-[#BE5EED] font-semibold text-[#BE5EED] text-[9px] px-2 py-0.5 w-fit">
            #FEATUREDCHALLENGE
          </span>

          <h1 className="font-extrabold text-2xl leading-tight mt-1">
            {season?.seasonName || "Upcoming Challenge"}
          </h1>

          <p className="text-gray-300 text-xs mt-1">
            Participate in this photography season and compete with others.
          </p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-[10px] text-gray-300">PRIZE POOL</p>
              <p className="text-lg font-bold">
                ₹{season?.prizeMoney?.toLocaleString() || "0"}
              </p>
            </div>

            <button className="bg-[#BE5EED] rounded-full px-5 py-2 text-xs font-semibold">
              JOIN CHALLENGE
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
