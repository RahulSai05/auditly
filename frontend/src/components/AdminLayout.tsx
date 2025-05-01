// import { useState, useEffect } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import {
//   Image,
//   Cog as SettingsIcon,
//   FileText,
//   Mail,
//   Users,
//   Cable,
//   FileUp,
//   ChevronRight,
//   Database,
//   BoxesIcon,
//   UserCircle,
//   RefreshCw,
//   Menu,
//   UserCog,
//   X,
//   Construction,
//   Asterisk,
//   Usb,
//   Undo2,
//   Inbox,
//   ExternalLink,
//   LogOut,
//   Code,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const AdminLayout = () => {
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [connectorsOpen, setConnectorsOpen] = useState(false);
//   const [apiConfigOpen, setApiConfigOpen] = useState(false); // New state for API Config dropdown
//   const [maintenanceOpen, setMaintenanceOpen] = useState(false);
//   const [reportsOpen, setReportsOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
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

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsSidebarOpen(true);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const activeLinkStyle = "bg-blue-500 text-white";
//   const baseLinkStyle =
//     "flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white";
//   const nestedLinkStyle =
//     "flex items-center p-2 pl-12 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white";

//   const handleLinkClick = (e) => {
//     if (isMobile) {
//       setIsSidebarOpen(false);
//     }
//     e.stopPropagation();
//   };

//   const sidebarVariants = {
//     open: {
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//         staggerChildren: 0.05,
//         delayChildren: 0.1,
//       },
//     },
//     closed: {
//       x: "-100%",
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//         staggerChildren: 0.05,
//         staggerDirection: -1,
//       },
//     },
//   };

//   const itemVariants = {
//     open: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//     closed: {
//       opacity: 0,
//       x: -20,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//   };

//   const dropdownVariants = {
//     open: {
//       height: "auto",
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//         staggerChildren: 0.05,
//         delayChildren: 0.1,
//       },
//     },
//     closed: {
//       height: 0,
//       opacity: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//         staggerChildren: 0.05,
//         staggerDirection: -1,
//       },
//     },
//   };

//   const overlayVariants = {
//     open: {
//       opacity: 1,
//       transition: { duration: 0.3 },
//     },
//     closed: {
//       opacity: 0,
//       transition: { duration: 0.3 },
//     },
//   };

//   const handleConnectorToggle = (e) => {
//     e.stopPropagation();
//     setConnectorsOpen((prev) => !prev);
//   };

//   const handleApiConfigToggle = (e) => { // New handler for API Config toggle
//     e.stopPropagation();
//     setApiConfigOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <AnimatePresence>
//         {isMobile && isSidebarOpen && (
//           <motion.div
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={overlayVariants}
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       <motion.button
//         className="md:hidden fixed top-20 left-4 z-30 p-2 rounded-lg bg-white shadow-lg"
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <AnimatePresence mode="wait">
//           {isSidebarOpen ? (
//             <motion.div
//               key="close"
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: 90, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <X className="w-6 h-6 text-gray-600" />
//             </motion.div>
//           ) : (
//             <motion.div
//               key="menu"
//               initial={{ rotate: 90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: -90, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Menu className="w-6 h-6 text-gray-600" />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.button>

//       <motion.div
//         className="fixed md:static w-72 bg-white h-screen overflow-y-auto text-gray-800 shadow-md flex flex-col z-30"
//         initial={isMobile ? "closed" : "open"}
//         animate={isSidebarOpen ? "open" : isMobile ? "closed" : "open"}
//         variants={sidebarVariants}
//       >
//         <motion.div
//           className="p-5 font-bold text-xl text-gray-900 border-b border-gray-300 flex justify-between items-center"
//           variants={itemVariants}
//         >
//           <motion.span
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
//           >
//             User Panel
//           </motion.span>
//         </motion.div>

//         <ul className="space-y-2 p-5 flex-1">
//           {isAdmin ? (
//             <motion.li variants={itemVariants}>
//               <motion.button
//                 onClick={() => setSettingsOpen(!settingsOpen)}
//                 className={`${baseLinkStyle} w-full group`}
//                 whileHover={{ x: 5 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <motion.div
//                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <SettingsIcon className="w-6 h-6 mr-3" />
//                 </motion.div>
//                 <span className="flex-1 text-left">Admin</span>
//                 <motion.div
//                   animate={{ rotate: settingsOpen ? 90 : 0 }}
//                   transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </motion.div>
//               </motion.button>

