import { Zap, Trophy, Target, TrendingUp } from "lucide-react";
import { useContestantDetails } from "../arena/hooks";
import { useNavigate, useParams } from "react-router-dom";
import NeonLoader from "../../../components/Loader";

const PlayerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useContestantDetails(id);

  return (
    <div className="flex pt-20 flex-col md:flex-row w-full justify-evenly min-h-screen text-white">
      {isLoading && <NeonLoader />}

      
      <section className="h-[40dvh] w-full md:w-[45%] md:rounded-2xl md:h-[95dvh] relative overflow-hidden">
        <img
          src={data?.participantPhotoUrl || data?.seasonPhotoUrl}
          alt="Player"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-3xl font-bold">
            {data?.participantName}
          </h1>
          <div className="flex items-center gap-3 text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-1"><Target size={14} className="text-primary"/> {data?.location || "Unknown"}</span>
            <span>|</span>
            <span>{data?.dateOfBirth ? new Date(data.dateOfBirth).getFullYear() : "N/A"}</span>
          </div>
        </div>
      </section>

    
      <section className="max-w-xl w-full p-4 md:p-12 md:space-y-8 ">
        
        <div className="bg-[#0f1720] w-full max-w-132.5 p-8 rounded-2xl md:border border-cyan-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">RANKING</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                #{data?.rank || 0}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">ARENA SCORE</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary">
                {data?.score || 0}
              </h2>
            </div>
          </div>

         <button
            onClick={() => navigate('/leaderboard')}
            className="w-full group relative flex items-center justify-center gap-3 bg-primary mt-4 text-black py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#9DE2E2] active:scale-[0.98]"
          >
            <Trophy size={18} />
            See Rankings
          </button>

          <div className="flex justify-between mt-4 px-1">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">
               VOTES: {data?.voteCount || 0}
             </p>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">
               LIMIT: 5 PER SEASON
             </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg mt-1 font-semibold mb-3">
            About me
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            {data?.description || "No intel provided for this participant. Entry into the GlitchFame arena implies acceptance of all combat risks."}
          </p>

          <p className="text-primary text-sm mt-4 font-bold tracking-tight">
            #GlitchFame #{data?.seasonName}
          </p>
          
          {data?.rank > 100 && (
            <p className="text-gray-500 text-xs mt-2 italic font-medium">
              Not in the top rankings yet — currently among the lower-ranked participants.
            </p>
          )}
        </div>

        <div className="bg-[#0f1720] p-6 mt-4 rounded-xl border border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Current Season</p>
            <p className="uppercase font-bold text-white">{data?.seasonName}</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Status</p>
            <p className="text-xs font-bold text-primary">{data?.status}</p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default PlayerDetails;