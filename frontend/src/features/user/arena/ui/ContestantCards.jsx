import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";




export const ContestantCard = React.memo(({ user, toggleVote, votingStatus }) => {

  console.log(user)

  const navigate = useNavigate();
  const status = votingStatus[user.id];


 

 

  return (

    <article
      onClick={() => navigate(`/details/${user.
participationId
}`)}

      className="relative flex flex-col w-full max-w-40.75 h-51  mt-4 sm:max-w-77.5 sm:h-97 rounded-xl rounded-b-none overflow-hidden border border-gray-800 hover:border-white transition"
    >
       
      <img
        src={`${user?.participantPhotoUrl}?auto=compress&cs=tinysrgb&w=500`}
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
          {user.participantName}
        </h3>

        <p className="text-[#9DE2E2] text-xs sm:text-sm">
          {user.totalVotes} votes
        </p>
      </div>

   
  

     
    </article>
  );
});
