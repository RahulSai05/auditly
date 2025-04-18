// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   Database,
//   Globe,
//   Share2,
//   BarChart2,
// } from "lucide-react";

// const destinations = [
//   {
//     id: 1,
//     title: "Azure",
//     description:
//       "Microsoft's scalable object storage solution for unstructured data.",
//     icon: Database,
//     color: "#43A047",
//     status: "Enterprise",
//   },
//   {
//     id: 2,
//     title: "Amazon S3",
//     description:
//       "Secure cloud storage with unlimited scalability and high availability.",
//     icon: Globe,
//     color: "#00796B",
//     status: "Popular",
//   },
//   {
//     id: 3,
//     title: "Power BI",
//     description:
//       "Push your customer item data directly to Power BI for advanced analytics and visualization.",
//     icon: BarChart2,
//     color: "#0078D4",
//     status: "Analytics",
//     action: "push-to-powerbi",
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

//   const handlePushToPowerBI = async (destinationId: number) => {
//     setPushStatus({ loading: true, success: false, message: "", destinationId });
//     try {
//       const response = await fetch("https://auditlyai.com/api/push-to-powerbi", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
      
//       const result = await response.json();
//       if (response.ok) {
//         setPushStatus({ 
//           loading: false, 
//           success: true, 
//           message: result.message, 
//           destinationId 
//         });
        
//         // Clear status after 3 seconds
//         setTimeout(() => {
//           setPushStatus({ loading: false, success: false, message: "" });
//         }, 3000);
//       } else {
//         setPushStatus({ 
//           loading: false, 
//           success: false, 
//           message: result.message, 
//           destinationId 
//         });
//       }
//     } catch (error) {
//       setPushStatus({ 
//         loading: false, 
//         success: false, 
//         message: "Failed to connect to the server",
//         destinationId
//       });
//     }
//   };

//   const handleDestinationAction = (destination: typeof destinations[0]) => {
//     if (destination.action === "push-to-powerbi") {
//       handlePushToPowerBI(destination.id);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header Section */}
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
//             Search Destinations
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-4 text-xl text-gray-600 max-w-3xl"
//           >
//             Choose where to index your data for powerful search capabilities
//           </motion.p>
//         </motion.div>

//         {/* Cards Grid */}
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

//                 {destination.action === "push-to-powerbi" ? (
//                   <div className="space-y-3">
//                     <button
//                       onClick={() => handleDestinationAction(destination)}
//                       disabled={pushStatus.loading && pushStatus.destinationId === destination.id}
//                       className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
//                         pushStatus.loading && pushStatus.destinationId === destination.id
//                           ? "bg-blue-100 text-blue-400 cursor-not-allowed"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                     >
//                       {pushStatus.loading && pushStatus.destinationId === destination.id ? (
//                         <>
//                           <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           <span>Pushing Data...</span>
//                         </>
//                       ) : (
//                         "Push Data to Power BI"
//                       )}
//                     </button>

//                     {pushStatus.message && pushStatus.destinationId === destination.id && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className={`p-3 rounded-lg text-sm ${
//                           pushStatus.success 
//                             ? "bg-green-100 text-green-800" 
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {pushStatus.message}
//                       </motion.div>
//                     )}
//                   </div>
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

//         {/* Footer Info Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-16 text-center"
//         >
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Each destination offers unique features and capabilities. Choose the
//             one that best fits your search requirements and performance needs.
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Outbound;


import React, { useState } from "react";
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
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const destinations = [
  {
    id: 1,
    title: "Azure",
    description:
      "Microsoft's scalable object storage solution for unstructured data.",
    icon: Database,
    color: "#43A047",
    status: "Enterprise",
  },
  {
    id: 2,
    title: "Amazon S3",
    description:
      "Secure cloud storage with unlimited scalability and high availability.",
    icon: Globe,
    color: "#00796B",
    status: "Popular",
  },
  {
    id: 3,
    title: "Power BI",
    description:
      "Push your customer item data directly to Power BI for advanced analytics and visualization.",
    icon: BarChart2,
    color: "#0078D4",
    status: "Analytics",
    action: "push-to-powerbi",
  },
  {
    id: 4,
    title: "Outbound Automate",
    description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
    icon: Share2,
    color: "#FF9900",
    status: "Enterprise",
  }
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

const Outbound: React.FC = () => {
  const [pushStatus, setPushStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string;
    destinationId?: number;
  }>({ loading: false, success: false, message: "" });

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    cron_to_mapping_name: "",
    cron_expression: "",
    destination_type: "s3", // Default destination type
  });
  const [isScheduling, setIsScheduling] = useState(false);

  const handlePushToPowerBI = async (destinationId: number) => {
    setPushStatus({ loading: true, success: false, message: "", destinationId });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPushStatus({ 
        loading: false, 
        success: true, 
        message: "Data successfully pushed to Power BI", 
        destinationId 
      });
      
      toast.success("Data pushed to Power BI successfully!", {
        position: "top-right",
        autoClose: 5000,
      });

      // Clear status after 3 seconds
      setTimeout(() => {
        setPushStatus({ loading: false, success: false, message: "" });
      }, 3000);
    } catch (error) {
      setPushStatus({ 
        loading: false, 
        success: false, 
        message: "Failed to push data to Power BI",
        destinationId
      });
      toast.error("Failed to push data to Power BI", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleDestinationAction = (destination: typeof destinations[0]) => {
    if (destination.action === "push-to-powerbi") {
      handlePushToPowerBI(destination.id);
    } else if (destination.id === 4) {
      setShowScheduleForm(true);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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
              <p className="text-sm mt-1">
                You'll receive notifications for:
              </p>
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
    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
      />

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
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Common examples:
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">
                              0 9 * * *
                            </code>{" "}
                            - 9 AM daily
                          </li>
                          <li>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">
                              0 9 * * 1-5
                            </code>{" "}
                            - 9 AM weekdays
                          </li>
                          <li>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">
                              0 9 1 * *
                            </code>{" "}
                            - 9 AM on 1st of month
                          </li>
                          <li>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">
                              */15 * * * *
                            </code>{" "}
                            - Every 15 minutes
                          </li>
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

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
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

        {/* Cards Grid */}
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
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 group"
            >
              <div
                className="h-2 bg-gradient-to-r"
                style={{
                  background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)`,
                }}
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <destination.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {destination.title}
                    </h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r"
                      style={{
                        background: `linear-gradient(to right, ${destination.color}20, ${destination.color}40)`,
                        color: destination.color,
                      }}
                    >
                      {destination.status}
                    </motion.span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {destination.description}
                </p>

                {destination.action === "push-to-powerbi" ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleDestinationAction(destination)}
                      disabled={pushStatus.loading && pushStatus.destinationId === destination.id}
                      className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        pushStatus.loading && pushStatus.destinationId === destination.id
                          ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {pushStatus.loading && pushStatus.destinationId === destination.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Pushing Data...</span>
                        </>
                      ) : (
                        "Push Data to Power BI"
                      )}
                    </button>

                    {pushStatus.message && pushStatus.destinationId === destination.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg text-sm ${
                          pushStatus.success 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pushStatus.message}
                      </motion.div>
                    )}
                  </div>
                ) : destination.id === 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDestinationAction(destination)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Schedule Export</span>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm font-medium">Configure</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info Section */}
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
  );
};

export default Outbound;
