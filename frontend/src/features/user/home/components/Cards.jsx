import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { getTimeLeft, useIsMobile } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";

const Cards = ({ liveSeason, isLoading }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-screen mx-auto px-2 sm:px-6 md:px-10 lg:px-20">
      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <ShimmerCard />
          <ShimmerCard />
        </section>
      ) : liveSeason?.length === 0 ? (
        <div className="w-full text-center py-20 text-gray-400 text-xl">
          No live seasons found.
        </div>
      ) : (
        <>
          {isMobile ? (
            /* ✅ MOBILE — NO ANIMATION */
            <section className="grid grid-cols-2 gap-3 sm:gap-6">
              {liveSeason?.map((item) => (
                <Link
                  to={`/vote/${item.seasonId}`}
                  key={item.seasonId}
                  className="w-full h-[278px] bg-[#181B20] rounded-2xl overflow-hidden border border-[#364354] hover:border-white transition duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={`${item.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=600`}
                      alt={item.seasonName}
                      className="h-[163px] w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-medium">
                      ● LIVE
                    </span>
                  </div>

                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <p className="text-[11px] text-primary uppercase tracking-wide">
                        {item.category}
                      </p>
                      <h3 className="text-white text-[14px] font-semibold mt-1 line-clamp-2">
                        {item.seasonName}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <p className="flex items-center gap-1">
                        <Timer size={14} />
                        <span>{getTimeLeft(item.votingEndDate)}</span>
                      </p>
                      <span className="text-primary font-medium">Vote</span>
                    </div>
                  </div>
                </Link>
              ))}
              
            </section>
          ) : (
            /* ✅ DESKTOP — WITH ANIMATION */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* MAIN CARD */}
              {liveSeason?.[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    to={`/vote/${liveSeason[0].seasonId}`}
                    className="group relative w-full h-[320px] rounded-xl overflow-hidden border border-gray-800 flex flex-col"
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={`${liveSeason[0].seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=800`}
                        alt={liveSeason[0].seasonName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition duration-500" />

                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </span>
                    </div>

                    <div className="relative z-10 mt-auto p-5">
                      <p className="text-[10px] text-primary uppercase font-black tracking-[0.15em]">
                        {liveSeason[0].category}
                      </p>

                      <h3 className="text-white font-bold text-lg mt-1">
                        {liveSeason[0].seasonName}
                      </h3>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2 text-gray-300 text-[11px]">
                          <Timer size={14} className="text-primary" />
                          <span>
                            {getTimeLeft(liveSeason[0].votingEndDate)}
                          </span>
                        </div>

                        <span className="text-white text-[13px] font-bold bg-white/10 px-4 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-black transition">
                          Vote Now
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* VIEW ALL CARD */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/live"
                  className="group relative w-full h-[320px] rounded-xl overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center"
                >
                  <div className="absolute inset-0 opacity-30 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                      className="w-full h-full object-cover grayscale group-hover:scale-110 transition duration-700"
                      alt="View all"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition">
                      <ArrowRight size={28} />
                    </div>

                    <h3 className="text-white font-bold text-xl">
                      View All Seasons
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                      Explore the full archive
                    </p>
                  </div>
                </Link>
              </motion.div>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cards;