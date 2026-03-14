import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToggleVote } from "../hooks";
import ShimmerCard from "../../../../components/ShimmerCard";
import { getVoteButtonProps } from "../../../../lib/helper";
import toast from "react-hot-toast";
import Error from "../../../../components/Error";


const ContestantCard = React.memo(({ user, toggleVote, votingStatus }) => {
   const navigate = useNavigate();
  const status = votingStatus[user.id];
  const { text, className, disabled } = getVoteButtonProps(status);


  return (
    <article
      onClick={() => navigate(`/details/${user.id}`)}
      className="relative w-full sm:max-w-77.5 h-[35dvh] sm:h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
    >
     <img
  src={`${user?.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=500`}
  alt={user?.name}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.target.src =
      "https://images.pexels.com/photos/29179706/pexels-photo-29179706.jpeg?auto=compress&cs=tinysrgb&w=500";
  }}
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


const ArenaCard = ({ contestantsData = { content: [] }, isLoading ,isError}) => {
  
  console.log()

  console.log(isLoading)
 const navigate = useNavigate();
  const toggleVoteMutation = useToggleVote();

  const [votingStatus, setVotingStatus] = useState({});

  const toggleVote = useCallback((userId) => {

    setVotingStatus((prev) => ({
      ...prev,
      [userId]: "loading",
    }));

    toggleVoteMutation.mutate(userId, {
      onSuccess: (data) => {

        setVotingStatus((prev) => ({
          ...prev,
          [userId]: data.hasVoted ? "voted" : undefined,
        }));

      
      },
      onError: () => {

        setVotingStatus((prev) => ({
          ...prev,
          [userId]: undefined,
        }));
        toast.error("Failed to vote. Try again.");
      },
    });

  }, [toggleVoteMutation]);

  const contestants = contestantsData.content || [];

  return (
    <section className="flex flex-col w-full px-1 sm:px-6 md:pb-20">
      <div className="w-full mt-4 mx-auto">

        <h2 className="text-white text-xl mt-2 font-semibold mb-8">
          Current Participants
        </h2>

        {(isError || (!isLoading && contestants.length === 0)) ? (
          <Error />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8">

            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex w-full justify-center">
                  <ShimmerCard />
                </div>
              ))}

            {!isLoading &&
              contestants.map((user) => (
                <ContestantCard
                  key={user.id}
                  user={user}
                  toggleVote={toggleVote}
                  votingStatus={votingStatus}
                />
              ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default ArenaCard;