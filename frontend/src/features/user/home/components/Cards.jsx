import React from "react";
import { useNavigate } from "react-router-dom";

const contests = [
  {
    id: 1,
    title: "CYBERPUNK SEOUL",
    image:
      "https://i.pinimg.com/474x/99/ed/1b/99ed1bf6223ed9863fca27fd838959d8.jpg?nii=t",
    prize: "$2.5k",
    votes: "1.2k",
    timeLeft: "24h",
  },
  {
    id: 2,
    title: "NEON TOKYO",
    image:
      "https://i.pinimg.com/originals/dc/e7/91/dce7915ba0c362c24426eccd27a00929.jpg",
    prize: "$1.8k",
    votes: "980",
    timeLeft: "12h",
  },
  {
    id: 3,
    title: "FUTURE DUBAI",
    image:
      "https://i.pinimg.com/originals/2d/5a/d4/2d5ad4cb9aee6b11b3ad4352998814d6.jpg",
    prize: "$3k",
    votes: "2.1k",
    timeLeft: "48h",
  },
  {
    id: 4,
    title: "SPACE MUMBAI",
    image:
      "https://i.ytimg.com/vi/k-n5PdPuQFM/oar2.jpg",
    prize: "$900",
    votes: "650",
    timeLeft: "6h",
  },
 
    {
    id: 5,
    title: "DIGITAL PARIS",
    image:
      "https://i.pinimg.com/originals/f8/19/e4/f819e4d4f5b6a266a71f8a5248003e39.jpg",
    prize: "$2k",
    votes: "1.5k",
    timeLeft: "36h",
  },
  {
    id: 6,
    title: "AI NEW YORK",
    image:
      "https://tse3.mm.bing.net/th/id/OIF.sThQPvxMvK2ZSwZeNgudhQ?pid=Api&P=0&h=180",
    prize: "$4k",
    votes: "3.4k",
    timeLeft: "72h",
  },
];

const Cards = () => {

  const navigate = useNavigate()

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20">

     
      <section className="w-full py-12 md:py-16">
        <div className="flex flex-col items-start justify-between">
          <div className="space-y-3">
            <p className="text-[#BE5EED] text-[12px] tracking-widest font-semibold uppercase">
              Active Challenges
            </p>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
             Vote Now
            </h2>
          </div>
          
        </div>
        
      </section>

     
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">

        {contests.map((item) => (
          <article onClick={()=>navigate("/arena")}
            key={item.id}
            className="bg-[#181B20] rounded-lg overflow-hidden border border-[#232A33] hover:border-purple-500 transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[25vh] sm:h-72 object-cover"
            />

            <div className="flex flex-col justify-between p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-white font-semibold text-sm sm:text-base">
                  {item.title}
                </h4>
                <span className="text-[#BE5EED] hidden sm:flex text-sm font-medium">
                  {item.prize}
                </span>
              </div>

              <div className="flex gap-4 text-gray-400 text-xs sm:text-sm">
                <span>{item.votes} votes</span>
                <span>{item.timeLeft} left</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Cards;