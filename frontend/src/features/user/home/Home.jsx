import React, { Suspense, lazy } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
const Cards = lazy(() => import("./components/Cards"));
const Gallery = lazy(() => import("./components/Gallery"));
import Overview from "./components/OverviewSection";
import SeasonCardShimmer from "../../../components/loaders";



const Home = () => {
  
  const { profile } = useOutletContext() || {};

  return (
    <div className="w-full  flex-col max-w-screen m-auto bg-[#000000] md:bg-[#1E2229] flex items-center justify-center">
      
    

      <FeaturedCarousel />

      <div className="bg-[#0F141A] mt-0 hidden md:flex w-full items-center justify-center">
        <ul className="flex space-x-10 py-3 text-[14px] font-semibold">
          <h6 className="neon-blink text-lg md:text-xl">
            Participate in The Season to Win Big Prizes
          </h6>
        </ul>
      </div>

      <section className="w-full md:bg-[#181B20]">
       <Suspense fallback={<p className="text-white">  </p>}>
          <Cards />
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
