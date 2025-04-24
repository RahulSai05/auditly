import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import {
  Lock,
  MessageCircleQuestion,
  Home,
  Menu,
  X,
  FileText,
  Construction,
  UserCog,
  Shield,
  ShieldUser,
  Cog,
  FileUp,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState(() => {
    const userDataString = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    return userDataString ? { ...JSON.parse(userDataString), id: userId } : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isReportUser, setIsReportUser] = useState(false);
  const [isInspectionUser, setIsInspectionUser] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userData && Array.isArray(userData["User Type"])) {
      setIsAdmin(userData["User Type"].includes("admin"));
      setIsReportUser(userData["User Type"].includes("reports_user"));
      setIsInspectionUser(userData["User Type"].includes("inpection_user"));
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.id) {
      fetchNotifications();
    }
  }, [userData]);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `https://auditlyai.com/api/get-notifications?user_id=${userData.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
      
      const unread = data.filter(notif => !notif.read_at).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `https://auditlyai.com/api/update-notification/${notificationId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Failed to mark as read");
      
      setNotifications(notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read_at: new Date().toISOString() } 
          : notif
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (isOpen) setIsOpen(false);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className="hover:text-blue-600 flex items-center gap-x-2 text-sm md:text-base transition px-3 py-2 rounded-lg hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-5 h-5" />
        {children}
      </Link>
    </motion.li>
  );

  return (
    <header className="sticky top-0 border-b py-4 px-6 shadow-sm relative bg-white/95 backdrop-blur-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-['Prompt']">
            <span className="text-[1.7em]">a</span>uditly
            <span className="text-black opacity-80">.</span>
            <span className="text-[1.2em]">a</span>i
          </div>
        </motion.div>

        {/* Hamburger Menu Button */}
        <motion.button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>

        {/* Navigation */}
        <AnimatePresence>
          {(isOpen || window.innerWidth >= 1024) && (
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className={`
                lg:block ${isOpen ? "block" : "hidden"}
                lg:relative absolute top-full left-0 right-0
                lg:bg-transparent bg-white
                lg:shadow-none shadow-md
                lg:p-0 p-4
                lg:mt-0 mt-2
                z-50
              `}
            >
              <ul className="lg:flex lg:space-x-2 lg:space-y-0 space-y-2 lg:items-center">
                {isInspectionUser && (
                  <NavLink to="/" icon={Home}>Home</NavLink>
                )}
                {isAdmin && (
                  <NavLink to="/admin/settings/connectors/inbound" icon={Cog}>Admin</NavLink>
                )}
                {isReportUser && (
                  <NavLink to="/admin/reports/items" icon={FileText}>Reports</NavLink>
                )}
                {isInspectionUser && (
                  <NavLink to="/admin/settings/item-master-upload" icon={FileUp}>Manual Data Ingestion</NavLink>
                )}
                <NavLink to="/help-center" icon={MessageCircleQuestion}>Help Center</NavLink>

                {/* Notification Bell */}
                {userData && (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                    ref={notificationRef}
                  >
                    <button
                      onClick={toggleNotifications}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative flex items-center gap-x-3"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={notificationVariants}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
                        >
                          <div className="py-1 max-h-96 overflow-y-auto">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                              <span className="text-xs text-gray-500">{unreadCount} unread</span>
                            </div>
                            {notifications.length === 0 ? (
                              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                No notifications
                              </div>
                            ) : (
                              notifications.map((notification) => (
                                <motion.div
                                  key={notification.id}
                                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                    !notification.read_at ? 'bg-blue-50' : ''
                                  }`}
                                  onClick={() => markAsRead(notification.id)}
                                  whileHover={{ backgroundColor: '#F3F4F6' }}
                                >
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-800">
                                      {"Notification"}
                                    </p>
                                    {!notification.read_at && (
                                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {notification.notification_message || "No message"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleString()}
                                  </p>
                                </motion.div>
                              ))
                            )}
                          </div>
                          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                            <button
                              onClick={closeNotifications}
                              className="w-full text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )}

                {/* Profile */}
                <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <div className="flex items-center gap-x-3 text-sm md:text-base">
                    <Profile />
                  </div>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
