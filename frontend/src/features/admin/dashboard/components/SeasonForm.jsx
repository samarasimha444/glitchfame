import { useState } from "react";
import { initialState } from "../../../../constants/admin";
import { fields } from "../../../../constants/admin";
import { useCreateSeason } from "../hooks";
import { prepareFormData, validateSeasonDates } from "../../../../lib/helper";


const SeasonForm = ({ initialData = {}, loading }) => {

  const { mutate: createSeason, isPending } = useCreateSeason();
  const [form, setForm] = useState({ ...initialState, ...initialData });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };



const handleSubmit = (e) => {
  e.preventDefault();

  const { formData, dateTimes } = prepareFormData(form);

  const errors = validateSeasonDates({
    registrationStart: new Date(dateTimes.registrationStart),
    registrationEnd: new Date(dateTimes.registrationEnd),
    votingStart: new Date(dateTimes.votingStart),
    votingEnd: new Date(dateTimes.votingEnd),
  });

  if (errors.length > 0) {
    return alert(errors.join("\n"));
  }

  createSeason(formData, {
    onSuccess: (data) => alert(data?.message || "Season created successfully!"),
    onError: (error) => alert(error?.message || "Failed to create season"),
  });
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
              value={form[`${field.name}Date`] || ""}
              onChange={handleChange}
              className={`${commonClasses} w-2/3`}
            />
            <input
              type="time"
              name={`${field.name}Time`}
              value={form[`${field.name}Time`] || ""}
              onChange={handleChange}
              className={`${commonClasses} w-1/3`}
            />
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            name={field.name}
            onChange={handleChange}
            className={commonClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={form[field.name] || ""}
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
          disabled={isPending}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Season"}
        </button>
      </div>
    </form>
  );
};

export default SeasonForm;