// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import {
//   ArrowLeft,
//   Database,
//   Globe,
//   Share2,
//   BarChart2,
//   Clock,
//   X,
//   Check,
//   Bell,
//   RefreshCw,
//   User,
//   Mail,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";

// const destinations = [
//   {
//     id: 1,
//     title: "Azure",
//     description: "Microsoft's scalable object storage solution for unstructured data.",
//     icon: Database,
//     color: "#43A047",
//     status: "Enterprise",
//   },
//   {
//     id: 2,
//     title: "Amazon S3",
//     description: "Secure cloud storage with unlimited scalability and high availability.",
//     icon: Globe,
//     color: "#00796B",
//     status: "Popular",
//   },
//   {
//     id: 3,
//     title: "Power BI",
//     description: "Push your customer item data directly to Power BI for advanced analytics and visualization.",
//     icon: BarChart2,
//     color: "#0078D4",
//     status: "Analytics",
//     authEndpoint: "/api/powerbi/auth_login",
//   },
//   {
//     id: 4,
//     title: "Outbound Automate",
//     description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
//     icon: Share2,
//     color: "#FF9900",
//     status: "Enterprise",
//   }
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.3,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 10,
//     },
//   },
// };

// const Outbound: React.FC = () => {
//   const [pushStatus, setPushStatus] = useState<{
//     loading: boolean;
//     success: boolean;
//     message: string;
//     destinationId?: number;
//   }>({ loading: false, success: false, message: "" });

//   const [showScheduleForm, setShowScheduleForm] = useState(false);
//   const [scheduleData, setScheduleData] = useState({
//     cron_to_mapping_name: "",
//     cron_expression: "",
//     destination_type: "s3",
//   });
//   const [isScheduling, setIsScheduling] = useState(false);
//   const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
//   const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);
//   const [powerBiUsers, setPowerBiUsers] = useState<any[]>([]);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [expandedSource, setExpandedSource] = useState<number | null>(3);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId));
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchPowerBiUsers();
//     }
//   }, [userId]);

//   const fetchPowerBiUsers = async () => {
//     setIsLoadingUsers(true);
//     try {
//       const response = await fetch("/api/power-bi-users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           auditly_user_id: userId,
//           connection_type: "outbound"
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch Power BI users");
//       }
//       const data = await response.json();
//       setPowerBiUsers(data);
//     } catch (error) {
//       console.error("Error fetching Power BI users:", error);
//       toast.error("Failed to load Power BI connections", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   const handleRefreshUsers = async () => {
//     setIsLoadingUsers(true);
//     try {
//       const response = await fetch("/api/power-bi-users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           auditly_user_id: userId,
//           connection_type: "outbound"
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to refresh Power BI users");
//       }
//       const data = await response.json();
//       setPowerBiUsers(data);
//       toast.success("Power BI connections refreshed", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error refreshing Power BI users:", error);
//       toast.error("Failed to refresh connections", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   const handleAuthClick = async (destination: typeof destinations[0]) => {
//     if (!destination.authEndpoint) return;
//     if (!userId) {
//       toast.error("User not authenticated. Please login again.", {
//         icon: "🔒",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     try {
//       setIsAuthWindowOpen(true);

//       const width = 600;
//       const height = 700;
//       const left = window.screen.width / 2 - width / 2;
//       const top = window.screen.height / 2 - height / 2;

//       const returnUrl = encodeURIComponent(window.location.origin);
//       const authUrl = `${destination.authEndpoint}?mapping_id=${userId}&returnUrl=${returnUrl}&connection_type=outbound`;

//       const authWindow = window.open(
//         authUrl,
//         "AuthPopup",
//         `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
//       );

//       if (authWindow) {
//         setActiveAuthWindow(authWindow);

