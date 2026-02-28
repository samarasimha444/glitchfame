import React from "react";

const AdminCards = ({className}) => {
  return (
    <div className={`flex flex-col w-full  py-4 ${className}`}>

      <section className="flex w-full  justify-between items-start ">
        <h3 className="flex flex-col font-semibold text-3xl">
          Season Management
          <p className="text-[13px] max-w-xl text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            doloremque, quam exercitationem !
          </p>
        </h3>

        <button className="bg-blue-400 px-3 py-2">+Create Season</button>
      </section>

      <section className="mt-12 flex  w-full justify-between ">

        <div
          className="relative bg-[#111418] border border-[#1E232B] 
                  rounded-2xl p-6 w-full max-w-[340px]"
        >
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-medium">
              Active Seasons
            </h3>

            <p className="text-3xl font-semibold text-white">4</p>

            <p className="text-xs text-gray-500">+15% across 2 continents</p>
          </div>

          <div
            className="absolute right-6 top-1/2 -translate-y-1/2
                    w-14 h-14 rounded-full 
                    bg-[#1B2330] flex items-center justify-center"
          >
            <span className="text-blue-400 text-xl">📈</span>
          </div>
        </div>

         <div
          className="relative bg-[#111418] border border-[#1E232B] 
                  rounded-2xl p-6 w-full max-w-[340px]"
        >
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-medium">
              Active Seasons
            </h3>

            <p className="text-3xl font-semibold text-white">4</p>

            <p className="text-xs text-gray-500">+15% across 2 continents</p>
          </div>

          <div
            className="absolute right-6 top-1/2 -translate-y-1/2
                    w-14 h-14 rounded-full 
                    bg-[#1B2330] flex items-center justify-center"
          >
            <span className="text-blue-400 text-xl">📈</span>
          </div>
        </div>
       
         <div
          className="relative bg-[#111418] border border-[#1E232B] 
                  rounded-2xl p-6 w-full max-w-[340px]"
        >
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-medium">
              Active Seasons
            </h3>

            <p className="text-3xl font-semibold text-white">4</p>

            <p className="text-xs text-gray-500">+15% across 2 continents</p>
          </div>

          <div
            className="absolute right-6 top-1/2 -translate-y-1/2
                    w-14 h-14 rounded-full 
                    bg-[#1B2330] flex items-center justify-center"
          >
            <span className="text-blue-400 text-xl">📈</span>
          </div>
        </div>
        

      </section>
    </div>
  );
};

export default AdminCards;
