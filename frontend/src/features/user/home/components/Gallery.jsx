import React from "react";
import { Trophy } from "lucide-react";

const data = [
  {
    id: 1,
    name: "Leo Dash",
    role: "PRE-SEASON",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Mia Thorne",
    role: "BETA TEST",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Chen Wei",
    role: "S0 PILOT",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const Gallery = () => {
  return (
    <div className="w-full px-3  sm:px-6 mt-6">

      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          Hall of Fame
        </h2>

        
      </div>

    
      <div className="flex gap-5  mt-6 overflow-x-auto no-scrollbar">

        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center min-w-[80px]">

            <div className="relative">
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[70px] h-[70px] rounded-full object-cover bg-[#111]"
                />
              </div>

              <div className="absolute bottom-0 right-0 bg-[#9DE2E2] rounded-full p-[3px]">
                <Trophy size={10} className="text-black" />
              </div>
            </div>

            
            <p className="text-white text-xs mt-2 text-center font-medium">
              {item.name}
            </p>

           
            <p className="text-[10px] text-gray-400 uppercase tracking-wide text-center">
              {item.role}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Gallery;