import React, { useState } from "react";
import { useUpdateSeasonDates } from "../hooks";
import toast from "react-hot-toast";

const fieldConfig = {
  registration: [
    { label: "Registration Start Time", name: "start" },
    { label: "Registration End Time", name: "end" },
  ],
  voting: [
    { label: "Voting Start Time", name: "start" },
    { label: "Voting End Time", name: "end" },
  ],
};

const toUTC = (localDateTime) => {
  if (!localDateTime) return null;
  return new Date(localDateTime).toISOString();
};

const Model = ({ type, seasonId, onClose }) => {
  console.log(seasonId)
  const fields = fieldConfig[type] || [];

  const [formData, setFormData] = useState({
    start: "",
    end: "",
  });

  const { mutate: updateDates, isPending } = useUpdateSeasonDates();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // if (!formData.start || !formData.end) {
    //   toast.error("Both dates are required");
    //   return;
    // }

    const utcStart = toUTC(formData.start);
    const utcEnd = toUTC(formData.end);

    let payload = {
      id: seasonId,
    };

   
    if (type === "registration") {
      payload.registrationStart = utcStart;
      payload.registrationEnd = utcEnd;
    }

    if (type === "voting") {
      payload.votingStart = utcStart;
      payload.votingEnd = utcEnd;
    }

    updateDates(payload, {
      onSuccess: () => {
        toast.success("Updated successfully ");
        onClose();
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to update");
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-[#1a1f2b] w-full max-w-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
        
        <h2 className="text-white text-xl font-semibold mb-6 text-center capitalize">
          {type} Timing
        </h2>

        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">
                {field.label}
              </label>
              <input
                type="datetime-local"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-3 bg-[#111418] border border-gray-600 rounded-xl text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex-1 px-4 py-3 rounded-xl text-white ${
              isPending
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;