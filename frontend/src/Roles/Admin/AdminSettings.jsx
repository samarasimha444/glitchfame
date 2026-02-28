import React from 'react'
import AdminCards from './ui/AdminCards';
import SeasonSummary from './drops/SeasonSummary';
import SessionEngineTimer from './drops/EngineBox';



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

  
  <section className="w-full bg-amber-100  flex flex-col xl:flex-row items-start gap-6">

    
    <div className="flex-1 self-start">
      <AdminCards />
    </div>

  
    <div className="w-full xl:w-[420px] self-start">
      <SessionEngineTimer />
    </div>

  </section>

 
  <SeasonSummary
    title="Season Summary"
    subtitle="Overview of registration and performance metrics"
    data={seasonData}
  />

</div>

   
  );
};


export default AdminSettings



// //here comes lock and unlock voting of a particular season
// <br />
//  control timer of the seasons

//  reset seaons we can start from zeri again timer again same seaons

//  manual wineer for some particular season

//  manage prize mony of a particlar season

/* Container */
