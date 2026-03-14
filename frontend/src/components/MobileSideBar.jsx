import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {  Zap } from "lucide-react";

const MobileMenu = ({ isOpen, setIsOpen, menuItems, actionButton,setOpenModal }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
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

              <div className=" w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                       <Zap className="text-white" size={26} />
                     </div>
           
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

            
            <div className="flex flex-col gap-3 text-xs mt-auto">
              <Link to={actionButton.path} onClick={() => setIsOpen(false)}>
                <button className="w-full text-center border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition">
                  {actionButton.label}
                </button>
              </Link>

               <button
              onClick={() => {
       setIsOpen(false);
    setOpenModal(true);
  }}
                className="w-full text-center border text-xs border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition"
              >
                Reset Password
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center border text-xs border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;