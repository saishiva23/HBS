import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClockIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const MenuDropdown = ({ open, onClose }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  // Menu for logged-in users (Trivago style)
  if (isAuthenticated) {
    return (
      <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 py-4 overflow-hidden transition-colors">

        {/* Account Section */}
        <MenuSection title="Account">
          <MenuItem
            icon={UserIcon}
            label="Personal info"
            to="/account/personal"
            onClick={onClose}
          />
          <MenuItem
            icon={ShieldCheckIcon}
            label="Account security"
            to="/account/security"
            onClick={onClose}
          />
        </MenuSection>

        {/* Trips Section */}
        <MenuSection title="Trips">
          <MenuItem
            icon={HeartIcon}
            label="Favorites"
            to="/favorites"
            onClick={onClose}
          />
          <MenuItem
            icon={ClockIcon}
            label="Recently viewed"
            to="/recent"
            onClick={onClose}
          />
          <MenuItem
            icon={BriefcaseIcon}
            label="Bookings"
            to="/bookings"
            onClick={onClose}
          />
        </MenuSection>

        {/* Preferences Section */}
        <MenuSection title="Preferences">
          <MenuItem
            icon={MagnifyingGlassIcon}
            label="Search preferences"
            to="/preferences/search"
            onClick={onClose}
          />
          <MenuItem
            icon={BellIcon}
            label="Notifications"
            to="/preferences/notifications"
            onClick={onClose}
          />
        </MenuSection>

        {/* Support Section */}
        <MenuSection title="Support">
          <MenuItem
            icon={QuestionMarkCircleIcon}
            label="Help and support"
            to="/help"
            onClick={onClose}
          />
          <MenuItem
            icon={BuildingOfficeIcon}
            label="stays.in for hoteliers"
            to="/hoteliers"
            onClick={onClose}
          />
        </MenuSection>

        {/* Logout - Separate with border */}
        <div className="border-t border-gray-100 mt-2 pt-2 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    );
  }

  // Menu for non-logged-in users (original)
  return (
    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 p-4 transition-colors">

      <MenuSection title="Trips">
        <MenuItem icon={HeartIcon} label="Favorites" to="/favorites" onClick={onClose} />
        <MenuItem icon={ClockIcon} label="Recently viewed" to="/recent" onClick={onClose} />
        <MenuItem icon={BriefcaseIcon} label="Bookings" to="/bookings" onClick={onClose} />
      </MenuSection>

      <MenuSection title="Support">
        <MenuItem icon={QuestionMarkCircleIcon} label="Help and support" to="/help" onClick={onClose} />
        <MenuItem icon={BuildingOfficeIcon} label="Hoteliers/Admin" to="/hoteliers" onClick={onClose} />
      </MenuSection>

    </div>
  );
};

export default MenuDropdown;
