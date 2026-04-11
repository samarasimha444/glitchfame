import React, { useCallback, useState } from "react";
import { formFields } from "../../../../constants/userdata";
import toast from "react-hot-toast";
import NeonLoader from "../../../../components/NeonLoader";
import { useNavigate } from "react-router-dom";
import { useSubmitEntry, useUploadImage } from "../hooks";
import DatePicker from "../../../../components/DatePicker";
import { isAdult } from "../../../../lib/helper";

const Form = ({ seasonId, image }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    location: "",
    bio: "",
  });

 

  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();
  const { mutate: submitEntry, isPending } = useSubmitEntry();

 const handleChange = useCallback((e) => {
  const { name, value } = e.target;


  if (name === "mobile") {
    const digitsOnly = value.replace(/\D/g, ""); 
    if (digitsOnly.length <= 10) {
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    }
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    const { name, location, bio, dateOfBirth } = formData;

    if (!name || !location || !bio || !dateOfBirth) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isAdult(dateOfBirth)) {
      toast.error("You must be at least 18 years old");
      return;
    }

    try {
      const uploadedUrl = await uploadImage({ file: image, seasonId });

      const payload = {
        seasonId,
        name,
        description: bio,
        dateOfBirth,
        location,
        photoUrl: uploadedUrl,
      };

      submitEntry(payload, {
        onSuccess: () => {
          toast.success("Submitted successfully");
          setFormData({ name: "", dateOfBirth: "", location: "", bio: "" });
          navigate("/home");
        },
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      dateOfBirth: "",
      location: "",
      bio: "",
    });
  };

  const isLoading = uploading || isPending;


  return (
    <>
      

      <form onSubmit={handleSubmit} className="space-y-6 relative w-full  ">
        <h3 className="text-white font-semibold text-lg">PROFILE INTELLIGENCE</h3>

        {isLoading && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 h-full">
  <NeonLoader />
</div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs sm:text-base">
          {formFields?.map((field,index) => (
            <input
              key={`${field.name}-${index}`}
              type={field.type}
              name={field.name}
              maxLength={30}
              value={formData[field.name]}
              onChange={handleChange}
              required=""
              placeholder={field.label}
              className="bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:bg-[#1a202c] outline-none"
            />
          ))}

         <div className="relative">
          <DatePicker
            value={formData.dateOfBirth}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                dateOfBirth: date,
              }))
            }
            placeholder="Date of Birth"
            className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2  focus:border-white outline-none cursor-pointer text-xs sm:text-sm "
          />
        </div>

        </div>

        <textarea
          name="bio"
          value={formData.bio}
          maxLength={170}
          onChange={handleChange}
          placeholder="Tell the arena why you deserve the crown..."
          rows="4"
          className="w-full text-xs sm:text-base bg-[#1a202c] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ffffff] outline-none resize-none focus:bg-[#1a202c]"
        />

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 text-xs sm:text-base rounded-lg bg-black text-white border border-gray-700 hover:border-[#BE5EED]"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 text-xs sm:text-base rounded-lg text-black font-semibold bg-primary ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {!isLoading ? "Submit Arena Entry" : uploading ? "Uploading..." : "Submitting..."}
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;