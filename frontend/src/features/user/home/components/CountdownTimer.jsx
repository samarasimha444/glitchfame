import React, { useEffect, useState, useMemo } from "react";

export default function CountdownTimer({ endDate }) {
  const endTime = useMemo(() => new Date(endDate).getTime(), [endDate]);

  const calculateTimeLeft = () => {
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) return null;

    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      if (!updated) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft(updated);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const format = (num) => String(num ?? 0).padStart(2, "0");

  return (
    <div className="flex flex-col items-end gap-3">
      {/* Label with Clock Icon as seen in image */}
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-gray-400 uppercase mr-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        VOTING ENDS IN
      </div>

      {/* Timer Container */}
      <div className="flex items-center gap-2">
        <TimerBox value={format(timeLeft?.d)} label="DAYS" />
        <TimerBox value={format(timeLeft?.h)} label="HRS" />
        <TimerBox value={format(timeLeft?.m)} label="MIN" />
        <TimerBox value={format(timeLeft?.s)} label="SEC" />
      </div>
    </div>
  );
}

const TimerBox = React.memo(({ value, label }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* The Styled Box from Visily */}
      <div className="flex items-center justify-center w-14 h-14 sm:w-[56px] sm:h-[56px] rounded-[14px] border border-white/20 bg-white/5 backdrop-blur-sm">
        <span className="text-xl sm:text-2xl font-bold text-white tabular-nums tracking-tight">
          {value}
        </span>
      </div>
      
      {/* Label Outside the box */}
      <span className="text-[9px] font-bold text-gray-500 tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
});