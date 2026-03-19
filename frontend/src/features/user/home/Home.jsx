import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Gallery = lazy(() => import("./components/Gallery"));
import Overview from "./components/OverviewSection";
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import { isRegistrationOpen, isVotingLive } from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame } from "lucide-react";
import New from "./components/New";

const Home = () => {
  const navigate = useNavigate();

  const { data: seasons = [], isLoading: seasonsLoading } =
    useLiveUpcomingSeasons();

  console.log(seasons);
  const season = seasons?.content?.find(isRegistrationOpen);
  const liveSeason = seasons?.content?.filter(isVotingLive)?.slice(0, 2);

  console.log(season);
  console.log(liveSeason);

  return (
    <div className="w-full  px-2  flex-col max-w-screen m-auto bg-[#1E2229] flex items-center justify-center bg-fixed bg-cover bg-center">
      <FeaturedCarousel season={season} />

      <StickyHeader liveSeason={liveSeason} season={season} />

      <section className="w-full sm:mt-12  space-y-6 md:space-y-12 flex flex-col items-center mt-5  ">
        <section className=" flex  w-full px-3 sm:px-20   justify-between items-center text-center">
          <h5 className="flex items-center justify-center gap-2">
            <Flame sm:size={40} className="text-red-400" />
            <span className="text-white mt-1 text-[18px] md:text-5xl  font-semibold">
              Live
            </span>
          </h5>
        </section>

        <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />

        <button
          onClick={() => navigate(`/vote/${liveSeason?.seasonId}`)}
          className="
            px-6 mt-2 py-2 md:px-13 md:py-3
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
          <New/>
        </Suspense>
      </section>

      <Overview />
    </div>
  );
};

export default Home;
