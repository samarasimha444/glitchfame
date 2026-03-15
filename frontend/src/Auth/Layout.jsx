import { Outlet, useOutletContext } from "react-router-dom";
import UserProfile from "./Navbar.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "../Footer.jsx";

import { Home, Trophy, Flame, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileBottomNav=()=> {
  return (
    <nav className="fixed bottom-0 left-0 w-full py-3 bg-[#1E2229] border-t border-gray-800 flex justify-around items-center py-2 md:hidden z-50">

      <NavLink to="/" className="flex flex-col items-center text-gray-400 text-xs">
        <Home size={20} />
        Home
      </NavLink>

      <NavLink to="/rank" className="flex flex-col items-center text-gray-400 text-xs">
        <Trophy size={20} />
        Rank
      </NavLink>

      <NavLink to="/vote" className="flex flex-col items-center text-gray-400 text-xs">
        <Flame size={20} />
        Vote
      </NavLink>

      <NavLink to="/profile" className="flex flex-col items-center text-gray-400 text-xs">
        <User size={20} />
        Profile
      </NavLink>

    </nav>
  );
}

const Layout = () => {
  // Use dummy data for now
  const dummyProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/100",
  };

  
  const { profile } = useOutletContext() || { profile: dummyProfile };

  return (
    <>
      <Navbar profile={profile} />
      <div>
        <Outlet context={{ profile }} />

       <Footer/>
      </div>
      <MobileBottomNav/>
    </>
  );
};

export default Layout;