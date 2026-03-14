import React, { useState } from "react";
import AdminCard from "../dashboard/components/AdminCard";
import SeasonSummary from "./components/SeasonSummary";
import Controls from "./components/Controls";

import { Plus } from "lucide-react";
import { useDeleteSeason, useFetchSeasonDetails } from "./hooks";
import { useFetchSeasons } from "../dashboard/hooks";
import { dashCards } from "../../../constants/admin";
import NeonLoader from "../../../components/Loader";

const AdminSettings = () => {
  
  const { data: seasons = [], isLoading: isSeasonsLoading } = useFetchSeasons();
  console.log(seasons);

  const { mutate: deleteSeason,isPending } = useDeleteSeason();

  const [selectedSeasonId, setSelectedSeasonId] = useState();

  

  const {
    data: seasonData,
    isLoading: isSeasonLoading,
    isError: isSeasonError,
  } = useFetchSeasonDetails(selectedSeasonId);

  console.log("Seasons:", seasons);
  console.log("Selected Season Data:", seasonData);

  const handleDelete = () => {
    deleteSeason(selectedSeasonId);
  };

  const loading = isPending || isSeasonsLoading

  const handleRemove = () => {};

 if (loading) {
  return <NeonLoader />;
}

  return (
    <div className="mt-6 w-full flex flex-col gap-6">
      <section className="w-full">
        <select
          value={selectedSeasonId}
          onChange={(e) => setSelectedSeasonId(e.target.value)}
          className="w-full bg-[#2C2C2E] max-w-xs text-white px-3 py-2 rounded-xs border border-gray-400 focus:outline-none 
       focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Choose Event</option>

          {seasons?.content?.map((item) => (
            <option key={item.seasonId} value={item.seasonId}>
              {item.seasonName} {item.seasonId}
            </option>
          ))}
        </select>
      </section>

      <section className="w-full flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex-none self-start">
          <AdminCard
            title="Settings"
            paragraph="Note actions perform here can change the db use it carefully"
            cardsInfo={dashCards}
            className="max-w-4xl hidden sm:flex"
          />


          {isSeasonLoading ?
              <div className="w-full h-[50vh] bg-[#171A1F] border border-gray-800 rounded-xl animate-pulse"></div>
          : isSeasonError ?
            <p className="text-red-500 mt-4">Failed to load season data </p>
          : <SeasonSummary
              title="Season Summary"
              subtitle="Overview of registration and performance metrics"
              data={seasonData || []}
            />
          }
        </div>

        <div className="max-w-xl mt-4 sm:mt-28 space-y-3">
          <Controls
            id={selectedSeasonId}
            voteLock={seasonData?.voteLock}
            seasonLock={seasonData?.seasonLock}
            prizeMoney={seasonData?.prizeMoney}
          />
           

          <div className="flex flex-col px-6 py-4 rounded-lg max-w-xs gap-4 mt-6 border border-gray-800 bg-[#181B20]">
            <h5 className="w-full text-sm font-semibold text-red-500">
              Event Actions
            </h5>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition text-sm font-medium"
            >
              <Plus size={16} />
              Delete Current Season
            </button>

            <button
              onClick={handleRemove}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition text-sm font-medium"
            >
              <Plus size={16} />
              Remove All Votes & Users
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
