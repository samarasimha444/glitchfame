import React from "react";

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
      "https://tse2.mm.bing.net/th/id/OIF.JWAPf2AdUGp0hV8OWYFptQ?phttps://i.pinimg.com/originals/dc/e7/91/dce7915ba0c362c24426eccd27a00929.jpg",
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

const Cards = () => {
  return (
    <div className="flex flex-col px-20  w-full max-w-screen ">
      <section className="w-full   py-16">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-[#BE5EED] text-[12px] tracking-widest font-semibold uppercase">
              Active Challenges
            </p>

            <h2 className="text-5xl font-extrabold text-white tracking-tight">
              THE FEED
            </h2>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <input
              type="text"
              placeholder="Find your vibe..."
              className="bg-[#161C23] text-gray-300 placeholder-gray-500 
                       px-5 py-3 rounded-md w-80 outline-none 
                       border border-[#232A33] 
                       focus:border-blue-500 transition"
            />

            <button
              className="px-6 py-3 rounded-md border border-[#2A323C] 
                       text-white text-sm font-semibold 
                       hover:bg-[#1B2129] transition"
            >
              LATEST
            </button>
          </div>
        </div>
      </section>

      <section>
        <section className="flex  w-full justify-between  flex-wrap  gap-4">
          {contests.map((item) => (
            <article className="w-full  max-w-93.75 h-[406px] bg-[#181B20] rounded-lg overflow-hidden border border-[#232A33]">
              <img
                src={item.image}
                alt="Cyberpunk Seoul"
                className="w-full h-[80%] object-cover"
              />

              <div className="flex  flex-col justify-between h-[20%] p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm">
                    {item.title}
                  </h4>
                  <span className="text-[#BE5EED] text-sm font-medium">
                    {item.prize}
                  </span>
                </div>

                <div className="flex gap-4 text-gray-400 text-xs">
                  <span>{item.votes}</span>
                  <span>{item.timeLeft}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
};

export default Cards;
