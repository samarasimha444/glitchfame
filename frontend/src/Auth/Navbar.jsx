import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#181B20] px-8 py-5 flex items-center justify-between">
  
      <div className="flex items-center space-x-2">
        <div className="bg-purple-500 p-2 rounded-md">
       
          <span className=" font-bold">Fire</span>
        </div>
        <span className=" font-bold text-[#BE5EED] text-[20px]">GlitchFame</span>

           <ul className="flex space-x-6  ml-4 text-[14px] font-medium">
        <li className="hover:text-purple-400 cursor-pointer">Live Arena</li>
        <li className="hover:text-purple-400 cursor-pointer">Leaderboard</li>
        <li className="hover:text-purple-400 cursor-pointer">How it Works</li>
      </ul>


      </div>

     
 
    
      <div className="flex items-center space-x-4">
        <button className="border border-purple-500 text-[14px] text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
          + Submit Entry
        </button>
        <img
          src="https://via.placeholder.com/40"
          alt=""
          className="w-10 h-10 bg-contain rounded-full border-2 border-purple-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;