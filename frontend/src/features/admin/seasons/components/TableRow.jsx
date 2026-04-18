import React from "react";
import { Trash2 } from "lucide-react";

export const TableRow = React.memo(({ item, onVote, onDelete, setActive }) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-[#141821] transition">
      <td className="py-2 sm:py-5 flex items-center gap-2 sm:gap-4">
        <img
          src={item?.participantPhotoUrl}
          loading="lazy"
          alt={item.name}
          className="w-10 h-10 rounded-full object-contain"
        />
        <span className="text-white text-[11px] sm:text-xs font-medium">
          {item.participantName}
        </span>
      </td>

      <td className="hidden sm:table-cell text-gray-400 text-[11px] sm:text-sm">
        {item.seasonName}
      </td>

      <td className="text-blue-400 font-semibold text-[10px] sm:text-sm">
        {item.voteCount}
      </td>

      <td className="text-right">
        <div className="flex flex-wrap sm:flex-nowrap justify-end gap-1 sm:gap-3">

          {/* Custom Button */}
          <button
            onClick={() => setActive(item.participationId)}
            className="bg-[#141821] border border-gray-700 text-gray-300 
            text-[10px] sm:text-[12px] px-2 sm:px-3 py-[2px] sm:py-1 
            rounded-md hover:border-gray-500 transition"
          >
             Add Votes
          </button>

          {/* +10 Button */}
          <button
            onClick={() => onVote(item.participationId, 10)}
            className="bg-[#141821] border border-gray-700 text-gray-300 
            text-[11px] sm:text-[12px] px-5 sm:px-3 py-[2px] sm:py-1 
            rounded-md hover:border-gray-500 transition"
          >
            +10
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.participationId)}
            className="text-red-500 hover:text-red-400 transition"
          >
            <Trash2 size={14} className="sm:size-4" />
          </button>

        </div>
      </td>
    </tr>
  );
});

TableRow.displayName = "TableRow";