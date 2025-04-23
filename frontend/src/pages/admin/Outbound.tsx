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
//   },
// ];

// const cronExamples = [
//   { value: "0 9 * * *", label: "9 AM daily" },
//   { value: "0 9 * * 1-5", label: "9 AM weekdays" },
//   { value: "0 9 1 * *", label: "9 AM on 1st of month" },
//   { value: "*/15 * * * *", label: "Every 15 minutes" },
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

// class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center p-4">Something went wrong. Please refresh the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Outbound: React.FC = () => {
//   const [loading, setLoading] = useState<Record<number, boolean>>({});
//   const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
//   const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);
//   const [showScheduleForm, setShowScheduleForm] = useState(false);
//   const [scheduleData, setScheduleData] = useState({
//     cron_to_mapping_name: "",
//     cron_expression: "",
//     destination_type: "s3",
//   });
//   const [isScheduling, setIsScheduling] = useState(false);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [powerBiUsers, setPowerBiUsers] = useState<any[]>([]);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [expandedSource, setExpandedSource] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

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
//           connection_type: "outbound",
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
//           connection_type: "outbound",
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
//         setLoading({});
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
//         setLoading({});
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
//       setLoading((prev) => ({ ...prev, [destination.id]: true }));
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
//             setLoading((prev) => ({ ...prev, [destination.id]: false }));
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
//       setLoading((prev) => ({ ...prev, [destination.id]: false }));
//     }
//   };

//   const handleScheduleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userId) {
//       toast.error("User not authenticated. Please login again.", {
//         icon: "🔒",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }
//     if (!scheduleData.cron_to_mapping_name || !scheduleData.cron_expression || !scheduleData.destination_type) {
//       toast.error("Please fill all required fields.", {
//         icon: "⚠️",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }
//     setIsScheduling(true);
//     try {
//       const response = await fetch("/api/add-cronjobs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...scheduleData,
//           auditly_user_id: userId,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success(
//           <div>
//             <p className="font-medium">Outbound automation scheduled successfully! 🎉</p>
//             <p className="text-sm mt-1">Name: {scheduleData.cron_to_mapping_name}</p>
//             <p className="text-sm">Schedule: {scheduleData.cron_expression}</p>
//             <p className="text-sm">Destination: {scheduleData.destination_type.toUpperCase()}</p>
//           </div>,
//           {
//             position: "top-right",
//             autoClose: 5000,
//             icon: <Clock className="text-green-500" />,
//           }
//         );
//         setTimeout(() => {
//           toast.info(
//             <div className="flex items-start gap-3">
//               <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
//               <div>
//                 <p className="font-medium">Outbound Automation Notifications</p>
//                 <p className="text-sm mt-1">You'll receive notifications for:</p>
//                 <ul className="text-xs list-disc ml-4 mt-1 space-y-1">
//                   <li>Successful data exports</li>
//                   <li>Failed delivery attempts</li>
//                   <li>Schedule changes</li>
//                   <li>Destination connectivity issues</li>
//                 </ul>
//               </div>
//             </div>,
//             {
//               autoClose: 8000,
//               position: "top-right",
//             }
//           );
//         }, 1000);
//         setShowScheduleForm(false);
//         setScheduleData({
//           cron_to_mapping_name: "",
//           cron_expression: "",
//           destination_type: "s3",
//         });
//       } else {
//         throw new Error(data.message || "Failed to create cron job");
//       }
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
//     setScheduleData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCronExampleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setScheduleData((prev) => ({ ...prev, cron_expression: value }));
//   };

//   const handleDeleteConnection = async (email: string) => {
//     if (!userId) {
//       toast.error("User not authenticated. Please login again.", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     try {
//       const response = await fetch("/api/power-bi-users/delete", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           power_bi_email: email,
//           power_bi_user_mapping_id: userId,
//           connection_type: "outbound",
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Connection removed successfully", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         fetchPowerBiUsers();
//       } else if (response.status === 404) {
//         toast.error("Connection not found", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//       } else {
//         throw new Error(data.detail || "Failed to delete connection");
//       }
//     } catch (error: any) {
//       console.error("Error deleting Power BI connection:", error);
//       toast.error(error.message || "Failed to remove connection", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     }
//   };

//   const toggleExpandSource = (sourceId: number) => {
//     setExpandedSource(expandedSource === sourceId ? null : sourceId);
//   };

//   const activeConnections = powerBiUsers.filter(user => user.connection_status === 'Active');
//   const inactiveConnections = powerBiUsers.filter(user => user.connection_status !== 'Active');

//   return (
//     <ErrorBoundary>
//       <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative ${isAuthWindowOpen ? "pointer-events-none" : ""}`}>
//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           style={{ zIndex: 9999 }}
//         />

