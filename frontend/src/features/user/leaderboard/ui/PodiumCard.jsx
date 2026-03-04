

export const PodiumCard = ({ position, name, score, large }) => {
  return (
    <div
      className={`relative rounded-2xl p-6 text-center
      border border-[#1F2A35] bg-gradient-to-b from-[#121820] to-[#0E141B]
      ${large ? "w-[320px] h-[420px] -mt-8" : "w-[260px] h-[360px]"}
      `}
    >
      <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
        {position}
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-24 h-24 rounded-full bg-gray-700 mb-4"></div>

        <h3 className="text-lg font-bold">{name}</h3>

        <p className="text-cyan-400 font-semibold mt-2">
          {score}
        </p>

        <button className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition">
          Vote Now
        </button>
      </div>
    </div>
  );
};