import { Link, useNavigate } from "react-router-dom";
import { User, Zap } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// Import standard Swiper styles (remove fade styles)
import "swiper/css";
import "swiper/css/pagination";


const images = [
  "https://images.pexels.com/photos/14960246/pexels-photo-14960246.jpeg?cs=srgb&dl=pexels-less-rock-14960246.jpg&fm=jpg",
  "https://tse3.mm.bing.net/th/id/OIP.mH44ISNpf9kj_zNEMcCwEwHaEK?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.KCUfds52iy8sP7L2Mjau9AHaEJ?pid=Api&P=0&h=180",
];

export default function FeaturedCarousel() {

  
  const navigate = useNavigate();

  return (
    <>

 <div className="w-full  h-120  sm:min-h-150  md:h-full md:max-h-dvh  relative flex justify-center items-center mx-auto overflow-hidden">

     
      
      

     
      <Swiper
        modules={[Autoplay]}
        speed={1000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="!h-full !w-full"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="!h-full w-full">
            <div className="relative  w-full h-full">
              <img
                src={img}
                alt="Slide"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10" />

      
      <div className="absolute inset-0 z-30 flex flex-col justify-end md:justify-center px-6 md:px-12 max-w-[1400px] mx-auto pointer-events-none">

        <div className="pointer-events-auto pb-10 md:pb-0">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-6 block">
            Phase 1 Registration Open — 2026
          </span>

          <h1 className="font-black text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-[-0.04em] uppercase   mb-4 sm:mb-8">
            Ascend to <br />
            <span className="block text-primary">GLITCHFAME</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
            <p className="max-w-md text-gray-300 text-sm md:text-base leading-relaxed">
              Where high-stakes competition meets digital dominance.
              The premier destination for seasonal esports.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/join")}
                className="bg-primary text-black hidden md:inline px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition"
              >
                Join the Arena
              </button>

              <button
                onClick={() => navigate("/arena")}
                className="border border-white/30 text-white px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition"
              >
                View Seasons
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>


     <section className=" text-white hidden md:flex py-14 md:py-20 px-6 font-sans relative overflow-hidden">
      {/* Background Grid Effect - Matches the reference image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', size: '100px 100px', backgroundSize: '80px 80px' }}>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Top Header Section - Spans Full Width */}
        <div className="border-b border-gray-800 pb-12 mb-12">
          <div className="flex justify-between items-start mb-16">
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
               Est. 2024 ©
            </div>
            <div className="text-right text-[10px] uppercase tracking-widest text-gray-400">
              GlitchFame / Global Esports <br /> Competitive Platform
            </div>
          </div>

          <h2 className="text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.1] tracking-tight max-w-6xl">
            GlitchFame is the premier destination for seasonal esports and 
            competitive creativity. A global platform for top-tier talent 
            to compete for massive prize pools and fame.
          </h2>
        </div>

        {/* Bottom Section - 4 Column Layout Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          
          {/* Column 1: Feature */}
          <div className="border-l border-gray-800 pl-4 md:pl-6 pt-2">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">01 / Competition</h4>
            <h3 className="font-bold text-lg uppercase mb-2">Rapid Seasons</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Four high-octane competitive seasons annually, designed to push the limits of digital skill.
            </p>
          </div>

          {/* Column 2: Feature */}
          <div className="border-l border-gray-800 pl-4 md:pl-6 pt-2">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">02 / Community</h4>
            <h3 className="font-bold text-lg uppercase mb-2">Global Registry</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Join over 50k+ verified competitors worldwide and claim your spot in digital history.
            </p>
          </div>

          {/* Column 3: The Image (Replacing the 4-image layout with one wide style) */}
          <div className="md:col-span-2 border-l border-gray-800 pl-4 md:pl-6 pt-2 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
               <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">03 / Legacy</h4>
               <p className="text-sm text-gray-300 leading-relaxed mb-6">
                We don't operate in silos. Every season is an end-to-end ecosystem designed to scale, 
                perform, and integrate seamlessly with the global gaming community.
               </p>
               <div className="bg-primary text-black inline-block px-4 py-2">
                  <p className="text-xl font-black">200K+</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest">Prizes Paid Out</p>
               </div>
            </div>
            
            {/* The single hero image replacing the old block */}
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop" 
                alt="Arena" 
                className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}