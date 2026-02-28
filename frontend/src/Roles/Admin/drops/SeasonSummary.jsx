import React from "react";
import { MoreVertical } from "lucide-react";

const SeasonSummary = ({ title, subtitle, data }) => {
  return (
    <div className="w-full bg-[#0f1115] flex ">
      <div className="w-full max-w-[650px]  border border-gray-900  ">

        
        <div className="flex items-start justify-between p-6 ">
          <div>
            <h2 className="text-white text-xl font-semibold">
              {title}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {subtitle}
            </p>
          </div>

          <button className="text-gray-400 hover:text-white transition">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-400">{item.label}</span>
                <span className={`${item.color || "text-white"} font-medium`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeasonSummary;