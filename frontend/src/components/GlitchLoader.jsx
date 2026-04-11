import React, { useState, useEffect } from 'react';
import { Zap, Info } from 'lucide-react';

const GlitchLoader = () => {
  const [statusIndex, setStatusIndex] = useState(0);

 const messages = [
  "Loading Season...",
  "Retrieving Contestants...",
  "Syncing Data...",
  "Almost Ready..."
];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-sans overflow-hidden px-4">
      
     
      <div className="absolute top-6 right-6 md:top-8 md:right-10 text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-teal-900/60 uppercase select-none">
        System Status: <span className="text-teal-300">Live</span>
      </div>

      <div className="flex flex-col items-center w-full max-w-lg">
        
        {/* Central Ring - Responsive Sizing */}
        <div className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center mb-8 md:mb-10">
         
          <div className="absolute inset-0 border border-teal-300/10 rounded-full" />
          
          
          <div className="absolute inset-0 border-2 border-transparent border-t-teal-300 rounded-full animate-spin">
          
            <div className="absolute top-[10px] right-[10px] md:top-[14px] md:right-[14px] w-1.5 h-1.5 bg-teal-300 rounded-full shadow-[0_0_10px_#5eead4]" />
          </div>

         
          <div className="w-10 h-10 md:w-14 md:h-14 bg-teal-300/5 border border-teal-300/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Zap className="w-5 h-5 md:w-7 md:h-7 text-primary" fill="currentColor" fillOpacity="0.1" />
          </div>
        </div>

      {/* Brand Title - Scaled for Mobile */}
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter uppercase flex gap-1 items-center select-none">
          <span className="text-white">Glitch</span>
          <span className="text-primary">Fame</span>
        </h1>

        {/* Status Message */}
        <div className="mt-4 flex items-center gap-2 md:gap-3 font-mono text-xs md:text-sm text-teal-300/80">
          <span className="opacity-50 text-primary">{`>>`}</span>
          <span className="min-w-[180px] md:min-w-[220px]">{messages[statusIndex]}</span>
          <div className="w-1.5 h-4 bg-primary animate-pulse" />
        </div>

        {/* Bottom Alert Box - Adjusted Padding for Mobile */}
        <div className="mt-12 md:mt-16 flex items-start md:items-center gap-3 px-5 py-3 bg-teal-950/20 border border-teal-300/10 rounded-2xl md:rounded-full text-[10px] md:text-xs text-teal-100/40 max-w-[90%] md:max-w-none">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <p className="leading-tight">
            Initializing secure session. <span className="text-teal-300/80 font-medium">Please do not close this window.</span>
          </p>
        </div>

        {/* Refresh Link */}
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-[9px] md:text-[10px] text-teal-900 tracking-[0.15em] uppercase hover:text-teal-300 transition-colors underline decoration-teal-900/30 underline-offset-4"
        >
          Connection slow? Try Refreshing
        </button>
      </div>

      {/* Decorative Scanline Effect (Subtle) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default GlitchLoader;