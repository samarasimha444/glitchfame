import React from "react";
import { Trash2, Zap, PlusCircle } from "lucide-react";

export const TableRow = React.memo(({ item, onVote, onDelete, setActive }) => {
  return (
    <tr className="group border-b border-gray-800/50 hover:bg-[#111622] transition-all duration-200 h-[68px]"> 
      
      <td className="pl-2 sm:pl-4">
        {/* Changed: Ensure items-center is present to V-align name with avatar center */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={item?.participantPhotoUrl}
              loading="lazy"
              alt={item.participantName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-gray-700 group-hover:border-cyan-500/50 transition-colors shadow-lg"
            />
            {/* Identity/Status Accent */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-[#0d1117]"></div>
          </div>
          <div className="flex flex-col min-w-0">
          
            <span className="text-white text-[12px] sm:text-sm font-bold truncate group-hover:text-cyan-400 transition-colors leading-tight">
              {item.participantName}
            </span>
            {/* Season Info (Mobile view: moves under name) */}
            <span className="text-[10px] text-gray-500 sm:hidden uppercase font-semibold">
              {item.seasonName}
            </span>
          </div>
        </div>
      </td>

     
      
      <td className="hidden sm:table-cell text-gray-400 text-xs">
        <div className="flex items-center h-full px-2 justify-end">
          <span className="bg-gray-900/50 border border-gray-800 px-2 py-1 rounded">
            {item.seasonName}
          </span>
        </div>
      </td>

     
      <td>
        <div className="flex items-center h-full px-2 justify-end">
          <div className="flex flex-col items-end leading-none"> {/* Right align internal text */}
            <span className="text-blue-400 font-black text-xs sm:text-base tabular-nums">
              {item.score?.toLocaleString()}
            </span>
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter leading-none">
              Points
            </span>
          </div>
        </div>
      </td>

      
      <td>
        <div className="flex items-center h-full px-2 sm:pr-4 gap-2 sm:gap-3 justify-end">
          
          <button
            onClick={() => setActive(item.participationId)}
            className="flex items-center gap-1.5 bg-[#141821] border border-gray-700 text-gray-300 
            text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 rounded-lg hover:border-cyan-500/30 hover:text-white transition-all shadow-md active:scale-95 shrink-0"
          >
            <PlusCircle size={14} className="text-gray-500" />
            <span className="hidden md:inline">Add</span>
          </button>

          
          <button
            onClick={() => onVote(item.participationId, 10)}
            className="flex items-center gap-1.5 bg-blue-950/40 border border-blue-500/20 text-blue-300 
            text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95 shrink-0"
          >
            <Zap size={13} className="hidden sm:block fill-blue-500 hover:fill-white" />
            +10
          </button>

          <button
            onClick={() => onDelete(item.participationId)}
            className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10 active:scale-90 shrink-0"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </td>
    </tr>
  );
});

TableRow.displayName = "TableRow";