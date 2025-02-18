
import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Image,
  Settings as SettingsIcon,
  FileText,
  Mail,
  Users,
  Cable,
  ChevronRight,
  Database,
  BoxesIcon,
  UserCircle,
  RefreshCw,
  Menu,
  X,
  InspectionPanel,
  Construction,
  Asterisk,
  Usb,
  Undo2,
  Inbox,
  ExternalLink,
} from "lucide-react";

const AdminLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [MaintenanceOpen, setMaintenanceOpen] = useState(false);

  const [reportsOpen, setReportsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeLinkStyle = "bg-blue-500 text-white";
  const baseLinkStyle =
    "flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white";
  const nestedLinkStyle =
    "flex items-center p-2 pl-12 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white";

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Hamburger Menu Button */}
      <button
        className="md:hidden fixed top-20 left-4 z-30 p-2  rounded-lg bg-white shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static w-72 bg-white h-screen overflow-y-auto text-gray-800 shadow-md flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0  " : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5 font-bold text-xl text-gray-900 border-b border-gray-300 flex justify-between items-center">
          Admin Panel
        </div>

        <ul className="space-y-2 p-5 flex-1">
          {/* <li>
            <NavLink
              to="/admin/dashboard-tables"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
              onClick={handleLinkClick}
            >
              <LayoutDashboard className="w-6 h-6 mr-3" />
              Tables
            </NavLink>
          </li> */}

          {/* Settings Dropdown */}
          <li>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`${baseLinkStyle} w-full group`}
            >
              <SettingsIcon className="w-6 h-6 mr-3" />
              <span className="flex-1 text-left">Settings</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  settingsOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            <ul
              className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                settingsOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <li onClick={() => setConnectorsOpen((prev) => !prev)}>
                <div
                  className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12"
                  onClick={handleLinkClick}
                >
                  <Cable className="w-5 h-5 mr-2" /> <span>Connectors</span>
                  <ChevronRight
                    className={`w-4 h-4 mt-1 ml-14 transition-transform duration-200 ${
                      connectorsOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div>
                  {connectorsOpen ? (
                    <div className="ml-5">
                      <li>
                        <NavLink
                          to="/admin/reports/customer-serials"
                          className={({ isActive }) =>
                            `${nestedLinkStyle} ${
                              isActive ? activeLinkStyle : ""
                            }`
                          }
                          onClick={handleLinkClick}
                        >
                          <Inbox className="w-5 h-5 mr-2" />
                          Inbound
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/reports/customer-serials"
                          className={({ isActive }) =>
                            `${nestedLinkStyle} ${
                              isActive ? activeLinkStyle : ""
                            }`
                          }
                          onClick={handleLinkClick}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Outbound
                        </NavLink>
                      </li>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </li>
              {[
                "api configurations",
                "email configurations",
                "users maintenance",
              ].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/admin/settings/${item}`}
                    className={({ isActive }) =>
                      `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                    }
                    onClick={handleLinkClick}
                  >
                    {item === "api configurations" && (
                      <Database className="w-5 h-5 mr-2" />
                    )}
                    {item === "email configurations" && (
                      <Mail className="w-5 h-5 mr-2" />
                    )}
                    {item === "users maintenance" && (
                      <Users className="w-5 h-5 mr-2" />
                    )}
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* Regular Items */}
          {/* <li>
            <NavLink
              to="/admin/item-image-upload"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
              onClick={handleLinkClick}
            >
              <Image className="w-6 h-6 mr-3" />
              Item Image Upload
            </NavLink>
          </li> */}

          {/* Reports Dropdown */}
          <li>
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`${baseLinkStyle} w-full group`}
            >
              <FileText className="w-6 h-6 mr-3" />
              <span className="flex-1 text-left">Reports</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  reportsOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            <ul
              className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                reportsOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <li>
                <NavLink
                  to="/admin/reports/items"
                  className={({ isActive }) =>
                    `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                  }
                  onClick={handleLinkClick}
                >
                  <BoxesIcon className="w-5 h-5 mr-2" />
                  Items
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports/customer-serials"
                  className={({ isActive }) =>
                    `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                  }
                  onClick={handleLinkClick}
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Customer Serials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports/returns"
                  className={({ isActive }) =>
                    `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                  }
                  onClick={handleLinkClick}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Returns
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports/audity-inspections"
                  className={({ isActive }) =>
                    `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                  }
                  onClick={handleLinkClick}
                >
                  <InspectionPanel className="w-5 h-5 mr-2" />
                  Auditly Inspections
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <button
              onClick={() => setMaintenanceOpen(!MaintenanceOpen)}
              className={`${baseLinkStyle} w-full group`}
            >
              <Construction className="w-6 h-6 mr-3" />
              <span className="flex-1 text-left">Maintenance</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  MaintenanceOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            <ul
              className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                MaintenanceOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              {[
                "Item master upload",
                "Customer Serial Upload",
                "Item Image Upload",
                "Return Upload",
              ].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/admin/settings/${item}`}
                    className={({ isActive }) =>
                      `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                    }
                    onClick={handleLinkClick}
                  >
                    {item === "Item master upload" && (
                      <Asterisk className="w-5 h-5 mr-2" />
                    )}
                    {item === "Customer Serial Upload" && (
                      <Usb className="w-5 h-5 mr-2" />
                    )}
                    {item === "Item Image Upload" && (
                      <Image className="w-5 h-5 mr-2" />
                    )}
                    {item === "Return Upload" && (
                      <Undo2 className="w-5 h-5 mr-2" />
                    )}
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li
            className={`mt-2 space-y-1 text-red-600  cursor-pointer  overflow-hidden transition-all duration-300`}
          >
            Logout
          </li>

          {/* <li>
            <NavLink
              to="/admin/item-upload"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
              onClick={handleLinkClick}
            >
              <RefreshCcw className="w-6 h-6 mr-3" />
              Customer Item Data upload
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink
              to="/admin/item-return"
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
              onClick={handleLinkClick}
            >
              <RefreshCcw className="w-6 h-6 mr-3" />
              Return Item Upload
            </NavLink>
          </li> */}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white shadow-md rounded-lg p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