//         <AnimatePresence>
//           {isAuthWindowOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
//             />
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showScheduleForm && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//               onClick={() => setShowScheduleForm(false)}
//             >
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: 20, opacity: 0 }}
//                 transition={{ type: "spring", damping: 25 }}
//                 className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                       <Clock className="w-5 h-5 text-blue-600" />
//                       Schedule Outbound Automation
//                     </h3>
//                     <button
//                       onClick={() => setShowScheduleForm(false)}
//                       className="text-gray-400 hover:text-gray-500 transition-colors"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <form onSubmit={handleScheduleSubmit}>
//                     <div className="space-y-4">
//                       <div>
//                         <label
//                           htmlFor="cron_to_mapping_name"
//                           className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                           Automation Name *
//                         </label>
//                         <input
//                           type="text"
//                           id="cron_to_mapping_name"
//                           name="cron_to_mapping_name"
//                           value={scheduleData.cron_to_mapping_name}
//                           onChange={handleScheduleChange}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                           placeholder="Enter automation name"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="destination_type"
//                           className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                           Destination *
//                         </label>
//                         <select
//                           id="destination_type"
//                           name="destination_type"
//                           value={scheduleData.destination_type}
//                           onChange={handleScheduleChange}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                           required
//                         >
//                           <option value="s3">Amazon S3</option>
//                           <option value="azure">Azure Blob Storage</option>
//                           <option value="powerbi">Power BI</option>
//                           <option value="api">API Endpoint</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="cron_expression"
//                           className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                           Schedule Expression *
//                         </label>
//                         <input
//                           type="text"
//                           id="cron_expression"
//                           name="cron_expression"
//                           value={scheduleData.cron_expression}
//                           onChange={handleScheduleChange}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                           placeholder="e.g., 0 9 * * * (9 AM daily)"
//                           required
//                         />
//                         <div className="mt-2">
//                           <label
//                             htmlFor="cron_example"
//                             className="block text-xs font-medium text-gray-500 mb-1"
//                           >
//                             Select a common schedule:
//                           </label>
//                           <select
//                             id="cron_example"
//                             onChange={handleCronExampleSelect}
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
//                           >
//                             <option value="">Select an example</option>
//                             {cronExamples.map((example) => (
//                               <option key={example.value} value={example.value}>
//                                 {example.label} ({example.value})
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>
//                       <div className="pt-2">
//                         <button
//                           type="submit"
//                           disabled={isScheduling}
//                           className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all ${
//                             isScheduling ? "opacity-75 cursor-not-allowed" : ""
//                           }`}
//                         >
//                           {isScheduling ? (
//                             <>
//                               <svg
//                                 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               Scheduling...
//                             </>
//                           ) : (
//                             <>
//                               <Check className="w-5 h-5 mr-2" />
//                               Schedule Outbound Automation
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-opacity duration-200 ${isAuthWindowOpen ? "opacity-50" : "opacity-100"}`}>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-12"
//           >
//             <motion.a
//               href="#"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
//               <span className="text-lg">Configure data destination</span>
//             </motion.a>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//             >
//               Data Destinations
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="mt-3 text-lg text-gray-600 max-w-3xl"
//             >
//               Choose where to send your data and configure automated exports
//             </motion.p>
//           </motion.div>

//           {destinations.length === 0 ? (
//             <div className="text-center text-gray-500">No data destinations available.</div>
//           ) : (
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {destinations.map((destination) => (
//                 <motion.div
//                   key={destination.id}
//                   variants={itemVariants}
//                   whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
//                   className="bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 flex flex-col"
//                   style={{ minHeight: "250px" }}
//                 >
//                   <div
//                     className="h-2"
//                     style={{ background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)` }}
//                   />
//                   <div className="p-5 flex flex-col flex-grow">
//                     <div className="flex items-start gap-4 mb-4">
//                       <motion.div
//                         whileHover={{ scale: 1.1, rotate: 10 }}
//                         className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0"
//                       >
//                         <destination.icon className="w-6 h-6 text-blue-600" />
//                       </motion.div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-semibold text-gray-900 text-lg truncate">{destination.title}</h3>
//                           {destination.id === 3 && (
//                             <button
//                               onClick={() => toggleExpandSource(destination.id)}
//                               className="text-gray-500 hover:text-gray-700 transition-colors ml-2 flex-shrink-0"
//                             >
//                               {expandedSource === destination.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                             </button>
//                           )}
//                         </div>
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
//                           style={{
//                             background: `linear-gradient(to right, ${destination.color}20, ${destination.color}40)`,
//                             color: destination.color,
//                           }}
//                         >
//                           {destination.status}
//                         </motion.span>
//                       </div>
//                     </div>
                    
