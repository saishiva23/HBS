import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";
import {
  HeartIcon,
  ClockIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const MenuDropdown = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border z-50 p-4">

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
