import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToggleVote } from "../hooks";
import ShimmerCard from "../../../../components/ShimmerCard";
import { getVoteButtonProps } from "../../../../lib/helper";
import toast from "react-hot-toast";


const ContestantCard = React.memo(({ user, toggleVote, votingStatus, voteCount, navigate }) => {
  const status = votingStatus[user.id];
  const votes = voteCount[user.id] || 0;
  const { text, className, disabled } = getVoteButtonProps(status, votes);

  return (
    <article
      onClick={() => navigate(`/details/${user.id}`)}
      className="relative w-full sm:max-w-77.5 h-[35dvh] sm:h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
    >
      <img
        src={`${user.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=500`}
        alt={user.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />

      <div className="absolute cursor-grab inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full p-4">
        <h3 className="text-white font-semibold text-lg">{user.name}</h3>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVote(user.id);
          }}
          disabled={disabled}
          className={`mt-3 text-xs sm:text-base w-full py-2 rounded-md cursor-pointer font-semibold transition ${className}`}
        >
          {text}
        </button>
      </div>
    </article>
  );
});


const ArenaCard = ({ contestantsData = { content: [] }, isLoading }) => {
  const navigate = useNavigate();
  const toggleVoteMutation = useToggleVote();

  const [votingStatus, setVotingStatus] = useState({});
  const [voteCount, setVoteCount] = useState({});

 
  const toggleVote = useCallback(
    (userId) => {
      if ((voteCount[userId] || 0) >= 5) return;

      setVotingStatus((prev) => ({ ...prev, [userId]: "loading" }));

      toggleVoteMutation.mutate(userId, {
        onSuccess: () => {
          setVoteCount((prev) => ({
            ...prev,
            [userId]: prev[userId] ? prev[userId] + 1 : 1,
          }));
          setVotingStatus((prev) => ({ ...prev, [userId]: "success" }));
           toast.success("Vote submitted successfully ");
        },
        onError: () => {
          setVotingStatus((prev) => ({ ...prev, [userId]: "error" }));
           toast.error("Failed to vote. Try again.");

        },
      });
    },
    [voteCount, toggleVoteMutation]
  );

  const contestants = useMemo(() => contestantsData.content || [], [contestantsData]);

  return (
    <section className="flex flex-col px-1 sm:px-6 md:pb-20">
      <div className="max-w-screen w-full mt-4 mx-auto">
        <section className="flex justify-between">
          <h2 className="text-white text-xl font-semibold mb-8">Current Participants</h2>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 space-y-6 sm:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <ShimmerCard />
                </div>
              ))
            : contestants.map((user) => (
                <ContestantCard
                  key={user.id}
                  user={user}
                  toggleVote={toggleVote}
                  votingStatus={votingStatus}
                  voteCount={voteCount}
                  navigate={navigate}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default ArenaCard;