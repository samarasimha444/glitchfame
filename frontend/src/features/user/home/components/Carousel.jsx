import { useEffect, useState } from "react";
import { useLiveUpcomingSeasons } from "../hooks";
import { Link } from "react-router-dom";

export default function FeaturedCarousel() {

  const { data: seasons = [], isLoading } = useLiveUpcomingSeasons();
  const season = seasons?.[0];

  const [timeLeft, setTimeLeft] = useState({ days: "--", hrs: "--", min: "--" });

  const fallback =
    "https://images.pexels.com/photos/3678857/pexels-photo-3678857.jpeg";

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

  if (!season) return null;

  return (
    <div className="w-full relative mt-6 md:mt-0 justify-center items-center md:justify-start max-w-400 m-auto h-full md:h-[95dvh] flex">

     
      <section className="w-1/2 hidden md:flex flex-col justify-center px-16 text-white space-y-6">

        <span className="border border-[#BE5EED] text-[#BE5EED] text-xs px-3 py-1 w-fit">
          #FeaturedChallenge
        </span>

        <h1 className="font-extrabold text-7xl max-w-[440px] leading-tight">
         {season.seasonName}
        </h1>

        <p className="text-gray-400 max-w-lg">
          Participate in this photography season and compete with others.
        </p>

        <div className="flex items-center gap-6 pt-4">
          <Link to={`/enter/${season.seasonId}`}  className="bg-[#BE5EED] hover:bg-purple-600 transition px-6 py-3 font-semibold text-black">
            ENTER NOW
          </Link>

          <div>
            <p className="text-xs text-gray-400">PRIZE POOL</p>
            <p className="text-xl font-bold">
              ₹{season.prizeMoney.toLocaleString()}
            </p>
          </div>
        </div>

      </section>

      
      <section className="border md:border-none md:rounded-none border-gray-600 rounded-xl w-full max-w-90 h-[50vh] md:h-full md:w-1/2 md:max-w-screen relative overflow-hidden">

        <img
          src={season?.seasonPhotoUrl || fallback}
          alt="event"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = fallback)}
        />

       
       <button className="absolute top-3 left-3 flex items-center gap-2 bg-[#BE5EED] text-white px-4 py-2 text-xs sm:text-[9px] font-bold rounded-3xl animate-pulse">
  
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
  </span>

  Register Now

</button>

        
        <div className="absolute top-3 right-3 md:top-6 md:right-6 flex gap-2">

          <div className="bg-black/70 px-3 py-2 rounded text-center text-white">
            <p className="font-bold">{timeLeft.days}</p>
            <p className="text-[10px] text-gray-400">DAYS</p>
          </div>

          <div className="bg-black/70 px-3 py-2 rounded text-center text-white">
            <p className="font-bold">{timeLeft.hrs}</p>
            <p className="text-[10px] text-gray-400">HRS</p>
          </div>

          <div className="bg-black/70 px-3 py-2 rounded text-center text-white">
            <p className="font-bold">{timeLeft.min}</p>
            <p className="text-[10px] text-gray-400">MIN</p>
          </div>

        </div>

       
        <section className="absolute sm:hidden bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">

          <span className="border border-[#BE5EED] font-semibold text-[#BE5EED] text-[9px] px-2 py-[2px] w-fit">
            #FEATUREDCHALLENGE
          </span>

          <h1 className="font-extrabold text-2xl leading-tight mt-1">
            {season.seasonName}
          </h1>

          <p className="text-gray-300 text-xs mt-1">
            Participate in this photography season and compete with others.
          </p>

          <div className="flex items-center justify-between mt-3">

            <div>
              <p className="text-[10px] text-gray-300">PRIZE POOL</p>
              <p className="text-lg font-bold">
                ₹{season.prizeMoney.toLocaleString()}
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