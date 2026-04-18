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

 const SubmissionCard = ({ season }) => {
  return (
    <div className="group flex items-center justify-between px-6 py-5 md:hover:bg-white/[0.02] md:transition-all">
      <div className="flex items-center gap-4">
        
        <div className="h-12 w-12 rounded-full border border-white/10 overflow-hidden bg-gray-900">
          <img
            src={season.participantPhotoUrl}
            alt={season.participantName}
            className="w-full h-full object-cover  md:group-hover:grayscale-0 transition-all duration-500"
          />
        </div>

      
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-tighter">
            {season.seasonName}
          </span>
          <span className="text-lg font-bold text-white">
            {season.participantName}
          </span>
        </div>
      </div>

      
      <div className="flex flex-col items-end gap-2">
        <StatusChip status={season.status?.toLowerCase()} />
        <span className="text-[10px] font-mono text-gray-600 uppercase">
          Applied: {new Date(season.registrationStartDate).toLocaleDateString('en-GB')}
        </span>
      </div>
    </div>
  );
};


export default SubmissionCard