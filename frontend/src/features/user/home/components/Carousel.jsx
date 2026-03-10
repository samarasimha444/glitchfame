import { useEffect, useState } from "react";
import { useLiveUpcomingSeasons } from "../hooks";
import { Link } from "react-router-dom";

export default function FeaturedCarousel() {

  const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();
  const season = seasons?.[0];

  const [timeLeft, setTimeLeft] = useState({ days: "--", hrs: "--", min: "--" });

  const fallback =
    "https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg";

  useEffect(() => {
    if (!season?.votingEndDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(season.votingEndDate);

      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hrs: 0, min: 0 });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const min = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft({ days, hrs, min });

    }, 1000);

    return () => clearInterval(timer);
  }, [season]);

  return (
    
    <div className="w-full relative mt-6 md:mt-3 flex justify-center items-center max-w-400 mx-auto h-full md:h-[95dvh]">

      <section className="border border-gray-600 rounded-xl w-full max-w-90 md:max-w-screen md:w-[1120px] h-62.5 md:h-160 relative overflow-hidden aspect-16\/9">

       
        <img
          src={`${season?.seasonPhotoUrl || fallback}?auto=compress&cs=tinysrgb&w=1600`}
          alt="event"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = fallback)}
        />

        {/* DESKTOP UI */}
        <section className="absolute hidden md:flex inset-0 flex-col items-center justify-center text-center text-white px-6">

          <span className="border border-purple-400 text-purple-300 text-xs px-4 py-1 rounded-full backdrop-blur bg-black/30">
            NEXT CHALLENGE ANNOUNCEMENT
          </span>

          <h1 className="mt-6 font-extrabold leading-tight text-6xl lg:text-7xl">
            THE{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              NEON
            </span>
          </h1>

          <h1 className="font-extrabold text-6xl lg:text-7xl">
            FRONTIER
          </h1>

          <p className="text-gray-300 mt-4 max-w-xl text-sm">
            Push the boundaries of creativity in our biggest creative challenge.
          </p>

          <button className="mt-6 bg-[#BE5EED] hover:opacity-90 transition text-black font-semibold px-6 py-3 rounded-full">
            Register Now →
          </button>

          <div className="flex items-center gap-8 mt-6 text-sm text-gray-300">
            <span>₹{season?.prizeMoney?.toLocaleString()}</span>
            <span>
              ⏱ {timeLeft.days}D {timeLeft.hrs}H {timeLeft.min}M
            </span>
          </div>
        </section>

        {/* MOBILE UI */}
        <section className="absolute sm:hidden bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">

          <span className="border border-[#BE5EED] font-semibold text-[#BE5EED] text-[9px] px-2 py-0.5 w-fit">
            #FEATUREDCHALLENGE
          </span>

          <h1 className="font-extrabold text-2xl leading-tight mt-1">
            {season?.seasonName || "Upcoming Challenge"}
          </h1>

          <p className="text-gray-300 text-xs mt-1">
            Participate in this photography season and compete with others.
          </p>

          <div className="flex items-center justify-between mt-3">

            <div>
              <p className="text-[10px] text-gray-300">PRIZE POOL</p>
              <p className="text-lg font-bold">
                ₹{season?.prizeMoney?.toLocaleString() || "0"}
              </p>
            </div>

            <button className="bg-[#BE5EED] rounded-full px-5 py-2 text-xs font-semibold">
              JOIN CHALLENGE
            </button>

          </div>
        </section>

      </section>
    </div>



  );
}