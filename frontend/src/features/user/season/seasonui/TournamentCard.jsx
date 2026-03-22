
import { Link, useNavigate } from "react-router-dom";
import { useLiveUpcomingSeasons } from "../../home/hooks";
import ShimmerCard from "../../../../components/ShimmerCard";
import { isRegistrationOpen } from "../../../../lib/helper";
import { MousePointerClick } from "lucide-react";

const TournamentCard = () => {
  const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();
 console.log(seasons)
  const navigate = useNavigate();

  const activeRegistrations = seasons?.content?.filter(isRegistrationOpen);

  return (
    <div className="flex flex-col px-4 sm:px-10 lg:px-20 py-10 w-full">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-6 w-full ">
        {isLoading ?
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full flex justify-center"
            >
              <ShimmerCard />
            </div>
          ))
        : activeRegistrations?.map((item, index) => (
            <article
              key={index}
              className="w-full sm:w-full lg:max-w-100 bg-[#111418] border border-[#1E232B] 
             rounded-2xl overflow-hidden flex flex-col justify-between shadow-md"
            >
              <Link
                to={`/enter/${item.seasonId}`}
                className="relative w-full block"
              >
                <div className="w-full h-36 sm:h-52 lg:h-60 overflow-hidden rounded-lg">
                  <img
                    src={item.seasonPhotoUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                  <span className="bg-primary text-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                    FEATURED
                  </span>

                  <span className="bg-black/70 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                    GlitchFame
                  </span>
                </div>
              </Link>

              <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-white uppercase font-semibold text-sm sm:text-base leading-tight">
                    {item.seasonName}
                  </h3>

                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">
                      Prize Pool
                    </p>
                    <p className="text-pink font-bold text-base sm:text-lg">
                      ₹{item.prizeMoney}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-[12px] sm:text-sm leading-snug line-clamp-3">
                  {item.seasonDesc}
                </p>

                <div className="border-t border-[#232A33]" />

                <div className="flex justify-between text-[10px] sm:text-xs">
                  <div>
                    <p className="text-gray-500 uppercase">Deadline</p>
                    <p className="text-white font-medium text-[12px] sm:text-sm">
                      {new Date(item.registrationEndDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 uppercase">Starts</p>
                    <p className="text-white font-medium text-[12px] sm:text-sm">
                      {new Date(item.registrationEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/enter/${item.seasonId}`)}
                  className="mt-3 w-full cursor-pointer sm:w-auto sm:max-w-45 py-2 sm:py-3 px-3 sm:px-5 rounded-xl 
                 bg-primary
                 font-semibold tracking-wide flex items-center justify-center gap-2
                 text-black text-[13px] sm:text-sm hover:opacity-90 transition"
                >
                  REGISTER NOW
                  <MousePointerClick size={18} />
                </button>
              </div>
            </article>
          ))
        }
      </section>
    </div>
  );
};

export default TournamentCard;
