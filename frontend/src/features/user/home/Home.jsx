import React, { Suspense, lazy } from "react";
import FeaturedCarousel from "./components/Carousel";
const Overview = lazy(() => import("./components/OverviewSection"));
const New = lazy(() => import("./components/New"));
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import {
  isRegistrationOpen,
  isVotingLive,
  useIsMobile,
} from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame, MenuSquare, Search } from "lucide-react";
import { useMemo } from "react";
import SeasonData from "./components/SeasonData";

const Home = () => {
  const isMobile = useIsMobile();

  const { data: seasons = [], isLoading: seasonsLoading } =
    useLiveUpcomingSeasons();

  const season = useMemo(
    () => seasons?.content?.find(isRegistrationOpen),
    [seasons],
  );

  const liveSeason = useMemo(
    () => seasons?.content?.filter(isVotingLive)?.slice(0, 2),
    [seasons],
  );

  const totalPrizeMoney = useMemo(() => {
    return liveSeason?.reduce((sum, item) => {
      return sum + Number(item.prizeMoney || 0);
    }, 0);
  }, [liveSeason]);

  return (
    <div className="w-full pt-18  sm:p-0  flex-col max-w-screen m-auto  bg-display flex min-h-screen border border-gray-800 items-center justify-center bg-fixed bg-cover bg-center  ">
      <FeaturedCarousel/>

      <StickyHeader season={season} />

      <SeasonData season={season} />

      <section className="w-full px-3 min-h-[660px]  bg-black md:bg-[#16191D]  flex flex-col max-w-296 mx-auto py-18  ">
        <div className="flex flex-col  md:flex-row md:items-end justify-between mb-8 gap-4">

          {/* <div className="flex flex-col gap-2 mb-10">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <h6 className="text-red-600 hidden md:block text-[12px] uppercase tracking-widest text-xs font-bold">
                Real-Time Hub
              </h6>
            </div>
            <h2 className="mobile-h2 md:home-h2 mt-1 flex items-center gap-3">
              Live Seasons

              <div className="inline-flex items-center gap-1.5 md:hidden bg-[#1a0505] border border-red-900/40 px-2 py-0.5 rounded-md">
                <span className="relative flex h-2 w-2">
                  <span className="sm:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>

                <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 leading-none">
                  Active
                </span>
              </div>
            </h2>

            <p className="small-text">
              Currently active circuits. Join now to secure your spot in the
              bracket.
            </p>
          </div> */}

         <div className="flex justify-between items-start mb-7 sm:mb-14">
    <div className="space-y-4 sm:space-y-6">
      
      <h2 className="mobile-h2 md:home-h2 mt-1 flex items-center gap-3">
              Live Seasons

              <div className="inline-flex items-center gap-1.5 md:hidden bg-[#1a0505] border border-red-900/40 px-2 py-0.5 rounded-md">
                <span className="relative flex h-2 w-2">
                  <span className="sm:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>

                <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 leading-none">
                  Active
                </span>
              </div>
            </h2>
      <p className="small-text max-w-xs">
      Catch the action live as players compete for top prizes
      </p>
    </div>
  </div>


          <div className="flex items-center space-x-3  justify-center bg-black p-1 rounded-md md:border text-[13px] border-gray-500 self-center md:self-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-black  font-semibold rounded-sm border border-gray-500 md:border-none">
              <span className="">
                <MenuSquare />
              </span>{" "}
              All
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-gray-400  font-semibold hover:text-white border border-gray-500 transition-colors md:border-none">
              Trending
            </button>

            <button className="flex items-center gap-2 px-6 py-2 border border-gray-500 text-gray-400  font-semibold hover:text-white transition-colors md:border-none">
              Newest
            </button>
          </div>
        </div>

        <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />

       
      </section>

      <section className="md:bg-black w-full px-3 py-16 ">
        <Suspense fallback={<p className="text-white"></p>}>
          <New />
        </Suspense>
      </section>
    
      <Overview totalPrizeMoney={totalPrizeMoney} />
    </div>
  );
};

export default Home;
