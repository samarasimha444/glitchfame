import React, { Suspense, lazy } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Cards = lazy(() => import("./components/Cards"));
const Gallery = lazy(() => import("./components/Gallery"));
import Overview from "./components/OverviewSection";
import ArenaCard from "../arena/ui/ArenaCard";
import { useLiveUpcomingSeasons } from "./hooks";
import CountdownTimer from "./components/CountdownTimer";

const Home = () => {
  const { profile } = useOutletContext() || {};

    const { data: seasons = [], isLoading } = useLiveUpcomingSeasons("live");
    
  const season = seasons?.[0];

  console.log(season)

  return (
    <div className="w-full  px-1 flex-col max-w-screen m-auto bg-[#000000] md:bg-[#1E2229] flex items-center justify-center">
      <FeaturedCarousel season={season} />

      <div className="max-w-6xl px-2 w-full md:mb-6  mt-6 mx-auto text-center  sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            GLITCHFAME
          </span>
        </h1>

        <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
          SUMMER SEASON 04
        </p>

        <div className="flex  w-full justify-center gap-3 sm:gap-6 mt-6 sm:mt-10">
          <div className="flex-1 sm:flex-none bg-[#11161f] px-3 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 rounded-xl border border-gray-700 text-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
              VOTING ENDS IN
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                {season?.votingEndDate ? (
                <CountdownTimer endDate={season.votingEndDate} />
              ) : (
                "Loading..."
              )}
            </h2>
          </div>

          <div className="flex-1 sm:flex-none bg-[#0f1e22] px-3 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 rounded-xl border border-cyan-500/30 text-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
              TOTAL PRIZE POOL
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-400">
              $2,500.00
            </h2>
          </div>
        </div>
      </div>

      <section className="w-full bg-black md:bg-[#181B20]">
        <Suspense fallback={<p className="text-white"> </p>}>
          <ArenaCard id={season?.seasonId} />
        </Suspense>

        <Suspense fallback={<p className="text-white"> GalleryLoading...</p>}>
          <Gallery />
        </Suspense>
      </section>

      <Overview />
    </div>
  );
};

export default Home;
