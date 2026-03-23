import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Gallery = lazy(() => import("./components/Gallery"));
import Overview from "./components/OverviewSection";
import { useLiveUpcomingSeasons } from "./hooks";
import { StickyHeader } from "./components/Header";
import { isRegistrationOpen, isVotingLive } from "../../../lib/helper";
import Cards from "./components/Cards";
import { Flame, Search } from "lucide-react";
import New from "./components/New";
import { ContestantCard } from "../Voting/ui/ContestantCards";
import ContestStats from "./components/box";

const Home = () => {
  const navigate = useNavigate();

  const { data: seasons = [], isLoading: seasonsLoading } =
    useLiveUpcomingSeasons();

  console.log(seasons);
  const season = seasons?.content?.find(isRegistrationOpen);
  const liveSeason = seasons?.content?.filter(isVotingLive)?.slice(0, 2);

 
  return (
    <div className="w-full  px-2  flex-col max-w-screen m-auto bg-[#1E2229] flex items-center justify-center bg-fixed bg-cover bg-center">
      <FeaturedCarousel season={season} />
     

      <StickyHeader liveSeason={liveSeason} season={season} />


      <section className="sm:mt-12 w-full">

         <ContestStats/>
          <section className="w-full sm:mt-12  space-y-6 md:space-y-12 flex flex-col items-center mt-5  ">

      <section className="flex flex-wrap  w-full px-3 sm:px-20 justify-between items-center gap-4 sm:py-8">
   
      <h5 className="flex items-center gap-2">
        <Flame className="text-red-500 w-6 h-6 md:w-10 md:h-10" />
        <span className="text-white text-2xl md:text-5xl font-bold uppercase tracking-tight">Live</span>
      </h5>

      <div className=" hidden sm:flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Find your vibe..." 
            className="w-full bg-[#111214] border border-gray-800 rounded-md py-3.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-gray-600 transition"
          />
        </div>
        
        <button className="bg-[#1a1c20] border border-gray-800 text-white text-[10px] font-bold px-4 py-3 rounded-md uppercase tracking-widest hover:bg-gray-800">
          Find
        </button>
      </div>

    </section>

        <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />

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
        </button>

        <Suspense fallback={<p className="text-white">Gallery Loading...</p>}>
          <Gallery />
          <New/>
        </Suspense>
      </section>
      </section>

     

      

      <Overview />
    </div>
  );
};

export default Home;
