import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContestantsById, useToggleVote } from "../hooks";
import ShimmerCard from "../../../../components/ShimmerCard";



const ArenaCard = ({id}) => {
  console.log(id)
  const navigate = useNavigate();

   const { data: contestants = [], isLoading, isError } =useContestantsById(1);

   console.log(contestants)

    const toggleVoteMutation = useToggleVote();


  const toggleVote = (id) => {
    console.log(id);
    toggleVoteMutation.mutate(id);

  };


  

  return (


    <section className=" mt-6 flex flex-col  px-1 sm:px-6 md:pb-20">

      <div className="max-w-screen w-full mt-10  mx-auto">
        <section className="flex justify-between">
           <h2 className="text-white text-xl font-semibold mb-8">
          Current Participants
        </h2>
        

        </section>
       

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 space-y-6 sm:gap-8">
          {isLoading ?
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex  justify-center">
                <ShimmerCard />
              </div>
            ))
          : contestants?.content?.map((user) => (
              <article
                onClick={() => navigate(`/details/${user.id}`)}
                key={user.id}
                className="relative w-full  sm:max-w-77.5 h-[35dvh] sm:h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
              >
                <img
                  src={`${user.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=500`}
                  alt={user.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full  object-cover"
                />

                <div className="absolute cursor-grab inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {user.name}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVote(user.id);
                    }}
                    className="mt-3 text-xs cursor-pointer sm:text-base w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md text-black font-semibold hover:opacity-90 transition"
                  >
                    VOTE
                  </button>
                </div>
              </article>
            ))
          }
        </div>
      </div>
      <button
            className="mt-8 mx-auto block 
             px-6 py-2 md:px-10 md:py-3 
             text-sm md:text-base 
             rounded-md md:rounded-lg 
             font-semibold
             bg-white/10 backdrop-blur border border-white/20
             text-white hover:bg-white/20 transition"
          >
            View More
          </button>
        </section>

        
      );
    };

export default ArenaCard;