//                     <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                    
//                     <div className="mt-auto">
//                       {destination.id === 3 && expandedSource === destination.id && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="border-t border-gray-200 pt-4 -mx-5 px-5"
//                         >
//                           <div className="flex items-center justify-between mb-3">
//                             <h4 className="font-medium text-gray-800 flex items-center gap-2">
//                               <User className="w-4 h-4" />
//                               Connections
//                             </h4>
//                             <button
//                               onClick={handleRefreshUsers}
//                               disabled={isLoadingUsers}
//                               className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
//                             >
//                               <RefreshCw className={`w-3 h-3 ${isLoadingUsers ? "animate-spin" : ""}`} />
//                               Refresh
//                             </button>
//                           </div>
//                           <div className="flex gap-2 mb-3">
//                             <button
//                               onClick={() => setActiveTab("active")}
//                               className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
//                                 activeTab === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                               }`}
//                             >
//                               Active ({activeConnections.length})
//                             </button>
//                             <button
//                               onClick={() => setActiveTab("inactive")}
//                               className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
//                                 activeTab === "inactive" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                               }`}
//                             >
//                               Inactive ({inactiveConnections.length})
//                             </button>
//                           </div>
//                           {isLoadingUsers ? (
//                             <div className="py-4 text-center">
//                               <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
//                             </div>
//                           ) : activeTab === "active" && activeConnections.length === 0 ? (
//                             <div className="py-4 text-center bg-gray-50 rounded-lg">
//                               <p className="text-sm text-gray-500">No active connections</p>
//                             </div>
//                           ) : activeTab === "inactive" && inactiveConnections.length === 0 ? (
//                             <div className="py-4 text-center bg-gray-50 rounded-lg">
//                               <p className="text-sm text-gray-500">No inactive connections</p>
//                             </div>
//                           ) : (
//                             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                               {(activeTab === "active" ? activeConnections : inactiveConnections).map((user, index) => (
//                                 <motion.div
//                                   key={index}
//                                   initial={{ opacity: 0, y: 10 }}
//                                   animate={{ opacity: 1, y: 0 }}
//                                   transition={{ delay: index * 0.05 }}
//                                   className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                                       <User className="w-4 h-4 text-blue-600" />
//                                     </div>
//                                     <div className="min-w-0">
//                                       <p className="text-xs font-semibold text-gray-900 truncate">{user.power_bi_username || 'Unknown User'}</p>
//                                       <div className="flex items-center gap-1 mt-0.5">
//                                         <span
//                                           className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${
//                                             user.connection_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                                           }`}
//                                         >
//                                           {user.connection_status}
//                                         </span>
//                                         <p className="text-2xs text-gray-600 flex items-center gap-1 truncate">
//                                           <Mail className="w-2.5 h-2.5" />
//                                           <span className="truncate max-w-[100px]">{user.power_bi_email || 'No email'}</span>
//                                         </p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <button
//                                     onClick={() => handleDeleteConnection(user.power_bi_email)}
//                                     className="p-1 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
//                                     title="Remove connection"
//                                   >
//                                     <Trash2 className="w-3.5 h-3.5" />
//                                   </button>
//                                 </motion.div>
//                               ))}
//                             </div>
//                           )}
//                         </motion.div>
//                       )}
                      
