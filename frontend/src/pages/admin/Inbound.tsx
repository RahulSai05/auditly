// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import {
//   ArrowLeft,
//   Database,
//   Cloud,
//   Server,
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
// import { fetchPowerBiUsers, deletePowerBiUser, selectPowerBiUsers, selectPowerBiUsersLoading, selectPowerBiUsersError } from "../../store/slices/itemSlice";
// import "react-toastify/dist/ReactToastify.css";

// interface DataSource {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ComponentType<{ className?: string }>;
//   color: string;
//   status: string;
//   authEndpoint?: string;
// }

// interface ScheduleData {
//   cron_to_mapping_name: string;
//   cron_expression: string;
// }

// const dataSources: DataSource[] = [
//   {
//     id: 1,
//     title: "Power BI",
//     description: "Business analytics tool for visualizing data and sharing insights across your organization.",
//     icon: Cloud,
//     color: "#00796B",
//     status: "Enterprise",
//     authEndpoint: "/api/powerbi/auth_login",
//   },
//   {
//     id: 2,
//     title: "D365",
//     description: "Microsoft's enterprise resource planning & customer relationship management applications.",
//     icon: Database,
//     color: "#43A047",
//     status: "Enterprise",
//   },
//   {
//     id: 3,
//     title: "Inbound Automate",
//     description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
//     icon: Server,
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

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("ErrorBoundary caught:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center p-4">Something went wrong. Please refresh the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Inbound: React.FC = () => {
//   const [loading, setLoading] = useState<Record<number, boolean>>({});
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
//   const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);
//   const [showScheduleForm, setShowScheduleForm] = useState(false);
//   const [scheduleData, setScheduleData] = useState<ScheduleData>({
//     cron_to_mapping_name: "",
//     cron_expression: "",
//   });
//   const [userId, setUserId] = useState<number | null>(null);
//   const [isScheduling, setIsScheduling] = useState(false);
//   const [expandedPowerBi, setExpandedPowerBi] = useState(false);
//   const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

//   const dispatch = useAppDispatch();
//   const powerBiUsers = useAppSelector(selectPowerBiUsers);
//   const isLoadingUsers = useAppSelector(selectPowerBiUsersLoading);
//   const powerBiUsersError = useAppSelector(selectPowerBiUsersError);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId));
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchPowerBiUsers({ userId, connectionType: "inbound" }));
//     }
//   }, [userId, dispatch]);

//   const handleRefreshUsers = async () => {
//     if (!userId) return;
    
//     try {
//       const result = await dispatch(
//         fetchPowerBiUsers({ userId, connectionType: "inbound" })
//       ).unwrap();
      
//       toast.success("Power BI connections refreshed", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       toast.error(
//         error instanceof Error 
//           ? error.message 
//           : "Failed to refresh connections",
//         {
//           position: "top-right",
//           autoClose: 5000,
//         }
//       );
//     }
//   };

//   useEffect(() => {
//     const message = searchParams.get("message");
//     const error = searchParams.get("error");

//     if (message) {
//       const decodedMessage = decodeURIComponent(message.replace(/\+/g, " "));
//       toast.success(decodedMessage, {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       searchParams.delete("message");
//       setSearchParams(searchParams, { replace: true });
//     }

//     if (error) {
//       const decodedError = decodeURIComponent(error.replace(/\+/g, " "));
//       toast.error(decodedError, {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       searchParams.delete("error");
//       setSearchParams(searchParams, { replace: true });
//     }
//   }, [searchParams, setSearchParams]);

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
//         dispatch(fetchPowerBiUsers({ userId: userId!, connectionType: "inbound" }));
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
//   }, [activeAuthWindow, dispatch, userId]);

//   useEffect(() => {
//     return () => {
//       if (activeAuthWindow && !activeAuthWindow.closed) {
//         activeAuthWindow.close();
//       }
//     };
//   }, [activeAuthWindow]);

//   const handleAuthClick = async (source: DataSource) => {
//     if (!source.authEndpoint) return;
//     if (!userId) {
//       toast.error("User not authenticated. Please login again.", {
//         icon: "🔒",
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     try {
//       setLoading((prev) => ({ ...prev, [source.id]: true }));
//       setIsAuthWindowOpen(true);

//       const width = 600;
//       const height = 700;
//       const left = window.screen.width / 2 - width / 2;
//       const top = window.screen.height / 2 - height / 2;

//       const returnUrl = encodeURIComponent(window.location.origin);
//       const authUrl = `${source.authEndpoint}?mapping_id=${userId}&returnUrl=${returnUrl}&connection_type=inbound`;

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
//             setLoading((prev) => ({ ...prev, [source.id]: false }));
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
//       setLoading((prev) => ({ ...prev, [source.id]: false }));
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
//             <p className="font-medium">Automation scheduled successfully! 🎉</p>
//             <p className="text-sm mt-1">Name: {scheduleData.cron_to_mapping_name}</p>
//             <p className="text-sm">Schedule: {scheduleData.cron_expression}</p>
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
//                 <p className="font-medium">Automation Notifications</p>
//                 <p className="text-sm mt-1">You'll receive notifications for:</p>
//                 <ul className="text-xs list-disc ml-4 mt-1 space-y-1">
//                   <li>Successful runs</li>
//                   <li>Failed executions</li>
//                   <li>Schedule changes</li>
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
//         setScheduleData({ cron_to_mapping_name: "", cron_expression: "" });
//       } else {
//         throw new Error(data.message || "Failed to create cron job");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to create cron job", {
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
//       await dispatch(deletePowerBiUser({ email, userId })).unwrap();
//       toast.success("Connection removed successfully", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error: any) {
//       console.error("Error deleting Power BI connection:", error);
//       toast.error(error.message || "Failed to remove connection", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     }
//   };

//   const togglePowerBiExpand = () => {
//     setExpandedPowerBi(!expandedPowerBi);
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
//                       Schedule Automation
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
//                         <label htmlFor="cron_to_mapping_name" className="block text-sm font-medium text-gray-700 mb-1">
//                           Mapping Name *
//                         </label>
//                         <input
//                           type="text"
//                           id="cron_to_mapping_name"
//                           name="cron_to_mapping_name"
//                           value={scheduleData.cron_to_mapping_name}
//                           onChange={handleScheduleChange}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                           placeholder="Enter mapping name"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="cron_expression" className="block text-sm font-medium text-gray-700 mb-1">
//                           Automation Expression *
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
//                               Schedule Automation
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
//             className="mb-16"
//           >
//             <motion.a
//               href="#"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
//               <span className="text-lg">Create a new data source</span>
//             </motion.a>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//             >
//               Data Sources
//             </motion.h1>
//           </motion.div>

//           {dataSources.length === 0 ? (
//             <div className="text-center text-gray-500">No data sources available.</div>
//           ) : (
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {dataSources.map((source) => (
//                 <motion.div
//                   key={source.id}
//                   variants={itemVariants}
//                   whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
//                   className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
//                 >
//                   <div
//                     className="h-2"
//                     style={{ background: `linear-gradient(to right, ${source.color}40, ${source.color}60)` }}
//                   />
//                   <div className="p-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <motion.div
//                         whileHover={{ scale: 1.1, rotate: 10 }}
//                         className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//                       >
//                         {React.createElement(source.icon, { className: "w-6 h-6 text-blue-600" })}
//                       </motion.div>
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 text-lg">{source.title}</h3>
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//                           style={{
//                             background: `linear-gradient(to right, ${source.color}20, ${source.color}40)`,
//                             color: source.color,
//                           }}
//                         >
//                           {source.status}
//                         </motion.span>
//                       </div>
//                       {source.id === 1 && (
//   <div className="flex items-center gap-2">
//     <button
//       onClick={togglePowerBiExpand}
//       className="text-gray-500 hover:text-gray-700 transition-colors"
//       aria-label={expandedPowerBi ? "Collapse Power BI connections" : "Expand Power BI connections"}
//     >
//       {expandedPowerBi ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//     </button>
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => handleAuthClick(source)}
//       disabled={loading[source.id] || isAuthWindowOpen}
//       className={`px-3 py-1.5 text-xs bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md shadow hover:shadow-md transition-all ${
//         loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//       }`}
//       aria-label="Add Power BI account"
//     >
//       Add Account
//     </motion.button>
//   </div>
// )}

//                     </div>

//                     <p className="text-gray-600 text-sm mb-4">{source.description}</p>
                    
//                     {source.id === 1 ? (
//                       <div className="relative">
//                         <div className="flex justify-between items-center mt-4 pt-2">
//                           <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
//                             <span className="text-sm font-medium">Learn more</span>
//                             <motion.span
//                               animate={{ x: [0, 5, 0] }}
//                               transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//                             >
//                               →
//                             </motion.span>
//                           </div>
//                         </div>

//                         {expandedPowerBi && (
//                           <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="border-t border-gray-200 pt-4 overflow-hidden"
//                           >
//                             <div className="flex items-center justify-between mb-3">
//                               <h4 className="font-medium text-gray-800 flex items-center gap-2">
//                                 <User className="w-4 h-4" />
//                                 Connections
//                               </h4>
//                               <button
//                                 onClick={handleRefreshUsers}
//                                 disabled={isLoadingUsers}
//                                 className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
//                                 aria-label="Refresh Power BI connections"
//                               >
//                                 <RefreshCw className={`w-3 h-3 ${isLoadingUsers ? "animate-spin" : ""}`} />
//                                 Refresh
//                               </button>
//                             </div>
//                             <div className="flex gap-4 mb-4">
//                               <button
//                                 onClick={() => setActiveTab("active")}
//                                 className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
//                                   activeTab === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                 }`}
//                                 aria-label="Show active connections"
//                               >
//                                 Active ({activeConnections.length})
//                               </button>
//                               <button
//                                 onClick={() => setActiveTab("inactive")}
//                                 className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
//                                   activeTab === "inactive" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                 }`}
//                                 aria-label="Show inactive connections"
//                               >
//                                 Inactive ({inactiveConnections.length})
//                               </button>
//                             </div>
//                             {isLoadingUsers ? (
//                               <div className="py-4 text-center">
//                                 <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
//                               </div>
//                             ) : activeTab === "active" && activeConnections.length === 0 ? (
//                               <div className="py-4 text-center bg-gray-50 rounded-lg">
//                                 <p className="text-sm text-gray-500">No active connections</p>
//                               </div>
//                             ) : activeTab === "inactive" && inactiveConnections.length === 0 ? (
//                               <div className="py-4 text-center bg-gray-50 rounded-lg">
//                                 <p className="text-sm text-gray-500">No inactive connections</p>
//                               </div>
//                             ) : (
//                               <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
//                                 {(activeTab === "active" ? activeConnections : inactiveConnections).map((user, index) => (
//                                   <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.05 }}
//                                     className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                                         <User className="w-5 h-5 text-blue-600" />
//                                       </div>
//                                       <div>
//                                         <p className="text-sm font-semibold text-gray-900">{user.power_bi_username || 'Unknown User'}</p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                           <span
//                                             className={`text-xs px-2 py-0.5 rounded-full font-medium ${
//                                               user.connection_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                                             }`}
//                                           >
//                                             {user.connection_status}
//                                           </span>
//                                           <p className="text-xs text-gray-600 flex items-center gap-1">
//                                             <Mail className="w-3 h-3" />
//                                             <span className="truncate max-w-[150px]">{user.power_bi_email || 'No email'}</span>
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                       {user.connection_status !== 'Active' && (
//                                         <button
//                                           onClick={() => handleAuthClick(source)}
//                                           disabled={loading[source.id] || isAuthWindowOpen}
//                                           className={`p-1.5 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
//                                             loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                                           }`}
//                                           title="Reactivate connection"
//                                           aria-label={`Reactivate connection for ${user.power_bi_email}`}
//                                         >
//                                           <RefreshCw className="w-4 h-4" />
//                                         </button>
//                                       )}
//                                       <button
//                                         onClick={() => handleDeleteConnection(user.power_bi_email)}
//                                         className="p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
//                                         title="Remove connection"
//                                         aria-label={`Remove connection for ${user.power_bi_email}`}
//                                       >
//                                         <Trash2 className="w-4 h-4" />
//                                       </button>
//                                     </div>
//                                   </motion.div>
//                                 ))}
//                               </div>
//                             )}
// {/*                             <div className="flex justify-end items-center mt-4">
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => handleAuthClick(source)}
//                                 disabled={loading[source.id] || isAuthWindowOpen}
//                                 className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
//                                   loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                                 }`}
//                                 aria-label={powerBiUsers.length > 0 ? "Add new Power BI account" : "Connect Power BI account"}
//                               >
//                                 {powerBiUsers.length > 0 ? "Add Account" : "Connect"}
//                               </motion.button>
//                             </div> */}
//                           </motion.div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-center mt-4 pt-2">
//                         <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
//                           <span className="text-sm font-medium">Learn more</span>
//                           <motion.span
//                             animate={{ x: [0, 5, 0] }}
//                             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//                           >
//                             →
//                           </motion.span>
//                         </div>
//                         {source.id === 3 ? (
//                           <div className="flex gap-2">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => setShowScheduleForm(true)}
//                               className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
//                               aria-label="Schedule automation"
//                             >
//                               <Clock className="w-4 h-4 inline mr-2" />
//                               Schedule
//                             </motion.button>
//                             {source.authEndpoint && (
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => handleAuthClick(source)}
//                                 disabled={loading[source.id] || isAuthWindowOpen}
//                                 className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
//                                   loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                                 }`}
//                                 aria-label="Connect data source"
//                               >
//                                 Connect
//                               </motion.button>
//                             )}
//                           </div>
//                         ) : (
//                           source.authEndpoint && (
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleAuthClick(source)}
//                               disabled={loading[source.id] || isAuthWindowOpen}
//                               className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
//                                 loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
//                               }`}
//                               aria-label="Connect data source"
//                             >
//                               Connect
//                             </motion.button>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default Inbound;


import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  ArrowLeft,
  Database,
  Cloud,
  Server,
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
import { fetchPowerBiUsers, deletePowerBiUser, selectPowerBiUsers, selectPowerBiUsersLoading, selectPowerBiUsersError } from "../../store/slices/itemSlice";
import "react-toastify/dist/ReactToastify.css";

interface DataSource {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: string;
  authEndpoint?: string;
}

interface ScheduleData {
  cron_to_mapping_name: string;
  cron_expression: string;
}

const dataSources: DataSource[] = [
  {
    id: 1,
    title: "Power BI",
    description: "Business analytics tool for visualizing data and sharing insights across your organization.",
    icon: Cloud,
    color: "#00796B",
    status: "Enterprise",
    authEndpoint: "/api/powerbi/auth_login",
  },
  {
    id: 2,
    title: "D365",
    description: "Microsoft's enterprise resource planning & customer relationship management applications.",
    icon: Database,
    color: "#43A047",
    status: "Enterprise",
  },
  {
    id: 3,
    title: "Inbound Automate",
    description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
    icon: Server,
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center p-4">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const Inbound: React.FC = () => {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
  const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    cron_to_mapping_name: "",
    cron_expression: "",
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [expandedPowerBi, setExpandedPowerBi] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  const dispatch = useAppDispatch();
  const powerBiUsers = useAppSelector(selectPowerBiUsers);
  const isLoadingUsers = useAppSelector(selectPowerBiUsersLoading);
  const powerBiUsersError = useAppSelector(selectPowerBiUsersError);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPowerBiUsers({ userId, connectionType: "inbound" }));
    }
  }, [userId, dispatch]);

  const handleRefreshUsers = async () => {
    if (!userId) return;
    
    try {
      const result = await dispatch(
        fetchPowerBiUsers({ userId, connectionType: "inbound" })
      ).unwrap();
      
      toast.success("Power BI connections refreshed", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to refresh connections",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");

    if (message) {
      const decodedMessage = decodeURIComponent(message.replace(/\+/g, " "));
      toast.success(decodedMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      searchParams.delete("message");
      setSearchParams(searchParams, { replace: true });
    }

    if (error) {
      const decodedError = decodeURIComponent(error.replace(/\+/g, " "));
      toast.error(decodedError, {
        position: "top-right",
        autoClose: 5000,
      });
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
        dispatch(fetchPowerBiUsers({ userId: userId!, connectionType: "inbound" }));
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
  }, [activeAuthWindow, dispatch, userId]);

  useEffect(() => {
    return () => {
      if (activeAuthWindow && !activeAuthWindow.closed) {
        activeAuthWindow.close();
      }
    };
  }, [activeAuthWindow]);

  const handleAuthClick = async (source: DataSource) => {
    if (!source.authEndpoint) return;
    if (!userId) {
      toast.error("User not authenticated. Please login again.", {
        icon: "🔒",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [source.id]: true }));
      setIsAuthWindowOpen(true);

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const returnUrl = encodeURIComponent(window.location.origin);
      const authUrl = `${source.authEndpoint}?mapping_id=${userId}&returnUrl=${returnUrl}&connection_type=inbound`;

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
            setLoading((prev) => ({ ...prev, [source.id]: false }));
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
      setLoading((prev) => ({ ...prev, [source.id]: false }));
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
    if (!scheduleData.cron_to_mapping_name || !scheduleData.cron_expression) {
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
            <p className="font-medium">Automation scheduled successfully! 🎉</p>
            <p className="text-sm mt-1">Name: {scheduleData.cron_to_mapping_name}</p>
            <p className="text-sm">Schedule: {scheduleData.cron_expression}</p>
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
                <p className="font-medium">Automation Notifications</p>
                <p className="text-sm mt-1">You'll receive notifications for:</p>
                <ul className="text-xs list-disc ml-4 mt-1 space-y-1">
                  <li>Successful runs</li>
                  <li>Failed executions</li>
                  <li>Schedule changes</li>
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
        setScheduleData({ cron_to_mapping_name: "", cron_expression: "" });
      } else {
        throw new Error(data.message || "Failed to create cron job");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create cron job", {
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
      await dispatch(deletePowerBiUser({ email, userId })).unwrap();
      toast.success("Connection removed successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting Power BI connection:", error);
      toast.error(error.message || "Failed to remove connection", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const togglePowerBiExpand = () => {
    setExpandedPowerBi(!expandedPowerBi);
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
                      Schedule Automation
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
                        <label htmlFor="cron_to_mapping_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Mapping Name *
                        </label>
                        <input
                          type="text"
                          id="cron_to_mapping_name"
                          name="cron_to_mapping_name"
                          value={scheduleData.cron_to_mapping_name}
                          onChange={handleScheduleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter mapping name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cron_expression" className="block text-sm font-medium text-gray-700 mb-1">
                          Automation Expression *
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
                              Schedule Automation
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
              <span className="text-lg">Create a new data source</span>
            </motion.a>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Data Sources
            </motion.h1>
          </motion.div>

          {dataSources.length === 0 ? (
            <div className="text-center text-gray-500">No data sources available.</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {dataSources.map((source) => (
                <motion.div
                  key={source.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                  className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
                >
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(to right, ${source.color}40, ${source.color}60)` }}
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                      >
                        {React.createElement(source.icon, { className: "w-6 h-6 text-blue-600" })}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{source.title}</h3>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: `linear-gradient(to right, ${source.color}20, ${source.color}40)`,
                            color: source.color,
                          }}
                        >
                          {source.status}
                        </motion.span>
                      </div>
                      {source.id === 1 && (
                        <button
                          onClick={togglePowerBiExpand}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label={expandedPowerBi ? "Collapse Power BI connections" : "Expand Power BI connections"}
                        >
                          {expandedPowerBi ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{source.description}</p>
                    
                    {source.id === 1 ? (
                      <div className="relative">
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
                            onClick={() => handleAuthClick(source)}
                            disabled={loading[source.id] || isAuthWindowOpen}
                            className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                              loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                            aria-label={powerBiUsers.length > 0 ? "Add new Power BI account" : "Connect Power BI account"}
                          >
                            {powerBiUsers.length > 0 ? "Add Account" : "Connect"}
                          </motion.button>
                        </div>

                        {expandedPowerBi && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 pt-6 mt-4 overflow-hidden"
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
                                aria-label="Refresh Power BI connections"
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
                                aria-label="Show active connections"
                              >
                                Active ({activeConnections.length})
                              </button>
                              <button
                                onClick={() => setActiveTab("inactive")}
                                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                  activeTab === "inactive" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                aria-label="Show inactive connections"
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
                                    <div className="flex items-center gap-2">
                                      {user.connection_status !== 'Active' && (
                                        <button
                                          onClick={() => handleAuthClick(source)}
                                          disabled={loading[source.id] || isAuthWindowOpen}
                                          className={`p-1.5 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                            loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                                          }`}
                                          title="Reactivate connection"
                                          aria-label={`Reactivate connection for ${user.power_bi_email}`}
                                        >
                                          <RefreshCw className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteConnection(user.power_bi_email)}
                                        className="p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Remove connection"
                                        aria-label={`Remove connection for ${user.power_bi_email}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ) : (
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
                        {source.id === 3 ? (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowScheduleForm(true)}
                              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
                              aria-label="Schedule automation"
                            >
                              <Clock className="w-4 h-4 inline mr-2" />
                              Schedule
                            </motion.button>
                            {source.authEndpoint && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAuthClick(source)}
                                disabled={loading[source.id] || isAuthWindowOpen}
                                className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                                  loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                                aria-label="Connect data source"
                              >
                                Connect
                              </motion.button>
                            )}
                          </div>
                        ) : (
                          source.authEndpoint && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAuthClick(source)}
                              disabled={loading[source.id] || isAuthWindowOpen}
                              className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                                loading[source.id] || isAuthWindowOpen ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                              aria-label="Connect data source"
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
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Inbound;
