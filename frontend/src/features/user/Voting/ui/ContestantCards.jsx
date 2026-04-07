import { ExternalLink } from 'lucide-react';
import React from "react";
import { useNavigate } from "react-router-dom";

export const ContestantCard = React.memo(({ user }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/details/${user.participationId}`)}
      className="group relative w-full cursor-pointer rounded-t-xl overflow-hidden bg-[#1a1a1a] transition-all duration-300 h-64 sm:h-[400px] transform-gpu will-change-transform"
    >
     
      {/* Icon */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black/40 md:backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/20">
        <ExternalLink size={12} className="text-white sm:w-[14px]" />
      </div>

      {/* Image */}
      <picture className="w-full h-full">
        
        {/* Mobile */}
        <source
          media="(max-width: 640px)"
          srcSet="https://res.cloudinary.com/dw3ymazvl/image/upload/f_webp,q_auto:low,w_300/v1760368348/threesix/jeep7.webp"
          type="image/webp"
        />

        {/* Tablet */}
        <source
          media="(max-width: 1024px)"
          srcSet="https://res.cloudinary.com/dw3ymazvl/image/upload/f_webp,q_auto:good,w_600/v1760368348/threesix/jeep7.webp"
          type="image/webp"
        />

        {/* Desktop */}
        <source
          media="(min-width: 1025px)"
          srcSet="https://res.cloudinary.com/dw3ymazvl/image/upload/f_webp,q_auto:good,w_1000/v1760368348/threesix/jeep7.webp"
          type="image/webp"
        />

        {/* Fallback */}
        <img
          src="https://res.cloudinary.com/dw3ymazvl/image/upload/q_auto,w_600/v1760368348/threesix/jeep7.webp"
          alt={user?.name || "participant"}
          className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </picture>
   
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black md:via-black/20 to-transparent" />

      {/* Info */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <h3 className="text-[14px] sm:text-[18px] font-bold uppercase tracking-tight text-white truncate">
          {user.name || user.participantName}
        </h3>

        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 md:animate-pulse" />
            <span className="text-[9px] sm:text-[11px] font-bold text-white">
              {user.score?.toLocaleString() || "0"} VOTES
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.user.participationId === nextProps.user.participationId &&
    prevProps.user.score === nextProps.user.score
  );
});