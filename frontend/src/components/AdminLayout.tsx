import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Image, Package, RefreshCcw } from "lucide-react";

const AdminLayout = () => {
  const activeLinkStyle = "bg-blue-500 text-white";
  const baseLinkStyle =
    "flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white text-gray-800 shadow-md flex flex-col">
        <div className="p-5 font-bold text-xl text-gray-900 border-b border-gray-300">
          Admin Panel
        </div>
        <ul className="space-y-2 p-5 flex-1">
          <li>
            <NavLink
              to="/admin/dashboard-tables"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
            >
              <LayoutDashboard className="w-6 h-6 mr-3" /> Tables
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/item-image-upload"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
            >
              <Image className="w-6 h-6 mr-3" /> Item Image Upload
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/item-upload"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
            >
              <Package className="w-6 h-6 mr-3" /> Customer Item Data Upload
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/item-return"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
            >
              <RefreshCcw className="w-6 h-6 mr-3" /> Return Item Upload
            </NavLink>
          </li>
        </ul>
      </div>
      {/* Main content */}
      <div className="flex-1  overflow-auto bg-white shadow-md rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
