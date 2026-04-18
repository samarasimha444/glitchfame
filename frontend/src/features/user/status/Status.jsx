import React from "react";
import { useMyApplications } from "../entryForm/hooks";
import SubmissionCard from "./components/SubmissionCard";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";


const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin w-10 h-10 border-2 border-[#9DE2E2] border-t-transparent rounded-full" />
  </div>
);

const SubmissionsPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useMyApplications();
  const applications = data?.content || [];

  return (
    <div className="min-h-screen py-24 bg-[#1E2229] text-[#E6EEF0] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
      <div className="flex items-center gap-2">
       
        <div>
          <h1 className="text-2xl  sm:text-4xl tracking-tighter font-black uppercase  leading-none">
            Active Submissions
          </h1>
          <p className="small-text mt-2">
           Here are the applications you’ve participated in — past and ongoing.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/season")}
        className="px-5 py-2.5 rounded-xl bg-[#9DE2E2] text-[#072023] text-sm font-bold md:hover:brightness-110 transition-all shadow-lg shadow-[#9DE2E2]/10"
      >
        New Applications
      </button>
    </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {isLoading && (
              <div className="py-20 flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {isError && (
              <div className="p-20 border-2 border-dashed border-red-500/20 rounded-3xl text-center">
                <p className="text-red-400">
                 You need to log in to continue.
                </p>
              </div>
            )}

{!isLoading && !isError && applications.length > 0 && (
  <div className=" border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
    {/* Header */}
    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
      <h2 className="text-xl font-bold tracking-tight">Your Submissions</h2>
      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
        Track your season status
      </p>
    </div>

    
    <div className="divide-y divide-white/5">
      {applications.map((season) => (
        <SubmissionCard key={season.participationId} season={season} />
      ))}
    </div>
  </div>
)}

            {!isLoading && !isError && applications.length === 0 && (
              <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-[#95A0A6]">Nothing to be found.</p>
              </div>
            )}
          </div>

        <aside className="space-y-6">
      <div className="bg-[#9DE2E2]/[0.03] border border-[#9DE2E2]/10 rounded-2xl p-6 md:p-8 sticky top-8">
        <div className="w-10 h-10 rounded-xl bg-[#9DE2E2]/10 flex items-center justify-center text-[#9DE2E2] mb-6">
          <Info size={20} strokeWidth={2.5} />
        </div>

        <h3 className="text-lg font-bold mb-3">Next Steps</h3>

        <p className="text-sm text-[#95A0A6] mb-6">
          Accepted applicants will receive onboarding within{" "}
          <span className="text-white font-bold">48 hours</span>.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/aboutus")}
            className="w-full py-3 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all"
          >
            View Guidelines
          </button>

          <button className="w-full py-3 rounded-xl border border-[#9DE2E2]/20 text-[#9DE2E2] text-xs font-bold hover:bg-[#9DE2E2]/5 transition-all">
            Contact Support
          </button>
        </div>
      </div>
       </aside>
        </main>
      </div>
    </div>
  );
};

export default SubmissionsPage;