//               <AnimatePresence>
//                 {settingsOpen && (
//                   <motion.ul
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     variants={dropdownVariants}
//                     className="mt-2 space-y-1 overflow-hidden"
//                   >
//                     <motion.li variants={itemVariants}>
//                       <motion.div
//                         className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12 cursor-pointer"
//                         onClick={handleConnectorToggle}
//                         whileHover={{ x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <Cable className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         <span>Connectors</span>
//                         <motion.div
//                           animate={{ rotate: connectorsOpen ? 90 : 0 }}
//                           transition={{
//                             duration: 0.3,
//                             type: "spring",
//                             stiffness: 300,
//                           }}
//                           className="ml-auto"
//                         >
//                           <ChevronRight className="w-4 h-4" />
//                         </motion.div>
//                       </motion.div>
//                       <AnimatePresence>
//                         {connectorsOpen && (
//                           <motion.div
//                             initial="closed"
//                             animate="open"
//                             exit="closed"
//                             variants={dropdownVariants}
//                             className="ml-5 overflow-hidden"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <motion.li variants={itemVariants}>
//                               <NavLink
//                                 to="/admin/settings/connectors/inbound"
//                                 className={({ isActive }) =>
//                                   `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                                 }
//                                 onClick={handleLinkClick}
//                               >
//                                 <motion.div
//                                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                                   transition={{ duration: 0.5 }}
//                                 >
//                                   <Inbox className="w-5 h-5 mr-2" />
//                                 </motion.div>
//                                 Inbound
//                               </NavLink>
//                             </motion.li>
//                             <motion.li variants={itemVariants}>
//                               <NavLink
//                                 to="/admin/settings/connectors/outbound"
//                                 className={({ isActive }) =>
//                                   `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                                 }
//                                 onClick={handleLinkClick}
//                               >
//                                 <motion.div
//                                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                                   transition={{ duration: 0.5 }}
//                                 >
//                                   <ExternalLink className="w-5 h-5 mr-2" />
//                                 </motion.div>
//                                 Outbound
//                               </NavLink>
//                             </motion.li>
//                             <motion.li variants={itemVariants}>
//                               <NavLink
//                                 to="/admin/settings/mapping-rules"
//                                 className={({ isActive }) =>
//                                   `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                                 }
//                                 onClick={handleLinkClick}
//                               >
//                                 <motion.div
//                                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                                   transition={{ duration: 0.5 }}
//                                 >
//                                   <FileText className="w-5 h-5 mr-2" />
//                                 </motion.div>
//                                 Data Mapping Rules
//                               </NavLink>
//                             </motion.li>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.li>

//                     {/* New API Configurations Dropdown */}
//                     <motion.li variants={itemVariants}>
//                       <motion.div
//                         className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12 cursor-pointer"
//                         onClick={handleApiConfigToggle}
//                         whileHover={{ x: 5 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <Database className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         <span>API Configurations</span>
//                         <motion.div
//                           animate={{ rotate: apiConfigOpen ? 90 : 0 }}
//                           transition={{
//                             duration: 0.3,
//                             type: "spring",
//                             stiffness: 300,
//                           }}
//                           className="ml-auto"
//                         >
//                           <ChevronRight className="w-4 h-4" />
//                         </motion.div>
//                       </motion.div>
//                       <AnimatePresence>
//                         {apiConfigOpen && (
//                           <motion.div
//                             initial="closed"
//                             animate="open"
//                             exit="closed"
//                             variants={dropdownVariants}
//                             className="ml-5 overflow-hidden"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <motion.li variants={itemVariants}>
//                               <NavLink
//                                 to="/admin/settings/api-configurations"
//                                 className={({ isActive }) =>
//                                   `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                                 }
//                                 onClick={handleLinkClick}
//                               >
//                                 <motion.div
//                                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                                   transition={{ duration: 0.5 }}
//                                 >
//                                   <Code className="w-5 h-5 mr-2" />
//                                 </motion.div>
//                                 API Token
//                               </NavLink>
//                             </motion.li>
//                             <motion.li variants={itemVariants}>
//                               <NavLink
//                                 to="/admin/settings/api-endpoint"
//                                 className={({ isActive }) =>
//                                   `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                                 }
//                                 onClick={handleLinkClick}
//                               >
//                                 <motion.div
//                                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                                   transition={{ duration: 0.5 }}
//                                 >
//                                   <ExternalLink className="w-5 h-5 mr-2" />
//                                 </motion.div>
//                                 API Endpoints
//                               </NavLink>
//                             </motion.li>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.li>

