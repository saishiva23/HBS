import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaHistory, FaTicketAlt, FaQuestionCircle } from "react-icons/fa";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const menu = [
  { name: "Favorites", path: "/favorites", icon: FaHeart },
  { name: "Recently viewed", path: "/recent", icon: FaHistory },
  { name: "Bookings", path: "/bookings", icon: FaTicketAlt },
  { name: "My Complaints", path: "/complaints", icon: ExclamationTriangleIcon },
  { name: "Help and support", path: "/help", icon: FaQuestionCircle },
];

const AccountSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 min-h-[calc(100vh-200px)] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2 shadow-lg transition-colors">
      <Link to="/" className="flex items-center gap-2 mb-6 text-sm font-semibold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <FaArrowLeft /> Back
      </Link>

      {menu.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
};

export default AccountSidebar;
