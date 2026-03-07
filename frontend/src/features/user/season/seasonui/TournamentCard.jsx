import React from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { useLiveUpcomingSeasons } from "../../home/hooks";




const TournamentCard = () => {

   const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();
   console.log(seasons)
    const navigate = useNavigate()

    const now = new Date();

   const activeRegistrations = seasons.filter((season) => {
   return new Date(season.registrationEndDate) > now;
});

   console.log(activeRegistrations)


return (
 <div className="flex flex-col px-4 sm:px-10 lg:px-20 py-10 w-full">

  <section className="flex w-full flex-wrap gap-6 justify-center sm:justify-between">

    {activeRegistrations.map((item, index) => (

      <article
        key={index}
        className="w-full sm:w-[48%] lg:max-w-95 bg-[#111418] border border-[#1E232B] 
        rounded-2xl overflow-hidden flex flex-col justify-between"
      >

        <Link to="/details" className="relative w-full">

          <img
            src="https://tse3.mm.bing.net/th/id/OIP.NC_e6GoCMQHiKWKltN8V2wHaEK?pid=Api&P=0&h=180"
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
