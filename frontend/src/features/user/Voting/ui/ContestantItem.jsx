import { Heart, X, Skull } from "lucide-react";
import { memo } from "react";
import { ContestantCard } from "./ContestantCards";

const ContestantItem = ({
  user,
  loadingState,
  setLoadingState,
  voteAction,
}) => {
  const isVoteLoading =
    loadingState?.id === user.participationId &&
    loadingState?.action === "VOTE";

  const isKillLoading =
    loadingState?.id === user.participationId &&
    loadingState?.action === "KILL";

  const status =
    user.hasVoted ? "voted"
    : user.hasKilled ? "killed"
    : "idle";

  return (
   <div className="flex flex-col w-full group">
  <ContestantCard user={user} />

  <section className="flex items-center gap-2 p-2 sm:p-3 bg-[#121214] rounded-b-2xl border-x border-b border-white/5 shadow-2xl">
    
    {/* Vote Button */}
    <button
      disabled={isVoteLoading}
      onClick={(e) => {
        e.stopPropagation();

        setLoadingState({
          id: user.participationId,
          action: "VOTE",
        });

        voteAction(
          {
            participationId: user.participationId,
            action: "VOTE",
          },
          {
            onSettled: () => setLoadingState(null),
          }
        );
      }}
      className={`
        flex-2 sm:flex-3
        flex items-center justify-center gap-2
        h-11 sm:h-12 rounded-full
        transition-all active:scale-95
        ${
          status === "voted"
            ? "bg-primary text-black"
            : "bg-[#27272A] text-white hover:bg-teal-400"
        }
      `}
    >
      {isVoteLoading ? (
        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <>
          <Heart size={14} />
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest">
            {status === "voted" ? "Voted" : "Vote"}
          </span>
        </>
      )}
    </button>

  
    <button
      disabled={isKillLoading}
      onClick={(e) => {
        e.stopPropagation();

        setLoadingState({
          id: user.participationId,
          action: "KILL",
        });

        voteAction(
          {
            participationId: user.participationId,
            action: "KILL",
          },
          {
            onSettled: () => setLoadingState(null),
          }
        );
      }}
      className={`
        flex-1
        flex items-center justify-center
        h-11 sm:h-12 rounded-full
        transition-all active:scale-95
        ${
          status === "killed"
            ? "bg-red-600"
            : "bg-[#27272A] hover:bg-red-500"
        }
      `}
    >
      <Skull
        size={18}
        strokeWidth={2}
        className={`
          text-white
          ${isKillLoading ? "animate-[spin_0.3s_linear_infinite]" : ""}
        `}
      />
    </button>
  </section>

  <p className="text-gray-600 font-bold text-[9px] sm:text-[10px] text-center pt-3 uppercase tracking-[0.2em] opacity-60">
    Support or Challenge
  </p>
</div>
  );
};

export default memo(ContestantItem);
