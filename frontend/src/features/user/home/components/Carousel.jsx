import { Link } from "react-router-dom";

export default function FeaturedCarousel({ season }) {
  return (
    <div className="w-full max-h-dvh relative mt-6 md:mt-0 flex justify-center items-center  max-w-400 mx-auto  h-full md:max-h-[95dvh]">
      {/* <section className=" w-full hidden md:flex  flex-col  max-w-4xl text-center mb-8 md:mb-6 px-4">
        <h2 className="text-white text-xl md:text-5xl font-bold  max-w-xl tracking-wider uppercase">
          ENTER THE{" "}
          <span className="bg-primary bg-clip-text text-transparent">
            GLITCH ARENA
          </span>
        </h2>

        <p className="text-gray-400 text-sm md:text-base mt-3  max-w-xl leading-relaxed">
          Step into the digital spotlight and prove your presence. The Glitch
          Arena is where creators, challengers, and rising icons compete for
          recognition and rewards. Upload your entry, gather votes from the
          community, and climb the leaderboard to claim your place among the
          elite.
        </p>

        <p className="text-gray-500 text-xs max-w-xl md:text-sm mt-3">
          Every season introduces a new challenge. Every vote pushes someone
          closer to the crown. Are you ready to enter the arena?
        </p>
      </section> */}

      <section className="border border-gray-900 rounded-xl md:rounded-none w-full max-w-90 h-60 sm:max-w-screen sm:h-120 md:h-170 relative overflow-hidden aspect-16\/9">

    <img
  src={`${season?.seasonPhotoUrl}?auto=compress&cs=tinysrgb&w=1600`}
  alt="event"
  loading="eager"
  decoding="async"
  className="w-full h-full object-cover"
  // onError={(e) => {
  //   e.currentTarget.onerror = null; 
  //   e.currentTarget.src =
  //     "https://img.freepik.com/free-vector/coming-soon-banner-with-focus-lights_1017-33739.jpg?semt=ais_hybrid&w=740&q=80";
  // }}
/>

        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />

       
        <section className="absolute hidden sm:flex inset-0 flex-col items-center justify-center text-center text-white px-6">
          <span className="border border-white/20 max-w-xs text-teal-400 text-xs px-4 py-1 rounded-full backdrop-blur bg-black/30 tracking-widest">
            PHASE 1 REGISTRATION ENDS IN
          </span>

          <h1
            className="uppercase mt-6 font-black max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight bg-gradient-to-b from-white via-white to-[#6A7282] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
          >
            {season?.seasonName || "COMING SOON"}
          </h1>

          <p className="text-gray-300 mt-4 max-w-2xl text-sm md:text-base opacity-80">
            {season?.seasonDesc}
          </p>

          <div className="flex gap-4 mt-8">
            {[
              { label: "DAYS", value: "02" },
              { label: "HOURS", value: "14" },
              { label: "MINS", value: "38" },
              { label: "SECS", value: "05" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-black/60 border border-white/10 w-25 h-24 rounded-md flex items-center text-primary justify-center text-[36px] font-bold font-mono">
                  {item.value}
                </div>
                <span className="text-[10px] mt-2 text-gray-400 font-bold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* mobile */}

        <section className=" sm:hidden absolute  bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <span className="border text-black font-semibold bg-primary text-[9px] px-2 py-0.5 w-fit">
            #FEATUREDCHALLENGE
          </span>

          <h1 className="font-extrabold  uppercase text-2xl leading-tight mt-1">
            {season?.seasonName || "Upcoming Challenge"}
          </h1>

          <p className="text-gray-300 text-xs mt-1">
            {season?.registrationEndDate ?
              new Date(season.registrationEndDate).toLocaleString()
            : "TBD"}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-[10px] text-gray-300">PRIZE POOL</p>
              <p className="text-lg font-bold">
                ₹{season?.prizeMoney?.toLocaleString() || "0"}
              </p>
            </div>

            <Link
              to={`/enter/${season?.seasonId}`}
              className=" border bg-primary text-black cursor-pointer rounded-full px-5 py-2 text-xs font-semibold"
            >
              Register Now →
            </Link>
          </div>
        </section>

      </section>

      <div className=" hidden w-full absolute -bottom-20 max-w-xl md:max-w-5xl h-39 bg-[#123B3B] border border-teal-500/30 rounded-xs p-6 sm:flex flex-col md:flex-row items-center  justify-between ]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/20 rounded-full border border-teal-500/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-[20px] md:text-[24px] font-bold uppercase tracking-wider">
              Seasonal Prize Pool
            </p>

            <p className="text-primary font-mono text-[24px] md:text-[36px] font-extrabold">
              ₹{season?.prizeMoney?.toLocaleString() || "250,000"}
            </p>
          </div>
        </div>

        <button className="mt-4 md:mt-0 bg-primary hover:bg-teal-300 text-black px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
          REGISTER NOW <span>&gt;</span>
        </button>
      </div>
    </div>
  );
}
