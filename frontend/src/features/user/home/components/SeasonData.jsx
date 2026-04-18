import React from "react";
import { Users, Clock, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeasonData = ({ season }) => {
  const navigate = useNavigate();
  console.log(season);
  return (
    <div className=" py-6 px-4 md:py-20 sm:bg-black  text-white w-full ">
      <div className="max-w-300 mx-auto">

          <div className="flex justify-between items-start mb-10 sm:mb-14">
    <div className="space-y-4 sm:space-y-6">
      <h1 className="mobile-h2 md:home-h2 mt-1 flex items-center gap-3">
       Active competition

      </h1>
      <p className="small-text max-w-xs">
      The gates are open. Step in now
      </p>
    </div>
  </div>

        <div className="flex flex-col md:flex-row bg-[#1A1A23] border border-gray-800 rounded-sm overflow-hidden ">
          <div className="relative w-full md:w-[40%] lg:w-[45%] xl:w-[473px] shrink-0">
            <div className="relative h-[240px] sm:h-[350px] md:h-[500px] w-full">
              <img
                src={season?.seasonPhotoUrl}
                alt={season?.seasonName}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-black/40" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex flex-col justify-end h-full">
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
                Live Now
              </span>
              <h3 className="text-2xl md:text-2xl font-black uppercase  tracking-tighter">
                {season?.seasonName || "Coming Soon..."}
              </h3>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
            <div className="sm:space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">
                    Tournament Status
                  </p>
                  <p className="text-[14px] md:text-2xl font-bold text-white">
                    Open Registration
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">
                    Prize Pool
                  </p>
                  <p className="text-[16px] md:text-3xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
                    {season?.prizeMoney || "$0.00"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm md:text-lg text-gray-400 leading-relaxed max-w-2xl">
                {season?.seasonDesc}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-gray-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users size={16} className="text-primary" />
                    <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">
                      Total Players
                    </span>
                  </div>
                  <p className="text-sm md:text-xl font-bold">12,482</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} className="text-primary" />
                    <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">
                      Ends Time
                    </span>
                  </div>
                  <p className="text-sm md:text-xl font-bold text-primary sm:animate-pulse">
                    {season?.registrationEndDate ?
                      new Date(season.registrationEndDate).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : "N/A"}
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-1 border-t border-gray-800 md:border-0 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">
                      End Date
                    </span>
                  </div>
                  <p className="text-sm md:text-xl font-bold">
                    {season?.registrationEndDate ?
                      new Date(season.registrationEndDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-10">
              <button
                onClick={() => navigate(`/enter/${season?.id}`)}
                className="flex-1 bg-primary hover:bg-white transition-all duration-300 text-black font-black uppercase text-xs md:text-sm py-4 md:py-5 tracking-[0.2em] flex items-center justify-center gap-2 group"
              >
                Enter Season Now
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="bg-transparent border border-gray-700 px-6 hover:bg-gray-800 transition-colors hidden md:inline flex items-center justify-center">
                <ArrowUpRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonData;
