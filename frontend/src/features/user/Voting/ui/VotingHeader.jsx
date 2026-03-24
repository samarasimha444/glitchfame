
import React, { useMemo } from "react";
import CountdownTimer from "../../home/components/CountdownTimer";


const VotingHeader = ({season}) => {
  
 const endDate = useMemo(
  () => (season?.votingEndDate ? new Date(season.votingEndDate) : new Date()),
  [season]
);
  
  return (
    <section className="w-full  overflow-x-hidden text-white py-6 md:py-4  md:px-16">



      <div className="max-w-350 mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-10">
          <div className="max-w-xl">

            <div className=" hidden md:flex items-center gap-3 text-sm  sm:mb-4">
              <span className="px-3 text-xs md: text-normal py-1 bg-purple-600/20 rounded-full">
                Featured Event
              </span>
             
            </div>

            <h1 className="text-2xl uppercase md:text-5xl font-black">
              {season?.seasonName} <span className="text-primary">2026</span>
            </h1>

            <p className="text-gray-400 w-full max-w-xl sm:flex sm:mt-4 leading-relaxed">
              {season?.seasonDesc} 
              <span className="text-yellow-400 hidden sm:flex font-semibold px-3">
                {" "}
                Rs{season?.prizeMoney} Grand Prize.
              </span>
            </p>
          </div>

       
  
              <CountdownTimer
               prizeMoney={season?.prizeMoney}
                endDate={endDate}
                className="font-mono text-lg sm:text-xl font-bold text-white tracking-widest"
              />
           
         
        </div>

        
      </div>

   
    </section>
  );
};

export default React.memo(VotingHeader);
