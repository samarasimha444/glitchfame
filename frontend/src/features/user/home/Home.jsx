import React, { Suspense, lazy } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Gallery = lazy(() => import("./components/Gallery"));
import Overview from "./components/OverviewSection";
import ArenaCard from "../arena/ui/ArenaCard";
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import { useContestantsById } from "../arena/hooks";
import { isRegistrationOpen, isVotingLive } from "../../../lib/helper";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useOutletContext() || {};

  const { data: seasons = [], isLoading: seasonsLoading } =
    useLiveUpcomingSeasons();

  const season = seasons?.find(isRegistrationOpen);
  const liveSeason = seasons?.find(isVotingLive);

  const {
    data: contestantsData,
    isLoading: contestantsLoading,
    isError,
  } = useContestantsById(liveSeason?.seasonId);

  const arenaLoading = seasonsLoading || contestantsLoading;

  return (
    <div className="w-full px-1 flex-col max-w-screen m-auto bg-[#000000] md:bg-[#1E2229] flex items-center justify-center bg-fixed bg-cover bg-center">
      
      <FeaturedCarousel season={season} />

      <StickyHeader liveSeason={liveSeason} season={season} />

      <section className="w-full space-y-4 flex flex-col items-center mt-6 bg-black md:bg-[#181B20]">
        
        <ArenaCard
          contestantsData={contestantsData}
          isLoading={arenaLoading}
          isError={isError}
        />


        <button
          onClick={() => navigate(`/vote/${liveSeason?.seasonId}`)}
          className="
            px-6 mt-5 py-2 md:px-13 md:py-3
            text-sm md:text-base
            rounded-md md:rounded-lg
            font-semibold
            bg-white/10 backdrop-blur border border-white/20
            text-white hover:bg-white/20 transition
            cursor-pointer
          "
        >
          View More
        </button>

        <Suspense fallback={<p className="text-white">Gallery Loading...</p>}>
          <Gallery />
        </Suspense>

      </section>

      <Overview />
    </div>
  );
};

export default Home;