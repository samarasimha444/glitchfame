import React from "react";
import AdminCards from "./ui/AdminCards";
import SeasonSummary from "./drops/SeasonSummary";
import SessionEngineTimer from "./drops/EngineBox";
import Controls from "./drops/Controls";
import { Plus } from "lucide-react";

const seasonData = [
  { label: "Season Name", value: "Neon Genesis S03" },
  { label: "Current Voting Status", value: "Active" },
  {
    label: "Prize Pool Allocation",
    value: "$12,500.00",
    color: "text-emerald-400",
  },
  {
    label: "Session Multiplier",
    value: "2.5x Boost",
    color: "text-purple-400",
  },
  { label: "Registration Period", value: "Mar 01 - Mar 15" },
  { label: "Next Scheduled Payout", value: "Apr 16, 2024" },
];

const AdminSettings = () => {
  return (
    <div className="mt-6 w-full flex flex-col gap-6">
      <section className="w-full ">
        <select
          className="w-full bg-[#2C2C2E] max-w-xs text-white px-3 py-2 rounded-xs 
          border border-gray-400 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Choose Event</option>
          <option>Event 1</option>
          <option>Event 2</option>
          <option>Event 3</option>
        </select>
      </section>

      <section className="w-full flex items-start justify-between  gap-6">
        <div className="flex-none  self-start">
          <AdminCards className="max-w-4xl" />
          <SeasonSummary
            title="Season Summary"
            subtitle="Overview of registration and performance metrics"
            data={seasonData}
          />

          <div className="flex px-6  rounded-xs flex-wrap max-w-xs gap-4 mt-6 border py-3 border-gray-800">
            
            <h5 className="w-full text-sm font-semibold text-white">
              Quick Vote Modifiers
            </h5>

            <button className="flex items-center gap-2 px-5 py-2 rounded-lg border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition text-sm font-medium">
              <Plus size={16} />
              +5 Votes
            </button>

            <button className="flex items-center gap-2 px-5 py-2 rounded-lg border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition text-sm font-medium">
              <Plus size={16} />
              +10 Votes
            </button>

            <p className="text-xs text-gray-400">Applied globally to all the contestants</p>
          </div>
         
        


        </div>
        <div className="max-w-xl space-y-3">
          <SessionEngineTimer />
          <Controls />

        
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;

// //here comes lock and unlock voting of a particular season
// <br />
//  control timer of the seasons

//  reset seaons we can start from zeri again timer again same seaons

//  manual wineer for some particular season

//  manage prize mony of a particlar season

/* Container */
