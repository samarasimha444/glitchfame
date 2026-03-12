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
  const navigate = useNavigate()
  const { profile } = useOutletContext() || {};

  const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();

  const findRegisteration = seasons?.filter(isRegistrationOpen)
  const findLive= seasons?.filter(isVotingLive);

  const season = findRegisteration?.[0];

  const liveSeason = findLive?.[0]
  
 const { data: contestantsData, isLoading:load, isError } = useContestantsById(liveSeason?.seasonId);
   

  return (
    
    <div className="w-full  px-1 flex-col max-w-screen m-auto bg-[#000000] md:bg-[#1E2229] flex items-center justify-center bg-fixed bg-cover bg-center">

      <FeaturedCarousel season={season} />
  
     <StickyHeader liveSeason={liveSeason} season={season} />

      <section className="w-full flex flex-col items-center mt-6 bg-black md:bg-[#181B20]">

        <Suspense fallback={<p className="text-white"> </p>}>
          <ArenaCard contestantsData={contestantsData} isLoading={load} />

        
            <button onClick={()=>navigate(`/vote/${season?.seasonId}`)}
              className=" 
               px-6 py-2 md:px-13 md:py-3 
               text-sm md:text-base 
               rounded-md md:rounded-lg 
               font-semibold
               bg-white/10 backdrop-blur border border-white/20
               text-white hover:bg-white/20 transition
               cursor-pointer"
            >
              View More
            </button>
          
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
