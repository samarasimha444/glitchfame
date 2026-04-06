import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, User2Icon, Users } from "lucide-react";
import { useCallback, memo } from "react";

// ✅ move outside component (stable reference)
const menuItems = [
  {
    name: "Seasons",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Contestants",
    path: "season",
    icon: Users,
  },
  {
    name: "Settings",
    path: "settings",
    icon: Settings,
  },
  {
    name: "Logout",
    action: "logout",
    icon: User2Icon,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="h-screen mt-4 text-gray-300">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

         
          if (item.action === "logout") {
            return (
              <li key="logout">
                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:text-white"
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 hover:text-white"
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
  );
};


export default memo(Sidebar);