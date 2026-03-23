import React, { lazy, Suspense, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useEndSeasonNow, useParticipationLock } from "../hooks";
import NeonLoader from "../../../../components/Loader";
import { menuItems } from "../../../../constants/admin";

const Model = lazy(() => import("./Model"));



const SeasonSummary = ({ title, subtitle, data }) => {
  console.log(data)

  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState("");
  const [active, setActive] = useState(false);

  const seasonId = data?.seasonId;

  const { mutate: endSeason, isPending } = useEndSeasonNow();

  const { mutate: lockParticipation, isPending: locking } =
    useParticipationLock();

  const loading = isPending || locking;

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

  const handleClick = (item) => {
    if (item.action === "lock") {
      lockParticipation({ id: seasonId });
    } else if (item.action === "end") {
      endSeason({ id: seasonId });
    } else {
      setSelected(item.action);
      setActive(true);
    }

    setShowMenu(false);
  };

  const preloadModal = () => {
    import("./Model");
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <NeonLoader />
      </section>
    );
  }

  return (
    <div className="w-full max-w-200 bg-[#0f1115] min-h-[50dvh] flex">
      {active && (
        <Suspense fallback={<NeonLoader />}>
          <Model
            type={selected}
            seasonId={seasonId}
            onClose={() => setActive(false)}
          />
        </Suspense>
      )}
      <div className="w-full max-w-195 border border-gray-900 relative">
        <div className="flex items-start justify-between p-6">
          <div>
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          </div>

          <div className="relative">
            <button
              onMouseEnter={preloadModal}
              onClick={() => setShowMenu((prev) => !prev)}
              className="text-gray-400 hover:text-white transition"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-1 mt-2 w-44 bg-[#171A1F] border  border-gray-800 rounded-lg shadow-lg z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`w-full text-left px-4 py-2 text-sm ${item.color} hover:bg-gray-800`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-6 px-3">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
            {formattedData?.map((item, index) => {
              if (item.label.toLowerCase().includes("photo url")) return null;

              return (
                <div
                  key={index}
                  className="flex text-xs sm:text-[13px] justify-between"
                >
                  <span className="text-gray-400 uppercase text-[13px]">{item.label}</span>
                  <span className="text-white font-medium ">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonSummary;
