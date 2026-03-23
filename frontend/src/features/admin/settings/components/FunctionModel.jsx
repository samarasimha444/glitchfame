import React from "react";
import { useDeleteSeason } from "../hooks";
import { useResetSeason } from "../hooks";
import NeonLoader from "../../../../components/Loader";


const messages = {
  DELETE_SEASON: {
    title: "Delete Season",
    message: "Are you sure you want to delete this season?",
    confirmText: "Delete",
  },

  DELETE_ASSETS: {   
    title: "Delete Assets",
    message: "Are you sure you want to delete all assets?",
    confirmText: "Delete",
  },

  REMOVE_USERS: {   
    title: "Reset Season",
    message: "Are you sure you want to remove all users?",
    confirmText: "Reset",
  },
};

const FunctionModel = ({seasonId, type, onCancel }) => {
  console.log(type)
  
  console.log(seasonId)

   const { mutate: deleteSeason,isPending } = useDeleteSeason();
   const {mutate:reset,isPending:resetPending}= useResetSeason()

  const data = messages[type];

  
  


  const handleConfirm = () => {
    if (type === "DELETE_SEASON") {
     deleteSeason(seasonId);
    } else if (type === "REMOVE_USERS") {
      reset(seasonId)
    }

    onCancel(); 
  };


  const loading = resetPending || isPending


  if (!data) return null;

  if(loading) return <NeonLoader/>

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-[#171A1F] w-[360px] rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">
          {data.title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {data.message}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            {data.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunctionModel;