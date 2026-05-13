import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/parallax";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop",
  },

  {
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
  },

  {
    image:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function FeaturedCarousel() {
  const navigate = useNavigate();

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 40%"],
  });

  const textFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <div className="w-full h-140 sm:min-h-150 md:h-full md:max-h-dvh relative flex justify-center items-center mx-auto overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectCreative]}
          effect="creative"
          speed={1200}
          loop={true}
          watchSlidesProgress={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          creativeEffect={{
            prev: {
              shadow: false,
              translate: ["-10%", 0, -1],
              scale: 1.05,
              opacity: 0,
            },

            next: {
              translate: ["100%", 0, 0],
            },
          }}
          className="h-full w-full [transform:translate3d(0,0,0)]"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-screen overflow-hidden will-change-transform">
                {/* IMAGE */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover scale-[1.05]"
                  />
                </div>

                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-black/30 z-10" />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* FIXED CONTENT */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end md:justify-center px-6 md:px-12 max-w-[1400px] mx-auto pointer-events-none">
          <div className="pointer-events-auto pb-10 md:pb-0">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-6 block">
              Phase 1 Registration Open — 2026
            </span>

            <h1 className="font-black text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-[-0.04em] uppercase mb-4 sm:mb-8">
              Ascend to <br />
              <span className="block text-primary">GLITCHFAME</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
              <p className="max-w-md text-gray-300 text-sm md:text-base leading-relaxed">
                Where high-stakes competition meets digital dominance. The
                premier destination for seasonal esports.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/vote")}
                  className="bg-primary text-black hidden md:inline px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition duration-300"
                >
                  Join the Arena
                </button>

                <button
                  onClick={() => navigate("/arena")}
                  className="border border-white/30 text-white px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition duration-300"
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
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        ></div>

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

            <div ref={sectionRef} className="relative">
              <motion.h2
                style={{
                  // CHANGED: "to bottom" instead of "to right"
                  backgroundImage: useTransform(
                    textFill,
                    (v) =>
                      `linear-gradient(to bottom, white ${v}, #4b5563 ${v})`,
                  ),
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
                className="text-[clamp(2rem,6vw,4.3rem)] font-bold leading-[1.1] tracking-tighter uppercase text-transparent max-w-6xl"
              >
                Vote for your favorite contestants, rise through the rankings,
                compete with others, and get featured in the GlitchFame Hall of
                Fame.
              </motion.h2>
            </div>
          </div>

          {/* Bottom Section - 4 Column Layout Style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {/* Column 1: Feature */}
            <div className="border-l border-gray-800 pl-4 md:pl-6 pt-2">
              <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                01 / Participation
              </h4>
              <h3 className="font-bold text-lg uppercase mb-2">Join Seasons</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Participate in active seasons by adding your details, uploading
                your profile picture, and entering the competition.
              </p>
            </div>

            {/* Column 2: Feature */}
            <div className="border-l border-gray-800 pl-4 md:pl-6 pt-2">
              <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                02 / Approval
              </h4>
              <h3 className="font-bold text-lg uppercase mb-2">
                Admin Verification
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                After admin approval, your profile gets added to the season and
                becomes visible for public voting.
              </p>
            </div>

            <div className="md:col-span-2 border-l border-gray-800 pl-4 md:pl-6 pt-2 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                  03 / Community
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  Don’t want to participate? Explore contestants, vote for your
                  favorite users, and help them reach the Hall of Fame.
                </p>
                <div className="bg-primary text-black inline-block px-4 py-2">
                  <p className="text-xl font-black">LIVE</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest">
                    Voting Experience
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/039/072/289/small_2x/ai-generated-a-crowd-celebrating-victory-with-a-gold-trophy-large-copyspace-area-free-photo.jpeg"
                  alt="Arena"
                  loading="lazy"
                  decoding="async"
                  width={500}
                  height={192}
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
