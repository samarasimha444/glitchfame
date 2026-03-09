import React, { useState } from "react";
import { data, Link } from "react-router-dom";
import { useContestantsById} from "../hooks";


const ArenaCard = ({id}) => {

  console.log(id)
   
   const [voted,setVoted]= useState([])


   const addVote = ()=>{
     
   }

    const { data: contestants = [], isLoading, isError } =
    useContestantsById(id);

    const totalPages = contestants?.pageable?.pageSize || 0
    console.log(totalPages)

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading contestants</p>;
  console.log(contestants);

  return (
    <section className="bg-black mt-6 px-1 sm:px-6 pb-20">
      <div className="max-w-screen w-full mt-10  mx-auto">
        <h2 className="text-white text-xl font-semibold mb-8">
          Current Participants
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 space-y-6 sm:gap-8">

          {contestants?.content.map((user) => (

            <Link to={`/details/${user.id}`}
              key={user.id}
              className="relative w-full  sm:max-w-77.5 h-[35dvh] sm:h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
            >
             
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />

           
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

             
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-white font-semibold text-lg">
                  {user.name}
                </h3>

                <button className="mt-3 text-xs sm:text-base w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md text-black font-semibold hover:opacity-90 transition">
                  VOTE
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArenaCard;
