import React from "react";

const winners = [
  {
    id: 1,
    title: "CHROMATIC PULSE",
    image:
      "https://img.freepik.com/premium-photo/gen-z-boy-wheelchair-city_114016-25432.jpg?w=2000",
    profile:
      "https://randomuser.me/api/portraits/men/2.jpg",
    username: "@NeonWave",
    rank: "2ND",
    size: "small",
  },
  {
    id: 2,
    title: "THE URBAN NOMAD",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.sme2jXgLzUjySgJ_DR40oAHaHa?pid=Api&P=0&h=180",
    profile:
      "https://randomuser.me/api/portraits/women/1.jpg",
    username: "@Kaelin.psd",
    rank: "1ST",
    size: "large",
  },
  {
    id: 3,
    title: "DIGITAL ARTIFACTS",
    image:
      "https://i.pinimg.com/736x/91/33/0f/91330f10f89e1c0c5f52317c5fee42c8.jpg",
    profile:
      "https://randomuser.me/api/portraits/women/3.jpg",
    username: "@PixelQueen",
    rank: "3RD",
    size: "small",
  },
];


const Gallery = () => {

  return (
<>


    <div className="w-full sm:hidden min-h-screen mt-12
     bg-gradient-to-b  text-white flex justify-center">

      <div className="w-full max-w-[420px] px-4 py-8 space-y-6">

       
        <div>
          <h1 className="text-3xl font-bold">
            PAST <span className="text-purple-500">WINNERS</span>
          </h1>

          
        </div>

        <div>
          <p className="text-xs text-yellow-400 tracking-widest mb-3">
            🏆 GRAND CHAMPION
          </p>

          <div className="relative h-[350px] rounded-xs overflow-hidden">

            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              alt="champion"
              className="w-full h-full object-cover"
            />

            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute top-4 left-4 bg-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
              HALL OF FAME
            </div>

            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              1ST
            </div>

          
            <div className="absolute bottom-4 left-4">
              <p className="text-xs text-gray-300">@Kaelin.psd</p>
              <h3 className="text-xl font-bold">THE URBAN NOMAD</h3>
              <p className="text-xs text-gray-400 max-w-[250px]">
                Awarded for exceptional composition and storytelling.
              </p>
            </div>
          </div>
        </div>

       
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-gray-400 tracking-widest">
              RUNNER UPS & MENTIONS
            </p>
            <span className="text-purple-400 text-xs">SWIPE →</span>
          </div>

          <div className="flex gap-4 mt-3 overflow-x-auto scroll-smooth pb-2">

            
            <div className=" min-w-[250px] h-[300px] rounded-xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab"
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs text-gray-300">@NeonWave</p>
                <h4 className="text-sm font-semibold">CHROMATIC PULSE</h4>
              </div>
            </div>

            <div className="min-w-[250px] h-[300px] rounded-xl  overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs text-gray-300">@PixelQueen</p>
                <h4 className="text-sm font-semibold">DIGITAL ARTIFACTS</h4>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>


 <div className="w-full hidden sm:block  text-white px-6 md:px-20 py-20">

    
      <div className="flex justify-between items-start sm:mb-14">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            PAST <span className="text-gray-500">WINNERS</span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl text-sm">
            Celebrating the top-tier creators who defined the standards
            of the GlitchFame community.
          </p>
        </div>

        <button className="hidden md:flex items-center gap-2 border border-[#2A323C] px-4 py-2 rounded-lg text-sm hover:bg-[#1B2129] transition">
          Archive →
        </button>
      </div>

   
      <div className="flex   justify-center items-end gap-8 mb-16">

        {winners.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-2xl overflow-hidden border border-[#2A323C] bg-[#111418]
            ${item.size === "large"
                ? " w-[420px] h-[520px]"
                : " w-[320px] h-[420px]"
              }`}
          >
            
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

       
            <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              {item.rank}
            </div>

            <div className="absolute bottom-6 left-6">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.profile}
                  alt={item.username}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
                <span className="text-sm text-gray-300">
                  {item.username}
                </span>
              </div>

              <h3 className="text-lg font-semibold tracking-wide">
                {item.title}
              </h3>

              {item.size === "large" && (
                <p className="text-gray-400 text-xs mt-2 max-w-xs">
                  Awarded for exceptional composition and storytelling
                  in street photography.
                </p>
              )}
            </div>
          </div>
        ))}

        
      </div>

      

    
      <div className="flex justify-between items-center border-t border-[#2A323C] pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          New season starts in 4 days. Join 12k+ participants.
        </div>

        <button className="bg-[#BE5EED] text-black px-6 py-2 rounded-xs text-sm font-semibold hover:opacity-90 transition">
          View All Winners
        </button>
      </div>
    </div>
    </>

  );
};


   



export default Gallery;


