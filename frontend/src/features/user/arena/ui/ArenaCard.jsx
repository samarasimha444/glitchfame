import React, { useState } from "react";
import { data, Link } from "react-router-dom";
import { useContestantsById } from "../hooks";
import ShimmerCard from "../../../../components/ShimmerCard";

const contestants = [
  {
    id: 1,
    name: "Sarah Connor",
    photoUrl:
      "https://images.pexels.com/photos/3031397/pexels-photo-3031397.jpeg",
  },
  {
    id: 2,
    name: "Deckard Blade",
    photoUrl:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
  },
  {
    id: 3,
    name: "Major Kusanagi",
    photoUrl:
      "https://images.pexels.com/photos/5273717/pexels-photo-5273717.jpeg",
  },
  {
    id: 4,
    name: "Neo Anderson",
    photoUrl:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  },
];

const ArenaCard = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  // console.log(id)

  //  const [voted,setVoted]= useState([])

  //  const addVote = ()=>{

  //  }

  //   const { data: contestants = [], isLoading, isError } =
  //   useContestantsById(id);

  //   const totalPages = contestants?.pageable?.pageSize || 0
  //   console.log(totalPages)

  // if (isError) return <p className="text-red-500">Error loading contestants</p>;
  // console.log(contestants);

  return (
    <section className=" mt-6 flex flex-col  px-1 sm:px-6 md:pb-20">
      <div className="max-w-screen w-full mt-10  mx-auto">
        <h2 className="text-white text-xl font-semibold mb-8">
          Current Participants
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 space-y-6 sm:gap-8">
          {
            isLoading ?
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex  justify-center">
                  <ShimmerCard />
                </div>
              ))
              // :contestants?.content.map((user) => (
            : contestants?.map((user) => (
                <Link
                  to={`/details/${user.id}`}
                  key={user.id}
                  className="relative w-full  sm:max-w-77.5 h-[35dvh] sm:h-97 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition"
                >
                  <img
                    src={`${user.photoUrl}?auto=compress&cs=tinysrgb&w=500`}
                    alt={user.name}
                    loading="lazy"
                    decoding="async"
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
