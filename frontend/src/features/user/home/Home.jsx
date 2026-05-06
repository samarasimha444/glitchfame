import React, { Suspense, lazy } from "react";
import FeaturedCarousel from "./components/Carousel";
const Overview = lazy(() => import("./components/OverviewSection"));
const New = lazy(() => import("./components/New"));
import { useLiveUpcomingSeasons } from "./hooks";

import {
  isRegistrationOpen,
  isVotingLive,
} from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame, MenuSquare, Search } from "lucide-react";
import { useMemo } from "react";
import SeasonData from "./components/SeasonData";

const Home = () => {
 

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
    <div className="w-full min-h-screen    bg-fixed bg-cover bg-center flex flex-col items-center">
      <FeaturedCarousel />

      <section className="min-h-[305px] md:hidden border-y border-gray-800  px-6 py-12 flex flex-col justify-center">
        <div className="max-w-screen md:mx-auto w-full">
          <h5 className="home-h2">The Mission</h5>
          <p className="text-[13px] sm:text-base text-gray-400 leading-relaxed max-w-xl">
            GlitchFame celebrates the anomalies. Each season presents a new
            digital frontier where competitors clash for supremacy. We reward
            the creative, the bold, and the fast. One winner takes the crown;
            everyone else is just a glitch in the background.
          </p>
        </div>
      </section>

      <SeasonData season={season} />

      <section className="w-full px-4 py-16 md:py-12  flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="home-h2">Live Seasons</h2>

              {/* <div className="inline-flex items-center gap-1.5 bg-red-950/30 border border-red-500/30 px-2 py-1 rounded-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                  Active
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />
        </div>
      </section>

      
      <section className="w-full px-4 py-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="h-40 w-full animate-pulse bg-gray-900 rounded-xl" />
            }
          >
            <New />
          </Suspense>
        </div>
      </section>

      <Overview totalPrizeMoney={totalPrizeMoney} />
    </div>
  );
};

export default Home;
