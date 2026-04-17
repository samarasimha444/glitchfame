import { Link, useNavigate } from "react-router-dom";
import { User, Zap } from "lucide-react";

export default function FeaturedCarousel() {

  
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full max-h-dvh relative  sm:mt-0 flex justify-center items-center  max-w-400 mx-auto  h-full md:max-h-[95dvh]">
        <section
          className="relative overflow-hidden w-full  sm:max-w-screen min-h-120 md:h-170  md:rounded-none border border-gray-900 aspect-[16/9]"
          aria-hidden="false"
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              src="/hero.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center blur-[7px] transform scale-[1.02] transition-transform duration-700 ease-out will-change-transform"
            />
            <div className="absolute  inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            <div
              className="absolute inset-0 
      bg-gradient-to-b from-black/80 via-black/40 to-black/90 
      pointer-events-none"
            />

            <div className="absolute inset-0 bg-[#0a0a0f]/40 mix-blend-multiply pointer-events-none" />
          </div>

          <section
            className="absolute flex inset-0 flex-col items-start
         md:items-center justify-center text-start md:text-center text-white px-6"
          >
            <span className="border border-white/20 max-w-xs text-teal-400 text-xs px-4 py-1 rounded-full backdrop-blur bg-black/30 tracking-widest">
              PHASE 1 REGISTRATION ENDS IN
            </span>

            <h1
              className="uppercase mt-6 hidden md:inline font-black max-w-4xl text-5xl md:text-8xl leading-[0.95] tracking-[-0.04em] bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent 
                   drop-shadow-[0_10px_40px_rgba(255,255,255,0.25)][-webkit-text-stroke:1px_rgba(255,255,255,0.15) ]"
            >
              ASCEND TO <br />
              <span className="text-primary ">GLITCHFAME</span>
            </h1>

            <h1
              className="uppercase mt-6 font-black md:hidden max-w-4xl text-5xl md:text-8xl leading-[0.95] tracking-[-0.04em] bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent 
                   drop-shadow-[0_10px_40px_rgba(255,255,255,0.25)][-webkit-text-stroke:1px_rgba(255,255,255,0.15) ]"
            >
              BEcome the  <br />
              <span className="text-primary  italic">GLITCH</span>
            </h1>


            <p className="text-gray-200 mb-3
             mt-6 max-w-xs md:max-w-2xl text-sm md:text-lg font-medium opacity-90 leading-relaxed">
              Where high-stakes competition meets digital dominance. 
              Showcase your skill, dominate the seasons, and immortalize your
              name in the Hall of Legends.
            </p>

            <button className="border-2  border-white/20 backdrop-blur-md px-8 py-3 font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-colors">
              View All Seasons
            </button>

            <div className="mt-8 hidden md:flex flex gap-4">
              <button className="bg-primary text-black px-8 py-3 font-black uppercase text-sm tracking-widest hover:bg-white transition-colors">
                Join the Arena
              </button>
              <button className="border-2 border-white/20 backdrop-blur-md px-8 py-3 font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-colors">
                View Seasons
              </button>
            </div>
          </section>
        </section>
      </div>

      <section className="bg-[#181820] hidden md:flex text-white  =py-14 md:py-20 px-6 ">

        <div className="max-w-[1184px] mx-auto flex flex-col md:flex-row items-center gap-12">

          <div className="flex-1 space-y-6">

            <h2 className=" mobile-h2 md:home-h2">
             <span className="hidden md:inline">What is GlitchFame?</span>
                <span className="md:hidden">THe mission</span>
               </h2>

            <p className=" text-[14px] md:text-[18px] text-gray-300 font-medium leading-relaxed max-w-xl">
              GlitchFame is the premier destination for seasonal esports and
              competitive creativity. We provide a global platform for top-tier
              talent to compete for massive prize pools, fame, and a permanent
              spot in digital history.
            </p>

            <div className="w-16 hidden md:inline  h-1 bg-primary rounded-full mb-10" />

            <div className=" hidden md:flex grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded border border-purple-500/30">
                  <span className="text-black">
                    <Zap />
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    Rapid Seasons
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Four high-octane competitive seasons annually.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded border border-purple-500/30">
                  <span className="text-black">
                    <User />
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    Global Registry
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Join 50k+ verified competitors worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 relative w-full max-w-[542px] ">
            <div className="border  border-gray-800 p-2 rounded-sm bg-gray-900/20">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop"
                alt="Esports Arena"
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-primary text-black p-4 pr-10 min-w-[180px] shadow-xl">
              <p className="text-2xl font-black leading-none">200K+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Prizes Paid Out
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
