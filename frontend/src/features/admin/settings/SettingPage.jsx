import React, { useCallback, useMemo, useState } from "react";
import AdminCard from "../dashboard/components/AdminCard";
import SeasonSummary from "./components/SeasonSummary";
import Controls from "./components/Controls";
import { Plus } from "lucide-react";
import {  useFetchSeasonDetails } from "./hooks";
import { useFetchSeasons } from "../dashboard/hooks";
import { settingCards } from "../../../constants/admin";
import NeonLoader from "../../../components/NeonLoader";
import FunctionModel from "./components/FunctionModel";

const AdminSettings = () => {
  
 const [modalType, setModalType] = useState(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState();
  
  const { data: seasons = [], isLoading: isSeasonsLoading } = useFetchSeasons();
  
  
  const {
    data: seasonData,
    isLoading: isSeasonLoading,
    isError: isSeasonError,
  } = useFetchSeasonDetails(selectedSeasonId);

    
const { seasonName, prizeMoney } = seasonData?.season || {};


  

 const stats = useMemo(
    () => ({
      seasonName,
      prizeMoney,
    }),
    [seasonName, prizeMoney]
  );



  const handleAction = useCallback((type) => {
    setModalType(type);
  }, []);


 if (isSeasonLoading) {
  return <NeonLoader />;
}

  return (
    <div className="mt-6 w-full max-w-screen flex flex-col  gap-6">
   
     {modalType && (
    <FunctionModel
    type={modalType}
    seasonId={selectedSeasonId}
    onCancel={() => setModalType(null)}
  />
)}

      <section className="w-full">

       <div className="relative max-w-xs">
  <select
    value={selectedSeasonId}
    onChange={(e) => setSelectedSeasonId(e.target.value)}
    className="w-full appearance-none bg-[#1C1C1E] text-sm text-gray-200 
               pl-4 pr-10 py-2.5 rounded-lg border border-white/10 
               md:hover:border-white/20 md:focus:outline-none ,md:focus:ring-2 
               mdLfocus:ring-blue-500/50 md:transition-all cursor-pointer shadow-sm"
  >
    <option value="" className="bg-[#1C1C1E]">Choose Event</option>
    {seasons?.content?.map((item) => (
      <option key={item.seasonId} value={item.seasonId} className="bg-[#1C1C1E]">
        {item.seasonName}
      </option>
    ))}
  </select>
  
  {/* Custom Arrow Icon */}
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
      </section>

      <section className="w-full flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex-none self-start">
          <AdminCard
            title="Settings"
            paragraph="Note actions perform here can change the db use it carefully"
            cardsInfo={settingCards}
            stats={stats}
            className="max-w-4xl  sm:flex"
          />


          {isSeasonLoading ?
              <div className="w-full h-[50vh] bg-[#171A1F] border border-gray-800 rounded-xl animate-pulse"></div>
          : isSeasonError ?
            <p className="text-red-500 mt-4">Failed to load season data </p>
          : <SeasonSummary
              title="Season Summary"
              subtitle="Overview of registration and performance metrics"
              data={seasonData?.season || []}
            />
          }
        </div>

        <div className=" w-full max-w-xl mt-4 sm:mt-28 space-y-3">
          <Controls
            id={selectedSeasonId}
            voteLock={seasonData?.season?.voteLock}
            seasonLock={seasonData?.seasons?.seasonLock}
            prizeMoney={seasonData?.season?.prizeMoney}
          />
           

          <div className="flex flex-col px-6 py-4 rounded-lg sm:max-w-xl gap-4 mt-6 border border-gray-800 bg-[#181B20]">
            <h5 className="w-full text-sm font-semibold text-red-500">
              Event Actions
            </h5>

            <button
              onClick={() => handleAction("DELETE_SEASON")}
              className="flex items-center gap-2 px-5 cursor-pointer py-2 rounded-lg border border-red-600 text-red-400 md:hover:bg-red-600 md:hover:text-white md:transition text-sm font-medium"
            >
              <Plus size={16} />
              Delete Current Season
            </button>

           


            <button
            onClick={() => handleAction("REMOVE_USERS")}
              className="flex items-center gap-2 cursor-pointer px-5 py-2 rounded-lg border border-blue-500 text-blue-500 md:hover:bg-blue-600 md:hover:text-white md:transition text-sm font-medium"
            >
              <Plus size={16} />
              Reset Season
            </button>

            <p className="text-xs text-gray-400">
              These actions are irreversible. Use carefully!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;



