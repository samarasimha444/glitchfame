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
<div className="w-full min-h-screen bg-display bg-fixed bg-cover bg-center flex flex-col items-center">
  <FeaturedCarousel />
  <StickyHeader season={season} />
  <SeasonData season={season} />

  {/* Main Section */}
  <section className="w-full px-4 py-8 md:py-12 md:bg-[#16191D] flex flex-col max-w-7xl mx-auto">
    
    {/* Header & Filter Container */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
      
      {/* Title & Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Live Seasons
          </h2>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 bg-red-950/30 border border-red-500/30 px-2 py-1 rounded-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
              Active
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
          Catch the action live as players compete for top prizes in our active circuits.
        </p>
      </div>

      {/* Filter Tabs - Mobile Optimized */}
      <div className="flex items-center p-1 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 w-full md:w-auto overflow-x-auto no-scrollbar">
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-md transition-all text-sm">
          <MenuSquare size={16} />
          All
        </button>
        <button className="flex-1 md:flex-none px-5 py-2.5 text-gray-400 font-semibold hover:text-white transition-colors text-sm">
          Trending
        </button>
        <button className="flex-1 md:flex-none px-5 py-2.5 text-gray-400 font-semibold hover:text-white transition-colors text-sm">
          Newest
        </button>
      </div>
    </div>

    {/* Cards Grid */}
    <div className="w-full">
      <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />
    </div>
  </section>

  {/* Secondary Section */}
  <section className="w-full px-4 py-12 md:bg-black">
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-900 rounded-xl" />}>
        <New />
      </Suspense>
    </div>
  </section>

  <Overview totalPrizeMoney={totalPrizeMoney} />
</div>
  );
};

export default Home;
