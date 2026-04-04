import React from "react";
import { useMyApplications } from "../entryForm/hooks";
import Sidebar
 from "./components/SideBar";
import SubmissionCard from "./components/SubmissionCard";
import HeaderSection from "./components/HeaderSection";



const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin w-10 h-10 border-2 border-[#9DE2E2] border-t-transparent rounded-full" />
  </div>
);

const SubmissionsPage = () => {
  const { data, isLoading, isError } = useMyApplications();
  const applications = data?.content || [];

  return (
    <div className="min-h-screen pt-20 bg-[#1E2229] text-[#E6EEF0] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <HeaderSection />

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
                  Something went wrong. Try logging in again.
                </p>
              </div>
            )}

            {!isLoading && !isError && applications.length > 0 &&
              applications.map((season) => (
                <SubmissionCard key={season.participationId} season={season} />
              ))
            }

            {!isLoading && !isError && applications.length === 0 && (
              <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-[#95A0A6]">Nothing to be found.</p>
              </div>
            )}
          </div>

          <Sidebar />
        </main>
      </div>
    </div>
  );
};

export default SubmissionsPage;