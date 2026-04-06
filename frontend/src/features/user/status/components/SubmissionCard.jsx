import React, { memo, useMemo } from "react";
import { Calendar } from "lucide-react";
import StatusChip from "./StatujsChip";

const getSeasonPhase = (season) => {
  const now = new Date();
  const regStart = new Date(season.registrationStartDate);
  const regEnd = new Date(season.registrationEndDate);
  const voteStart = new Date(season.votingStartDate);
  const voteEnd = new Date(season.votingEndDate);

  if (now >= regStart && now <= regEnd) return "REGISTRATION";
  if (now >= voteStart && now <= voteEnd) return "LIVE";
  if (now < regStart) return "UPCOMING";
  if (now > voteEnd) return "ENDED";

  return "UNKNOWN";
};

const SubmissionCard = memo(({ season }) => {
  const phase = useMemo(() => getSeasonPhase(season), [season]);

  return (
    <div className="bg-white/[0.03] border border-[#9DE2E2]/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-5 md:p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
        <div>
          <h2 className="text-lg md:text-2xl font-bold">{season.seasonName}</h2>
          <div className="flex items-center gap-2 text-[#95A0A6] text-sm">
            <Calendar size={16} />
            <span>
              {new Date(season.registrationStartDate).toLocaleDateString()} —{" "}
              {new Date(season.votingEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {phase === "LIVE" && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#9DE2E2]/10 text-[#9DE2E2] border border-[#9DE2E2]/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Live
          </div>
        )}

        {phase === "REGISTRATION" && (
          <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest">
            Registration Open
          </div>
        )}
      </div>

      <div className="p-5 md:p-8 space-y-4">
        <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#1E2229]/50 border border-white/[0.03]">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-full">z
              <img
                src={season.participantPhotoUrl}
                alt={season.participantName}
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
            <div>
              <p className="font-bold">{season.participantName}</p>
              <p className="text-xs text-[#95A0A6]">{season.seasonName}</p>
            </div>
          </div>
          <StatusChip status={season.status?.toLowerCase()} />
        </div>
      </div>
    </div>
  );
});

export default SubmissionCard;