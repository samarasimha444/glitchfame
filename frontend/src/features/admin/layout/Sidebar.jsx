import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

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
];

const Sidebar = () => {
  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

  return (
    <div className="h-screen mt-4 text-gray-300 ">
      <ul className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-start gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive ?
                      "bg-blue-600 text-white"
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

export default Sidebar;
