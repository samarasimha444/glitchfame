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

    
    <div className="w-full mt-4 md:bg-[#1E2229] py-3 mb-4 md:py-24 flex justify-center">

      <div className="w-full max-w-7xl px-6 md:px-16 flex flex-col md:flex-row justify-between gap-12 md:gap-20">

      
        <div className="w-full md:w-1/2 text-white space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            NOT JUST 
            ANOTHER 
            PICTURE.
          </h2>

          <p className="text-gray-400 max-w-xl text-base md:text-lg">
            ShutterUp is where the next generation of visual artists
            claim their crown. No filters, just vision.
            Are you ready to submit?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-[#BE5EED] text-xs sm:text-base  text-black px-6 py-3 md:font-semibold hover:opacity-90 transition w-full sm:w-auto">
              START SUBMISSION
            </button>

            <button className="border text-xs sm:text-base border-gray-600 px-6 py-3 font-semibold hover:border-[#BE5EED] hover:text-[#BE5EED] transition w-full sm:w-auto">
              HOW IT WORKS
            </button>
          </div>
        </div>

       
        <div className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-6">
  {features.map((item, index) => {
    const Icon = item.icon;

    return (
      <div
        key={item.id}
        className={`border border-gray-700 p-6 md:p-8 space-y-4 hover:border-[#BE5EED] transition
        ${index >= 2 ? "hidden md:block" : ""}
        `}
      >
        <Icon className="text-[#BE5EED]" size={26} sm:size={32} />
        <h3 className="text-white font-bold text-lg">
          {item.title}
        </h3>
        <p className="text-gray-400  text-xs sm:text-sm">
          {item.description}
        </p>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
};

export default Overview;