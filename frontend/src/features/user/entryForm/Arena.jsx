import { Upload, X } from "lucide-react";
import Form from "./ui/Form";
import { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import LoginRequiredModal from "../../../components/LoginModal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../lib/helper";

const ArenaForm = () => {
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false);
  const { profile } = useOutletContext();

  // 🔥 Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const handleImageChange = (e) => {
    const token = localStorage.getItem("token");

    if (!profile || !token) {
      setShow(true);
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setTempImage(imageUrl);
    setShowCrop(true);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        tempImage,
        croppedAreaPixels
      );

      const croppedFile = new File([croppedBlob], "cropped.jpg", {
        type: "image/jpeg",
      });

      setImage(croppedFile);
      setPreview(URL.createObjectURL(croppedBlob));

      setShowCrop(false);
    } catch (err) {
      console.error(err);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };


return (
    <div className="min-h-screen w-full   bg-[#0a0a0f] bg-gradient-to-br from-[#0f0f18] via-[#141a24] to-[#0c1b22] 
      flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 py-24 px-4 sm:px-10 overflow-x-hidden">

      {show && <LoginRequiredModal onCancel={() => setShow(false)} />}

      
      <div className="w-full lg:w-120 text-center lg:text-left flex flex-col items-center lg:items-start z-10 pt-4 md:pt-0">

        <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
          <span className="h-px w-6 bg-primary/50 hidden lg:block"></span>
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase">
            Live Season Entry
          </span>

        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter">
          JOIN THE 
          <span className="text-transparent md:block ml-1 bg-clip-text bg-linear-to-r text-primary italic">
            ARENA
          </span>
        </h1>

        <p className="text-gray-400  hidden sm:block sm:mt-4 md:mt-6 text-xs sm:text-base md:text-lg leading-relaxed max-w-70 sm:max-w-md opacity-80">
          Upload your best look and claim your spot in the <span className="text-white font-semibold">GlitchFame</span> spotlight.
        </p>

        <div className="hidden sm:flex items-center gap-8 mt-12">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">100%</span>
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">Secure</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-800"></div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">LIVE</span>
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">Voting</span>
          </div>
        </div>
      </div>


      <div className="relative w-full max-w-225 mb-10">
        
        {/* Mobile Glow: Concentrated light for smaller screens */}
        <div className="absolute -inset-2 bg-primary/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative w-full bg-[#11161f]/60 backdrop-blur-3xl border border-white/10 rounded-4xl md:rounded-[2.5rem] 
          p-5 sm:p-8 md:p-12 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)]">

          {/* UPLOAD AREA */}
          <div className="flex flex-col">
             <div className="flex items-center gap-2 mb-4 md:mb-6 group cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#BE5EED]"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Step 01: Media</span>
             </div>

            <div className={`relative w-full transition-all duration-500 rounded-[1.2rem] md:rounded-3xl overflow-hidden
              flex items-center justify-center text-center h-75 sm:h-95 md:h-105
              ${preview ? 'bg-black' : 'bg-white/2 border border-white/5 hover:border-primary/40'}`}>

              {showCrop && tempImage ? (
                <div className="relative w-full h-full">
                  <Cropper
                    image={tempImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="absolute bottom-4 inset-x-4 flex gap-2 z-10">
                    <button onClick={() => setShowCrop(false)} className="flex-1 bg-zinc-900/90 text-white py-3 rounded-xl text-[10px] font-bold backdrop-blur-md">Cancel</button>
                    <button onClick={handleCropDone} className="flex-1 bg-primary text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-wider">Save Edit</button>
                  </div>
                </div>
              ) : preview ? (
                <div className="relative w-full h-full group/preview">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button onClick={removeImage} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-xl">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4 md:space-y-6 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl md:rounded-3xl bg-white/3 border border-white/10 text-primary transition-all duration-500 shadow-lg">
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base md:text-lg">Upload Portrait</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-1">4:5 Aspect Ratio Recommended</p>
                  </div>
                  <label className="bg-primary text-black font-black px-6 py-2.5 md:px-8 md:py-3 rounded-lg md:rounded-xl cursor-pointer hover:bg-primary transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-widest">
                    Select File
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Step 02: Profile</span>
             </div>
            <div className="w-full">
              
              <Form seasonId={id} image={image} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaForm;