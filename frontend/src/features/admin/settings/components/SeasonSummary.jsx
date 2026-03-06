import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useEndSeasonNow, useParticipationLock } from "../hooks";

const menuItems = [
  { id: 2, label: "Participation Lock", color: "text-gray-300" },
  { id: 3, label: "End Now", color: "text-red-400" },
];

const SeasonSummary = ({ title, subtitle, data }) => {
  console.log(data)

  const [showMenu, setShowMenu] = useState(false);
  const [seasonId,setSeasonId]= useState(data.id)

  console.log(seasonId)

  const formattedData =
    data ?
      Object.entries(data).map(([key, value]) => {
        let formattedValue = value;

        if (key.toLowerCase().includes("date") && typeof value === "string") {
          formattedValue = new Date(value).toLocaleString();
        }

        return {
          label: key.replace(/([A-Z])/g, " $1"),
          value: String(formattedValue),
        };
      })
    : [];


const { mutate: endSeason, isLoading } = useEndSeasonNow();
const { mutate: lockParticipation, isLoading: locking } = useParticipationLock();


    const handleClick= (item)=>{
    console.log(item);

    if (item.label === "Participation Lock"){
      lockParticipation({id:seasonId})

    }else if(item.label ==="End NOW"){
      endSeason({ id: seasonId });
    }
      setShowMenu(false)

    }


  return (
    <div className="w-full bg-[#0f1115] flex">
      <div className="w-full max-w-[780px] border border-gray-900 relative">
        
        <div className="flex items-start justify-between p-6">
          <div>
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="text-gray-400 hover:text-white transition"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#171A1F] border border-gray-800 rounded-lg shadow-lg z-50">
                {menuItems.map((item) => (
                  <button onClick={()=>handleClick(item)}
                    key={item.id}
                    className={`w-full text-left px-4 py-2 text-sm ${item.color} hover:bg-gray-800`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
            {formattedData?.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonSummary;
