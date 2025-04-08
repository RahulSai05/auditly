// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Profile } from "./Profile";
// import {
//   Lock,
//   MessageCircleQuestion,
//   Home,
//   Menu,
//   X,
//   FileText,
//   Construction,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useNavigate();
//   const [userData, setUserData] = useState(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isReportUser, setIsReportUser] = useState(false);
//   const [isInspectionUser, setIsInspectionUser] = useState(false);

//   useEffect(() => {
//     if (userData && Array.isArray(userData["User Type"])) {
//       setIsAdmin(userData["User Type"].includes("admin"));
//       setIsReportUser(userData["User Type"].includes("reports_user"));
//       setIsInspectionUser(userData["User Type"].includes("inpection_user"));
//     }
//   }, [userData]);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const menuVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//     exit: { opacity: 0, y: -20 },
//   };

//   return (
//     <header className="border-b py-4 px-6 shadow-md relative bg-white/90 backdrop-blur-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <motion.div
//           onClick={() => router("/")}
//           className="text-2xl cursor-pointer font-bold flex items-center"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div
//             className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
//             style={{
//               fontFamily: "Prompt, sans-serif",
//               fontWeight: 400,
//               opacity: 0.9,
//             }}
//           >
//             <span style={{ fontSize: "1.7em" }}>a</span>uditly
//           </div>
//           <span
//             className="text-black"
//             style={{
//               fontFamily: "Prompt, sans-serif",
//               fontSize: "1.1em",
//               opacity: 0.8,
//             }}
//           >
//             .
//           </span>
//           <div
//             className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
//             style={{
//               fontFamily: "Prompt, sans-serif",
//               fontWeight: 400,
//               opacity: 0.9,
//             }}
//           >
//             <span style={{ fontSize: "1.2em" }}>a</span>i
//           </div>
//         </motion.div>

//         {/* Hamburger Menu Button - Only visible on mobile/tablet */}
//         <motion.button
//           onClick={toggleMenu}
//           className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
//           aria-label="Toggle menu"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </motion.button>

//         {/* Navigation */}
//         <AnimatePresence>
//           {(isOpen || window.innerWidth >= 1024) && (
//             <motion.nav
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={menuVariants}
//               className={`
//                 lg:block
//                 ${isOpen ? "block" : "hidden"}
//                 lg:relative absolute top-full left-0 right-0
//                 lg:bg-transparent bg-white
//                 lg:shadow-none shadow-md
//                 lg:p-0 p-4
//                 lg:mt-0 mt-2
//                 z-50
//                 transition-all duration-300 ease-in-out
//               `}
//             >
//               <ul
//                 className="
//                   lg:flex lg:space-x-6
//                   lg:space-y-0 space-y-4
//                   lg:items-center
//                 "
//               >
//                 {
//                   isInspectionUser ? <motion.li
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link
//                       to="/"
//                       className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <Home className="w-5 h-5" />
//                       Home
//                     </Link>
//                   </motion.li> : ""
//                 }

//                 {isAdmin ? (
//                   <motion.li
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link
//                       to="/admin/settings/connectors/inbound"
//                       className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <Lock className="w-5 h-5" />
//                       Admin
//                     </Link>
//                   </motion.li>
//                 ) : (
//                   ""
//                 )}

//                 {isReportUser ? (
//                   <motion.li
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link
//                       to="/admin/reports/items"
//                       className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <FileText className="w-5 h-5" />
//                       Reports
//                     </Link>
//                   </motion.li>
//                 ) : (
//                   ""
//                 )}
//                 {isInspectionUser ? (
//                   <motion.li
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link
//                       to="/admin/settings/item-master-upload"
//                       className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <Construction className="w-5 h-5" />
//                       Maintenance
//                     </Link>
//                   </motion.li>
//                 ) : (
//                   ""
//                 )}

//                 <motion.li
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Link
//                     to="/help-center"
//                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <MessageCircleQuestion className="w-5 h-5" />
//                     Help Center
//                   </Link>
//                 </motion.li>
//                 <motion.li
//                   className="lg:ml-4"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Profile />
//                 </motion.li>
//               </ul>
//             </motion.nav>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Overlay for mobile menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }


import { useState, useEffect } from "react";
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
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();
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

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/get-notifications?user_id=${userData.id}`
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
        `http://localhost:8000/update-notification/${notificationId}`,
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
      
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const closeNotifications = (e) => {
    e.stopPropagation(); // Prevent event bubbling
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

  return (
    <header className="border-b py-4 px-6 shadow-md relative bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: "1.7em" }}>a</span>uditly
          </div>
          <span
            className="text-black"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontSize: "1.1em",
              opacity: 0.8,
            }}
          >
            .
          </span>
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: "1.2em" }}>a</span>i
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
                lg:block
                ${isOpen ? "block" : "hidden"}
                lg:relative absolute top-full left-0 right-0
                lg:bg-transparent bg-white
                lg:shadow-none shadow-md
                lg:p-0 p-4
                lg:mt-0 mt-2
                z-50
                transition-all duration-300 ease-in-out
              `}
            >
              <ul
                className="
                  lg:flex lg:space-x-6
                  lg:space-y-0 space-y-4
                  lg:items-center
                "
              >
                {isInspectionUser ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}

                {isAdmin ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/settings/connectors/inbound"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Lock className="w-5 h-5" />
                      Admin
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}

                {isReportUser ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/reports/items"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="w-5 h-5" />
                      Reports
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}
                {isInspectionUser ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/settings/item-master-upload"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Construction className="w-5 h-5" />
                      Maintenance
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}

                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/help-center"
                    className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircleQuestion className="w-5 h-5" />
                    Help Center
                  </Link>
                </motion.li>

                {/* Notification Bell */}
                {userData && (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <button
                      onClick={toggleNotifications}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative flex items-center gap-x-3 text-sm md:text-base"
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
                          className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200"
                        >
                          <div className="py-1 max-h-96 overflow-y-auto">
                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                            </div>
                            {notifications.length === 0 ? (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                No notifications
                              </div>
                            ) : (
                              notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read_at ? 'bg-blue-50' : ''}`}
                                  onClick={() => {
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-800">
                                      {notification.title || "Notification"}
                                    </p>
                                    {!notification.read_at && (
                                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.message || "No message"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleString()}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                            <button
                              onClick={closeNotifications}
                              className="text-xs text-blue-600 hover:text-blue-800"
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
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
