import React from "react";

const MenuSection = ({ title, children }) => {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default MenuSection;
