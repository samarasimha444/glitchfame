import React, { useState } from "react";

const Form = () => {

  const fields = [
    { label: "In-game Name", name: "name", type: "text" },
    { label: "Mobile Number", name: "mobile", type: "text" },
    { label: "Age (Min 18)", name: "age", type: "number" },
    { label: "Location", name: "location", type: "text" }
  ];

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    location: "",
    bio: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <h3 className="text-white font-semibold text-lg">
        PROFILE INTELLIGENCE
      </h3>

   
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
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
      </div>

      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Tell the arena why you deserve the crown in 100 characters..."
        rows="4"
        className="w-full bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#BE5EED] outline-none resize-none"
      />

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          className="px-6 py-3 rounded-lg bg-black text-white border border-gray-700 hover:border-[#BE5EED] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#BE5EED] to-purple-600 text-black font-semibold hover:opacity-90 transition"
        >
          Submit Arena Entry
        </button>
      </div>

    </form>
  );
};

export default Form;