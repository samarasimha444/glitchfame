import React, { memo } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = memo(() => {
  const navigate = useNavigate();

  return (
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
  );
});

export default Sidebar;