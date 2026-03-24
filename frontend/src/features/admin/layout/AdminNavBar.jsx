import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, Menu, X, User } from "lucide-react";

const menuItems = [
  { name: "Seasons", path: "/admin", icon: LayoutDashboard },
  { name: "Contestants", path: "/admin/season", icon: Users },
  { name: "Settings", path: "/admin/settings", icon: Settings },
  { name: "Logout", icon: User }, // no path for logout
];

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/auth"); // redirect to login
  };

  return (
    <nav className="relative w-full border-b border-gray-700 shadow-sm py-3 flex justify-between items-center md:hidden">
      <div className="text-white font-bold text-xl">Admin Dashboard</div>

      <button onClick={() => setIsOpen(!isOpen)} className="text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111418] border-t border-gray-700 shadow-lg z-50">
          <ul className="flex flex-col p-4 gap-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              if (item.name === "Logout") {
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-base ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;