//         const checkWindowClosed = setInterval(() => {
//           if (authWindow.closed) {
//             clearInterval(checkWindowClosed);
//             setIsAuthWindowOpen(false);
//             setActiveAuthWindow(null);
//             fetchPowerBiUsers();
//           }
//         }, 500);
//       } else {
//         throw new Error("Failed to open authentication window");
//       }
//     } catch (error) {
//       console.error("Authentication error:", error);
//       toast.error("Failed to initiate authentication. Please try again.", {
//         icon: "❌",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       setIsAuthWindowOpen(false);
//       setActiveAuthWindow(null);
//     }
//   };

//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       const trustedOrigins = ["https://auditlyai.com"];
//       if (!trustedOrigins.includes(event.origin)) return;

//       if (event.data.type === "AUTH_SUCCESS") {
//         if (activeAuthWindow && !activeAuthWindow.closed) {
//           activeAuthWindow.close();
//         }

//         setIsAuthWindowOpen(false);
//         setActiveAuthWindow(null);
//         fetchPowerBiUsers();

//         toast.success("Authentication successful!", {
//           icon: "🔐",
//           position: "top-right",
//           autoClose: 5000,
//         });
//       }

//       if (event.data.type === "AUTH_ERROR") {
//         if (activeAuthWindow && !activeAuthWindow.closed) {
//           activeAuthWindow.close();
//         }

//         setIsAuthWindowOpen(false);
//         setActiveAuthWindow(null);

//         toast.error(event.data.message || "Authentication failed", {
//           icon: "❌",
//           position: "top-right",
//           autoClose: 5000,
//         });
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [activeAuthWindow]);

//   useEffect(() => {
//     return () => {
//       if (activeAuthWindow && !activeAuthWindow.closed) {
//         activeAuthWindow.close();
//       }
//     };
//   }, [activeAuthWindow]);

//   const handleDeleteConnection = async (email: string) => {
//     try {
//       const response = await fetch(`/api/power-bi-users/${encodeURIComponent(email)}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           auditly_user_id: userId,
//           connection_type: "outbound"
//         }),
//       });

//       if (response.ok) {
//         toast.success("Connection removed successfully", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         fetchPowerBiUsers();
//       } else {
//         throw new Error("Failed to delete connection");
//       }
//     } catch (error) {
//       toast.error("Failed to remove connection", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     }
//   };

