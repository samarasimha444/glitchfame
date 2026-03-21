import { LockOpen, Lock } from "lucide-react";
import { useToggleSeasonLock } from "../../settings/hooks";

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

const SeasonsTable = ({seasons,isLoading}) => {
  console.log(seasons)

  // const { data: seasons, isLoading, isError, error } = useFetchSeasons();
  // console.log(seasons);

  const { mutate: toggleSeasonLock, isPending: seasonPending } =
    useToggleSeasonLock();

  if (isLoading) return <p>Loading seasons...</p>;

  // if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="p-4 w-full justify-between border-b border-gray-800 flex items-center">
        <input
          type="text"
          placeholder="Filter by name..."
          className="bg-[#1E2229] border border-gray-700 px-3 py-2 rounded-md text-sm outline-none focus:border-purple-500"
        />

        <section className="hidden sm:flex space-x-4 text-[13px]">
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            All
          </p>
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            Active
          </p>
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            Ended
          </p>
        </section>
      </div>


      <div className="rounded-xl min-h-[30dvh] border border-gray-800  sm:max-h-[70vh] overflow-y-auto">


        <table className="w-full text-sm  text-left text-gray-300">
          <thead className="bg-[#1E2229] text-gray-400 uppercase text-xs sticky top-0">
            <tr>
              <th className="px-4 py-2">Season Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Prize Pool</th>

              <th className="hidden sm:table-cell px-4 py-2">
                Registration Period
              </th>

              <th className="hidden sm:table-cell px-4 py-2">Voting Window</th>

              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {seasons?.content.map((season) => (
              <tr
                key={season.id}
                className="border-t border-gray-800 hover:bg-[#1E2229] transition"
              >
                <td className="px-4 py-2 text-xs sm:text-sm">
                  <div className="font-medium text-white">
                    {season.seasonName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {season.seasonId}
                  </div>
                </td>

                <td className="px-4 py-2 text-xs sm:text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] sm:text-xs ${getStatusStyle(
                      season.seasonLock ? "Closed" : "Active",
                    )}`}
                  >
                    {season.seasonLock ? "Closed" : "Active"}
                  </span>
                </td>

                <td className="px-4 py-2 text-blue-400 font-medium text-xs sm:text-sm">
                  {season.prizeMoney}
                </td>

                <td className="px-4 py-2 hidden sm:table-cell text-gray-400 text-xs sm:text-sm">
                  {season.registrationStartDate}
                </td>

                <td className="px-4 py-2 hidden sm:table-cell text-gray-400 text-xs sm:text-sm">
                  {season.votingEndDate}
                </td>

                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => toggleSeasonLock(season.seasonId)}
                    className="cursor-pointer hover:text-purple-300 text-[10px] sm:text-sm"
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
