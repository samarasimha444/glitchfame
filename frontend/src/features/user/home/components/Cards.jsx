import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Timer, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";
import { getTimeLeft, useIsMobile } from "../../../../lib/helper";
import ShimmerCard from "../../../../components/ShimmerCard";

const Cards = ({ liveSeason, isLoading }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex sm:block justify-center max-w-screen mx-auto md:py-10">
      {isLoading ?
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <ShimmerCard />
          <ShimmerCard />
        </section>
      : liveSeason?.length === 0 ?
        <div className="w-full text-center py-20 text-gray-400 text-xl">
          No live seasons found.
        </div>
      : <>
          {isMobile ?
            <div className="w-full max-w-[340px] rounded-lg overflow-hidden border border-[#2A323C] bg-[#111418] font-sans">
              <div className="relative h-[180px] w-full">
                <img
                  src={`${liveSeason[0].seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=800`}
                  alt={liveSeason[0].seasonName}
                  loading="lazy"
                  className="w-full h-full object-cover "
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#181820] border border-[#FF3B3B] px-2.5 py-1 ">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3B3B]">
                    Live Now
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-[#8B5CF6]/20 border border-[#8B5CF6] px-3 py-1 rounded">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">
                    Trending
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-[18px] font-bold text-white uppercase tracking-tight mb-3">
                  Neon Overload: Zero Hour
                </h3>

                {/* Info Row (Entries & Prize) */}
                <div className="flex items-center justify-between text-gray-400 text-sm border-t border-[#2A323C] pt-3">
                  <div className="flex items-center gap-2">
                    <span className="">
                      <User size={12} />
                    </span>
                    1.2k entries
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      <Trophy size={12} />
                    </span>{" "}
                    {/* Use an actual Trophy icon here if needed */}
                    Prize:{" "}
                    <span className="text-white font-medium">$5,000</span>
                  </div>
                </div>
              </div>
            </div>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSeason?.[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    to={`/vote/${liveSeason[0].seasonId}`}
                    className="group relative w-full h-92 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
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

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/arena"
                  className="group relative w-full h-92 rounded-xl overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center"
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
          }
        </>
      }
    </div>
  );
};

export default Cards;
