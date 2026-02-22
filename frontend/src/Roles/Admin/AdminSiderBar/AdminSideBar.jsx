import { NavLink } from "react-router-dom";
import { adminMenuItems } from "./AdminMenuItems";

const AdminSidebar = () => {
  return (
    <div style={{ width: "250px" }}>
      <h3>Admin</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {adminMenuItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "12px" }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;