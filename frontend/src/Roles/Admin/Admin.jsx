import { Outlet, useOutletContext } from "react-router-dom";
import AdminSidebar from "./AdminSiderBar/AdminSideBar";

const Admin = () => {
  const { profile } = useOutletContext();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "30px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h2>Admin Dashboard</h2>
          <p>Welcome, {profile.username}</p>
        </div>

        <hr />

        {/* Nested Routes Render Here */}
        <div style={{ marginTop: "20px" }}>
          <Outlet context={{ profile }} />
        </div>

      </div>
    </div>
  );
};

export default Admin;