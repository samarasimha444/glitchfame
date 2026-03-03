import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#181B20] px-8 py-5 flex items-center justify-between relative">
      
     
      <div className="flex items-center space-x-2">
        <div className="bg-purple-500 p-2 rounded-md">
          <span className="font-bold">Fire</span>
        </div>

        <span className="font-bold text-[#BE5EED] text-[20px]">
          GlitchFame
        </span>

        
        <ul className="hidden md:flex space-x-6 ml-4 text-[14px] font-medium">
          <li>
            <Link
              to="/arena"
              className="hover:text-purple-400 cursor-pointer"
            >
              Live Arena
            </Link>
          </li>

          <li>
            <Link
              to="/leaderboard"
              className="hover:text-purple-400 cursor-pointer"
            >
              LeaderBoard
            </Link>
          </li>

          <li className="hover:text-purple-400 cursor-pointer">
            How it Works
          </li>
        </ul>
      </div>

      
      <div className="hidden md:block">
        <Link to="/season" className="flex items-center space-x-4">
          <button className="border border-purple-500 text-[14px] text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
            + Enter Arena
          </button>
          <img
            src="https://via.placeholder.com/40"
            alt=""
            className="w-10 h-10 bg-contain rounded-full border-2 border-purple-500"
          />
        </Link>
      </div>

      
     <button className="md:hidden text-white">
  <Menu
    size={28}
    className="animate-[wiggle_2s_ease-in-out_infinite]"
  />
</button>

      
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#181B20] flex flex-col items-center space-y-4 py-6 md:hidden z-50">
          
          <Link
            to="/arena"
            onClick={() => setIsOpen(false)}
            className="hover:text-purple-400"
          >
            Live Arena
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => setIsOpen(false)}
            className="hover:text-purple-400"
          >
            LeaderBoard
          </Link>

          <span className="hover:text-purple-400 cursor-pointer">
            How it Works
          </span>

          <Link
            to="/season"
            onClick={() => setIsOpen(false)}
            className="flex flex-col items-center space-y-3"
          >
            <button className="border border-purple-500 text-[14px] text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
              + Enter Arena
            </button>

            <img
              src="https://via.placeholder.com/40"
              alt=""
              className="w-10 h-10 bg-contain rounded-full border-2 border-purple-500"
            />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;