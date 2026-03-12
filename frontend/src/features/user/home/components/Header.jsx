import { memo } from "react";
import CountdownTimer from "./CountdownTimer";




export const StickyHeader = memo(({ liveSeason, season }) => (
  <div className="sticky top-0 z-50 w-full bg-opacity-50 backdrop-blur-sm md:static">
    <div className="max-w-6xl px-2 w-full md:mb-6 mt-6 mx-auto text-center sm:px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          GLITCHFAME
        </span>
      </h1>
      <p className="text-gray-400 uppercase mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
        {liveSeason?.seasonName}
      </p>

      <div className="flex w-full justify-center gap-3 sm:gap-6 mt-6 sm:mt-10 flex-wrap">
        <div className="flex-1 sm:flex-none bg-[#11161f] px-3 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 rounded-xl border border-gray-700 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
            VOTING ENDS IN
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {season?.votingEndDate ? (
              <CountdownTimer endDate={liveSeason?.votingEndDate} />
            ) : (
              <span className="inline-block w-25 sm:w-[250px] mt-1 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 animate-pulse"></span>
            )}
          </h2>
        </div>

        <div className="flex-1 w-full max-w-xs sm:flex-none bg-[#0f1e22] px-3 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 rounded-xl border border-cyan-500/30 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
            TOTAL PRIZE POOL
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-400">
            ₹{liveSeason?.prizeMoney || 0}
          </h2>
        </div>
      </div>
    </div>
  </div>
));