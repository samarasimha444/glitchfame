import React from "react";
import { CheckCircle, XCircle, ShieldAlert } from "lucide-react";

import { useContestants, useUpdateContestantStatus } from "../hook";
import toast from "react-hot-toast";

const Approval = ({ className }) => {
 
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useContestants();


  const contestants = data?.pages.flatMap((page) => page.content) ?? [];


  console.log(contestants)
  const { mutate: updateStatus, isLoading } = useUpdateContestantStatus();

  const handleAction = (action, userId) => {
    updateStatus(
      { id: userId, action },
      {
        onSuccess: () => {
          toast.success("success");
        },
        onError: (error) => {
          toast.error("something went wrong")
        },
      }
    );
  };

  return (
    <div className={`w-full bg-[#0f1115] flex justify-center ${className}`}>
      <div className="w-full max-w-full bg-[#1a1f2b] rounded-xs p-4 sm:p-6 shadow-xs border border-gray-800">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
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
          <button className="text-blue-400 text-sm hover:underline">Filter</button>
        </div>

        
        <div className="space-y-3">
          {contestants?.map((user) => (
            <div
              key={user.id}
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
                    <h3 className="text-white font-medium">{user.participantName}</h3>
                   
                  </div>
                  <p className="text-gray-400 text-sm">{user.location}</p>
                  <p className="text-gray-500 text-xs mt-1">{user.time}</p>
                </div>
              </div>

              
              <div className="flex flex-col text-xs sm:text-sm sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <button
                  onClick={() => handleAction("APPROVE", user.participationId)}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black border border-gray-600 text-white px-4 py-2 rounded-lg hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  onClick={() => handleAction("reject", user.userId)}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black border border-red-600 text-red-500 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              {isFetchingNextPage ? "Loading..." : "Load More Pending Entries"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approval;