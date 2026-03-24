import React, { useEffect, useState, useMemo } from "react";

export default function CountdownTimer({ prizeMoney, endDate }) {
 
  const endTime = useMemo(() => new Date(endDate).getTime(), [endDate]);

  const calculateTimeLeft = () => {
    const now = Date.now(); 
    const diff = endTime - now;

    if (diff <= 0) {
      return null; 
    }

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
    <div className="w-full max-w-[350px] bg-[#21252C] rounded-2xl p-4">

      <p className="text-xs text-gray-400 mb-3 tracking-widest">
        VOTING ENDS IN
      </p>

      <div className="flex items-center justify-between">

        <div className="flex gap-2">
          <TimerBox value={format(timeLeft?.d)} label="DAYS" />
          <TimerBox value={format(timeLeft?.h)} label="HRS" />
          <TimerBox value={format(timeLeft?.m)} label="MIN" />
          <TimerBox value={format(timeLeft?.s)} label="SEC" />
        </div>

        <div className="flex flex-col items-end ml-3 min-w-[70px] max-w-[120px]">
          <span className="text-[10px] px-2 py-[2px] rounded-full border border-[#9DE2E2] text-[#9DE2E2] whitespace-nowrap">
            POOL
          </span>

          <span className="text-white font-bold sm:text-lg truncate w-full text-right">
            {prizeMoney}
          </span>
        </div>

      </div>
    </div>
  );
}



const TimerBox = React.memo(function TimerBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[52px] h-[52px] bg-[#3B414D] rounded-xl flex items-center justify-center text-[#9DE2E2] font-bold text-lg">
        {value}
      </div>
      <span className="text-[10px] text-gray-400 mt-1">{label}</span>
    </div>
  );
});