import { useState } from "react";

const initialState = {
  name: "",
  prizePool: "",
  registrationType: "Public Entry",
  registrationStart: "",
  registrationEnd: "",
  votingStart: "",
  votingEnd: "",
  status: "Active",
  description: "",
};

const fields = [
  { label: "Season Name *", name: "name", type: "text", required: true, full: true },
  { label: "Prize Pool", name: "prizePool", type: "text" },
  {
    label: "Registration Type",
    name: "registrationType",
    type: "select",
    options: ["Public Entry", "Private Entry"],
  },
  { label: "Registration Start", name: "registrationStart", type: "date" },
  { label: "Registration End", name: "registrationEnd", type: "date" },
  { label: "Voting Start", name: "votingStart", type: "date" },
  { label: "Voting End", name: "votingEnd", type: "date" },
  {
    label: "Initial Status",
    name: "status",
    type: "select",
    options: ["Active", "Inactive", "Draft"],
  },
  { label: "Description", name: "description", type: "textarea", full: true },
];

const SeasonForm = ({ onSubmit, initialData = {}, loading }) => {
  const [form, setForm] = useState({ ...initialState, ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="bg-[#171A1F] border w-full border-white/5 rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-6">
        Season Configuration
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.full ? "col-span-2" : ""}
          >
            <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">
              {field.label}
            </label>

            {/* SELECT */}
            {field.type === "select" && (
              <select
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full bg-[#111317] text-white px-4 py-2.5 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none transition"
              >
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            )}

            
            {field.type === "textarea" && (
              <textarea
                name={field.name}
                rows="4"
                value={form[field.name]}
                onChange={handleChange}
                className="w-full bg-[#111317] text-white px-4 py-2.5 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none transition resize-none"
              />
            )}

            
            {field.type !== "select" && field.type !== "textarea" && (
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full bg-[#111317] text-white px-4 py-2.5 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-600 outline-none transition"
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/5">
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg bg-[#2C2C2E] text-white/70 hover:bg-[#3A3A3C] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Season"}
        </button>
      </div>
    </form>
  );
};

export default SeasonForm;