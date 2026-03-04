import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const events = [
  {
    id: 1,
    title: ["NEON", "NIGHTS", "SEOUL"],
    description:
      "Capture the electric pulse of the city. Low light, high stakes. Show us your best cyberpunk aesthetic.",
    prize: "$2,500",
    image:
      "https://www.creativeboom.com/upload/articles/77/77020aee1b9abf5dbf7f8437aa500cdb7046dfc8_944.jpg",
    status: "LIVE NOW",
    countdown: { days: "02", hrs: "14", min: "55" },
  },
  {
    id: 2,
    title: ["DESERT", "STORM", "DUBAI"],
    description:
      "Golden sands and dramatic shadows. Capture the heat and intensity.",
    prize: "$3,200",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    status: "COMING SOON",
    countdown: { days: "05", hrs: "10", min: "22" },
  },
  {
    id: 3,
    title: ["URBAN", "MOTION", "TOKYO"],
    description:
      "Fast streets, neon lights, and long exposure magic.",
    prize: "$4,000",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    status: "LIVE NOW",
    countdown: { days: "01", hrs: "08", min: "40" },
  },
];

export default function FeaturedCarousel() {

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
      {events.map((event) => (
        <SwiperSlide key={event.id}>
          <div className="w-full max-w-400 h-[70dvh] md:h-[95dvh] flex">

            
            <section className="w-1/2 hidden md:flex flex-col justify-center px-16 text-white space-y-6">
              <span className="border border-[#BE5EED] text-[#BE5EED] text-xs px-3 py-1 w-fit">
                #FeaturedChallenge
              </span>

              <h1 className="font-extrabold text-7xl leading-tight">
                {event.title.map((line, index) => (
                  <span key={index}>
                    {line} <br />
                  </span>
                ))}
              </h1>

              <p className="text-gray-400 max-w-lg">
                {event.description}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <button className="bg-[#BE5EED] hover:bg-purple-600 transition px-6 py-3 font-semibold text-black">
                  ENTER NOW
                </button>

                <div>
                  <p className="text-xs text-gray-400">PRIZE POOL</p>
                  <p className="text-xl font-bold">{event.prize}</p>
                </div>
              </div>
            </section>

            
            <section className="md:w-1/2 relative">
              <img
                src={event.image}
                alt="event"
                className="w-full h-full object-cover"
              />

             <button className="absolute bottom-6 left-6 bg-[#BE5EED] text-black px-4 py-2 text-sm font-semibold flex items-center gap-2">
  
  {event.status === "LIVE NOW" && (
    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute"></span>
  )}

  {event.status === "LIVE NOW" && (
    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
  )}

  {event.status}
</button>

              <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-3 text-sm">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {event.countdown.days}
                    </p>
                    <p className="text-xs text-gray-400">DAYS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {event.countdown.hrs}
                    </p>
                    <p className="text-xs text-gray-400">HRS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {event.countdown.min}
                    </p>
                    <p className="text-xs text-gray-400">MIN</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}