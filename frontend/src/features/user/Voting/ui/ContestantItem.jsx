import { Heart, X } from "lucide-react";
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

      <section className="flex items-center gap-2 p-3 bg-[#121214] rounded-b-2xl border-x border-b border-white/5 shadow-2xl">
        
        {/* Vote */}
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
            flex flex-3 rounded-full items-center justify-center gap-2 
            h-10 sm:h-12 text-black transition-all active:scale-95
            ${
              status === "voted"
                ? "bg-teal-300"
                : "bg-primary hover:bg-teal-400"
            }
          `}
        >
          {isVoteLoading ? (
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <Heart size={16} />
              <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest">
                {status === "voted" ? "Voted" : "Vote"}
              </span>
            </>
          )}
        </button>

        {/* Kill */}
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
            flex flex-1 items-center justify-center 
            h-10 sm:h-12 rounded-full transition-all active:scale-95 group/kill
            ${
              status === "killed"
                ? "bg-red-600"
                : "bg-[#27272A] hover:bg-red-600"
            }
          `}
        >
          {isKillLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <X
              size={16}
              strokeWidth={3}
              className="text-white group-hover/kill:rotate-90 transition-transform"
            />
          )}
        </button>
      </section>

      <p className="text-gray-600 font-bold text-[9px] sm:text-[10px] text-center pt-3 uppercase tracking-[0.2em] opacity-60">
        Support or Challenge
      </p>
    </div>
  );
};


export default memo(ContestantItem);