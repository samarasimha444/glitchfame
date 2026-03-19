import React from "react";



export default function NeonLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-4">
       
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-[#9DE2E2] rounded-full animate-spin "></div>
        <p className="text-white text-sm sm:text-base font-medium">Loading...</p>
      </div>
    </div>
  );
}