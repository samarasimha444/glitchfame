import React from "react";
import {
  CheckCircle,
  XCircle,
  ShieldAlert,
  Search,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useUpdateContestantStatus } from "../hook";

import { TableShimmer } from "../../../../components/TableShimmer";
import NeonLoader from "../../../../components/NeonLoader";

const Approval = ({
  contestants = [],
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  setSearch,
  search,
  className,
}) => {
  console.log(contestants);

  const { mutate: updateStatus, isPending } = useUpdateContestantStatus();

  const handleAction = (action, userId) => {
    updateStatus({ id: userId, action });
  };

  {
    isLoading && <TableShimmer />;
  }

  {
    isPending && <NeonLoader />;
  }

  return (
    <div className={`w-full bg-[#0f1115] flex justify-center ${className}`}>
      <div className="w-full max-w-full bg-[#1a1f2b] rounded-xs p-4 sm:p-6 min-h-[30dvh] shadow-xs border border-gray-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
         
          <div className="flex gap-3 items-start sm:items-center">
            <ShieldAlert className="text-yellow-400 mt-1 sm:mt-0" size={22} />
            <div>
              <h2 className="text-white text-xl font-semibold">
                Participant Approval Queue
              </h2>
              <p className="text-gray-400 text-sm">
                Review and moderate recent entries for the active season
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
               onChange={(e)=>setSearch(e.target.value)}
               value={search}
                type="text"
                placeholder="Search..."
                className="w-full sm:w-60 h-10 sm:h-9 pl-9 pr-8 text-sm bg-[#141821] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600 transition"
              />
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
              />
            </div>

            {/* Filter by Time */}
            <div className="relative flex-1 sm:flex-none">
              <select className="w-full sm:w-32 h-10 sm:h-9 px-3 text-sm bg-[#141821] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 transition appearance-none cursor-pointer">
                <option value="all">All Time</option>
                <option value="new">Newest</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Accept All Action */}
            <button className="w-full sm:w-auto h-10 sm:h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2">
              Accept All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {contestants.length === 0 ?
            <div className="flex flex-col items-center justify-center min-h-[100px] text-center text-gray-400">
              <p className="text-sm"> You're all caught up</p>
            </div>
          : contestants?.map((user) => (
              <div
                key={user.participationId}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#141821] border border-gray-700 rounded-xl p-4 sm:p-5 hover:border-gray-500 transition gap-3"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={`${user.participantPhotoUrl}?q=60&w=100`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <h3 className="text-white font-medium">
                        {user.participantName}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">{user.location}</p>
                    <p className="text-gray-500 text-xs mt-1">{user.time}</p>
                  </div>
                </div>

                <div className="flex flex-col text-xs sm:text-sm sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      handleAction("APPROVED", user.participationId)
                    }
                    disabled={isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black border border-gray-600 text-white px-4 py-2 rounded-lg hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction("REJECTED", user.participationId)
                    }
                    disabled={isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black border border-red-600 text-red-500 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        <div className="text-center mt-3">
          {hasNextPage && (
            <button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              className="text-gray-400 text-sm hover:text-white transition"
            >
              {isFetchingNextPage ? "Loading..." : "Load More Pending Entries"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approval;
