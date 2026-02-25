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
    <div className="w-full mt-12 bg-[#1E2229] py-24 flex justify-center">
      <div className="max-w-350 w-full px-16 flex justify-between gap-20">

        <div className="w-1/2 text-white space-y-6">
          <h2 className="text-6xl font-extrabold leading-tight">
            NOT JUST <br />
            ANOTHER <br />
            PICTURE.
          </h2>

          <p className="text-gray-400 max-w-xl text-lg">
            ShutterUp is where the next generation of visual artists
            claim their crown. No filters, just vision.
            Are you ready to submit?
          </p>

          <div className="flex gap-4 pt-4">
            <button className="bg-[#BE5EED] text-black px-6 py-3 font-semibold hover:opacity-90 transition">
              START SUBMISSION
            </button>

            <button className="border border-gray-600 px-6 py-3 font-semibold hover:border-[#BE5EED] hover:text-[#BE5EED] transition">
              HOW IT WORKS
            </button>
          </div>
        </div>

       
        <div className="w-1/2 grid grid-cols-2 gap-6">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="border border-gray-700 p-8 space-y-4 hover:border-[#BE5EED] transition"
              >
                <Icon className="text-[#BE5EED]" size={32} />
                <h3 className="text-white font-bold text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
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