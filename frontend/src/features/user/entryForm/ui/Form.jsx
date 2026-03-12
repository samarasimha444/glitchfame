import React, { useState } from "react";
import { formFields } from "../../../../constants/userdata";
import { useSubmitEntry } from "../../home/hooks";
import toast from "react-hot-toast";

const Form = ({ seasonId, image }) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "", 
    location: "",
    bio: "", 
  });

const { mutate: submitEntry, isPending } = useSubmitEntry();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

    if (!image) {
    toast.error("Please upload an image before submitting.");
    return;
  }


  const data = new FormData();
  data.append("seasonId", seasonId);
  data.append("name", formData.name);
  data.append("description", formData.bio);
  data.append("dateOfBirth", formData.dateOfBirth);
  data.append("location", formData.location);
  data.append("image", image);

  submitEntry(data, {
    onSuccess: () => {
      toast.success("Arena entry submitted successfully 🚀");

      setFormData({
        name: "",
        dateOfBirth: "",
        location: "",
        bio: "",
      });
    },
    onError: (err) => {
      toast.error(err?.message || "Submission failed");
    },
  });
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

      <div className="grid grid-cols-2 gap-4 text-xs sm:text-base">
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
        className="w-full text-xs sm:text-base bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#BE5EED] outline-none resize-none"
      />

     

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 text-xs sm:text-base rounded-lg bg-black text-white border border-gray-700 hover:border-[#BE5EED] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className={`px-8 py-3 text-xs sm:text-base rounded-lg bg-gradient-to-r from-[#BE5EED] to-purple-600 text-black font-semibold hover:opacity-90 transition ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Submitting..." : "Submit Arena Entry"}
        </button>
      </div>
    </form>
  );
};

export default Form;