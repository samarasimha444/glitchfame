import ShimmerCard from "../../../../components/ShimmerCard";
import toast from "react-hot-toast";
import Error from "../../../../components/Error";
import { Heart } from "lucide-react";
import { ContestantCard } from "./ContestantCards";
import { useState, useCallback } from "react";
import LoginModal from "../../../../components/LoginModal";
import { handleVoteError, isTokenExpired } from "../../../../lib/helper";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ArenaCard = ({ data, seasonId, isLoading, isError }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [clickedVotes, setClickedVotes] = useState(() => new Set());


const token = localStorage.getItem("token");
console.log(token)

if (!token || isTokenExpired(token)) {
  setShowLoginModal(true);
  return;
}



  const handleVote = useCallback(
    async (participationId) => {
      const token = localStorage.getItem("token");
      if (!token) {
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
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart size={18} strokeWidth={2} />
            <span className="text-[18px] font-semibold text-white">
              Current Participants
            </span>
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
              data?.map((user) => {
                const isClicked = clickedVotes.has(user.participationId);
                const isVoted = isClicked ? !user.hasVoted : user.hasVoted;

                return (
                  <div
                    key={user.participationId}
                    className="flex flex-col items-center"
                  >
                    <ContestantCard user={user} />

                    <button
                      onClick={() => handleVote(user.participationId)}
                      className={`mt-2 w-35 sm:w-full sm:text-base text-[12px] font-semibold py-2 cursor-pointer rounded-md transition-all duration-150 shadow-md active:shadow-sm active:scale-95 active:translate-y-[1px] ${
                        isVoted ?
                          "bg-primary text-black shadow"
                        : "bg-[#9DE2E2] text-black hover:opacity-90"
                      }`}
                    >
                      {isVoted ? "Voted" : "Vote Now"}
                    </button>
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
