import React, { useEffect, useState } from "react";
import { Timer, RotateCcw } from "lucide-react";

const SessionEngineTimer = () => {
  const [time, setTime] = useState(4 * 3600 + 12 * 60 + 8); // initial 04:12:08
  const [running, setRunning] = useState(true);
  const [adjustHours, setAdjustHours] = useState(4);
  const [adjustMins, setAdjustMins] = useState(12);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return { hrs, mins, secs };
  };

  const { hrs, mins, secs } = formatTime(time);

  const syncTime = () => {
    setTime(adjustHours * 3600 + adjustMins * 60);
  };

  return (
    <div className="bg-[]  flex justify-center items-center ">
      <div className="w-[420px]  border border-gray-800 rounded-2xl  relative">

       
        <div className="absolute top-0 left-0 w-full h-1 border-t-2 border-blue-600 rounded-t-2xl" />

        <div className="p-8">

        
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Timer className="text-purple-400" size={22} />
              <h2 className="text-white text-lg font-semibold">
                Session Engine
              </h2>
            </div>

            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>

          
          <div className="bg-[#141821] border border-gray-700 rounded-xl p-6 text-center mb-8">
            <p className="text-gray-400 text-xs tracking-widest mb-3">
              VOTING CLOSES IN
            </p>

            <div className="flex justify-center items-center gap-4 text-white text-4xl font-bold">
              <div>
                {hrs}
                <div className="text-xs text-gray-400 mt-1">HRS</div>
              </div>
              :
              <div>
                {mins}
                <div className="text-xs text-gray-400 mt-1">MIN</div>
              </div>
              :
              <div>
                {secs}
                <div className="text-xs text-gray-400 mt-1">SEC</div>
              </div>
            </div>
          </div>

      
          <div className="grid grid-cols-2 gap-6 mb-6">
            
            <div>
              <p className="text-gray-400 text-xs mb-2">ADJUST HOURS</p>
              <div className="flex items-center bg-[#141821] border border-gray-700 rounded-lg">
                <button
                  onClick={() => setAdjustHours((h) => Math.max(0, h - 1))}
                  className="px-3 text-gray-400"
                >
                  -
                </button>
                <input
                  type="number"
                  value={adjustHours}
                  onChange={(e) => setAdjustHours(Number(e.target.value))}
                  className="w-full bg-transparent text-center text-white outline-none"
                />
                <button
                  onClick={() => setAdjustHours((h) => h + 1)}
                  className="px-3 text-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            
            <div>
              <p className="text-gray-400 text-xs mb-2">ADJUST MINS</p>
              <div className="flex items-center bg-[#141821] border border-gray-700 rounded-lg">
                <button
                  onClick={() => setAdjustMins((m) => Math.max(0, m - 1))}
                  className="px-3 text-gray-400"
                >
                  -
                </button>
                <input
                  type="number"
                  value={adjustMins}
                  onChange={(e) => setAdjustMins(Number(e.target.value))}
                  className="w-full bg-transparent text-center text-white outline-none"
                />
                <button
                  onClick={() => setAdjustMins((m) => m + 1)}
                  className="px-3 text-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          </div>

       
          <div className="flex gap-4">
            <button
              onClick={() => setRunning(!running)}
              className="flex-1 border border-gray-700 text-white py-3 rounded-lg hover:border-gray-500 transition"
            >
              {running ? "Pause" : "Resume"}
            </button>

            <button
              onClick={syncTime}
              className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-purple-500/10 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Sync Time
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SessionEngineTimer;