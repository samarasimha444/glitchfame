import { Outlet, useOutletContext } from "react-router-dom";
import FeaturedCarousel from "./components/Carousel";
import Cards from "./components/Cards";
import Gallery from "./components/Gallery";
import Overview from "./components/OverviewSection";

const menuItems = [
  "#AESTHETICS",
  "ALL Challanges",
  "Neon NIghts",
  "Retro Nights",
  "Street Art",
  "Portrait",
];

const Home = () => {
  
  const { profile } = useOutletContext() || {};

  return (
    <div className="w-full space-y-3 flex-col max-w-screen m-auto bg-[#000000] md:bg-[#1E2229] flex items-center justify-center">
      {/* <div className="w-full max-w-400 h-[70dvh] md:h-[95dvh] flex">

        <section className="w-1/2 hidden md:flex flex-col justify-center px-16 text-white space-y-6">
          <span className="border border-[#BE5EED] text-[#BE5EED] text-xs px-3 py-1 w-fit">
            #FeaturedChallenge
          </span>

          <h1 className="font-extrabold text-7xl leading-tight">
            NEON <br />
            NIGHTS <br />
            SEOUL
          </h1>

          <p className="text-gray-400 max-w-lg">
            Capture the electric pulse of the city. Low light, high stakes. Show
            us your best cyberpunk aesthetic.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <button className="bg-[#BE5EED] hover:bg-purple-600 transition px-6 py-3 font-semibold text-black">
              ENTER NOW
            </button>

            <div>
              <p className="text-xs text-gray-400">PRIZE POOL</p>
              <p className="text-xl font-bold">$2,500</p>
            </div>
          </div>
        </section>

        <section className="md:w-1/2 relative">
          <img
            src="https://www.creativeboom.com/upload/articles/77/77020aee1b9abf5dbf7f8437aa500cdb7046dfc8_944.jpg"
            alt="Neon Seoul"
            className="w-full h-full object-cover"
          />

          <button className="absolute bottom-6 left-6 bg-[#BE5EED] text-black px-4 py-2 text-sm font-semibold">
            ● LIVE NOW
          </button>

          <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-3 text-sm">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="font-bold text-lg">02</p>
                <p className="text-xs text-gray-400">DAYS</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">14</p>
                <p className="text-xs text-gray-400">HRS</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">55</p>
                <p className="text-xs text-gray-400">MIN</p>
              </div>
            </div>
          </div>
        </section>
      </div>  */}

      <FeaturedCarousel />

      <div className="bg-[#0F141A] mt-0 hidden md:flex w-full items-center justify-center">
        <ul className="flex space-x-10 py-3 text-[14px] font-semibold">
          <h6 className="neon-blink text-lg md:text-xl">
            Participate in The Season to Win Big Prizes
          </h6>
        </ul>
      </div>

      <section className="w-full md:bg-[#181B20]">
        <Cards />

        <Gallery />
      </section>

      <Overview />
    </div>
  );
};

export default Home;
