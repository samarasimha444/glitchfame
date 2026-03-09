import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Zap, Award, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

 
  
  const menuItems = [
    { label: "Live Arena", path: "/arena/123", icon: Zap },
    { label: "LeaderBoard", path: "/leaderboard", icon: Award },
    { label: "How it Works", path: null, icon: Info },
  ];

  const actionButton = {
    label: "+ Enter Arena",
    path: "/season",
    img: "https://via.placeholder.com/40",
  };

  return (
    <nav className="bg-black md:bg-[#181B20] px-8 py-5 flex items-center justify-between relative">
      
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
                <Link to={item.path} className="flex items-center gap-1 hover:text-purple-400 cursor-pointer">
                  {item.icon && <item.icon size={16} className="text-purple-500" />}
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={idx} className="flex items-center gap-1 hover:text-purple-400 cursor-pointer">
                {item.icon && <item.icon size={16} className="text-purple-500" />}
                {item.label}
              </li>
            )
          )}
        </ul>
      </div>

   
      <div className="hidden sm:flex md:block">
        <Link to={actionButton.path} className="flex items-center space-x-4">
          <button className="border border-purple-500 text-[14px] text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
            {actionButton.label}
          </button>
          
         
        </Link>

        
      </div>

      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={28} className="animate-[wiggle_2s_ease-in-out_infinite]" />
      </button>

     
      <AnimatePresence>
    {isOpen && (
    <>
    
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black z-40"
      />

  
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-62.5 h-full bg-black z-50 flex flex-col p-8 gap-6 shadow-lg"
      >
       
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Zap className="text-white" size={24} />
          </div>
          <span className="text-white font-bold text-lg">GlitchFame</span>
        </div>

        
        <div className="flex flex-col gap-4">
           {menuItems.map((item, idx) =>
                  item.path ? (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-white font-medium text-base hover:text-purple-400 transition-colors flex items-center gap-2"
                    >
                      {item.icon && <item.icon size={20} className="text-purple-500" />}
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      key={idx}
                      className="text-white font-medium text-base hover:text-purple-400 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      {item.icon && <item.icon size={20} className="text-purple-500" />}
                      {item.label}
                    </span>
                  )
                )}
        </div>

    
        <div className="border-t border-gray-800 my-4" />

        
        <Link
          to={actionButton.path}
          onClick={() => setIsOpen(false)}
          className="flex flex-col items-center space-y-3 mt-auto"
        >
          <button className="w-full text-center border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
            {actionButton.label}
          </button>
           <button className="w-full text-center border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
            Logout
          </button>
          
          
        </Link>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </nav>
  );
};

export default Navbar;