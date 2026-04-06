import { ExternalLink } from 'lucide-react';
import React from "react";
import { useNavigate } from "react-router-dom";

export const ContestantCard = React.memo(({ user }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/details/${user.participationId}`)}
      className="group relative w-full cursor-pointer rounded-t-xl overflow-hidden bg-[#1a1a1a] transition-all duration-300 h-64 sm:h-[400px]"
    >
      {/* External link icon */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black/40 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/20">
        <ExternalLink size={12} className="text-white sm:w-[14px]" />
      </div>

      {/* Participant Image */}
      <img
        src={
          user?.participantPhotoUrl
            ? `${user.participantPhotoUrl}?w=300&q=70`
            : "https://tse1.mm.bing.net/th/id/OIP.brYCf8YXK2he0a35bkydtwHaJ4?pid=Api&P=0&h=180"
        }
        srcSet={
          user?.participantPhotoUrl
            ? `
              ${user.participantPhotoUrl}?w=150&q=60 150w,
              ${user.participantPhotoUrl}?w=300&q=70 300w,
              ${user.participantPhotoUrl}?w=600&q=80 600w
            `
            : undefined
        }
        sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
        alt={user?.name || "participant"}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-110"
        style={{
          transform: "scale(1.05)",
          filter: "none",
        }}
        onLoad={(e) => {
          // optional fade-in effect without blur
          e.currentTarget.style.transition = "transform 0.5s ease, opacity 0.5s ease";
          e.currentTarget.style.opacity = "1";
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Info box */}
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
}, (prevProps, nextProps) => {
  // Only re-render if score or user changes
  return (
    prevProps.user.participationId === nextProps.user.participationId &&
    prevProps.user.score === nextProps.user.score
  );
});