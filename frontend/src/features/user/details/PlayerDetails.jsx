import React, { useState } from "react";
import { Zap } from "lucide-react";
import { useContestantDetails, useToggleVote } from "../arena/hooks";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";




const PlayerDetails = () => {

  const [loading,setIsLoading]=useState(false)

   const { id } = useParams(); 
   console.log(id)




  const { data, isLoading, error } = useContestantDetails(id);
  const { mutate: voteToggle, isPending } = useToggleVote();

  console.log(data)
  const handleVote = (contestantId) => {
    if (!contestantId) return;

    voteToggle(contestantId, {
      onSuccess: () => {
        toast.success("Vote submitted successfully!");
      },
      onError: () => {
        toast.error("Failed to vote");
      },
    });
  };


  return (


    <div className="flex  flex-col md:flex-row w-full  justify-evenly min-h-screen bg-black text-white">

      <section className="h-[40dvh] w-full md:w-[45%] md:rounded-2xl md:h-[95dvh]  relative overflow-hidden">

        
        <img
          src={data?.seasonPhotoUrl}
          alt="Player"
          className="absolute inset-0 w-full h-full object-cover"
        />

       
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

       
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-3xl font-bold">
            {data?.participantName}
          </h1>
          <p className="text-gray-400  text-sm mt-1">
            {data?.dateOfBirth}
            <span> {data?.location}</span>
           
          </p>
        </div>

      </section>

  
      <section className="max-w-xl  p-4 md:p-12 md:space-y-8 ">

     
        <div className="md:bg-[#0f1720] max-w-[530px] p-8 rounded-2xl md:border border-cyan-500/20">
          <p className="text-xs text-gray-400 mb-2">
            CURRENT VOTES
          </p>

          <h2 className="text-3xl md:text-5xl font-extrabold text-cyan-400">
           {data?.voteCount}
          </h2>

          <button onClick={()=>handleVote(data?.participationId)}
           className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition">
            <Zap size={18} />
            Vote {data?.participantName}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            LIMITED TO 5 VOTES AS PER SEASON
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-3">
             About me
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            {data?.description}

          </p>

          <p className="text-purple-400 text-sm mt-4">
            #GlitchFame #{data?.seasonName}
          </p>
        </div>

       
        <div className="bg-[#0f1720] p-6 mt-4 rounded-xl border border-gray-800 flex items-center justify-between">
          {/* <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <img
                key={item}
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
            ))}
          </div> */}
          <p className="uppercase">{data?.seasonName} </p>

          <p className="text-sm text-gray-400">
          
          </p>
        </div>

    
       

      </section>
    </div>
  );
};

export default PlayerDetails;