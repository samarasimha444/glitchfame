import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Zap, Award, Info, Logs } from "lucide-react";
import MobileMenu from "../components/MobileSideBar"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const menuItems = [
    { label: "Live Arena", path: "/arena", icon: Zap },
    { label: "LeaderBoard", path: "/leaderboard", icon: Award },
    { label: "How it Works", path: null, icon: Info },
  ];

  const actionButton = {
    label: "Participate",
    path: "/season",
    img: "https://via.placeholder.com/40",
  };

  return (
    <nav className="bg-black z-50 md:bg-[#181B20] px-8 py-5 flex items-center justify-between relative">
     
      <div className="flex items-center space-x-2">
        <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
          <Zap className="text-white" size={26} />
        </div>
        <span className="font-bold px-2 sm:flex text-[#BE5EED] text-[20px]">
          GlitchFame
        </span>

        <ul className="hidden md:flex space-x-6 ml-4 text-[14px] font-medium">
          {menuItems.map((item, idx) =>
            item.path ? (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="flex items-center gap-1 hover:text-purple-400 cursor-pointer"
                >
                  {item.icon && <item.icon size={16} className="text-purple-500" />}
                  {item.label}
                </Link>
              </li>
            ) : (
              <li
                key={idx}
                className="flex items-center gap-1 hover:text-purple-400 cursor-pointer"
              >
                {item.icon && <item.icon size={16} className="text-purple-500" />}
                {item.label}
              </li>
            )
          )}
        </ul>
      </div>

      
      <div className="hidden sm:flex items-center space-x-4 relative">
        <Link to={actionButton.path}>
          <button className="border border-purple-500 text-[14px] text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
            {actionButton.label}
          </button>
        </Link>

        <div className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold"
          >
            A
          </button>

          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg flex flex-col">
              <button
                className="px-4 py-2 text-white hover:bg-purple-500 transition"
                onClick={() => {
                  setAvatarOpen(false);
                  console.log("Logout clicked");
                }}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 text-white hover:bg-purple-500 transition"
                onClick={() => {
                  setAvatarOpen(false);
                  console.log("Reset Password clicked");
                }}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>

  
      <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        <Logs size={28} className="animate-[wiggle_2s_ease-in-out_infinite]" />
      </button>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        menuItems={menuItems}
        actionButton={actionButton}
      />
    </nav>
  );
};

export default Navbar;