//                       <div className="flex justify-between items-center pt-4">
//                         <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
//                           <span className="text-sm font-medium">Learn more</span>
//                           <motion.span
//                             animate={{ x: [0, 5, 0] }}
//                             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//                           >
//                             →
//                           </motion.span>
//                         </div>
//                         {destination.id === 4 ? (
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setShowScheduleForm(true)}
//                             className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-lg shadow hover:shadow-md transition-all"
//                           >
//                             <Clock className="w-3.5 h-3.5 inline mr-1.5" />
//                             Schedule
//                           </motion.button>
//                         ) : destination.authEndpoint ? (
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleAuthClick(destination)}
//                             disabled={loading[destination.id] || isAuthWindowOpen}
//                             className={`px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-lg shadow hover:shadow-md transition-all ${
//                               loading[destination.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             {loading[destination.id] ? (
//                               <span className="flex items-center">
//                                 <svg
//                                   className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                   ></circle>
//                                   <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                   ></path>
//                                 </svg>
//                                 Connecting...
//                               </span>
//                             ) : powerBiUsers.length > 0 && destination.id === 3 ? (
//                               "Add Account"
//                             ) : (
//                               "Connect"
//                             )}
//                           </motion.button>
//                         ) : (
//                           <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
//                             <span className="text-sm font-medium">Configure</span>
//                             <motion.span
//                               animate={{ x: [0, 5, 0] }}
//                               transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//                             >
//                               →
//                             </motion.span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
          
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="mt-12 text-center"
//           >
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Each destination offers unique features and capabilities. Configure automated
//               exports to keep your external systems in sync with your data.
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </ErrorBoundary>
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
    id: 3,
    title: "Power BI",
    description: "Push your customer item data directly to Power BI for advanced analytics and visualization.",
    icon: BarChart2,
    color: "#0078D4",
    status: "Analytics",
    authEndpoint: "/api/powerbi/auth_login",
  },
    {
    id: 1,
    title: "Azure",
    description: "Microsoft's scalable object storage solution for unstructured data.",
    icon: Database,
    color: "#43A047",
    status: "Enterprise",
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

const cronExamples = [
  { value: "0 9 * * *", label: "9 AM daily" },
  { value: "0 9 * * 1-5", label: "9 AM weekdays" },
  { value: "0 9 1 * *", label: "9 AM on 1st of month" },
  { value: "*/15 * * * *", label: "Every 15 minutes" },
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
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPowerBiUsers();
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
        throw new Error("Failed to fetch Power BI users");
      }
      const data = await response.json();
      setPowerBiUsers(data);
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

  const handleCronExampleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setScheduleData((prev) => ({ ...prev, cron_expression: value }));
  };

  const handleDeleteConnection = async (email: string) => {
    if (!userId) {
      toast.error("User not authenticated. Please login again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      const response = await fetch("/api/power-bi-users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          power_bi_email: email,
          power_bi_user_mapping_id: userId,
          connection_type: "outbound",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Connection removed successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchPowerBiUsers();
      } else if (response.status === 404) {
        toast.error("Connection not found", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error(data.detail || "Failed to delete connection");
      }
    } catch (error: any) {
      console.error("Error deleting Power BI connection:", error);
      toast.error(error.message || "Failed to remove connection", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const toggleExpandSource = (sourceId: number) => {
    setExpandedSource(prev => prev === sourceId ? null : sourceId);
  };

  const activeConnections = powerBiUsers.filter(user => user.connection_status === 'Active');
  const inactiveConnections = powerBiUsers.filter(user => user.connection_status !== 'Active');

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
                          <label
                            htmlFor="cron_example"
                            className="block text-xs font-medium text-gray-500 mb-1"
                          >
                            Select a common schedule:
                          </label>
                          <select
                            id="cron_example"
                            onChange={handleCronExampleSelect}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          >
                            <option value="">Select an example</option>
                            {cronExamples.map((example) => (
                              <option key={example.value} value={example.value}>
                                {example.label} ({example.value})
                              </option>
                            ))}
                          </select>
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
                >
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)` }}
                  />
                  <div className="p-4">
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
                    
                    {destination.id === 3 && (
                      <div className="relative">
                        {expandedSource === destination.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 pt-4 overflow-hidden"
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
                            <div className="flex gap-4 mb-4">
                              <button
                                onClick={() => setActiveTab("active")}
                                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                  activeTab === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                Active ({activeConnections.length})
                              </button>
                              <button
                                onClick={() => setActiveTab("inactive")}
                                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                  activeTab === "inactive" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                Inactive ({inactiveConnections.length})
                              </button>
                            </div>
                            {isLoadingUsers ? (
                              <div className="py-4 text-center">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                              </div>
                            ) : activeTab === "active" && activeConnections.length === 0 ? (
                              <div className="py-4 text-center bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">No active connections</p>
                              </div>
                            ) : activeTab === "inactive" && inactiveConnections.length === 0 ? (
                              <div className="py-4 text-center bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">No inactive connections</p>
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {(activeTab === "active" ? activeConnections : inactiveConnections).map((user, index) => (
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
                        <div className="flex justify-between items-center mt-4 pt-2">
                          <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                            <span className="text-sm font-medium">Learn more</span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                              →
                            </motion.span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAuthClick(destination)}
                            disabled={loading[destination.id] || isAuthWindowOpen}
                            className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                              loading[destination.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                          >
                            {powerBiUsers.length > 0 ? "Add Account" : "Add Account"}
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {destination.id !== 3 && (
                      <div className="flex justify-between items-center mt-4 pt-2">
                        <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                          <span className="text-sm font-medium">Learn more</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
                        </div>
                        {destination.id === 4 ? (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowScheduleForm(true)}
                              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
                            >
                              <Clock className="w-4 h-4 inline mr-2" />
                              Schedule
                            </motion.button>
                            {destination.authEndpoint && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAuthClick(destination)}
                                disabled={loading[destination.id] || isAuthWindowOpen}
                                className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                                  loading[destination.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                              >
                                Connect
                              </motion.button>
                            )}
                          </div>
                        ) : (
                          destination.authEndpoint && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAuthClick(destination)}
                              disabled={loading[destination.id] || isAuthWindowOpen}
                              className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                                loading[destination.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                            >
                              Connect
                            </motion.button>
                          )
                        )}
                      </div>
                    )}
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
