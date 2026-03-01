import { Lock, Save } from "lucide-react"
import { useState } from "react"

const Controls = () => {
  const [votingOpen, setVotingOpen] = useState(false)
  const [prizePool, setPrizePool] = useState(12500)

  return (
    <div className="  border border-white/10 mt-4 rounded-xl p-4 w-full  ">
      
  
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-white/70" />
        <h2 className="text-white text-lg font-semibold">
          Security Controls
        </h2>
      </div>

     
      <div className="flex items-center justify-between bg-[#171A1F] border border-white/5 rounded-lg p-4 mb-3">
        <div>
          <p className="text-white text-sm font-medium">
            Voting Open
          </p>
          <p className="text-white/50 text-xs">
            Prevent manual vote injection
          </p>
        </div>

        
        <button
          onClick={() => setVotingOpen(!votingOpen)}
          className={`relative w-11 h-6 rounded-full transition ${
            votingOpen ? "bg-purple-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
              votingOpen ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <div>
        <p className="text-white/60 text-xs mb-2 uppercase tracking-wide">
          Edit Prize Pool
        </p>

        <div className="flex gap-2">
          <input
            type="number"
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="flex-1 bg-[#171A1F] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <button className="bg-[#1E2228] border border-white/10 rounded-lg px-3 flex items-center justify-center hover:bg-purple-600 transition">
            <Save className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls