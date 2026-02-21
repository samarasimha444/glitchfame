import { Outlet, useOutletContext } from "react-router-dom";
import UserProfile from "./UserProfile.jsx";

const Layout = () => {
  const { profile } = useOutletContext();

  return (
    <>
      <UserProfile profile={profile} />
      <div style={{ padding: "20px" }}>
        <Outlet context={{ profile }} />
      </div>
    </>
  );
};

export default Layout;