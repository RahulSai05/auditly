import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const activeLinkStyle = {
        backgroundColor: '#007bff', // Bootstrap primary blue
        color: 'white'
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-3 font-bold text-lg bg-blue-400 text-white">
                    Admin  {/* Update the branding style */}
                </div>
                <ul className="space-y-2 p-5">
                    <li>
                        <NavLink to="/admin/dashboard-tables" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 hover:bg-blue-500 hover:text-white rounded">
                            <span className="icon w-6 mr-2">📊</span>
                            Tables
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/item-image-upload" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 hover:bg-blue-500 hover:text-white rounded">
                            <span className="icon w-6 mr-2">🖼️</span>
                            Item Image Upload
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/item-upload" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 hover:bg-blue-500 hover:text-white rounded">
                            <span className="icon w-6 mr-2">📦</span>
                            Customer Item Data Upload
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/item-return" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center p-2 hover:bg-blue-500 hover:text-white rounded">
                            <span className="icon w-6 mr-2">🔄</span>
                            Return Item Upload
                        </NavLink>
                    </li>
                    {/* Additional links with icons */}
                    {/* Add more links as required */}
                </ul>
            </div>
            {/* Main content */}
            <div className="flex-1 p-10 overflow-hidden">
                <Outlet /> {/* Render child routes */}
            </div>
        </div>
    );
};

export default AdminLayout;
