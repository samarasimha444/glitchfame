import { Upload, X } from "lucide-react";
import Form from "./ui/Form";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ArenaForm = () => {
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f18] via-[#141a24] to-[#0c1b22] flex flex-col items-center py-12 md:py-16 px-4 sm:px-6">

  <div className="text-center mb-5 sm:mb-12 md:mb-16 max-w-xl">
    <span className="text-[10px] sm:text-xs text-primary border border-white px-3 py-1 rounded-full">
      NEW SEASON ENTRY
    </span>

    <h1 className="text-2xl sm:text-3xl md:text-6xl font-extrabold text-white mt-3 md:mt-6">
      JOIN THE <span className="text-primary">ARENA</span>
    </h1>

    <p className="text-gray-400 hidden sm:flex mt-4 md:mt-5 text-xs sm:text-sm md:text-base leading-relaxed">
      Upload your best look and claim your spot in the GlitchFame spotlight.
      Real-time voting starts as soon as you're approved.
    </p>
  </div>

  <div className="w-full max-w-4xl bg-[#11161f]/80 backdrop-blur-xl border border-gray-700 rounded-2xl 
  p-5 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

   
  <div className="relative w-full md:mt-12 border border-dashed border-gray-600 rounded-xl overflow-hidden
flex items-center justify-center text-center 
sm:h-[360px] ">
      
  {preview ? (
    <>
  <img
  src={preview}
  alt="preview"
  className="max-w-full h-full object-cover"
/>

          <button
            onClick={removeImage}
            className="absolute top-3 right-3 cursor-pointer bg-black/70 hover:bg-black text-white p-2 rounded-full transition"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <div className="p-6 md:p-8 space-y-5 md:space-y-6 flex flex-col items-center">

          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#BE5EED]/20">
            <Upload className="text-primary" />
          </div>

          <div>
            <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
              Drag & Drop or Click
            </p>
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>

          <label className="bg-black text-white px-5 py-2 rounded-md border border-gray-700 hover:border-[#BE5EED] transition cursor-pointer text-xs sm:text-sm">
            Browse Files
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <p className="text-[10px] sm:text-xs text-gray-500 max-w-[200px]">
            Ensure proper lighting, no masks, and centered subject.
          </p>
        </div>
      )}
    </div>

    
    <div className="w-full flex items-center">
      <Form seasonId={id} image={image} />
    </div>

  </div>

 
  <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 md:mt-16 text-gray-500 text-[10px] sm:text-xs md:text-sm">
    <span>• Secure Upload</span>
    <span>• Real-time Review</span>
    <span>• Global Payouts</span>
  </div>

</div>
  );
};

export default ArenaForm;