import React from "react";
import { Users, Clock, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeasonData = ({ season }) => {
  const navigate = useNavigate();
  console.log(season);
  return (
   <div className="py-12 px-4 md:py-20 bg-black text-white w-full">
  <div className="max-w-300 mx-auto">
    
    <div className="flex justify-between items-start mb-6 md:mb-14">
      <div className="space-y-1 sm:space-y-6">
        <h1 className="text-2xl md:home-h2 font-black uppercase tracking-tight flex items-center gap-3">
          Active competition
        </h1>
        <p className="text-xs md:small-text text-gray-400 max-w-xs">
          The gates are open. Step in now
        </p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row bg-[#1A1A23] border border-gray-800 rounded-sm overflow-hidden">
      {/* IMAGE SECTION: Height reduced for mobile */}
      <div className="relative w-full md:w-[40%] lg:w-[45%] xl:w-[473px] shrink-0">
        <div className="relative h-[180px] sm:h-[350px] md:h-[500px] w-full">
          <img
            src={season?.seasonPhotoUrl}
            alt={season?.seasonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-black/40" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex flex-col justify-end h-full">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 md:mb-3">
            Active Now
          </span>
          <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
            {season?.seasonName || "Coming Soon..."}
          </h3>
        </div>
      </div>

      {/* CONTENT SECTION: Reduced padding on mobile */}
      <div className="flex-1 p-5 md:p-10 flex flex-col justify-between">
        <div className="space-y-6 md:space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">
                Status
              </p>
              <p className="text-xs md:text-2xl font-bold text-white uppercase">
                Open Registration
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[9px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">
                Prize Pool
              </p>
              <p className="text-lg md:text-3xl font-black text-primary">
                {season?.prizeMoney || "$0.00"}
              </p>
            </div>
          </div>

          {/* Description: Hidden or clamped on mobile to save space */}
          <p className="text-xs md:text-lg text-gray-400 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
            {season?.seasonDesc}
          </p>

          {/* STATS GRID: 3 columns on mobile to prevent stacking */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 pt-4 md:pt-8 border-t border-gray-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1 md:gap-2 text-gray-500">
                <Users size={12} className="text-primary" />
                <span className="text-[8px] md:text-xs uppercase font-bold tracking-wider">Players</span>
              </div>
              <p className="text-xs md:text-xl font-bold">12.4k</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 md:gap-2 text-gray-500">
                <Clock size={12} className="text-primary" />
                <span className="text-[8px] md:text-xs uppercase font-bold tracking-wider">Ends</span>
              </div>
              <p className="text-xs md:text-xl font-bold text-primary">
                {season?.registrationEndDate ? 
                  new Date(season.registrationEndDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) 
                  : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 md:gap-2 text-gray-500">
                <Calendar size={12} className="text-primary" />
                <span className="text-[8px] md:text-xs uppercase font-bold tracking-wider">Date</span>
              </div>
              <p className="text-xs md:text-xl font-bold">
                {season?.registrationEndDate ? 
                  new Date(season.registrationEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) 
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* BUTTON: Slimmer on mobile */}
        <div className="flex gap-2 mt-6 md:mt-10">
          <button
            onClick={() => navigate(`/enter/${season?.id}`)}
            className="flex-1 bg-primary hover:bg-white transition-all duration-300 text-black font-black uppercase text-[10px] md:text-sm py-3 md:py-5 tracking-[0.2em] flex items-center justify-center gap-2 group"
          >
            Enter Now
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="bg-transparent border border-gray-700 px-4 hover:bg-gray-800 transition-colors hidden md:flex items-center justify-center">
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
