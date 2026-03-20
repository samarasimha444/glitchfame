import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";
import { getTimeLeft } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";





const seasons = [
  {
    seasonId: "1",
    seasonName: "Marco 'Pixel' Rossi",
    seasonPhotoUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    category: "Digital Art",
    views: "12.4K",
    votingEndDate: "2026-03-25T23:59:59",
  },
  {
    seasonId: "2",
    seasonName: "Sarah J. Bloom",
    seasonPhotoUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
    category: "Vocalist",
    views: "9.8K",
    votingEndDate: "2026-03-22T18:00:00",
  }
];
const Cards = ({ liveSeason,isLoading }) => {
  console.log(liveSeason)
  const navigate = useNavigate();

   return (
    <div className="w-full  max-w-screen mx-auto  sm:px-6 md:px-10 lg:px-20">

      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <ShimmerCard />
          <ShimmerCard />
        </section>
      ) : seasons.length === 0 ? (

        <div className="w-full text-center py-20 text-gray-400 text-xl">
          No live seasons found.
        </div>

      ) : (

        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

          {liveSeason?.map((item) => (
            <Link
              to={`/vote/${item.seasonId}`}
              key={item.seasonId}
              className="w-full h-[278px] md:max-w-[340px] md:h-[400px] bg-[#181B20] rounded-2xl overflow-hidden border border-[#364354] hover:border-white transition duration-300 flex flex-col"
            >

              
              <div className="relative">

                <img
                 src={`${item.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=600`}
                  alt={item.seasonName}
                   loading="lazy"
                  decoding="async"
                  className=" h-[163px] md:h-[300px] w-full object-cover"
                />

                <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-medium">
                  ● LIVE
                </span>
              </div>

             
              <div className="flex flex-col justify-between flex-1 p-4">

                <div>
                  <p className="text-[11px] text-primary uppercase tracking-wide">
                    {item.category}
                  </p>

                <h3 className="text-white text-[14px] font-semibold mt-1 leading-snug line-clamp-2 min-h-[42px]">
                    {item.seasonName}
                  </h3>
                </div>

               

              
                <div className="flex justify-between items-center text-xs  text-gray-400">
                  <p className="flex items-center gap-1">
                    <Timer size={14} />
                    <span>{getTimeLeft(item.votingEndDate)}</span>
                  </p>

                  <span className="text-primary font-medium cursor-pointer">
                    Vote
                  </span>
                </div>

              </div>
            </Link>
          ))}

        </section>
      )}
    </div>
  );
};

export default Cards;