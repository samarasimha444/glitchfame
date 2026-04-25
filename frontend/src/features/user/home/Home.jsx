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
<div className="w-full min-h-screen    bg-fixed bg-cover bg-center flex flex-col items-center">
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
  <section className="w-full px-4 py-16 md:py-12  flex flex-col max-w-7xl mx-auto">
    
    {/* Header & Filter Container */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
      
      {/* Title & Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="home-h2">
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
       
      </div>

      
      

      
    </div>



   
    <div className="w-full">
      <Cards liveSeason={liveSeason} isLoading={seasonsLoading} />
      
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

<div className="flex flex-col items-center sm:hidden justify-between p-6 font-sans">
  {/* Top Spacer to push content toward center/bottom for ergonomics */}
  <div className="h-4" />

  {/* Main Card */}
  <div className="w-full max-w-[320px] bg-neutral-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative">
    {/* Accent corner - gives it a technical/gaming feel without being tacky */}
    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary rounded-tr-2xl opacity-50" />
    
    {/* Icon with a soft glow */}
    <div className="mb-8 flex justify-start">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="stroke-primary relative"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1 1.5 1 3.5 0 5s-3 3-5 3a5 5 0 0 1-5-5c0-1.1.32-2.13.88-3L8.5 14.5z" />
        </svg>
      </div>
    </div>

    {/* Heading - Clean, tight, and professional */}
    <h2 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">
      Ready to Play?
    </h2>

    {/* Paragraph - More readable, less aggressive */}
    <p className="text-[13px] text-gray-400 leading-relaxed mb-8">
      Registration for <span className="text-white font-medium">Season 12</span> is now open. Secure your spot before the countdown ends.
    </p>

    {/* Button - Focused on utility */}
    <button className="w-full bg-primary text-black font-semibold py-3.5 rounded-xl transition-transform active:scale-[0.98] shadow-lg shadow-primary/10">
      Enter Season 12
    </button>
  </div>

  {/* Footer - Minimalist approach */}
  <div className="w-full flex flex-col items-center gap-4 pb-8">
    <div className="flex items-center gap-2.5">
       <div className="bg-primary aspect-square w-8 flex items-center justify-center rounded-lg">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
           <path d="M13 10V3L4 14H11V21L20 10H13Z" />
         </svg>
       </div>
       <span className="text-white text-xl font-bold tracking-tight">GlitchFame</span>
    </div>
    <div className="h-[1px] w-12 bg-white/10" />
    <p className="text-[11px] text-gray-500 text-center max-w-[200px] leading-tight">
      The premier platform for seasonal competition.
    </p>
  </div>
</div>

  <Overview totalPrizeMoney={totalPrizeMoney} />
</div>
  );
};

export default Home;

