import { Heart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ContestantCard = React.memo(({ user }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/details/${user.participationId}`)}
      
      className="group relative w-full cursor-pointer rounded-t-xl overflow-hidden bg-[#1a1a1a] transition-all duration-300 h-64  sm:h-[400px]"
    >
      {/* Heart Badge */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black/40 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/20">
        <Heart size={12} className="text-white sm:w-[14px]" />
      </div>

      {/* <img
        src={user?.image || user?.participantPhotoUr} // Support your dummy data keys
        alt={user?.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      /> */}

     <img
  src="https://tse1.mm.bing.net/th/id/OIP.Ra3Tj-w8J2fSEzmI-rDIogHaHa?pid=Api&P=0&h=180"
  alt={user?.name}
  loading="lazy"               
  decoding="async"             
  width={200}                  
  height={200}
  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
/>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <h3 className="text-[14px] sm:text-[18px] font-bold uppercase tracking-tight text-white truncate">
          {user.name || user.participantName}
        </h3>
        
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[9px] sm:text-[11px] font-bold text-white">
              {user.score?.toLocaleString() || "0"} VOTES
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});