import React, { useState } from "react";
import { useUpdateRegistrationDates } from "../hooks";

const fieldConfig = {
  registration: [
    { label: "Registration Start Time", name: "registrationStart" },
    { label: "Registration End Time", name: "registrationEnd" },
  ],
  voting: [
    { label: "Voting Start Time", name: "votingStart" },
    { label: "Voting End Time", name: "votingEnd" },
  ],
};

const Model = ({ type, onClose }) => {
  console.log(type)

  const fields = fieldConfig[type] || [];

  const [formData, setFormData] = useState({});

  const { mutate: updateRegistration } = useUpdateRegistrationDates();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    updateRegistration({
      type,
      ...formData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

      <div className="bg-[#1a1f2b] w-[400px] rounded-xl p-6 border border-gray-700">

        <h2 className="text-white text-lg font-semibold mb-5 capitalize">
          {type} Timing
        </h2>

        <div className="space-y-4">

          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-gray-400 text-sm">
                {field.label}
              </label>

              <input
                type="datetime-local"
                name={field.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-[#111418] border border-gray-600 rounded text-white"
              />
            </div>
          ))}

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 border border-gray-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>

      </div>

    </div>
  );
};

export default Model;