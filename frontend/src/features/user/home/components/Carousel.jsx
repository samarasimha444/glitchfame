import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLiveUpcomingSeasons } from "../hooks";

// const events = [
//   {
//     id: 1,
//     title: ["NEON", "NIGHTS", "SEOUL"],
//     description:
//       "Capture the electric pulse of the city. Low light, high stakes. Show us your best cyberpunk aesthetic.",
//     prize: "$2,500",
//     image:
//       "https://www.creativeboom.com/upload/articles/77/77020aee1b9abf5dbf7f8437aa500cdb7046dfc8_944.jpg",
//     status: "LIVE NOW",
//     countdown: { days: "02", hrs: "14", min: "55" },
//   },
//   {
//     id: 2,
//     title: ["DESERT", "STORM", "DUBAI"],
//     description:
//       "Golden sands and dramatic shadows. Capture the heat and intensity.",
//     prize: "$3,200",
//     image:
//       "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//     status: "COMING SOON",
//     countdown: { days: "05", hrs: "10", min: "22" },
//   },
//   {
//     id: 3,
//     title: ["URBAN", "MOTION", "TOKYO"],
//     description:
//       "Fast streets, neon lights, and long exposure magic.",
//     prize: "$4,000",
//     image:
//       "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
//     status: "LIVE NOW",
//     countdown: { days: "01", hrs: "08", min: "40" },
//   },
// ];

export default function FeaturedCarousel() {

   const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();


   const fallback =
  "https://tse2.mm.bing.net/th/id/OIP.tfkDUK4e10qzf8T8ls2g-AHaE7?pid=Api&P=0&h=180";
   console.log(seasons)

  return (
  
   <Swiper
  modules={[Autoplay, Pagination]}
  slidesPerView={1}
  loop={true}
  speed={1000} 
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  pagination={{ clickable: true }}
  navigation={false} 
  className="w-full"
>
      {seasons?.slice(0,1).map((season) => (

    <SwiperSlide key={season.seasonId}>

<div className="w-full relative mt-6 md:mt-0 justify-center items-center md:justify-start max-w-400 m-auto h-full md:h-[95dvh] flex">

 
  <section className="w-1/2 hidden md:flex flex-col justify-center px-16 text-white space-y-6">
    
    <span className="border border-[#BE5EED] text-[#BE5EED] text-xs px-3 py-1 w-fit">
      #FeaturedChallenge
    </span>

    <h1 className="font-extrabold text-7xl leading-tight">
      {season.seasonName.split(" ").map((word, index) => (
        <span key={index}>
          {word} <br />
        </span>
      ))}
    </h1>

    <p className="text-gray-400 max-w-lg">
      Participate in this photography season and compete with others.
    </p>

    <div className="flex items-center gap-6 pt-4">
      <button className="bg-[#BE5EED] hover:bg-purple-600 transition px-6 py-3 font-semibold text-black">
        ENTER NOW
      </button>

      <div>
        <p className="text-xs text-gray-400">PRIZE POOL</p>
        <p className="text-xl font-bold">
          ₹{season.prizeMoney.toLocaleString()}
        </p>
      </div>
    </div>
  </section>


  <section className="border md:border-none md:rounded-none border-gray-600 rounded-xl w-full max-w-90 h-[50vh] md:h-full md:w-1/2 md:max-w-screen relative overflow-hidden">

  <img
  src={season?.seasonPhotoUrl || fallback}
  alt="event"
  className="w-full h-full object-cover"
  onError={(e) => (e.target.src = fallback)}
/>

    
   <button className="absolute top-3 left-3 flex items-center gap-2 bg-[#BE5EED] text-white px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
  </span>
  LIVE NOW
</button>

  
    <div className="absolute top-3 right-3 md:top-6 md:right-6 flex gap-2">
      {["DAYS", "HRS", "MIN"].map((label, i) => (
        <div
          key={i}
          className="bg-black/70 backdrop-blur-md px-3 py-2 rounded-md text-center text-white"
        >
          <p className="text-sm font-bold">--</p>
          <p className="text-[10px] text-gray-400">{label}</p>
        </div>
      ))}
    </div>

    <section className="absolute sm:hidden bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">

      <span className="border border-[#BE5EED] font-semibold text-[#BE5EED] text-[9px] px-2 py-[2px] w-fit">
        #FEATUREDCHALLENGE
      </span>

      <h1 className="font-extrabold text-2xl leading-tight mt-1">
        {season.seasonName.split(" ").map((word, index) => (
          <span key={index} className="mr-1">
            {word}
          </span>
        ))}
      </h1>

      <p className="text-gray-300 text-xs mt-1">
        Capture the electric pulse of the city. Low light, high stakes.
      </p>

      <div className="flex items-center justify-between mt-3">

        <div>
          <p className="text-[10px] text-gray-300">PRIZE POOL</p>
          <p className="text-lg font-bold">
            ₹{season.prizeMoney.toLocaleString()}
          </p>
        </div>

        <button className="bg-[#BE5EED] rounded-full px-5 py-2 text-xs font-semibold">
          JOIN CHALLENGE
        </button>

      </div>

    </section>

  </section>

</div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}