//                     {[
//                       {
//                         name: "email-configurations",
//                         icon: <Mail className="w-5 h-5 mr-2" />,
//                       },
//                       {
//                         name: "users-maintenance",
//                         icon: <Users className="w-5 h-5 mr-2" />,
//                       },
//                     ].map((item) => (
//                       <motion.li key={item.name} variants={itemVariants}>
//                         <NavLink
//                           to={`/admin/settings/${item.name}`}
//                           className={({ isActive }) =>
//                             `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                           }
//                           onClick={handleLinkClick}
//                         >
//                           <motion.div
//                             whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                             transition={{ duration: 0.5 }}
//                           >
//                             {item.icon}
//                           </motion.div>
//                           {item.name
//                             .split("-")
//                             .map(
//                               (word) =>
//                                 word.charAt(0).toUpperCase() + word.slice(1)
//                             )
//                             .join(" ")}
//                         </NavLink>
//                       </motion.li>
//                     ))}
//                   </motion.ul>
//                 )}
//               </AnimatePresence>
//             </motion.li>
//           ) : (
//             ""
//           )}

//           {isReportUser ? (
//             <motion.li variants={itemVariants}>
//               <motion.button
//                 onClick={() => setReportsOpen(!reportsOpen)}
//                 className={`${baseLinkStyle} w-full group`}
//                 whileHover={{ x: 5 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <motion.div
//                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FileText className="w-6 h-6 mr-3" />
//                 </motion.div>
//                 <span className="flex-1 text-left">Reports</span>
//                 <motion.div
//                   animate={{ rotate: reportsOpen ? 90 : 0 }}
//                   transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </motion.div>
//               </motion.button>

//               <AnimatePresence>
//                 {reportsOpen && (
//                   <motion.ul
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     variants={dropdownVariants}
//                     className="mt-2 space-y-1 overflow-hidden"
//                   >
//                     <motion.li variants={itemVariants}>
//                       <NavLink
//                         to="/admin/reports/items"
//                         className={({ isActive }) =>
//                           `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                         }
//                         onClick={handleLinkClick}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <BoxesIcon className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         Items
//                       </NavLink>
//                     </motion.li>
//                     <motion.li variants={itemVariants}>
//                       <NavLink
//                         to="/admin/reports/customer-serials"
//                         className={({ isActive }) =>
//                           `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                         }
//                         onClick={handleLinkClick}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <UserCircle className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         Customer Serials
//                       </NavLink>
//                     </motion.li>
//                     <motion.li variants={itemVariants}>
//                       <NavLink
//                         to="/admin/reports/returns"
//                         className={({ isActive }) =>
//                           `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                         }
//                         onClick={handleLinkClick}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <RefreshCw className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         Returns
//                       </NavLink>
//                     </motion.li>
//                     <motion.li variants={itemVariants}>
//                       <NavLink
//                         to="/admin/reports/audity-inspections"
//                         className={({ isActive }) =>
//                           `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                         }
//                         onClick={handleLinkClick}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <FileText className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         Auditly Inspections
//                       </NavLink>
//                     </motion.li>
//                     <motion.li variants={itemVariants}>
//                       <NavLink
//                         to="/admin/reports/item-images"
//                         className={({ isActive }) =>
//                           `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                         }
//                         onClick={handleLinkClick}
//                       >
//                         <motion.div
//                           whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           <Image className="w-5 h-5 mr-2" />
//                         </motion.div>
//                         Item Image Viewer
//                       </NavLink>
//                     </motion.li>
//                   </motion.ul>
//                 )}
//               </AnimatePresence>
//             </motion.li>
//           ) : (
//             ""
//           )}

//           {isInspectionUser ? (
//             <motion.li variants={itemVariants}>
//               <motion.button
//                 onClick={() => setMaintenanceOpen(!maintenanceOpen)}
//                 className={`${baseLinkStyle} w-full group`}
//                 whileHover={{ x: 5 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <motion.div
//                   whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <FileUp className="w-6 h-6 mr-3" />
//                 </motion.div>
//                 <span className="flex-1 text-left">Manual Data Ingestion</span>
//                 <motion.div
//                   animate={{ rotate: maintenanceOpen ? 90 : 0 }}
//                   transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </motion.div>
//               </motion.button>

