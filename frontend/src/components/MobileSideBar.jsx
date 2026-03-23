import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Search } from "lucide-react";

const MobileMenu = ({
  isOpen,
  setIsOpen,
  menuItems,
  actionButton,
  setOpenModal,
  handleLogout,
}) => {


  const [token, setToken] = useState(null);

 
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  return (

    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* DROPDOWN CARD */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#1E2229] rounded-2xl z-50 p-5 shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#9DE2E2] flex items-center justify-center">
                  <Zap size={18} className="text-black" />
                </div>
                <span className="text-white font-semibold">GLITCH</span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

           
           
            

            
            <div className="flex flex-col gap-3">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-white text-sm hover:text-primary transition"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-gray-400" />
                    {item.label}
                  </div>
                  <span className="text-gray-500">{">"}</span>
                </Link>
              ))}
            </div>

          
            <div className="border-t border-gray-700 my-4" />

            
            <Link to={actionButton.path} onClick={() => setIsOpen(false)}>
              <button className="w-full bg-[#9DE2E2] text-black font-semibold py-2 rounded-lg hover:opacity-90 transition">
               {actionButton.label}
              </button>
            </Link>

            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setOpenModal(true);
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Reset Password
              </button>

          {token ? (
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            ) : (
              
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="text-sm text-red-400 hover:text-red-300">
                  Login
                </button>
              </Link>
            )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;