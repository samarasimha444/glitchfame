import { memo, useEffect, useState } from "react";

export const StickyHeader = memo(({ liveSeason, season }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  const calculateTimeLeft = () => {
    let targetDate;

    if (season?.votingEndDate) {
      targetDate = new Date(season.votingEndDate);
    } else {
      // fake 2-hour timer
      targetDate = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    }

    const diff = targetDate - new Date();

    // ✅ when ended → return zeros instead of null
    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [season?.votingEndDate]);

  return (
    <div className="sticky top-0 z-30 w-full backdrop-blur-sm">
      <div className="w-full md:max-w-6xl md:mx-auto">
        <div className="w-full mt-4 md:mt-6 px-0 md:px-4">
          <div
            className="w-full p-4 sm:p-6 
        rounded-none md:rounded-2xl 
        border-y md:border border-cyan-500/20 
        shadow-none md:shadow-[0_0_30px_rgba(0,255,255,0.05)]"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4 px-2 md:px-0">
              <div>
                <p className="text-xs text-gray-400">TIME REMAINING</p>
                <p className="text-sm text-gray-500">
                  PHASE 1 REGISTRATION
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full border border-cyan-400/30 text-cyan-400">
                Ends Soon
              </span>
            </div>

            {/* TIMER */}
            <div className="flex justify-between sm:justify-center gap-2 sm:gap-5 px-2 md:px-0">
              {[
                { label: "DAYS", value: timeLeft?.days ?? 0 },
                { label: "HOURS", value: timeLeft?.hours ?? 0 },
                { label: "MINS", value: timeLeft?.minutes ?? 0 },
                { label: "SECS", value: timeLeft?.seconds ?? 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="w-full max-w-[70px] sm:max-w-none h-14 sm:h-20 
                  flex items-center justify-center rounded-xl 
                  bg-[#0f1e22] border border-cyan-500/20 
                  shadow-[0_0_15px_rgba(0,255,255,0.12)]"
                  >
                    <span className="text-lg sm:text-3xl font-bold text-cyan-400">
                      {String(item.value).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="text-[9px] sm:text-xs text-gray-400 mt-2 tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});