//               <AnimatePresence>
//                 {maintenanceOpen && (
//                   <motion.ul
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     variants={dropdownVariants}
//                     className="mt-2 space-y-1 overflow-hidden"
//                   >
//                     {[
//                       {
//                         name: "item-master-upload",
//                         icon: <Asterisk className="w-5 h-5 mr-2" />,
//                       },
//                       {
//                         name: "customer-serial-upload",
//                         icon: <Usb className="w-5 h-5 mr-2" />,
//                       },
//                       {
//                         name: "item-image-upload",
//                         icon: <Image className="w-5 h-5 mr-2" />,
//                       },
//                       {
//                         name: "return-upload",
//                         icon: <Undo2 className="w-5 h-5 mr-2" />,
//                       },
//                     ].map((item) => (
//                       <motion.li key={item.name} variants={itemVariants}>
//                         <NavLink
//                           to={`/admin/settings/${item.name}`}
//                           className={({ isActive }) =>
//                             `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
//                           }
//                           onClick={handleLinkClick}
//                         >
//                           <motion.div
//                             whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                             transition={{ duration: 0.5 }}
//                           >
//                             {item.icon}
//                           </motion.div>
//                           {item.name
//                             .split("-")
//                             .map(
//                               (word) =>
//                                 word.charAt(0).toUpperCase() + word.slice(1)
//                             )
//                             .join(" ")}
//                         </NavLink>
//                       </motion.li>
//                     ))}
//                   </motion.ul>
//                 )}
//               </AnimatePresence>
//             </motion.li>
//           ) : (
//             ""
//           )}

// {/*           <motion.li variants={itemVariants} className="mt-auto">
//             <motion.button
//               className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-red-100 text-red-600 hover:text-red-700 w-full mt-8"
//               whileHover={{ x: 5 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <motion.div
//                 whileHover={{ rotate: [0, -10, 10, -5, 0] }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <LogOut className="w-5 h-5 mr-2" />
//               </motion.div>
//                   Logout 
//             </motion.button>
//           </motion.li> */}
//         </ul>
//       </motion.div>

//       <motion.div
//         className="flex-1 overflow-auto bg-white shadow-md rounded-lg p-4 md:p-6 m-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Outlet />
//       </motion.div>
//     </div>
//   );
// };

// export default AdminLayout;


