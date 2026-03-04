import { Upload } from "lucide-react";
import Form from "./ui/Form";


const ArenaForm = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f18] via-[#141a24] to-[#0c1b22] flex flex-col items-center justify-center py-5  px-6">

    
      <div className="text-center mb-12">
        <span className="text-xs text-[#BE5EED] border border-[#BE5EED] px-3 py-1 rounded-full">
          NEW SEASON ENTRY
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-5">
          JOIN THE <span className="text-[#BE5EED]">ARENA</span>
        </h1>

        {/* <p className="text-gray-400 mt-4 max-w-xl">
          Upload your best look and claim your spot in the GlitchFame spotlight.
          Real-time voting starts as soon as you're approved.
        </p> */}

      </div>

      
      <div className="w-full max-w-4xl bg-[#11161f]/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 grid md:grid-cols-2 gap-8">

        <div className="border border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6">

          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#BE5EED]/20">
            <Upload className="text-[#BE5EED]" />
          </div>

          <div>
            <p className="text-white font-semibold">Drag & Drop or Click</p>
            <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
          </div>

          <button className="bg-black text-white px-5 py-2 rounded-md border border-gray-700 hover:border-[#BE5EED] transition">
            Browse Files
          </button>

          <p className="text-xs text-gray-500 mt-6">
            Submission guidelines: Ensure proper lighting, no masks,
            and centered subject for better voting engagement.
          </p>
        </div>

      
       <Form/>
      </div>

      <div className="flex gap-10 mt-10 text-gray-500 text-sm">
        <span>• Secure Upload</span>
        <span>• Real-time Review</span>
        <span>• Global Payouts</span>
      </div>
    </div>
  );
};

export default ArenaForm;