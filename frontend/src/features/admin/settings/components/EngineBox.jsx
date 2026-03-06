import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

const SeasonScheduleBox = ({ data }) => {

  console.log(data);

  const [formData, setFormData] = useState({
    registrationStartDate: "",
    registrationEndDate: "",
    votingStartDate: "",
    votingEndDate: "",
  });

  const fields = [
    { label: "Registration Start", name: "registrationStartDate" },
    { label: "Registration End", name: "registrationEndDate" },
    { label: "Voting Start", name: "votingStartDate" },
    { label: "Voting End", name: "votingEndDate" },
  ];

  const formatForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  
  useEffect(() => {
    if (!data) return;

    setFormData({
      registrationStartDate: formatForInput(data?.registrationStartDate),
      registrationEndDate: formatForInput(data?.registrationEndDate),
      votingStartDate: formatForInput(data?.votingStartDate),
      votingEndDate: formatForInput(data?.votingEndDate),
    });
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("Updated schedule:", formData);
  };

  return (
    <div className="w-[340px] bg-[#0F141A] border border-gray-800 rounded-xl shadow-lg">

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-purple-400" size={18} />
          <h3 className="text-white text-sm font-semibold">
            Season Schedule
          </h3>
        </div>

        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
          CONFIG
        </span>
      </div>

      <div className="p-5 space-y-4">

        {fields.map((field) => (
          <div key={field.name}>
            <p className="text-xs text-gray-400 mb-2">{field.label}</p>

            <input
              type="datetime-local"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full bg-[#141821] border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded-md outline-none focus:border-purple-500"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2.5 rounded-md transition font-medium"
        >
          Update Status
        </button>

      </div>
    </div>
  );
};

export default SeasonScheduleBox;