import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Image,
  Cog as SettingsIcon,
  FileText,
  Mail,
  Users,
  Cable,
  FileUp,
  ChevronRight,
  Database,
  BoxesIcon,
  UserCircle,
  Clock,
  Truck,
  RefreshCw,
  Menu,
  UserCog,
  X,
  Construction,
  Asterisk,
  Usb,
  Undo2,
  Inbox,
  ExternalLink,
  LogOut,
  Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [apiConfigOpen, setApiConfigOpen] = useState(false); // New state for API Config dropdown
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isReportUser, setIsReportUser] = useState(false);
  const [isInspectionUser, setIsInspectionUser] = useState(false);

  useEffect(() => {
    if (userData && Array.isArray(userData["User Type"])) {
      setIsAdmin(userData["User Type"].includes("admin"));
      setIsReportUser(userData["User Type"].includes("reports_user"));
      setIsInspectionUser(userData["User Type"].includes("inpection_user"));
    }
  }, [userData]);

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

  const handleLinkClick = (e) => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    e.stopPropagation();
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
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
        delayChildren: 0.1,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleConnectorToggle = (e) => {
    e.stopPropagation();
    setConnectorsOpen((prev) => !prev);
  };

  const handleApiConfigToggle = (e) => { // New handler for API Config toggle
    e.stopPropagation();
    setApiConfigOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
            User Panel
          </motion.span>
        </motion.div>

        <ul className="space-y-2 p-5 flex-1">
          {isAdmin ? (
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
                <span className="flex-1 text-left">Admin</span>
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
                    <motion.li variants={itemVariants}>
                      <motion.div
                        className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12 cursor-pointer"
                        onClick={handleConnectorToggle}
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
                          transition={{
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                          }}
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            <motion.li variants={itemVariants}>
                              <NavLink
                                to="/admin/settings/connectors/inbound"
                                className={({ isActive }) =>
                                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
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
                                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
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
                            <motion.li variants={itemVariants}>
                              <NavLink
                                to="/admin/settings/mapping-rules"
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
                                Data Mapping Rules
                              </NavLink>
                            </motion.li>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>

                    {/* New API Configurations Dropdown */}
                    <motion.li variants={itemVariants}>
                      <motion.div
                        className="flex items-center p-3 rounded-lg transition duration-300 hover:bg-blue-400 hover:text-white pl-12 cursor-pointer"
                        onClick={handleApiConfigToggle}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Database className="w-5 h-5 mr-2" />
                        </motion.div>
                        <span>API Configurations</span>
                        <motion.div
                          animate={{ rotate: apiConfigOpen ? 90 : 0 }}
                          transition={{
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                          }}
                          className="ml-auto"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </motion.div>
                      <AnimatePresence>
                        {apiConfigOpen && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={dropdownVariants}
                            className="ml-5 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <motion.li variants={itemVariants}>
                              <NavLink
                                to="/admin/settings/api-configurations"
                                className={({ isActive }) =>
                                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                                }
                                onClick={handleLinkClick}
                              >
                                <motion.div
                                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Code className="w-5 h-5 mr-2" />
                                </motion.div>
                                API Token
                              </NavLink>
                            </motion.li>
                            <motion.li variants={itemVariants}>
                              <NavLink
                                to="/admin/settings/api-endpoint"
                                className={({ isActive }) =>
                                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                                }
                                onClick={handleLinkClick}
                              >
                                <motion.div
                                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <ExternalLink className="w-5 h-5 mr-2" />
                                </motion.div>
                                API Endpoints
                              </NavLink>
                            </motion.li>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>

                    {[
                      {
                        name: "email-configurations",
                        icon: <Mail className="w-5 h-5 mr-2" />,
                      },
                      {
                        name: "users-maintenance",
                        icon: <Users className="w-5 h-5 mr-2" />,
                      },
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
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </NavLink>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ) : (
            ""
          )}

          {isReportUser ? (
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
                    <motion.li variants={itemVariants}>
                      <NavLink
                        to="/admin/reports/item-images"
                        className={({ isActive }) =>
                          `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                        }
                        onClick={handleLinkClick}
                      >
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image className="w-5 h-5 mr-2" />
                        </motion.div>
                        Item Image Viewer
                      </NavLink>
                    </motion.li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ) : (
            ""
          )}

          {isInspectionUser ? (
  <>
    {/* Manual Data Ingestion Section */}
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
          <FileUp className="w-6 h-6 mr-3" />
        </motion.div>
        <span className="flex-1 text-left">Manual Data Ingestion</span>
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
            <motion.li variants={itemVariants}>
              <NavLink
                to="/admin/settings/item-master-upload"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Asterisk className="w-5 h-5 mr-2" />
                Item Master Upload
              </NavLink>
            </motion.li>
            <motion.li variants={itemVariants}>
              <NavLink
                to="/admin/settings/customer-serial-upload"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Usb className="w-5 h-5 mr-2" />
                Customer Serial Upload
              </NavLink>
            </motion.li>
            <motion.li variants={itemVariants}>
              <NavLink
                to="/admin/settings/item-image-upload"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Image className="w-5 h-5 mr-2" />
                Item Image Upload
              </NavLink>
            </motion.li>
            <motion.li variants={itemVariants}>
              <NavLink
                to="/admin/settings/return-upload"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Undo2 className="w-5 h-5 mr-2" />
                Return Upload
              </NavLink>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>

    {/* Agent Section */}
    <motion.li variants={itemVariants}>
      <motion.button
        onClick={() => setAgentOpen(!agentOpen)}
        className={`${baseLinkStyle} w-full group`}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <UserCog className="w-6 h-6 mr-3" />
        </motion.div>
        <span className="flex-1 text-left">Agent</span>
        <motion.div
          animate={{ rotate: agentOpen ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {agentOpen && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            className="mt-2 space-y-1 overflow-hidden"
          >
            <motion.li variants={itemVariants}>
              <NavLink
                to="/admin/agent/schedule"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Clock className="w-5 h-5 mr-2" />
                Schedule
              </NavLink>
            </motion.li>
            <motion.li variants={itemVariants}>
              <NavLink
                to="/agent/scheduled-pickups"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Inbox className="w-5 h-5 mr-2" />
                Scheduled Pickups
              </NavLink>
            </motion.li>
            <motion.li variants={itemVariants}>
              <NavLink
                to="/agent/schedule-delivery"
                className={({ isActive }) =>
                  `${nestedLinkStyle} ${isActive ? activeLinkStyle : ""}`
                }
                onClick={handleLinkClick}
              >
                <Truck className="w-5 h-5 mr-2" />
                Scheduled Deliveries
              </NavLink>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  </>
) : null}


{/*           <motion.li variants={itemVariants} className="mt-auto">
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
          </motion.li> */}
        </ul>
      </motion.div>

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
