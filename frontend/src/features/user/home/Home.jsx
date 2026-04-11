import React, { Suspense, lazy } from "react";
import FeaturedCarousel from "./components/Carousel";
const Gallery = lazy(() => import("./components/Gallery"));
const Overview = lazy(() => import("./components/OverviewSection"));
const New = lazy(() => import("./components/New"));
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import { isRegistrationOpen, isVotingLive, useIsMobile } from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame, Search } from "lucide-react";
import { useMemo } from "react";



const Home = () => {

   const isMobile = useIsMobile();
  

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


const totalPrizeMoney = useMemo(() => {
  return liveSeason?.reduce((sum, item) => {
    return sum + Number(item.prizeMoney || 0);
  }, 0);
}, [liveSeason]);


  return (
    <div className="w-full pt-18 px-2 sm:p-0  flex-col max-w-screen m-auto bg-display flex items-center justify-center bg-fixed bg-cover bg-center  ">
      <FeaturedCarousel season={season} />

      <StickyHeader season={season} />

      <section className="sm:mt-32 w-full">
    
        <section className="w-full sm:mt-12  space-y-6 md:space-y-12 flex flex-col items-center mt-5  ">

          <section className="flex flex-wrap  w-full px-3  md:px-20 justify-between items-center gap-4 sm:py-8">
            
            <h5 className="flex  items-center gap-1">

              <Flame className="text-red-500 w-6 h-6 md:w-10 md:h-10" />
              <span className="text-white flex  text-lg sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
                Live <span className="text-[#6A7282] hidden ml-2 sm:flex">CHALLANGES</span>
              </span>
            </h5>

         
          </section>

          <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />

          <Suspense fallback={<p className="text-white"></p>}>
  {isMobile ? <Gallery /> : <New />}
</Suspense>
        </section>
      </section>

      <Overview totalPrizeMoney={totalPrizeMoney} />
    </div>
  );
};

export default Home;
