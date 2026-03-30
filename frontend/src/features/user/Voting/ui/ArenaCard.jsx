import ShimmerCard from "../../../../components/ShimmerCard";
import toast from "react-hot-toast";
import Error from "../../../../components/Error";
import { Heart } from "lucide-react";
import { ContestantCard } from "./ContestantCards";
import { useState, useCallback } from "react";
import LoginModal from "../../../../components/LoginModal";
import { handleVoteError } from "../../../../lib/helper";
import { useOutletContext } from "react-router-dom";
import { X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ArenaCard = ({ data, seasonId, isLoading, isError }) => {
  const { profile } = useOutletContext();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [clickedVotes, setClickedVotes] = useState(() => new Set());

  const handleVote = useCallback(
    async (participationId) => {
      const token = localStorage.getItem("token");
      if (!profile) {
        setShowLoginModal(true);
        return;
      }

      setClickedVotes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(participationId)) newSet.delete(participationId);
        else newSet.add(participationId);
        return newSet;
      });

      try {
        const res = await fetch(`${BASE_URL}/votes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ participationId, seasonId }),
        });

        if (!res.ok) throw new Error("Vote failed");
        await res.json();
      } catch (err) {
        const result = handleVoteError(err, { setShowLoginModal });

        if (result.type === "toast") {
          toast.error(result.message);
        }

        if (result.type === "login") {
          setShowLoginModal(true);
        }

        setClickedVotes((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(participationId)) newSet.delete(participationId);
          else newSet.add(participationId);
          return newSet;
        });
      }
    },
    [seasonId],
  );

  const shimmerArray = Array.from({ length: 4 }).map((_, idx) => (
    <div key={idx} className="flex w-full justify-center">
      <ShimmerCard />
    </div>
  ));

  return (
    <section className="flex flex-col w-full sm:px-6 md:pb-20">
      {showLoginModal && (
        <LoginModal onCancel={() => setShowLoginModal(false)} />
      )}

      <div className="w-full mx-auto">
        <div className="flex items-center justify-between sm:mt-6">
          <div className="flex flex-col  text-primary">
            <h6 className="flex items-center text-center space-x-2">
              {" "}
              <Heart size={18} strokeWidth={2} />{" "}
              <span className="text-[20px] font-semibold text-white">
                Current Participants
              </span>{" "}
            </h6>
            <p className="ml-7 text-[13px] text-gray-400">
              Active for this season
            </p>
          </div>

          <span className="text-xs text-center text-gray-400 font-semibold">
            {data?.length || 0} TOTAL
          </span>
        </div>

        {isError || (!isLoading && data.length === 0) ?
          <Error />
        : <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8">
            {isLoading && shimmerArray}

            {!isLoading &&
              data?.map((user, index) => {
                const isClicked = clickedVotes.has(user.participationId);
                const isVoted = isClicked ? !user.hasVoted : user.hasVoted;

                return (
                  <div
                    key={`${user.participationId}-${index}`}
                    className="flex  relative flex-col items-center"
                  >
                    <ContestantCard user={user} />

                    <section
                      className="absolute bottom-3 right-2 flex flex-col items-end gap-2
                     sm:static sm:flex-row md:w-full md:justify-between md:items-center md:px-1"
                    >
                      {/* VOTE BUTTON */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 md:flex-1 sm:w-[103px] sm:h-[40px] border border-teal-100 hover:bg-[#28b3a8]
                         rounded-full sm:rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150
                       shadow-[0_4px_10px_rgba(48,213,200,0.3)]"
                      >
                        <Heart size={16} fill="currentColor" />
                        <span className="hidden sm:inline text-[12px] font-black uppercase">
                          Vote
                        </span>
                      </button>

                      
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="
                     w-8 h-8 md:flex-1 sm:w-[103px] sm:h-[40px] border border-[#E11D48] bg-[#E11D48]/5
                     hover:bg-[#E11D48] hover:text-white text-[#E11D48] rounded-full sm:rounded-xl flex items-center justify-center gap-1.5
                     transition-all duration-150"
                                     >
                         <X size={16} strokeWidth={3} />
                        <span className="hidden sm:inline text-[12px] font-black uppercase">
                          Kill
                        </span>
                      </button>
                    </section>

                    <p className="text-gray-400 hidden sm:flex font-medium text-[12px] pt-3 leading-relaxed tracking-wide">
                      Vote To Support or Kill to Challenge
                    </p>
                  </div>
                );
              })}
          </div>
        }
      </div>
    </section>
  );
};

export default ArenaCard;
