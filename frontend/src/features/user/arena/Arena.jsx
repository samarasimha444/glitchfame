import React, { useState } from "react";
import ArenaCard from "./ui/ArenaCard";
import { useParams } from "react-router-dom";


const Arena = () => {

  const { id } = useParams();


  return (
    <section className="bg-black text-white py-12 md:py-20 sm:px-6">
      
      <div className="max-w-6xl mx-auto text-center">
        <h1 className=" text-3xl md:text-5xl md:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            GLITCHFAME
          </span>
        </h1>

        <p className="text-gray-400 mt-3 text-[16px] md:text-lg">
          SUMMER SEASON 04
        </p>

        <div className="flex justify-center gap-2 sm:gap-6 mt-8 sm:mt-10 px-4">
          <div className="w-full sm:w-auto bg-[#11161f] px-5 sm:px-8 py-6 sm:py-5 rounded-xl border border-gray-700 text-center">
            <p className="text-xs text-gray-400 mb-1 sm:mb-2">VOTING ENDS IN</p>
            <h2 className="text-2xl sm:text-3xl font-bold">02 : 14 : 55</h2>
          </div>

          <div className="w-full sm:w-auto bg-[#0f1e22] px-5 sm:px-8 py-6 sm:py-5 rounded-xl border border-cyan-500/30 text-center">
            <p className="text-xs text-gray-400 mb-1 sm:mb-2">
              TOTAL PRIZE POOL
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400">
              $2,500.00
            </h2>
          </div>
        </div>
      </div>

      <ArenaCard id={id} />
    </section>
  );
};

export default Arena;
