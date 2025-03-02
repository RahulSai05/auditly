
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
        className="md:hidden fixed top-20 left-4 z-30 p-2 rounded-lg bg-white shadow-lg"
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
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5 font-bold text-xl text-gray-900 border-b border-gray-300 flex justify-between items-center">
          Admin Panel
        </div>

        <ul className="space-y-2 p-5 flex-1">
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
                  {connectorsOpen && (
                    <div className="ml-5">
                      <li>
                        <NavLink
                          to="/admin/settings/connectors/inbound"
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
                          to="/admin/settings/connectors/outbound"
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
                  )}
                </div>
              </li>
              {[
                { name: "api-configurations", icon: <Database className="w-5 h-5 mr-2" /> },
                { name: "email-configurations", icon: <Mail className="w-5 h-5 mr-2" /> },
                { name: "users-maintenance", icon: <Users className="w-5 h-5 mr-2" /> },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={`/admin/settings/${item.name}`}
                    className={({ isActive }) =>
                      `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                    }
                    onClick={handleLinkClick}
                  >
                    {item.icon}
                    {item.name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

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

          {/* Maintenance Dropdown */}
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
                { name: "item-master-upload", icon: <Asterisk className="w-5 h-5 mr-2" /> },
                { name: "customer-serial-upload", icon: <Usb className="w-5 h-5 mr-2" /> },
                { name: "item-image-upload", icon: <Image className="w-5 h-5 mr-2" /> },
                { name: "return-upload", icon: <Undo2 className="w-5 h-5 mr-2" /> },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={`/admin/settings/${item.name}`}
                    className={({ isActive }) =>
                      `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                    }
                    onClick={handleLinkClick}
                  >
                    {item.icon}
                    {item.name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* Logout */}
          <li
            className={`mt-2 space-y-1 text-red-600 cursor-pointer overflow-hidden transition-all duration-300`}
          >
            Logout
          </li>
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
  Construction,
  Asterisk,
  Usb,
  Undo2,
  Inbox,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
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

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      opacity: 0, 
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const dropdownVariants = {
    open: { 
      height: "auto",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const overlayVariants = {
    open: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Hamburger Menu Button */}
      <motion.button
        className="md:hidden fixed top-20 left-4 z-30 p-2 rounded-lg bg-white shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sidebar */}
      <motion.div
        className="fixed md:static w-72 bg-white h-screen overflow-y-auto text-gray-800 shadow-md flex flex-col z-30"
        initial={isMobile ? "closed" : "open"}
        animate={isSidebarOpen ? "open" : isMobile ? "closed" : "open"}
        variants={sidebarVariants}
      >
        <motion.div 
          className="p-5 font-bold text-xl text-gray-900 border-b border-gray-300 flex justify-between items-center"
          variants={itemVariants}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
          >
            Admin Panel
          </motion.span>
        </motion.div>

        <ul className="space-y-2 p-5 flex-1">
          {/* Settings Dropdown */}
          <motion.li variants={itemVariants}>
            <motion.button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`${baseLinkStyle} w-full group`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <SettingsIcon className="w-6 h-6 mr-3" />
              </motion.div>
              <span className="flex-1 text-left">Settings</span>
              <motion.div
                animate={{ rotate: settingsOpen ? 90 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.ul
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  <motion.li 
                    variants={itemVariants}
                    onClick={() => setConnectorsOpen((prev) => !prev)}
                  >
                    <motion.div
                      className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12 cursor-pointer"
                      onClick={handleLinkClick}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Cable className="w-5 h-5 mr-2" />
                      </motion.div>
                      <span>Connectors</span>
                      <motion.div
                        animate={{ rotate: connectorsOpen ? 90 : 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                    <AnimatePresence>
                      {connectorsOpen && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={dropdownVariants}
                          className="ml-5 overflow-hidden"
                        >
                          <motion.li variants={itemVariants}>
                            <NavLink
                              to="/admin/settings/connectors/inbound"
                              className={({ isActive }) =>
                                `${nestedLinkStyle} ${
                                  isActive ? activeLinkStyle : ""
                                }`
                              }
                              onClick={handleLinkClick}
                            >
                              <motion.div
                                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <Inbox className="w-5 h-5 mr-2" />
                              </motion.div>
                              Inbound
                            </NavLink>
                          </motion.li>
                          <motion.li variants={itemVariants}>
                            <NavLink
                              to="/admin/settings/connectors/outbound"
                              className={({ isActive }) =>
                                `${nestedLinkStyle} ${
                                  isActive ? activeLinkStyle : ""
                                }`
                              }
                              onClick={handleLinkClick}
                            >
                              <motion.div
                                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <ExternalLink className="w-5 h-5 mr-2" />
                              </motion.div>
                              Outbound
                            </NavLink>
                          </motion.li>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                  {[
                    { name: "api-configurations", icon: <Database className="w-5 h-5 mr-2" /> },
                    { name: "email-configurations", icon: <Mail className="w-5 h-5 mr-2" /> },
                    { name: "users-maintenance", icon: <Users className="w-5 h-5 mr-2" /> },
                  ].map((item) => (
                    <motion.li key={item.name} variants={itemVariants}>
                      <NavLink
                        to={`/admin/settings/${item.name}`}
                        className={({ isActive }) =>
                          `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                        }
                        onClick={handleLinkClick}
                      >
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                        {item.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Reports Dropdown */}
          <motion.li variants={itemVariants}>
            <motion.button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`${baseLinkStyle} w-full group`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="w-6 h-6 mr-3" />
              </motion.div>
              <span className="flex-1 text-left">Reports</span>
              <motion.div
                animate={{ rotate: reportsOpen ? 90 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {reportsOpen && (
                <motion.ul
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  <motion.li variants={itemVariants}>
                    <NavLink
                      to="/admin/reports/items"
                      className={({ isActive }) =>
                        `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                      }
                      onClick={handleLinkClick}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <BoxesIcon className="w-5 h-5 mr-2" />
                      </motion.div>
                      Items
                    </NavLink>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <NavLink
                      to="/admin/reports/customer-serials"
                      className={({ isActive }) =>
                        `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                      }
                      onClick={handleLinkClick}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <UserCircle className="w-5 h-5 mr-2" />
                      </motion.div>
                      Customer Serials
                    </NavLink>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <NavLink
                      to="/admin/reports/returns"
                      className={({ isActive }) =>
                        `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                      }
                      onClick={handleLinkClick}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                      </motion.div>
                      Returns
                    </NavLink>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <NavLink
                      to="/admin/reports/audity-inspections"
                      className={({ isActive }) =>
                        `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                      }
                      onClick={handleLinkClick}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="w-5 h-5 mr-2" />
                      </motion.div>
                      Auditly Inspections
                    </NavLink>
                  </motion.li>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Maintenance Dropdown */}
          <motion.li variants={itemVariants}>
            <motion.button
              onClick={() => setMaintenanceOpen(!maintenanceOpen)}
              className={`${baseLinkStyle} w-full group`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Construction className="w-6 h-6 mr-3" />
              </motion.div>
              <span className="flex-1 text-left">Maintenance</span>
              <motion.div
                animate={{ rotate: maintenanceOpen ? 90 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {maintenanceOpen && (
                <motion.ul
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  {[
                    { name: "item-master-upload", icon: <Asterisk className="w-5 h-5 mr-2" /> },
                    { name: "customer-serial-upload", icon: <Usb className="w-5 h-5 mr-2" /> },
                    { name: "item-image-upload", icon: <Image className="w-5 h-5 mr-2" /> },
                    { name: "return-upload", icon: <Undo2 className="w-5 h-5 mr-2" /> },
                  ].map((item) => (
                    <motion.li key={item.name} variants={itemVariants}>
                      <NavLink
                        to={`/admin/settings/${item.name}`}
                        className={({ isActive }) =>
                          `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                        }
                        onClick={handleLinkClick}
                      >
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                        {item.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Logout */}
          <motion.li 
            variants={itemVariants}
            className="mt-auto"
          >
            <motion.button
              className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-red-100 text-red-600 hover:text-red-700 w-full mt-8"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LogOut className="w-5 h-5 mr-2" />
              </motion.div>
              Logout
            </motion.button>
          </motion.li>
        </ul>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="flex-1 overflow-auto bg-white shadow-md rounded-lg p-4 md:p-6 m-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AdminLayout;
