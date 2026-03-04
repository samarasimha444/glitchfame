import React from 'react'
import ArenaCard from './ui/ArenaCard'


const Arena = () => {
  return (
    
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        
        <h1 className="text-5xl md:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            GLITCHFAME
          </span>
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          SUMMER SEASON 04
        </p>

      
        <div className="flex justify-center gap-6 mt-10 flex-wrap">

        
          <div className="bg-[#11161f] px-8 py-5 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">VOTING ENDS IN</p>
            <h2 className="text-3xl font-bold">02 : 14 : 55</h2>
          </div>

      
          <div className="bg-[#0f1e22] px-8 py-5 rounded-xl border border-cyan-500/30">
            <p className="text-xs text-gray-400 mb-2">TOTAL PRIZE POOL</p>
            <h2 className="text-3xl font-bold text-cyan-400">
              $2,500.00
            </h2>
          </div>

        </div>
      </div>


      <ArenaCard/>
    </section>
  )
}

export default Arena