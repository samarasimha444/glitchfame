import React from "react";
import { Zap } from "lucide-react";

const PlayerDetails = () => {
  return (
    <div className="flex w-full  justify-evenly min-h-screen bg-black text-white">

      <section className="w-[45%] rounded-2xl h-[95dvh] mt-3 relative overflow-hidden">

        
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          alt="Player"
          className="absolute inset-0 w-full h-full object-cover"
        />

       
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

       
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-3xl font-bold">
            Xyla 'Viper' Chen
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Neo-Tokyo Sector 7 • Joined Sept 2024
          </p>
        </div>

      </section>

  
      <section className="max-w-xl p-12 space-y-8 ">

     
        <div className="bg-[#0f1720] max-w-[530px] p-8 rounded-2xl border border-cyan-500/20">
          <p className="text-xs text-gray-400 mb-2">
            CURRENT ENERGY LEVEL
          </p>

          <h2 className="text-5xl font-extrabold text-cyan-400">
            42,892
          </h2>

          <button className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition">
            <Zap size={18} />
            BOOST VOTE
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            LIMITED TO 1 VOTE PER ARENA CYCLE
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-3">
            🎤 Artist Manifesto
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            Digital disruptor and street photographer. Capturing the neon pulse
            of the underground. I'm here to break the system and claim the crown.
            Every vote is a spark for the revolution. Join the Viper nest.
          </p>

          <p className="text-purple-400 text-sm mt-4">
            #GlitchFame #CyberpunkVibes #NeoTokyo
          </p>
        </div>

       
        <div className="bg-[#0f1720] p-6 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <img
                key={item}
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-10 h-10 rounded-full border-2 border-black"
              />
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Top Supporters
          </p>
        </div>

    
        <div>
          <p className="text-sm text-gray-400 mb-3">
            RECRUIT YOUR CREW
          </p>

          <div className="flex gap-4">
            <button className="bg-[#11161f] p-3 rounded-lg hover:bg-purple-600 transition">
              🔗
            </button>
            <button className="bg-[#11161f] p-3 rounded-lg hover:bg-purple-600 transition">
              🐦
            </button>
            <button className="bg-[#11161f] p-3 rounded-lg hover:bg-purple-600 transition">
              📸
            </button>
            <button className="bg-[#11161f] p-3 rounded-lg hover:bg-purple-600 transition">
              📤
            </button>
          </div>
        </div>

      </section>
    </div>
  );
};

export default PlayerDetails;