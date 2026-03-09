import React from "react";
import { CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import { useContestants } from "../hook";

const Approval = ({ className }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContestants();

  const contestants =
    data?.pages.flatMap((page) => page.content) ?? [];

    console.log(data)

  return (
    <div
      className={`w-full bg-[#0f1115] flex justify-center ${className}`}
    >
      <div className="w-full bg-[#1a1f2b] rounded-2xl p-6 shadow-xs border border-gray-800">
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3">
            <ShieldAlert className="text-yellow-400 mt-1" size={22} />
            <div>
              <h2 className="text-white text-xl font-semibold">
                Participant Approval Queue
              </h2>
              <p className="text-gray-400 text-sm">
                Review and moderate recent entries for the active season
              </p>
            </div>
          </div>

          <button className="text-blue-400 text-sm hover:underline">
            View All Queue
          </button>
        </div>

        <div className="space-y-3">
          {contestants.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-[#141821] border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition"
            >
              
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || "https://i.pravatar.cc/100"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">
                      {user.name}
                    </h3>

                    {user.isNew && (
                      <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm">
                    {user.location}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    {user.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[13px]">
                <button className="flex items-center gap-2 bg-black border border-gray-600 text-white px-4 py-2 rounded-lg hover:border-gray-400 transition">
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button className="flex items-center gap-2 bg-black border border-red-600 text-red-500 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition">
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          {hasNextPage && (
            <button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              className="text-gray-400 text-sm hover:text-white transition"
            >
              {isFetchingNextPage
                ? "Loading..."
                : "Load More Pending Entries"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approval;