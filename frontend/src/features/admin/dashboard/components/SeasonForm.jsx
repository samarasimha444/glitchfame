import { useState } from "react";

const initialState = {
  name: "",
  prizePool: "",
  registrationType: "Public Entry",

  registrationStartDate: "",
  registrationStartTime: "",
  registrationEndDate: "",
  registrationEndTime: "",

  votingStartDate: "",
  votingStartTime: "",
  votingEndDate: "",
  votingEndTime: "",

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

  { label: "Registration Start", name: "registrationStart", type: "datetime" },
  { label: "Registration End", name: "registrationEnd", type: "datetime" },

  { label: "Voting Start", name: "votingStart", type: "datetime" },
  { label: "Voting End", name: "votingEnd", type: "datetime" },

  { label: "Description", name: "description", type: "textarea", full: true },
];

const SeasonForm = ({ initialData = {}, loading }) => {
  const [form, setForm] = useState({ ...initialState, ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = { ...form };

    fields.forEach((field) => {
      if (field.type === "datetime") {
        const date = form[`${field.name}Date`];
        const time = form[`${field.name}Time`];

        if (date && time) {
          formattedData[field.name] = `${date}T${time}`;
        }
      }
    });

    console.log(formattedData)

  
  };


  const renderInput = (field) => {
    const commonClasses =
      "w-full bg-[#111317] text-sm text-white px-3 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-600 outline-none transition";

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            className={commonClasses}
          >
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            rows="4"
            value={form[field.name]}
            onChange={handleChange}
            className={`${commonClasses} resize-none`}
          />
        );

      case "datetime":
        return (
          <div className="flex gap-3">
            <input
              type="date"
              name={`${field.name}Date`}
              value={form[`${field.name}Date`]}
              onChange={handleChange}
              className={`${commonClasses} w-2/3`}
            />
            <input
              type="time"
              name={`${field.name}Time`}
              value={form[`${field.name}Time`]}
              onChange={handleChange}
              className={`${commonClasses} w-1/3`}
            />
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            required={field.required}
            className={commonClasses}
          />
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#171A1F] border border-white/5 rounded-xl p-6 w-full"
    >
      <h2 className="text-base font-semibold text-white mb-6">
        Season Configuration
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.full ? "col-span-2" : ""}>
            <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">
              {field.label}
            </label>

            {renderInput(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/5">
        <button
          type="button"
          className="px-4 py-2 text-sm rounded-lg bg-[#2C2C2E] text-white/70 hover:bg-[#3A3A3C] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Season"}
        </button>
      </div>
    </form>
  );
};

export default SeasonForm;