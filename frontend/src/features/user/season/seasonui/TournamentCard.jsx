import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { useLiveUpcomingSeasons } from "../../home/hooks";
import ShimmerCard from "../../../../components/ShimmerCard";


const activeRegistrations = [
  {
    seasonId: 1,
    seasonName: "Champions Arena",
    registrationStartDate: "2026-03-01",
    registrationEndDate: "2026-03-15",
    prizeMoney: 5000,
    featured: true,             // corresponds to FEATURED badge
    category: "FPS Tactical",    // corresponds to FPS Tactical badge
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Moles!", 
    imageUrl: "https://images.pexels.com/photos/416911/pexels-photo-416911.jpeg"
  },
  {
    seasonId: 2,
    seasonName: "Battle Royale Masters",
    registrationStartDate: "2026-03-05",
    registrationEndDate: "2026-03-20",
    prizeMoney: 8000,
    featured: false,
    category: "FPS Tactical",
    description: "Join the ultimate FPS tactical showdown and win big prizes!",
    imageUrl: "https://images.pexels.com/photos/3583571/pexels-photo-3583571.jpeg"
  },
  {
    seasonId: 3,
    seasonName: "Sniper Elite League",
    registrationStartDate: "2026-03-10",
    registrationEndDate: "2026-03-25",
    prizeMoney: 10000,
    featured: true,
    category: "FPS Tactical",
    description: "Test your aiming skills in the sniper elite league.",
    imageUrl: "https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg"
  }
];

const TournamentCard = () => {
const [isLoading,setIsLoading]= useState()
//    const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();
//    console.log(seasons)
    const navigate = useNavigate()

//     const now = new Date();

//    const activeRegistrations = seasons.filter((season) => {
//    return new Date(season.registrationEndDate) > now;
// });

//    console.log(activeRegistrations)


return (
 <div className="flex flex-col px-4 sm:px-10 lg:px-20 py-10 w-full">

  <section className="flex w-full flex-wrap gap-6 justify-center sm:justify-between">

    {
    isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-full sm:w-[48%] lg:max-w-95 flex justify-center">
                <ShimmerCard />
              </div>
            ))

    :activeRegistrations.map((item, index) => (

      <article
        key={index}
        className="w-full sm:w-[48%] lg:max-w-95 bg-[#111418] border border-[#1E232B] 
        rounded-2xl overflow-hidden flex flex-col justify-between"
      >

        <Link to="/details" className="relative w-full">

          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-[150px] sm:h-[220px] object-cover"
          />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              FEATURED
            </span>

            <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
              FPS Tactical
            </span>
          </div>
        </Link>

        <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">

          <div className="flex justify-between items-start gap-4">
            <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
              {item.seasonName}
            </h3>

            <div className="text-right shrink-0">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Prize Pool
              </p>

              <p className="text-[#39FFB6] font-bold text-lg">
                ${item.prizeMoney}
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Moles!
          </p>

          <div className="border-t border-[#232A33]" />

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase">Deadline</p>
              <p className="text-white font-medium">
                {item.registrationEndDate}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase">Starts</p>
              <p className="text-white font-medium">
                {item.registrationStartDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/enter/${item.seasonId}`)}
            className="mt-4 w-full sm:w-auto sm:max-w-[170px] py-3 rounded-xl 
            bg-gradient-to-r from-purple-500 to-purple-500 
            font-semibold tracking-wide text-black text-[14px]
            hover:opacity-90 transition"
          >
            REGISTER NOW ⚡
          </button>

        </div>
      </article>

    ))}
  </section>
</div>
);
};

export default TournamentCard;