//   const handlePushToPowerBI = async (destinationId: number) => {
//     setPushStatus({ loading: true, success: false, message: "", destinationId });
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setPushStatus({ 
//         loading: false, 
//         success: true, 
//         message: "Data successfully pushed to Power BI", 
//         destinationId 
//       });
      
//       toast.success("Data pushed to Power BI successfully!", {
//         position: "top-right",
//         autoClose: 5000,
//       });

//       setTimeout(() => {
//         setPushStatus({ loading: false, success: false, message: "" });
//       }, 3000);
//     } catch (error) {
//       setPushStatus({ 
//         loading: false, 
//         success: false, 
//         message: "Failed to push data to Power BI",
//         destinationId
//       });
//       toast.error("Failed to push data to Power BI", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     }
//   };

//   const handleDestinationAction = (destination: typeof destinations[0]) => {
//     if (destination.id === 3 && destination.authEndpoint) {
//       handleAuthClick(destination);
//     } else if (destination.id === 4) {
//       setShowScheduleForm(true);
//     }
//   };

//   const handleScheduleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!scheduleData.cron_to_mapping_name || !scheduleData.cron_expression) {
//       toast.error("Please fill all required fields.", {
//         icon: "⚠️",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     setIsScheduling(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       toast.success(
//         <div>
//           <p className="font-medium">Outbound automation scheduled successfully! 🎉</p>
//           <p className="text-sm mt-1">Name: {scheduleData.cron_to_mapping_name}</p>
//           <p className="text-sm">Schedule: {scheduleData.cron_expression}</p>
//           <p className="text-sm">Destination: {scheduleData.destination_type.toUpperCase()}</p>
//         </div>,
//         {
//           position: "top-right",
//           autoClose: 5000,
//           icon: <Clock className="text-green-500" />,
//         }
//       );

//       setTimeout(() => {
//         toast.info(
//           <div className="flex items-start gap-3">
//             <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
//             <div>
//               <p className="font-medium">Outbound Automation Notifications</p>
//               <p className="text-sm mt-1">
//                 You'll receive notifications for:
//               </p>
//               <ul className="text-xs list-disc ml-4 mt-1 space-y-1">
//                 <li>Successful data exports</li>
//                 <li>Failed delivery attempts</li>
//                 <li>Schedule changes</li>
//                 <li>Destination connectivity issues</li>
//               </ul>
//             </div>
//           </div>,
//           {
//             autoClose: 8000,
//             position: "top-right",
//           }
//         );
//       }, 1000);

//       setShowScheduleForm(false);
//       setScheduleData({
//         cron_to_mapping_name: "",
//         cron_expression: "",
//         destination_type: "s3",
//       });
//     } catch (error: any) {
//       toast.error(error.message || "Failed to schedule outbound automation", {
//         icon: "❌",
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } finally {
//       setIsScheduling(false);
//     }
//   };

//   const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setScheduleData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const toggleExpandSource = (sourceId: number) => {
//     setExpandedSource(expandedSource === sourceId ? null : sourceId);
//   };

//   return (
//     <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative ${isAuthWindowOpen ? "pointer-events-none" : ""}`}>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <AnimatePresence>
//         {isAuthWindowOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showScheduleForm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowScheduleForm(false)}
//           >
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 20, opacity: 0 }}
//               transition={{ type: "spring", damping: 25 }}
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                     <Clock className="w-5 h-5 text-blue-600" />
//                     Schedule Outbound Automation
//                   </h3>
//                   <button
//                     onClick={() => setShowScheduleForm(false)}
//                     className="text-gray-400 hover:text-gray-500 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <form onSubmit={handleScheduleSubmit}>
//                   <div className="space-y-4">
//                     <div>
//                       <label
//                         htmlFor="cron_to_mapping_name"
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         Automation Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="cron_to_mapping_name"
//                         name="cron_to_mapping_name"
//                         value={scheduleData.cron_to_mapping_name}
//                         onChange={handleScheduleChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         placeholder="Enter automation name"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="destination_type"
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         Destination *
//                       </label>
//                       <select
//                         id="destination_type"
//                         name="destination_type"
//                         value={scheduleData.destination_type}
//                         onChange={handleScheduleChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         required
//                       >
//                         <option value="s3">Amazon S3</option>
//                         <option value="azure">Azure Blob Storage</option>
//                         <option value="powerbi">Power BI</option>
//                         <option value="api">API Endpoint</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="cron_expression"
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         Schedule Expression *
//                       </label>
//                       <input
//                         type="text"
//                         id="cron_expression"
//                         name="cron_expression"
//                         value={scheduleData.cron_expression}
//                         onChange={handleScheduleChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         placeholder="e.g., 0 9 * * * (9 AM daily)"
//                         required
//                       />
//                       <div className="mt-2">
//                         <p className="text-xs text-gray-500 font-medium mb-1">
//                           Common examples:
//                         </p>
//                         <ul className="text-xs text-gray-500 space-y-1">
//                           <li>
//                             <code className="bg-gray-100 px-1 py-0.5 rounded">
//                               0 9 * * *
//                             </code>{" "}
//                             - 9 AM daily
//                           </li>
//                           <li>
//                             <code className="bg-gray-100 px-1 py-0.5 rounded">
//                               0 9 * * 1-5
//                             </code>{" "}
//                             - 9 AM weekdays
//                           </li>
//                           <li>
//                             <code className="bg-gray-100 px-1 py-0.5 rounded">
//                               0 9 1 * *
//                             </code>{" "}
//                             - 9 AM on 1st of month
//                           </li>
//                           <li>
//                             <code className="bg-gray-100 px-1 py-0.5 rounded">
//                               */15 * * * *
//                             </code>{" "}
//                             - Every 15 minutes
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="pt-2">
//                       <button
//                         type="submit"
//                         disabled={isScheduling}
//                         className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all ${
//                           isScheduling ? "opacity-75 cursor-not-allowed" : ""
//                         }`}
//                       >
//                         {isScheduling ? (
//                           <>
//                             <svg
//                               className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Scheduling...
//                           </>
//                         ) : (
//                           <>
//                             <Check className="w-5 h-5 mr-2" />
//                             Schedule Outbound Automation
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-opacity duration-200 ${isAuthWindowOpen ? "opacity-50" : "opacity-100"}`}>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-16"
//         >
//           <motion.a
//             href="#"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
//             <span className="text-lg">Configure data destination</span>
//           </motion.a>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             Data Destinations
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-4 text-xl text-gray-600 max-w-3xl"
//           >
//             Choose where to send your data and configure automated exports
//           </motion.p>
//         </motion.div>

//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
//         >
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//               <BarChart2 className="w-5 h-5 text-blue-600" />
//               Your Power BI Connections
//             </h2>
//             <button
//               onClick={handleRefreshUsers}
//               disabled={isLoadingUsers}
//               className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
//             >
//               <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? "animate-spin" : ""}`} />
//               Refresh
//             </button>
//           </div>
          
