import React, { Suspense, lazy, useRef } from "react";

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
import { useScroll, useTransform, motion } from "framer-motion";

const Home = () => {
  const missionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: missionRef,
    offset: ["start 80%", "end 20%"],
  });

  const textFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
     

      <section ref={missionRef} className="min-h-[305px] md:hidden border-y border-gray-800  px-6 py-12 flex flex-col justify-center">
        <div className="max-w-screen md:mx-auto w-full">
          <h5 className="home-h2">The Mission</h5>
          <motion.p
            style={{
              backgroundImage: useTransform(
                textFill,
                (v) => `linear-gradient(to bottom, white ${v}, #9ca3af ${v})`
              ),
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            className="text-[13px] sm:text-base text-transparent leading-relaxed max-w-xl"
          >
            GlitchFame celebrates the anomalies. Each season presents a new
            digital frontier where competitors clash for supremacy. We reward
            the creative, the bold, and the fast. One winner takes the crown;
            everyone else is just a glitch in the background.
          </motion.p>
        </div>
      </section>

      <SeasonData season={season} />

      <section className="w-full px-4 py-16 md:py-20  flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="home-h2">Live Seasons</h2>

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
