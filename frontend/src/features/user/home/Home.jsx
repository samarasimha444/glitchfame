import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Gallery = lazy(() => import("./components/Gallery"));
const Overview = lazy(() => import("./components/OverviewSection"));
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import { isRegistrationOpen, isVotingLive } from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame, Search } from "lucide-react";
import New from "./components/New";
import { useMemo } from "react";


const Home = () => {
  const navigate = useNavigate();

  const { data: seasons = [], isLoading: seasonsLoading } =
    useLiveUpcomingSeasons();

 
const season = useMemo(
  () => seasons?.content?.find(isRegistrationOpen),
  [seasons]
);

 const liveSeason = useMemo(
  () => seasons?.content?.filter(isVotingLive)?.slice(0, 2),
  [seasons]
);

  return (
    <div className="w-full  px-2 sm:p-0  flex-col max-w-screen m-auto bg-display flex items-center justify-center bg-fixed bg-cover bg-center  ">
      <FeaturedCarousel season={season} />

      <StickyHeader liveSeason={liveSeason} season={season} />

      <section className="sm:mt-32 w-full">
    
        <section className="w-full sm:mt-12  space-y-6 md:space-y-12 flex flex-col items-center mt-5  ">
          <section className="flex flex-wrap  w-full px-3 sm:px-20 justify-between items-center gap-4 sm:py-8">
            
            <h5 className="flex items-center gap-2">

              <Flame className="text-red-500 w-6 h-6 md:w-10 md:h-10" />
              <span className="text-white flex  text-lg md:text-5xl font-bold uppercase tracking-tight">
                Live <span className="text-[#6A7282] hidden ml-2 sm:flex">CHALLANGES</span>
              </span>
            </h5>

         
          </section>

          <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />
{/* 
          <button
            onClick={() => navigate(`/arena`)}
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
          </button> */}

          <Suspense fallback={<p className="text-white"></p>}>
            <Gallery />
            <New />
          </Suspense>
        </section>
      </section>

      <Overview />
    </div>
  );
};

export default Home;
