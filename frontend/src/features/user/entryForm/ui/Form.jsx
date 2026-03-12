import React, { useState } from "react";
import { formFields } from "../../../../constants/userdata";
import { useSubmitEntry } from "../../home/hooks";

const Form = ({ seasonId, image }) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "", // added
    location: "",
    bio: "", // will map to description
  });

  const { mutate: submitEntry, isLoading, isError, isSuccess, error } = useSubmitEntry();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("seasonId", seasonId);
  data.append("name", formData.name);
  data.append("description", formData.bio); // bio → description
  data.append("dateOfBirth", formData.dateOfBirth);
  data.append("location", formData.location);
  data.append("image", image); // string or file

  // Loop through FormData to see the key-value pairs
  console.log("FormData contents:");
  for (let [key, value] of data.entries()) {
    console.log(key, value);
  }

  submitEntry(data);
};
  const handleCancel = () => {
    setFormData({
      name: "",
      dateOfBirth: "",
      location: "",
      bio: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-white font-semibold text-lg">PROFILE INTELLIGENCE</h3>

      <div className="grid grid-cols-2 gap-4">
        {formFields?.map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.label}
            className="bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#BE5EED] outline-none"
          />
        ))}

        {/* Add dateOfBirth field */}
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Date of Birth"
          className="bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#BE5EED] outline-none"
        />
      </div>

      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Tell the arena why you deserve the crown in 100 characters..."
        rows="4"
        className="w-full bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#BE5EED] outline-none resize-none"
      />

      {isSuccess && <p className="text-green-500">Entry submitted successfully!</p>}
      {isError && <p className="text-red-500">{error?.message || "Something went wrong"}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 rounded-lg bg-black text-white border border-gray-700 hover:border-[#BE5EED] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg bg-gradient-to-r from-[#BE5EED] to-purple-600 text-black font-semibold hover:opacity-90 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Arena Entry"}
        </button>
      </div>
    </form>
  );
};

export default Form;