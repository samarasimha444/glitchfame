import { Trophy, Users, Camera, Zap, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: Trophy,
    title: "WIN BIG",
    description: "Weekly prize pools ranging from gear to cash. The best visionaries get paid.",
  },
  {
    id: 2,
    icon: Users,
    title: "VOTE",
    description: "Community-driven results. No gatekeepers, just the crowd’s eye.",
  },
  {
    id: 3,
    icon: Camera,
    title: "EQUIPMENT",
    description: "Partnerships with top brands to get the latest tech in your hands.",
  },
  {
    id: 4,
    icon: Zap,
    title: "SPEED",
    description: "Fast uploads, instant feedback, and rapid reward distribution.",
  },
];

const Overview = ({ totalPrizeMoney }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 bg-black md:bg-[#16191D] py-12 sm:py-24 flex justify-center overflow-hidden">

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-16 lg:gap-20">
        
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full sm:hidden flex flex-col items-center justify-center border border-teal-500/30 bg-teal-500/5 rounded-2xl p-8 text-center space-y-6"
        >
          <div className="p-3 bg-[#BE5EED]/10 rounded-full">
            <Flame className="text-primary" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Ready to Play?</h2>
            <p className="text-gray-400 text-sm">
              Registration for Season 12 is now open. Don't let your chance expire.
            </p>
          </div>
          <button 
            onClick={() => navigate("/season-12")}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs"
          >
            Enter Season 12
          </button>
        </motion.div>

        {/* TABLET & DESKTOP HEADER (From 'sm' upwards) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="w-full hidden sm:flex flex-col lg:w-1/2 text-white space-y-6 md:space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter uppercase">
            NOT JUST ANOTHER PICTURE.
          </h2>
          <p className="text-gray-400 max-w-xl text-base md:text-lg lg:text-xl leading-relaxed">
            GlitchFame is where creators compete and the community decides.
            Discover talent, cast your vote, and help crown the next digital icon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate("/season")}
              className="bg-primary text-black px-8 py-4 font-bold hover:bg-white transition-all uppercase tracking-widest text-xs"
            >
              START SUBMISSION
            </button>
            <button
              onClick={() => navigate("/aboutus")}
              className="border border-gray-600 text-white px-8 py-4 font-bold hover:border-primary transition-all uppercase tracking-widest text-xs"
            >
              HOW IT WORKS
            </button>
          </div>
        </motion.div>

        {/* FEATURES GRID SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`flex flex-col items-center justify-center text-center border border-gray-800 bg-[#1A1D21]/50 p-5 md:p-8 space-y-3 rounded-xl transition-all hover:border-primary/40
                  ${index >= 2 ? "hidden lg:flex" : "flex"}`} 
                >
                  <Icon className="text-primary" size={24} />
                  <h3 className="text-white font-bold text-[11px] md:text-sm tracking-widest uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs leading-snug">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* REWARD POOL BAR (Only on Mobile/Tablet) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:hidden"
          >
            <Link 
              to='/arena' 
              className="flex items-center justify-between border border-gray-800 bg-[#1A1D21] rounded-2xl px-6 py-5 hover:border-primary transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                    Live Reward Pool
                  </span>
                  <span className="text-white text-lg font-black">
                    ₹{totalPrizeMoney?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              <span className="text-gray-500 text-2xl font-light">›</span>
            </Link>
          </motion.section>
        </div>

      </div>
    </div>
  );
};

export default Overview;