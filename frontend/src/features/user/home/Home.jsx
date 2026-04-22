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


export const fakeLiveSeason = [
  {
    seasonId: "season-001",
    seasonName: "Neon Overload: Zero Hour",
    category: "Gaming",
    seasonPhotoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    votingEndDate: "2026-05-01T23:59:59Z",
    entries: 1200,
    prize: 5000
  },
  {
    seasonId: "season-002",
    seasonName: "Code Clash Championship",
    category: "Development",
    seasonPhotoUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    votingEndDate: "2026-05-05T23:59:59Z",
    entries: 850,
    prize: 3000
  }
];

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
  {/* <StickyHeader season={season} /> */}


<section className="min-h-[305px] md:hidden border-y border-gray-800  px-6 py-12 flex flex-col justify-center">
  <div className="max-w-screen-xl mx-auto w-full">
    <h5 className="mobile-h2 mb-6">
      The Mission
    </h5>
    <p className="text-[13px] md:text-base text-gray-400 leading-relaxed max-w-xl">
      GlitchFame celebrates the anomalies. Each season presents a new digital 
      frontier where competitors clash for supremacy. We reward the creative, 
      the bold, and the fast. One winner takes the crown; everyone else is 
      just a glitch in the background.
    </p>
  </div>
</section>


  <SeasonData season={season} />

  {/* Main Section */}
  <section className="w-full px-4 py-16 md:py-12 md:bg-[#16191D] flex flex-col max-w-7xl mx-auto">
    
    {/* Header & Filter Container */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
      
      {/* Title & Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Live Seasons
          </h2>
  
          
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
        <p className="text-gray-400 hidden sm:inline text-sm md:text-base max-w-md leading-relaxed">
          Catch the action live as players compete for top prizes in our active circuits.
        </p>
      </div>

      
      <div className="flex  items-center p-1 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 w-full md:w-auto overflow-x-auto no-scrollbar">

        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-md transition-all text-[12px] sm:text-sm">
          <MenuSquare size={16} />
          All
        </button>
        <button className="flex-1 md:flex-none px-5 py-2.5 text-gray-400 font-semibold hover:text-white transition-colors text-[12px] sm:text-sm">
          Trending
        </button>
        <button className="flex-1 md:flex-none px-5 py-2.5 text-gray-400 font-semibold hover:text-white transition-colors text-[12px] sm:text-sm">
          Newest
        </button>
      </div>
    </div>

    {/* Cards Grid */}
    <div className="w-full">
      {/* <Cards liveSeason={liveSeason} isLoading={seasonsLoading} /> */}
       <Cards liveSeason={fakeLiveSeason} isLoading={seasonsLoading} />
    </div>
  </section>

  {/* Secondary Section */}
  <section className="w-full px-4 py-12 bg-black">
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-900 rounded-xl" />}>
        <New />
      </Suspense>
    </div>
  </section>

<div className="flex flex-col items-center sm:hidden justify-center py-16  p-4 font-sans">
      {/* Main Border Container - Updated to border-teal-300 */}
      <div className="w-full max-w-sm border-2 border-teal-300  p-8 text-center relative">
        
        {/* Flame Icon - Stroke updated to teal-300 */}
        <div className="flex justify-center mb-4">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="stroke-teal-300"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1 1.5 1 3.5 0 5s-3 3-5 3a5 5 0 0 1-5-5c0-1.1.32-2.13.88-3L8.5 14.5z" />
          </svg>
        </div>

        {/* Heading - 30px */}
        <h2 className="text-[30px] font-black text-white uppercase tracking-tighter leading-tight mb-4">
          Ready to Play?
        </h2>

        {/* Paragraph - 11px */}
        <p className="text-[11px] text-gray-300 leading-relaxed mb-8 px-4">
          Registration for Season 12 is now open. Don't let your chance expire.
        </p>

        {/* Button - Updated to bg-teal-300 with a darker hover state */}
        <button className="w-full bg-teal-300 hover:bg-teal-400 text-black font-bold py-3 px-6 transition-colors duration-200 uppercase tracking-wide">
          Enter Season 12
        </button>
      </div>

      {/* Footer Logo Area */}
      <div className="mt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
           {/* Logo background updated to teal-300 */}
           <div className="bg-teal-300 p-1 rounded-md">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
               <path d="M13 10V3L4 14H11V21L20 10H13Z" />
             </svg>
           </div>
           <span className="text-white text-2xl font-bold tracking-tight">GlitchFame</span>
        </div>
        <p className="text-[11px] text-gray-400 text-center max-w-[280px]">
          The premier platform for seasonal competition and fame. Celebrating winners one glitch at a time.
        </p>
      </div>
    </div>

  <Overview totalPrizeMoney={totalPrizeMoney} />
</div>
  );
};

export default Home;
