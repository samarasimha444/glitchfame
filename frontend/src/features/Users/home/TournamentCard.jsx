import React from "react";
import { useNavigate } from "react-router-dom";

const contests = [
  {
    id: 1,
    title: "CYBERPUNK SEOUL",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.NC_e6GoCMQHiKWKltN8V2wHaEK?pid=Api&P=0&h=180",
    prize: "$2.5k",
    votes: "1.2k",
    timeLeft: "24h",
  },
  {
    id: 2,
    title: "NEON TOKYO",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.1Ky33cNFn54Blw9k_M1rxQHaEK?pid=Api&P=0&h=180",
    prize: "$1.8k",
    votes: "980",
    timeLeft: "12h",
  },
  {
    id: 3,
    title: "FUTURE DUBAI",
    image:
      "https://c8.alamy.com/comp/TD93W0/rock-musicians-silhouettes-rhythm-and-solo-guitar-bass-guitarist-drummer-and-girl-at-keyboards-open-air-excited-crowd-under-stage-night-blue-sky-TD93W0.jpg",
    prize: "$3k",
    votes: "2.1k",
    timeLeft: "48h",
  },
  {
    id: 4,
    title: "SPACE MUMBAI",
    image:
      "https://i.ytimg.com/vi/k-n5PdPuQFM/oar2.jpg?sqp=-oaymwEYCJYEENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLAJHnpjnC61IjWkDAeDJHqF4_Ee8g&usqp=CCk",
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

const TournamentCard = () => {


    const navigate = useNavigate()

return (
  <div className="flex flex-col px-20 py-10 w-full">
    
    

    <section className="flex w-full justify-between flex-wrap gap-4 ">
      {contests.map((item, index) => (
        <article
          key={index}
          className="w-full max-w-95 bg-[#111418] border border-[#1E232B] 
          rounded-2xl overflow-hidden flex flex-col justify-between"
        >
         
          <div className="relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[220px] object-cover"
            />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                FEATURED
              </span>
              <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
                FPS Tactical
              </span>
            </div>
          </div>

          
          <div className="p-6 flex flex-col gap-4 flex-1">
         
            <div className="flex justify-between items-start">
              <h3 className="text-white font-semibold text-lg leading-tight">
                {item.title}
              </h3>

              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Prize Pool
                </p>
                <p className="text-[#39FFB6] font-bold text-lg">
                  ${item.prize}
                </p>
              </div>
            </div>

          
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>

           
            <div className="border-t border-[#232A33]" />

        
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase">Deadline</p>
                <p className="text-white font-medium">
                  {item.deadline}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase">Starts</p>
                <p className="text-white font-medium">
                  {item.startDate}
                </p>
              </div>
            </div>

          
            <button onClick={()=>navigate('/enter')}
              className="mt-4 w-full py-3 max-w-[170px] rounded-xl 
              bg-gradient-to-r from-purple-500 to-purple-500 
               font-semibold tracking-wide text-black text-[14px]
              hover:opacity-90 transition"
            >
              REGISTER NOW ⚡
            </button>
          </div>
        </article>
      ))}
    </section>
  </div>
);
};

export default TournamentCard;
