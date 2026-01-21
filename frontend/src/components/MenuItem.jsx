import { Link } from "react-router-dom";

const MenuItem = ({ icon: Icon, label, to, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
    >
      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      <span className="font-medium dark:text-gray-200">{label}</span>
    </Link>
  );
};

export default MenuItem;
