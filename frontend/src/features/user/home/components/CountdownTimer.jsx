import { useEffect, useState } from "react";

export default function CountdownTimer({ endDate }) {

  const calculateTimeLeft = () => {
    const difference = new Date(endDate) - new Date();

    if (difference <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="w-full max-w-[350px] bg-[#21252C] rounded-2xl p-4 ">

      
      <p className="text-xs text-gray-400 mb-3 tracking-widest">
        VOTING ENDS IN
      </p>

      <div className="flex items-center justify-between">

       
        <div className="flex gap-2">

          <TimerBox value={timeLeft.days} label="DAYS" />
          <TimerBox value={timeLeft.hours} label="HRS" />
          <TimerBox value={timeLeft.minutes} label="MIN" />
          <TimerBox value={timeLeft.seconds} label="SEC" />

        </div>

       
        <div className="flex flex-col items-end ml-3">
          <span className="text-[10px] px-2 py-[2px] rounded-full border border-[#9DE2E2] text-[#9DE2E2]">
             POOL
          </span>
          <span className="text-white font-bold text-lg">
            $250K
          </span>
        </div>

      </div>

    </div>
  );
}


function TimerBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[52px] h-[52px] bg-[#3B414D] rounded-xl flex items-center justify-center text-[#9DE2E2] font-bold text-lg">
        {value}
      </div>
      <span className="text-[10px] text-gray-400 mt-1">{label}</span>
    </div>
  );
}