import React from "react";

const artworks = [
  {
    id: 1,
    image: "https://tse4.mm.bing.net/th/id/OIF.dgR7qhvVOfXA6JEidp1C7A?pid=Api&P=0&h=180",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    username: "@Kaelin.psd",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    username: "@NeonWave",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    username: "@PixelQueen",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    username: "@FutureArt",
  },
 
];


const Gallery = () => {
  return (
    <div className=" w-full mt-12 px-6 md:px-20  flex flex-col items-center justify-center overflow-x-hidden">

  <section className="w-full   py-16">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-[#BE5EED] text-xs md:text-[12px] tracking-widest font-semibold uppercase">
              Trending Submissions
            </p>

            <h2 className=" text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              BEST OF THE WEEK
            </h2>
          </div>

          <div className="flex items-center gap-4 mt-6">
        

            <button
              className="px-6 py-3 hidden md:flex rounded-md border border-[#2A323C] 
                       text-white text-sm font-semibold 
                       hover:bg-[#1B2129] transition"
            >
              VIEW GALLERY
            </button>
          </div>
        </div>
      </section>


  <div className="flex  md:grid md:grid-cols-4 gap-6 overflow-x-auto">
  {artworks.map((item) => (
    <article
      key={item.id}
      className="relative w-[320px] h-87.5 border border-[#2A323C] bg-[#181B20] "
    >
      
      <img
        className="w-full h-full object-cover"
        src={item.image}
        alt={item.username}
      />

     
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

     
      <div className="absolute bottom-4 left-4 flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full border border-white/20 object-cover"
          src={item.profileImage}
          alt={item.username}
        />
        <p className="text-white font-medium text-sm">
          {item.username}
        </p>
      </div>
    </article>
  ))}
</div>

    </div>
  );
};

export default Gallery;