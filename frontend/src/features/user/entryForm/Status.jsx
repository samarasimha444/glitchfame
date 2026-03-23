import React from "react";
import { ArrowLeft, Info, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyApplications } from "./hooks";

// ✅ Helper to detect phase
const getSeasonPhase = (season) => {
  const now = new Date();

  const regStart = new Date(season.registrationStartDate);
  const regEnd = new Date(season.registrationEndDate);
  const voteStart = new Date(season.votingStartDate);
  const voteEnd = new Date(season.votingEndDate);

  if (now >= regStart && now <= regEnd) return "REGISTRATION";
  if (now >= voteStart && now <= voteEnd) return "LIVE";
  if (now < regStart) return "UPCOMING";
  if (now > voteEnd) return "ENDED";

  return "UNKNOWN";
};

// ✅ Status chip
const StatusChip = ({ status }) => {
  const base =
    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest";

  const styles = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    accepted: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
};

// ✅ Loader
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin w-10 h-10 border-2 border-[#9DE2E2] border-t-transparent rounded-full" />
  </div>
);

const SubmissionsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMyApplications();

  const application = data?.content || [];

  return (
    <div className="min-h-screen bg-[#1E2229] text-[#E6EEF0] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">

        {/* ✅ HEADER ALWAYS VISIBLE */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 grid place-items-center rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all text-[#9DE2E2]">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>

            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Active Submissions
              </h1>
              <p className="text-sm text-[#95A0A6] mt-1 hidden md:block">
                Manage and monitor your current applications
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/season")}
            className="px-5 py-2.5 rounded-xl bg-[#9DE2E2] text-[#072023] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#9DE2E2]/10"
          >
            New Applications
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ✅ LOADING */}
            {isLoading && (
              <div className="py-20 flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {/* ❌ ERROR */}
            {isError && (
              <div className="p-20 border-2 border-dashed border-red-500/20 rounded-3xl text-center">
                <p className="text-red-400">
                  Something went wrong.
                  Try loggin in again
                </p>
              </div>
            )}

            {/* ✅ DATA */}
            {!isLoading && !isError && application.length > 0 &&
              application.map((season) => {
                const phase = getSeasonPhase(season);

                return (
                  <div
                    key={season.participationId}
                    className="bg-white/[0.03] border border-[#9DE2E2]/10 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="p-5 md:p-8 border-b border-white/5 bg-white/[0.01]">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-lg md:text-2xl font-bold">
                            {season.seasonName}
                          </h2>

                          <div className="flex items-center gap-2 text-[#95A0A6] text-sm">
                            <Calendar size={16} />
                            <span>
                              {new Date(
                                season.registrationStartDate
                              ).toLocaleDateString()}{" "}
                              —{" "}
                              {new Date(
                                season.votingEndDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* LIVE */}
                        {phase === "LIVE" && (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#9DE2E2]/10 text-[#9DE2E2] border border-[#9DE2E2]/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Live
                          </div>
                        )}

                        {/* REGISTRATION */}
                        {phase === "REGISTRATION" && (
                          <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest">
                            Registration Open
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 md:p-8 space-y-4">
                      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#1E2229]/50 border border-white/[0.03]">
                        
                        <div className="flex items-center gap-4">
                          {/* IMAGE FIX */}
                          <div className="relative w-12 h-12 overflow-hidden rounded-full">
                            <img
                              src={season.participantPhotoUrl}
                              alt={season.participantName}
                              className="w-full h-full object-cover object-top scale-125"
                            />
                          </div>

                          <div>
                            <p className="font-bold">
                              {season.participantName}
                            </p>
                            <p className="text-xs text-[#95A0A6]">
                              {season.seasonName}
                            </p>
                          </div>
                        </div>

                        <StatusChip status={season.status?.toLowerCase()} />
                      </div>
                    </div>
                  </div>
                );
              })
            }

            {/* ✅ EMPTY STATE */}
            {!isLoading && !isError && application.length === 0 && (
              <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-[#95A0A6]">
                  Nothing to be found.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
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