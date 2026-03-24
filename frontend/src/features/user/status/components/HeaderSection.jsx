import React, { memo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderSection = memo(() => {
  const navigate = useNavigate();

  return (
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
  );
});

export default HeaderSection;