//           {isLoadingUsers && powerBiUsers.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//               <p className="mt-2 text-gray-600">Loading connections...</p>
//             </div>
//           ) : powerBiUsers.length === 0 ? (
//             <div className="p-8 text-center">
//               <BarChart2 className="w-12 h-12 mx-auto text-gray-400" />
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No Power BI connections</h3>
//               <p className="mt-1 text-gray-500">Connect your Power BI account to push data</p>
//               <button
//                 onClick={() => handleAuthClick(destinations[2])}
//                 className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
//               >
//                 Connect Power BI
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {powerBiUsers.map((user, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1 * index }}
//                   className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                       <User className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-gray-900">{user.power_bi_username || 'Unknown User'}</h3>
//                       <div className="flex items-center gap-2">
//                         <span className={`text-xs px-1.5 py-0.5 rounded ${
//                           user.connection_status === 'Active' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {user.connection_status}
//                         </span>
//                         <p className="text-sm text-gray-500 flex items-center gap-1">
//                           <Mail className="w-3 h-3" />
//                           {user.power_bi_email || 'No email provided'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={() => handleDeleteConnection(user.power_bi_email)}
//                     className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
//                     title="Remove connection"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {destinations.map((destination) => (
//             <motion.div
//               key={destination.id}
//               variants={itemVariants}
//               whileHover={{
//                 y: -8,
//                 transition: { type: "spring", stiffness: 300 },
//               }}
//               className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 group"
//             >
//               <div
//                 className="h-2 bg-gradient-to-r"
//                 style={{
//                   background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)`,
//                 }}
//               />

//               <div className="p-6">
//                 <div className="flex items-center gap-4 mb-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 10 }}
//                     className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                   >
//                     <destination.icon className="w-6 h-6 text-blue-600" />
//                   </motion.div>

//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 text-lg">
//                       {destination.title}
//                     </h3>
//                     <motion.span
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r"
//                       style={{
//                         background: `linear-gradient(to right, ${destination.color}20, ${destination.color}40)`,
//                         color: destination.color,
//                       }}
//                     >
//                       {destination.status}
//                     </motion.span>
//                   </div>
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4">
//                   {destination.description}
//                 </p>

//                 {destination.id === 3 ? (
//                   <div className="flex justify-between items-center">
//                     <motion.div
//                       initial={{ x: -10, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                       className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
//                     >
//                       <span className="text-sm font-medium">Learn more</span>
//                       <motion.span
//                         animate={{ x: [0, 5, 0] }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 1.5,
//                           ease: "easeInOut",
//                         }}
//                       >
//                         →
//                       </motion.span>
//                     </motion.div>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleDestinationAction(destination)}
//                       disabled={isAuthWindowOpen}
//                       className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
//                         isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {powerBiUsers.length > 0 ? "Add Connection" : "Connect"}
//                     </motion.button>
//                   </div>
//                 ) : destination.id === 4 ? (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleDestinationAction(destination)}
//                     className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
//                   >
//                     <Clock className="w-4 h-4" />
//                     <span>Schedule Export</span>
//                   </motion.button>
//                 ) : (
//                   <motion.div
//                     initial={{ x: -10, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
//                   >
//                     <span className="text-sm font-medium">Configure</span>
//                     <motion.span
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{
//                         repeat: Infinity,
//                         duration: 1.5,
//                         ease: "easeInOut",
//                       }}
//                     >
//                       →
//                     </motion.span>
//                   </motion.div>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-16 text-center"
//         >
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Each destination offers unique features and capabilities. Configure automated
//             exports to keep your external systems in sync with your data.
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Outbound;



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  Database,
  Globe,
  Share2,
  BarChart2,
  Clock,
  X,
  Check,
  Bell,
  RefreshCw,
  User,
  Mail,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const destinations = [
  {
    id: 2,
    title: "Amazon S3",
    description: "Secure cloud storage with unlimited scalability and high availability.",
    icon: Globe,
    color: "#00796B",
    status: "Popular",
  },
  {
    id: 3,
    title: "Power BI",
    description: "Push your customer item data directly to Power BI for advanced analytics and visualization.",
    icon: BarChart2,
    color: "#0078D4",
    status: "Analytics",
    authEndpoint: "/api/powerbi/auth_login",
  },
  {
    id: 4,
    title: "Outbound Automate",
    description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
    icon: Share2,
    color: "#FF9900",
    status: "Enterprise",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center p-4">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const Outbound: React.FC = () => {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
  const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    cron_to_mapping_name: "",
    cron_expression: "",
    destination_type: "s3",
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [powerBiUsers, setPowerBiUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  useEffect(() => {
    console.log("Destinations:", destinations); // Debug: Confirm destinations is defined
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      console.warn("No userId found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPowerBiUsers();
    } else {
      console.warn("userId is null, skipping fetchPowerBiUsers");
    }
  }, [userId]);

  const fetchPowerBiUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch("/api/power-bi-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditly_user_id: userId,
          connection_type: "outbound",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Power BI users: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPowerBiUsers(data);
      console.log("Power BI users fetched:", data); // Debug: Confirm data
    } catch (error) {
      console.error("Error fetching Power BI users:", error);
      toast.error("Failed to load Power BI connections", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRefreshUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch("/api/power-bi-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditly_user_id: userId,
          connection_type: "outbound",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh Power BI users");
      }
      const data = await response.json();
      setPowerBiUsers(data);
      toast.success("Power BI connections refreshed", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error refreshing Power BI users:", error);
      toast.error("Failed to refresh connections", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const trustedOrigins = ["https://auditlyai.com"];
      if (!trustedOrigins.includes(event.origin)) return;

      if (event.data.type === "AUTH_SUCCESS") {
        if (activeAuthWindow && !activeAuthWindow.closed) {
          activeAuthWindow.close();
        }
        setIsAuthWindowOpen(false);
        setActiveAuthWindow(null);
        setLoading({});
        fetchPowerBiUsers();
        toast.success("Authentication successful!", {
          icon: "🔐",
          position: "top-right",
          autoClose: 5000,
        });
      }

      if (event.data.type === "AUTH_ERROR") {
        if (activeAuthWindow && !activeAuthWindow.closed) {
          activeAuthWindow.close();
        }
        setIsAuthWindowOpen(false);
        setActiveAuthWindow(null);
        setLoading({});
        toast.error(event.data.message || "Authentication failed", {
          icon: "❌",
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeAuthWindow]);

  useEffect(() => {
    return () => {
      if (activeAuthWindow && !activeAuthWindow.closed) {
        activeAuthWindow.close();
      }
    };
  }, [activeAuthWindow]);

  const handleAuthClick = async (destination: typeof destinations[0]) => {
    if (!destination.authEndpoint) return;
    if (!userId) {
      toast.error("User not authenticated. Please login again.", {
        icon: "🔒",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [destination.id]: true }));
      setIsAuthWindowOpen(true);

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const returnUrl = encodeURIComponent(window.location.origin);
      const authUrl = `${destination.authEndpoint}?mapping_id=${userId}&returnUrl=${returnUrl}&connection_type=outbound`;

      const authWindow = window.open(
        authUrl,
        "AuthPopup",
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );

      if (authWindow) {
        setActiveAuthWindow(authWindow);
        const checkWindowClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkWindowClosed);
            setIsAuthWindowOpen(false);
            setActiveAuthWindow(null);
            setLoading((prev) => ({ ...prev, [destination.id]: false }));
          }
        }, 500);
      } else {
        throw new Error("Failed to open authentication window");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to initiate authentication. Please try again.", {
        icon: "❌",
        position: "top-right",
        autoClose: 5000,
      });
      setIsAuthWindowOpen(false);
      setActiveAuthWindow(null);
      setLoading((prev) => ({ ...prev, [destination.id]: false }));
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not authenticated. Please login again.", {
        icon: "🔒",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    if (!scheduleData.cron_to_mapping_name || !scheduleData.cron_expression || !scheduleData.destination_type) {
      toast.error("Please fill all required fields.", {
        icon: "⚠️",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setIsScheduling(true);
    try {
      const response = await fetch("/api/add-cronjobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...scheduleData,
          auditly_user_id: userId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          <div>
            <p className="font-medium">Outbound automation scheduled successfully! 🎉</p>
            <p className="text-sm mt-1">Name: {scheduleData.cron_to_mapping_name}</p>
            <p className="text-sm">Schedule: {scheduleData.cron_expression}</p>
            <p className="text-sm">Destination: {scheduleData.destination_type.toUpperCase()}</p>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            icon: <Clock className="text-green-500" />,
          }
        );
        setTimeout(() => {
          toast.info(
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Outbound Automation Notifications</p>
                <p className="text-sm mt-1">You'll receive notifications for:</p>
                <ul className="text-xs list-disc ml-4 mt-1 space-y-1">
                  <li>Successful data exports</li>
                  <li>Failed delivery attempts</li>
                  <li>Schedule changes</li>
                  <li>Destination connectivity issues</li>
                </ul>
              </div>
            </div>,
            {
              autoClose: 8000,
              position: "top-right",
            }
          );
        }, 1000);
        setShowScheduleForm(false);
        setScheduleData({
          cron_to_mapping_name: "",
          cron_expression: "",
          destination_type: "s3",
        });
      } else {
        throw new Error(data.message || "Failed to create cron job");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule outbound automation", {
        icon: "❌",
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteConnection = async (email: string) => {
    try {
      const response = await fetch(`/api/power-bi-users/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditly_user_id: userId,
          connection_type: "outbound",
        }),
      });
      if (response.ok) {
        toast.success("Connection removed successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchPowerBiUsers();
      } else {
        throw new Error("Failed to delete connection");
      }
    } catch (error) {
      toast.error("Failed to remove connection", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const toggleExpandSource = (sourceId: number) => {
    console.log("Toggling source:", sourceId, "Current expandedSource:", expandedSource); // Debug: Track expansion
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative ${isAuthWindowOpen ? "pointer-events-none" : ""}`}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />

        <AnimatePresence>
          {isAuthWindowOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScheduleForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowScheduleForm(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Schedule Outbound Automation
                    </h3>
                    <button
                      onClick={() => setShowScheduleForm(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleScheduleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="cron_to_mapping_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Automation Name *
                        </label>
                        <input
                          type="text"
                          id="cron_to_mapping_name"
                          name="cron_to_mapping_name"
                          value={scheduleData.cron_to_mapping_name}
                          onChange={handleScheduleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter automation name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="destination_type"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Destination *
                        </label>
                        <select
                          id="destination_type"
                          name="destination_type"
                          value={scheduleData.destination_type}
                          onChange={handleScheduleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        >
                          <option value="s3">Amazon S3</option>
                          <option value="azure">Azure Blob Storage</option>
                          <option value="powerbi">Power BI</option>
                          <option value="api">API Endpoint</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="cron_expression"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Schedule Expression *
                        </label>
                        <input
                          type="text"
                          id="cron_expression"
                          name="cron_expression"
                          value={scheduleData.cron_expression}
                          onChange={handleScheduleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="e.g., 0 9 * * * (9 AM daily)"
                          required
                        />
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium mb-1">Common examples:</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            <li><code className="bg-gray-100 px-1 py-0.5 rounded">0 9 * * *</code> - 9 AM daily</li>
                            <li><code className="bg-gray-100 px-1 py-0.5 rounded">0 9 * * 1-5</code> - 9 AM weekdays</li>
                            <li><code className="bg-gray-100 px-1 py-0.5 rounded">0 9 1 * *</code> - 9 AM on 1st of month</li>
                            <li><code className="bg-gray-100 px-1 py-0.5 rounded">*/15 * * * *</code> - Every 15 minutes</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isScheduling}
                          className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all ${
                            isScheduling ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          {isScheduling ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Schedule Outbound Automation
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-opacity duration-200 ${isAuthWindowOpen ? "opacity-50" : "opacity-100"}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <motion.a
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg">Configure data destination</span>
            </motion.a>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Data Destinations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-xl text-gray-600 max-w-3xl"
            >
              Choose where to send your data and configure automated exports
            </motion.p>
          </motion.div>

          {destinations.length === 0 ? (
            <div className="text-center text-gray-500">No data destinations available.</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {destinations.map((destination) => (
                <motion.div
                  key={destination.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                  className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
                  style={{ minHeight: "250px" }}
                >
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)` }}
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                      >
                        <destination.icon className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{destination.title}</h3>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: `linear-gradient(to right, ${destination.color}20, ${destination.color}40)`,
                            color: destination.color,
                          }}
                        >
                          {destination.status}
                        </motion.span>
                      </div>
                      {destination.id === 3 && (
                        <button
                          onClick={() => toggleExpandSource(destination.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {expandedSource === destination.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                    <div className="relative">
                      {destination.id === 3 && expandedSource === destination.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 pt-4 mb-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Connections
                            </h4>
                            <button
                              onClick={handleRefreshUsers}
                              disabled={isLoadingUsers}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                            >
                              <RefreshCw className={`w-3 h-3 ${isLoadingUsers ? "animate-spin" : ""}`} />
                              Refresh
                            </button>
                          </div>
                          {isLoadingUsers ? (
                            <div className="py-4 text-center">
                              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                          ) : powerBiUsers.length === 0 ? (
                            <div className="py-4 text-center bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">No connections found. Add an account to get started.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                              {powerBiUsers.map((user, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                      <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{user.power_bi_username || 'Unknown User'}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            user.connection_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                          }`}
                                        >
                                          {user.connection_status}
                                        </span>
                                        <p className="text-xs text-gray-600 flex items-center gap-1">
                                          <Mail className="w-3 h-3" />
                                          <span className="truncate max-w-[150px]">{user.power_bi_email || 'No email'}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteConnection(user.power_bi_email)}
                                    className="p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Remove connection"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                      <div className="flex justify-between items-center">
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span className="text-sm font-medium">Learn more</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                        {destination.id === 4 ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowScheduleForm(true)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
                          >
                            <Clock className="w-4 h-4 inline mr-2" />
                            Schedule
                          </motion.button>
                        ) : destination.authEndpoint ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAuthClick(destination)}
                            disabled={loading[destination.id] || isAuthWindowOpen}
                            className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                              loading[destination.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                          >
                            {loading[destination.id] ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Connecting...
                              </span>
                            ) : powerBiUsers.length > 0 && destination.id === 3 ? (
                              "Add Account"
                            ) : (
                              "Connect"
                            )}
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span className="text-sm font-medium">Configure</span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                              →
                            </motion.span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each destination offers unique features and capabilities. Configure automated
              exports to keep your external systems in sync with your data.
            </p>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Outbound;
