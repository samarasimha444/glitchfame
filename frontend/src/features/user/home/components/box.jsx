import React, { useState } from 'react';
import { Clock, Trophy } from 'lucide-react';

const ContestStats = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: "04",
    minutes: "12",
    seconds: "55"
  });

  return (
    <div className="hidden md:grid grid-cols-1 mt-3 md:grid-cols-2 gap-4 w-full items-center text-center max-w-4xl mx-auto p-4">
      
      <div className="bg-[#111214] border border-[#1e1f22] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-red-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Clock size={14} />
          <span>Voting Ends In</span>
        </div>
        
        <div className="flex items-center gap-3 text-white font-mono text-5xl font-semibold tracking-tighter">
          <span>{timeLeft.hours}</span>
          <span className="text-gray-700 font-sans">:</span>
          <span>{timeLeft.minutes}</span>
          <span className="text-gray-700 font-sans">:</span>
          <span>{timeLeft.seconds}</span>
        </div>
      </div>

      <div className="bg-[#111214] border border-[#1e1f22] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-[#2dd4bf] text-[10px] font-bold uppercase tracking-[0.2em]">
          <Trophy size={14} />
          <span>Total Prize Pool</span>
        </div>
        
        <div className="flex items-center text-white font-mono text-5xl font-semibold tracking-tighter">
          <span className="text-[#2dd4bf] mr-1">$</span>
          <span>25,000.00</span>
        </div>
      </div>

    </div>
  );
};

export default ContestStats;