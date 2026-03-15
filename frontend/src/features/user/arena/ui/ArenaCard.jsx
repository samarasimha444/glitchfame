import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToggleVote } from "../hooks";
import ShimmerCard from "../../../../components/ShimmerCard";
import toast from "react-hot-toast";
import Error from "../../../../components/Error";
import { Heart } from "lucide-react";

const ContestantCard = React.memo(({ user, toggleVote, votingStatus }) => {
  const navigate = useNavigate();
  const status = votingStatus[user.id];

  return (

    <article
      onClick={() => navigate(`/details/${user.id}`)}

      className="relative flex flex-col w-full max-w-40.75 h-51  mt-4 sm:max-w-77.5 sm:h-97 rounded-xl rounded-b-none overflow-hidden border border-gray-800 hover:border-purple-500 transition"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      <div className="absolute bottom-3 left-3">
        <h3 className="text-white font-semibold text-sm sm:text-lg">
          {user.name}
        </h3>

        <p className="text-[#9DE2E2] text-xs sm:text-sm">
          ~ {user.votes || "12.8K"} votes
        </p>
      </div>

   
  

     
    </article>
  );
});

const ArenaCard = ({
  contestantsData = { content: [] },
  isLoading,
  isError,
}) => {
  console.log();

  console.log(isLoading);
  const navigate = useNavigate();
  const toggleVoteMutation = useToggleVote();

  const [votingStatus, setVotingStatus] = useState({});

  const toggleVote = useCallback(
    (userId) => {
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
    },
    [toggleVoteMutation],
  );

  const contestants = contestantsData.content || [];

  return (
    <section className="flex flex-col w-full  sm:px-6 md:pb-20">
      <div className="w-full  mx-auto">
        <div className="flex items-center justify-between sm:mt-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart size={18} strokeWidth={2} />
            <span className="text-[18px] font-semibold text-white">
              Current Participants
            </span>
          </div>

          <span className="text-xs text-center text-gray-400 font-semibold">
            42 TOTAL
          </span>
        </div>

        {isError || (!isLoading && contestants.length === 0) ?
          <Error />
        : <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8">
  
  {isLoading &&
    Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex w-full justify-center">
        <ShimmerCard />
      </div>
    ))}

  {!isLoading &&
    contestants.map((user) => (
      <div key={user.id} className="flex flex-col items-center">

        <ContestantCard
          user={user}
          toggleVote={toggleVote}
          votingStatus={votingStatus}
        />

      
        <button
          onClick={() => toggleVote(user.id)}
          className="mt-2 w-[140px] sm:w-full sm:text-base  bg-[#9DE2E2] text-[12px] text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
        >
          Vote Now
        </button>

      </div>
    ))
  }

</div>
        }
      </div>



    </section>
  );
};

export default ArenaCard;
