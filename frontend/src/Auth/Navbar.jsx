import React, { lazy, Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Award, Info, Logs,UserPlus } from "lucide-react";
import MobileMenu from "../components/MobileSideBar";
import { Settings } from "lucide-react";
import NeonLoader from "../components/Loader";
const ResetModal = lazy(() => import("../components/ResetModel"));

const Navbar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

  const menuItems = [
    { label: "Live Arena", path: "/arena", icon: Zap },
    { label: "LeaderBoard", path: "/leaderboard", icon: Award },
    { label: "How it Works", path: "/aboutus", icon: Info },
  ];

  const actionButton = {
    label: "Participate",
    path: "/season",
    
  };


 const handleLogout = () => {
  localStorage.removeItem("token"); 
  navigate("/auth"); 
};

  return (
   <nav className="absolute  max-w-[1600px] mx-auto top-0 left-0 w-full z-50   border-gray-600/50 px-5 sm:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center space-x-2">

      <div className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center bg-primary shadow-[0_0_40px_rgba(168,85,247,0.5)]">
       <Zap className="text-black" size={26} />
    </div>

        <span className="font-bold px-2 sm:flex text-[#F9FAFB] text-[20px]">
          GlitchFame
        </span>

    {openModal && (
  <Suspense fallback={<NeonLoader />}>
    <ResetModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
    />
  </Suspense>
)}
      

        <ul className="hidden md:flex space-x-6 ml-4 text-[14px] font-medium">
          {menuItems.map((item, idx) =>
            item.path ?
              <li key={idx}>
                <Link
                  to={item.path}
                  className="flex items-center gap-1 hover:text-white-400 cursor-pointer"
                >
                  {item.icon && (
                    <item.icon size={16} className="text-primary" />
                  )}
                  {item.label}
                </Link>
              </li>
            : <li
                key={idx}
                className="flex items-center gap-1 hover:text-primary cursor-pointer"
              >
                {item.icon && (
                  <item.icon size={16} className="text-white" />
                )}
                {item.label}
              </li>,
          )}
        </ul>
      </div>

      <div className="hidden sm:flex items-center  space-x-4 relative">
        <Link to={actionButton.path}>

         <button className="flex items-center gap-2 text-white text-[14px]  py-2 hover:bg-prmie-500 hover:text-white transition">
          <span className="text-primary"> <UserPlus size={16} /> </span>
          {actionButton.label}
          </button>
        </Link>

        <div className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="w-10 h-10 rounded-full text-primary flex items-center justify-center  hover:bg-gray-600 transition"
          >
            <Settings size={18} />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg flex flex-col">
              <button
                className="px-4 py-2 text-white hover:text-red-400  transition"
                onClick={() => {
                  handleLogout()
                  setAvatarOpen(false);
                  console.log("Logout clicked");
                }}
              >
                Logout
              </button>
              <button 
                className="px-4 py-2 text-white hover:bg-gray-500 transition"
                onClick={() => {
                  setAvatarOpen(false);
                  setOpenModal(true)
                }}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        className="sm:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Logs size={28} className="animate-[wiggle_2s_ease-in-out_infinite]" />
      </button>

      <MobileMenu
        isOpen={isOpen}
        setOpenModal={setOpenModal}
        setIsOpen={setIsOpen}
        menuItems={menuItems}
        actionButton={actionButton}
        handleLogout={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
