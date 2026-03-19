import { Trophy, Users, Camera, Zap } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Trophy,
    title: "WIN BIG",
    description:
      "Weekly prize pools ranging from gear to cash. The best visionaries get paid.",
  },
  {
    id: 2,
    icon: Users,
    title: "VOTE",
    description:
      "Community-driven results. No gatekeepers, just the crowd’s eye.",
  },
  {
    id: 3,
    icon: Camera,
    title: "EQUIPMENT",
    description:
      "Partnerships with top brands to get the latest tech in your hands.",
  },
  {
    id: 4,
    icon: Zap,
    title: "SPEED",
    description:
      "Fast uploads, instant feedback, and rapid reward distribution.",
  },
];

const Overview = () => {

  return (
    <div className="w-full mt-4 md:bg-[#1E2229] py-3 mb-4 md:py-24 flex    justify-center">

      <div className="w-full max-w-7xl px-2 md:px-16 flex flex-col md:flex-row justify-between gap-6 sm:gap-12 md:gap-20">

        <div className="w-full hidden sm:flex  flex-col md:w-1/2 text-white space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            NOT JUST ANOTHER PICTURE.
          </h2>

          <p className="text-gray-400 max-w-xl text-base md:text-lg">
            GlitchFame is where creators compete and the community decides.
            Discover talent, cast your vote, and help crown the next digital
            icon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-primary text-xs sm:text-base  text-black px-6 py-3 md:font-semibold hover:opacity-90 transition w-full sm:w-auto">
              START SUBMISSION
            </button>

            <button className="border text-xs sm:text-base border-gray-600 px-6 py-3 font-semibold hover:border-[#BE5EED] hover:text-[#BE5EED] transition w-full sm:w-auto">
              HOW IT WORKS
            </button>
          </div>
        </div>

        <div className="w-full  md:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`border flex flex-col bg-[#2F3849] items-center justify-center text-center border-gray-700 py-6 sm:p-5 md:p-6 space-y-2 sm:space-y-3 
                  hover:border-[#BE5EED] transition rounded-lg sm:rounded-xl
        ${index >= 2 ? "hidden md:block" : ""}
        `}
              >
                <Icon className="text-primary" size={20} />

                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-[13px] sm:text-xs leading-snug">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <section className="col-span-2 sm:hidden ">
          <div className="flex items-center justify-between bg-[#2A3442] border border-[#3A4656] rounded-2xl px-4 py-4 hover:border-[#BE5EED] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3A4656] flex items-center justify-center">
                <Trophy className="text-cyan-300" size={18} />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Live Reward Pool
                </span>
                <span className="text-white text-lg font-bold">₹250,000</span>
              </div>
            </div>

            <span className="text-gray-400 text-xl">›</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
