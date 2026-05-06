import React from "react";
import { Trophy, Users, Camera, Zap, Flame, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { id: 1, icon: Trophy, title: "WIN BIG", description: "Weekly prize pools ranging from gear to cash." },
  { id: 2, icon: Users, title: "VOTE", description: "Community-driven results. No gatekeepers." },
  { id: 3, icon: Camera, title: "EQUIPMENT", description: "Partnerships with top brands for latest tech." },
  { id: 4, icon: Zap, title: "SPEED", description: "Fast uploads and rapid reward distribution." },
];

const Overview = ({ totalPrizeMoney }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-[70vh] lg:min-h-[120dvh]  flex items-center justify-center py-12 px-4 sm:py-24 bg-[#0a0c10] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* MOBILE ONLY: HEADER CONTENT */}
        <div className="flex sm:hidden flex-col w-full space-y-4 mb-4">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            The Arena <br /> <span className="text-primary">Awaits</span>
          </h1>
          <p className="text-[13px] mb-4 sm:text-base text-gray-400 leading-relaxed max-w-xs">
            Only the best rise — the next digital icon is decided by the crowd.
          </p>
        </div>

        {/* LEFT COLUMN: BRANDING & CTA (DESKTOP) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-5/12 text-white space-y-8"
        >
          <div className="hidden sm:block space-y-6">
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              NOT JUST <br /> ANOTHER <br /> 
              <span className="text-primary">PICTURE.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed border-l-2 border-primary/30 pl-4">
              GlitchFame is where creators compete and the community decides. 
              Discover talent, cast your vote, and help crown the next icon.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/season")}
              className="group relative overflow-hidden bg-primary text-black px-8 py-4 font-black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              START SUBMISSION
              <Zap size={14} className="fill-current" />
            </button>
            <button
              onClick={() => navigate("/aboutus")}
              className="border border-gray-800 text-white px-8 py-4 font-bold hover:border-primary/50 hover:bg-gray-900/50 transition-all uppercase tracking-widest text-xs"
            >
              HOW IT WORKS
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: GRID & REWARDS */}
        <div className="w-full lg:w-6/12 flex flex-col gap-6">
          
          {/* FEATURES GRID */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="flex flex-col items-center justify-center text-center border border-gray-800 bg-[#14181d]/40 p-6 sm:p-10 rounded-2xl space-y-4 hover:border-primary/30 transition-all group"
              >
                <div className="p-3 bg-gray-900 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <item.icon className="text-primary" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-black text-[11px] md:text-sm tracking-widest uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs leading-snug">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* REWARD POOL ACTION BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <Link 
              to='/arena' 
              className="flex items-center justify-between  bg-primary/5 rounded-2xl px-6 py-6 hover:bg-primary/10 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-lg opacity-20 sm:animate-pulse"></div>
                  <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                    <Trophy size={24} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                    Live Reward Pool
                  </span>
                  <span className="text-white text-2xl font-black tabular-nums">
                    ₹{totalPrizeMoney?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-primary group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Overview;