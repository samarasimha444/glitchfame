import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShimmerCard() {

  return (
    <div className="w-full flex justify-center">
      <div className="bg-[#181B20] border border-[#282e36] rounded-lg overflow-hidden 
                      md:w-[374px] md:h-[403px] w-full min-w-[150px] h-[25vh] sm:h-72">
        
     
        <Skeleton height="25vh" sm={{height:"18rem"}} />

        
        <div className="p-3 flex flex-col justify-between h-full space-y-3">
          <Skeleton height={20} width="70%" className="mt-2"/>
          <Skeleton height={15} width="50%"/>
          <Skeleton height={15} width="40%"/>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <Skeleton height={40} width="70%" />
        </div>
      </div>
    </div>
  );
}