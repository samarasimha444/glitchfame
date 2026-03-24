import React, { memo } from "react";

const StatusChip = memo(({ status }) => {
  const base =
    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest";

  const styles = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    accepted: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
});

export default StatusChip;