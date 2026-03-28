import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "../Footer.jsx";

import { Home, Trophy, Flame, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useProfile } from "../features/user/home/hooks.js";

const MobileBottomNav = () => {
  const baseClass =
    "flex flex-col items-center text-xs transition-all duration-200";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#1E2229] border-t border-gray-800 flex justify-around items-center py-2 md:hidden z-50">

      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-primary" : "text-gray-400"}`
        }
      >
        <Home size={18} />
        Home
      </NavLink>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-primary" : "text-gray-400"}`
        }
      >
        <Trophy size={18} />
        Rank
      </NavLink>

      <NavLink
        to="/vote"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-primary" : "text-gray-400"}`
        }
      >
        <Flame size={18} />
        Vote
      </NavLink>

      <NavLink
        to="/status"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-primary" : "text-gray-400"}`
        }
      >
        <User size={18} />
        Status
      </NavLink>

    </nav>
  );
};
const Layout = () => {
 

  const { data } = useProfile();

 const profile = data?.data || null;

  

  


  return (
    <>
    <section className="flex flex-col w-full max-w-[1700px] m-auto">

   
      <Navbar profile={profile} />
      <div>
        <Outlet context={{ profile }} />
       <Footer/>
      </div>
      <MobileBottomNav/>
       </section>
    </>
  );
};

export default Layout;