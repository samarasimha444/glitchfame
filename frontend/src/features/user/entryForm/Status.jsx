import React from "react";
import { ArrowLeft, MoreVertical, Info, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const useProfile = () => {
  return {
    isLoading: false,
    error: null,
    data: {
      seasons: [
        {
          id: 1,
          name: "Winter 2024 Innovators Grant",
          dateRange: "Jan 15, 2024 — Mar 30, 2024",
          isActive: true,
          isLive: true,
          submissions: [
            {
              name: "Alex Rivers",
              email: "a.rivers@techflow.io",
              status: "pending",
              avatar: "https://i.pravatar.cc/150?u=alex",
            },
            {
              name: "Jordan Smith",
              email: "j.smith@designco.com",
              status: "accepted",
              avatar: "https://i.pravatar.cc/150?u=jordan",
            },
          ],
        },
      ],
    },
  };
};

// ✅ Inline StatusChip (same UI feel)
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

// ✅ Inline Loader
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#1E2229] text-white">
    <div className="animate-spin w-10 h-10 border-2 border-[#9DE2E2] border-t-transparent rounded-full" />
  </div>
);

// ✅ Inline Error
const ErrorMessage = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#1E2229] text-red-400">
    Something went wrong.
  </div>
);

const SubmissionsPage = () => {
  const { data, isLoading, error } = useProfile();
  const navigate = useNavigate()

  const activeSeasons =
    data?.seasons?.filter((season) => season.isActive) || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-[#1E2229] text-[#E6EEF0] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
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
                Manage and monitor your current grant applications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={()=>navigate('/season')} className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#9DE2E2] text-[#072023] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#9DE2E2]/10">
              New Applications
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeSeasons.length > 0 ? (
              activeSeasons.map((season) => (
                <div
                  key={season.id}
                  className="bg-white/[0.03] border border-[#9DE2E2]/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-5 md:p-8 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-lg md:text-2xl font-bold">
                          {season.name}
                        </h2>

                        <div className="flex items-center gap-2 text-[#95A0A6] text-sm">
                          <Calendar size={16} />
                          <span>{season.dateRange}</span>
                        </div>
                      </div>

                      {season.isLive && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#9DE2E2]/10 text-[#9DE2E2] border border-[#9DE2E2]/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9DE2E2]" />
                          Live
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 md:p-8 space-y-4">
                    <h3 className="text-[10px] font-black text-[#95A0A6] uppercase tracking-[0.2em] mb-4">
                      Current Status ({season.submissions?.length})
                    </h3>

                    {season.submissions?.map((sub, idx) => (
                      <div
                        key={idx}
                        className="group flex md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-[#1E2229]/50 border border-white/[0.03] hover:border-[#9DE2E2]/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={sub.avatar}
                              alt={sub.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/5 group-hover:border-[#9DE2E2]/50 transition-colors"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1E2229] border border-white/10 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-[#E6EEF0] group-hover:text-[#9DE2E2] transition-colors">
                              {sub.name}
                            </p>
                            <p className="text-xs text-[#95A0A6] truncate">
                              {sub.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <StatusChip status={sub.status} />

                        
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-[#95A0A6]">
                  No active seasons found.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-[#9DE2E2]/[0.03] border border-[#9DE2E2]/10 rounded-2xl p-6 md:p-8 sticky top-8">
              <div className="w-10 h-10 rounded-xl bg-[#9DE2E2]/10 flex items-center justify-center text-[#9DE2E2] mb-6">
                <Info size={20} strokeWidth={2.5} />
              </div>

              <h3 className="text-lg font-bold mb-3">Next Steps</h3>

              <p className="text-sm leading-relaxed text-[#95A0A6] mb-6">
                Accepted applicants will receive an onboarding email within{" "}
                <span className="text-[#E6EEF0] font-bold">48 hours</span>.
                If your status is Pending, our review board is currently
                evaluating your profile.
              </p>

              <div className="space-y-3">
                <button onClick={()=>navigate('/aboutus')}  className="w-full py-3 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
                  View Review Guidelines
                </button>

                <button className="w-full py-3 rounded-xl border border-[#9DE2E2]/20 text-[#9DE2E2] text-xs font-bold hover:bg-[#9DE2E2]/5 transition-all">
                  Contact Review Board
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