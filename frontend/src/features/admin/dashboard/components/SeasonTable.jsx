import { LockOpen, Lock } from "lucide-react";
import { useToggleSeasonLock } from "../../settings/hooks";
import { TableShimmer } from "../../../../components/TableShimmer";
import NeonLoader from "../../../../components/NeonLoader";
import { useState, useMemo } from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "Draft":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    case "Ended":
      return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    default:
      return "";
  }
};

const SeasonsTable = ({ seasons, isLoading }) => {
 
  const { mutate: toggleSeasonLock, isPending: seasonPending } =
    useToggleSeasonLock();

  const [filter, setFilter] = useState("All");

  const filteredSeasons = useMemo(() => {
    if (!seasons?.content) return [];

    return seasons.content.filter((season) => {
      if (filter === "All") return true;
      if (filter === "Active") return season.seasonLock === false;
      if (filter === "Ended") return season.seasonLock === true;
      return true;
    });
  }, [filter, seasons]);

  if (isLoading) return <TableShimmer />;
  if (seasonPending) return <NeonLoader />;

  return (
    <>
      <div className="sm:p-4 w-full flex flex-col sm:flex-row justify-between border-b border-gray-800 gap-2 sm:gap-0">
        <h5 className="text-xl font-semibold py-3">Seasons Table</h5>

        <section className="flex sm:hidden space-x-2 overflow-x-auto text-[12px]">
          {["All", "Active", "Ended"].map((f) => (
            <p
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 rounded-4xl cursor-pointer border px-2 py-1 whitespace-nowrap ${
                filter === f ?
                  "border-blue-500 text-blue-400"
                : "border-gray-600"
              }`}
            >
              {f}
            </p>
          ))}
        </section>

        <section className="hidden sm:flex space-x-5 ">
          {["All", "Active", "Ended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-1 text-xs font-medium rounded-full transition-all duration-200
        ${
          filter === f ?
            "bg-blue-600 text-white shadow-md"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
            >
              {f}
            </button>
          ))}
        </section>
      </div>

      <div className="rounded-xl min-h-[30dvh] border border-gray-800 sm:max-h-[70vh] overflow-x-auto overflow-y-auto">
        <table className="w-full sm:min-w-[600px] text-sm text-left text-gray-300">
          <thead className="bg-[#1E2229] text-gray-400 uppercase text-xs sticky top-0">
            <tr>
              <th className="px-2 sm:px-4 py-2">Season Name</th>
              <th className="px-2 sm:px-4 py-2">Status</th>
              <th className="px-2 truncate sm:px-4 py-2">Prize Pool</th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-2">
                Registration Period
              </th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-2">
                Voting Window
              </th>
              <th className="px-2 sm:px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSeasons.map((season) => (
              <tr
                key={season.seasonId || season.id}
                className="border-t border-gray-800 hover:bg-[#1E2229] transition"
              >
                <td className="px-1 sm:px-4 py-2 text-[11px] sm:text-sm">
                  <div className="font-medium text-white truncate max-w-30 sm:max-w-full">
                    {season.seasonName}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate max-w-30 sm:max-w-full">
                    {season.seasonId}
                  </div>
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  <span
                    className={`px-1 sm:px-2 py-1 rounded-full text-[10px] sm:text-xs ${getStatusStyle(
                      season.seasonLock ? "Ended" : "Active",
                    )}`}
                  >
                    {season.seasonLock ? "Closed" : "Active"}
                  </span>
                </td>

                <td className="px-2 sm:px-4 py-2 text-blue-400 font-medium text-[11px] sm:text-sm">
                  {season.prizeMoney}
                </td>

                <td className="px-2 sm:px-4 py-2 hidden sm:table-cell text-gray-400 text-xs sm:text-sm">
                  {new Date(season.registrationStartDate).toLocaleDateString()}{" "}
                  - {new Date(season.registrationEndDate).toLocaleDateString()}
                </td>

                <td className="px-2 sm:px-4 py-2 hidden sm:table-cell text-gray-400 text-xs sm:text-sm">
                  {new Date(season.votingStartDate).toLocaleDateString()} -{" "}
                  {new Date(season.votingEndDate).toLocaleDateString()}
                </td>

                <td className="px-2 sm:px-4 py-2 text-right space-x-1 sm:space-x-2">
                  <button
                    onClick={() => toggleSeasonLock(season.seasonId)}
                    className="cursor-pointer hover:text-blue-300 text-[10px] sm:text-sm"
                    disabled={seasonPending}
                  >
                    {season.seasonLock ?
                      <Lock />
                    : <LockOpen />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SeasonsTable;
