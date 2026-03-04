import { Outlet, useOutletContext } from "react-router-dom";
import UserProfile from "./Navbar.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "../Footer.jsx";

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
    </>
  );
};

export default Layout;