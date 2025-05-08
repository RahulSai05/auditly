// // import React, { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useSelector } from "react-redux";
// // import { RootState } from "../../store/store";
// // import {
// //   Calendar,
// //   CheckCircle2,
// //   Loader2,
// //   AlertCircle,
// //   XCircle,
// //   ChevronDown,
// //   ChevronUp,
// // } from "lucide-react";

// // interface DayOption {
// //   id: number;
// //   name: string;
// //   selected: boolean;
// // }

// // const Schedule: React.FC = () => {
// //   const [days, setDays] = useState<DayOption[]>([
// //     { id: 1, name: "Monday", selected: false },
// //     { id: 2, name: "Tuesday", selected: false },
// //     { id: 3, name: "Wednesday", selected: false },
// //     { id: 4, name: "Thursday", selected: false },
// //     { id: 5, name: "Friday", selected: false },
// //     { id: 6, name: "Saturday", selected: false },
// //     { id: 7, name: "Sunday", selected: false },
// //   ]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// //   const [isLastWorkingDay, setIsLastWorkingDay] = useState(false);
// //   const [isExpanded, setIsExpanded] = useState(false);
// //   const [agentId, setAgentId] = useState<number | null>(null);

// //   useEffect(() => {
// //     // Simulate fetching agent ID - replace with your actual auth logic
// //     const storedAgentId = localStorage.getItem("userId");
// //     if (storedAgentId) {
// //       setAgentId(parseInt(storedAgentId));
// //       fetchSchedule(parseInt(storedAgentId));
// //       checkLastWorkingDay(parseInt(storedAgentId));
// //     } else {
// //       setError("Agent ID not found. Please log in.");
// //       setLoading(false);
// //     }
// //   }, []);

// //   const fetchSchedule = async (agentId: number) => {
// //     try {
// //       // In a real app, you would fetch the existing schedule here
// //       // This is just a placeholder to simulate loading
// //       setTimeout(() => {
// //         setLoading(false);
// //       }, 1000);
// //     } catch (err) {
// //       setError("Failed to fetch schedule");
// //       setLoading(false);
// //     }
// //   };

// //   const checkLastWorkingDay = async (agentId: number) => {
// //     try {
// //       const response = await fetch("/api/check-agent-last-working-day", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ agent_id: agentId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to check last working day");
// //       }

// //       const data = await response.json();
// //       setIsLastWorkingDay(data.is_last_working_day);
// //     } catch (err) {
// //       console.error("Error checking last working day:", err);
// //     }
// //   };

// //   const toggleDaySelection = (dayId: number) => {
// //     setDays(days.map(day => 
// //       day.id === dayId ? { ...day, selected: !day.selected } : day
// //     ));
// //   };

// //   const handleSubmit = async () => {
// //     if (!agentId) return;

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const selectedDays = days
// //         .filter(day => day.selected)
// //         .map(day => day.id)
// //         .sort((a, b) => a - b);

// //       if (selectedDays.length === 0) {
// //         throw new Error("Please select at least one working day");
// //       }

// //       const response = await fetch("/api/update-work-schedule", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           agent_id: agentId,
// //           work_schedule: {
// //             days: selectedDays.join(","),
// //           },
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.detail || "Failed to update schedule");
// //       }

// //       const successData = await response.json();
// //       setSuccessMessage(successData.message || "Schedule updated successfully!");
// //       setTimeout(() => setSuccessMessage(null), 3000);
      
// //       // Re-check if today is still the last working day
// //       await checkLastWorkingDay(agentId);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Update failed");
// //       setTimeout(() => setError(null), 3000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading && !agentId) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <motion.div
// //           animate={{ rotate: 360 }}
// //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //           className="text-blue-600"
// //         >
// //           <Loader2 className="w-8 h-8" />
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
// //       <div className="max-w-3xl mx-auto">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
// //         >
// //           <div className="p-6">
// //             <div className="flex justify-between items-center mb-8">
// //               <div className="flex items-center gap-3">
// //                 <motion.div
// //                   whileHover={{ scale: 1.1, rotate: 10 }}
// //                   className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
// //                 >
// //                   <Calendar className="w-6 h-6 text-blue-600" />
// //                 </motion.div>
// //                 <h1 className="text-2xl font-bold text-gray-800">
// //                   Work Schedule
// //                 </h1>
// //               </div>
// //             </div>

// //             <AnimatePresence>
// //               {error && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: -20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
// //                 >
// //                   <XCircle className="w-5 h-5" />
// //                   <span className="font-medium">{error}</span>
// //                 </motion.div>
// //               )}

// //               {successMessage && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: -20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
// //                 >
// //                   <CheckCircle2 className="w-5 h-5" />
// //                   <span className="font-medium">{successMessage}</span>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>

// //             <div className="mb-6">
// //               <motion.button
// //                 whileHover={{ scale: 1.02 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={() => setIsExpanded(!isExpanded)}
// //                 className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg"
// //               >
// //                 <span className="font-medium text-gray-800">
// //                   Select Working Days
// //                 </span>
// //                 {isExpanded ? (
// //                   <ChevronUp className="w-5 h-5 text-gray-600" />
// //                 ) : (
// //                   <ChevronDown className="w-5 h-5 text-gray-600" />
// //                 )}
// //               </motion.button>

// //               <AnimatePresence>
// //                 {isExpanded && (
// //                   <motion.div
// //                     initial={{ opacity: 0, height: 0 }}
// //                     animate={{ opacity: 1, height: "auto" }}
// //                     exit={{ opacity: 0, height: 0 }}
// //                     className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
// //                   >
// //                     {days.map((day) => (
// //                       <motion.div
// //                         key={day.id}
// //                         whileHover={{ scale: 1.02 }}
// //                         whileTap={{ scale: 0.98 }}
// //                         onClick={() => toggleDaySelection(day.id)}
// //                         className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
// //                           day.selected
// //                             ? "bg-blue-600 text-white"
// //                             : "bg-gray-100 hover:bg-gray-200"
// //                         }`}
// //                       >
// //                         {day.name}
// //                       </motion.div>
// //                     ))}
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //             </div>

// //             <div className="mb-6">
// //               <h3 className="font-medium text-gray-800 mb-2">
// //                 Selected Days:
// //               </h3>
// //               <div className="flex flex-wrap gap-2">
// //                 {days.filter(day => day.selected).length > 0 ? (
// //                   days
// //                     .filter(day => day.selected)
// //                     .map(day => (
// //                       <motion.span
// //                         key={day.id}
// //                         initial={{ opacity: 0, scale: 0.9 }}
// //                         animate={{ opacity: 1, scale: 1 }}
// //                         className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
// //                       >
// //                         {day.name}
// //                       </motion.span>
// //                     ))
// //                 ) : (
// //                   <span className="text-gray-500">No days selected</span>
// //                 )}
// //               </div>
// //             </div>

// //             <motion.button
// //               whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
// //               whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
// //               onClick={handleSubmit}
// //               disabled={loading || !isLastWorkingDay}
// //               className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
// //                 loading
// //                   ? "bg-blue-200 text-blue-700"
// //                   : isLastWorkingDay
// //                   ? "bg-blue-600 text-white hover:bg-blue-700"
// //                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
// //               }`}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="w-5 h-5 animate-spin" />
// //                   Updating...
// //                 </>
// //               ) : (
// //                 <>
// //                   <CheckCircle2 className="w-5 h-5" />
// //                   {isLastWorkingDay ? "Update Schedule" : "Updates allowed only on your last working day"}
// //                 </>
// //               )}
// //             </motion.button>

// //             {!isLastWorkingDay && (
// //               <div className="mt-4 text-center text-sm text-gray-500">
// //                 You can only update your schedule on your last working day of the week.
// //               </div>
// //             )}
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Schedule;


// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import {
//   Calendar,
//   CheckCircle2,
//   Loader2,
//   AlertCircle,
//   XCircle,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";

// interface DayOption {
//   id: number;
//   name: string;
//   selected: boolean;
// }

// const Schedule: React.FC = () => {
//   const [days, setDays] = useState<DayOption[]>([
//     { id: 1, name: "Monday", selected: false },
//     { id: 2, name: "Tuesday", selected: false },
//     { id: 3, name: "Wednesday", selected: false },
//     { id: 4, name: "Thursday", selected: false },
//     { id: 5, name: "Friday", selected: false },
//     { id: 6, name: "Saturday", selected: false },
//     { id: 7, name: "Sunday", selected: false },
//   ]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [isLastWorkingDay, setIsLastWorkingDay] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const agentId = useSelector((state: RootState) => state.ids.agentId);

//   useEffect(() => {
//     if (agentId) {
//       fetchSchedule(agentId);
//       checkLastWorkingDay(agentId);
//     } else {
//       setError("Agent ID not found. Please log in.");
//       setLoading(false);
//     }
//   }, [agentId]);


//   const fetchSchedule = async (agentId: number) => {
//     try {
//       // In a real app, you would fetch the existing schedule here
//       // This is just a placeholder to simulate loading
//       setTimeout(() => {
//         setLoading(false);
//       }, 1000);
//     } catch (err) {
//       setError("Failed to fetch schedule");
//       setLoading(false);
//     }
//   };

//   const checkLastWorkingDay = async (agentId: number) => {
//     try {
//       const response = await fetch("/api/check-agent-last-working-day", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ agent_id: agentId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to check last working day");
//       }

//       const data = await response.json();
//       setIsLastWorkingDay(data.is_last_working_day);
//     } catch (err) {
//       console.error("Error checking last working day:", err);
//     }
//   };

//   const toggleDaySelection = (dayId: number) => {
//     setDays(days.map(day => 
//       day.id === dayId ? { ...day, selected: !day.selected } : day
//     ));
//   };

//   const handleSubmit = async () => {
//     if (!agentId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const selectedDays = days
//         .filter(day => day.selected)
//         .map(day => day.id)
//         .sort((a, b) => a - b);

//       if (selectedDays.length === 0) {
//         throw new Error("Please select at least one working day");
//       }

//       const response = await fetch("/api/update-work-schedule", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           agent_id: agentId,
//           work_schedule: {
//             days: selectedDays.join(","),
//           },
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to update schedule");
//       }

//       const successData = await response.json();
//       setSuccessMessage(successData.message || "Schedule updated successfully!");
//       setTimeout(() => setSuccessMessage(null), 3000);
      
//       // Re-check if today is still the last working day
//       await checkLastWorkingDay(agentId);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Update failed");
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !agentId) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="text-blue-600"
//         >
//           <Loader2 className="w-8 h-8" />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="max-w-3xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-8">
//               <div className="flex items-center gap-3">
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 10 }}
//                   className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//                 >
//                   <Calendar className="w-6 h-6 text-blue-600" />
//                 </motion.div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   Work Schedule
//                 </h1>
//               </div>
//             </div>

//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
//                 >
//                   <XCircle className="w-5 h-5" />
//                   <span className="font-medium">{error}</span>
//                 </motion.div>
//               )}

//               {successMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
//                 >
//                   <CheckCircle2 className="w-5 h-5" />
//                   <span className="font-medium">{successMessage}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="mb-6">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg"
//               >
//                 <span className="font-medium text-gray-800">
//                   Select Working Days
//                 </span>
//                 {isExpanded ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </motion.button>

//               <AnimatePresence>
//                 {isExpanded && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
//                   >
//                     {days.map((day) => (
//                       <motion.div
//                         key={day.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => toggleDaySelection(day.id)}
//                         className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
//                           day.selected
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-100 hover:bg-gray-200"
//                         }`}
//                       >
//                         {day.name}
//                       </motion.div>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div className="mb-6">
//               <h3 className="font-medium text-gray-800 mb-2">
//                 Selected Days:
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {days.filter(day => day.selected).length > 0 ? (
//                   days
//                     .filter(day => day.selected)
//                     .map(day => (
//                       <motion.span
//                         key={day.id}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                       >
//                         {day.name}
//                       </motion.span>
//                     ))
//                 ) : (
//                   <span className="text-gray-500">No days selected</span>
//                 )}
//               </div>
//             </div>

//             <motion.button
//               whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
//               whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
//               onClick={handleSubmit}
//               disabled={loading || !isLastWorkingDay}
//               className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
//                 loading
//                   ? "bg-blue-200 text-blue-700"
//                   : isLastWorkingDay
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="w-5 h-5" />
//                   {isLastWorkingDay ? "Update Schedule" : "Updates allowed only on your last working day"}
//                 </>
//               )}
//             </motion.button>

//             {!isLastWorkingDay && (
//               <div className="mt-4 text-center text-sm text-gray-500">
//                 You can only update your schedule on your last working day of the week.
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Schedule;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  PackageCheck,
  Info,
} from "lucide-react";

interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

interface RoutingModes {
  pickup: number | null;
  delivery: number | null;
}

const Schedule: React.FC = () => {
  const [days, setDays] = useState<DayOption[]>([
    { id: 1, name: "Monday", selected: false },
    { id: 2, name: "Tuesday", selected: false },
    { id: 3, name: "Wednesday", selected: false },
    { id: 4, name: "Thursday", selected: false },
    { id: 5, name: "Friday", selected: false },
    { id: 6, name: "Saturday", selected: false },
    { id: 7, name: "Sunday", selected: false },
  ]);
  const [routingModes, setRoutingModes] = useState<RoutingModes>({
    pickup: null,
    delivery: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLastWorkingDay, setIsLastWorkingDay] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const agentId = useSelector((state: RootState) => state.ids.agentId);

  useEffect(() => {
    if (agentId) {
      fetchSchedule(agentId);
      checkLastWorkingDay(agentId);
      fetchRoutingModes(agentId);
    } else {
      setError("Agent ID not found. Please log in.");
      setLoading(false);
    }
  }, [agentId]);

  const fetchSchedule = async (agentId: number) => {
    try {
      // In a real app, you would fetch the existing schedule here
      // This is just a placeholder to simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch schedule");
      setLoading(false);
    }
  };

  const fetchRoutingModes = async (agentId: number) => {
    try {
      const response = await fetch(`/api/agent/${agentId}/routing-modes`);
      if (!response.ok) {
        throw new Error("Failed to fetch routing modes");
      }
      const data = await response.json();
      setRoutingModes({
        pickup: data.pickup_routing_mode ? 1 : 0,
        delivery: data.delivery_routing_mode ? 1 : 0,
      });
    } catch (err) {
      console.error("Error fetching routing modes:", err);
    }
  };

  const checkLastWorkingDay = async (agentId: number) => {
    try {
      const response = await fetch("/api/check-agent-last-working-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: agentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to check last working day");
      }

      const data = await response.json();
      setIsLastWorkingDay(data.is_last_working_day);
    } catch (err) {
      console.error("Error checking last working day:", err);
    }
  };

  const toggleDaySelection = (dayId: number) => {
    setDays(days.map(day => 
      day.id === dayId ? { ...day, selected: !day.selected } : day
    ));
  };

  const handleRoutingModeChange = (mode: keyof RoutingModes, value: number) => {
    setRoutingModes(prev => ({
      ...prev,
      [mode]: value,
    }));
  };

  const updateRoutingModes = async () => {
    if (!agentId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/update-routing-modes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          pickup_routing_mode: routingModes.pickup,
          delivery_routing_mode: routingModes.delivery,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update routing modes");
      }

      const successData = await response.json();
      setSuccessMessage(successData.message || "Routing modes updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!agentId) return;

    try {
      setLoading(true);
      setError(null);

      const selectedDays = days
        .filter(day => day.selected)
        .map(day => day.id)
        .sort((a, b) => a - b);

      if (selectedDays.length === 0) {
        throw new Error("Please select at least one working day");
      }

      const response = await fetch("/api/update-work-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          work_schedule: {
            days: selectedDays.join(","),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update schedule");
      }

      const successData = await response.json();
      setSuccessMessage(successData.message || "Schedule updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Re-check if today is still the last working day
      await checkLastWorkingDay(agentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !agentId) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                >
                  <Calendar className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Work Schedule
                </h1>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg"
              >
                <span className="font-medium text-gray-800">
                  Select Working Days
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {days.map((day) => (
                      <motion.div
                        key={day.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDaySelection(day.id)}
                        className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                          day.selected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {day.name}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">
                Selected Days:
              </h3>
              <div className="flex flex-wrap gap-2">
                {days.filter(day => day.selected).length > 0 ? (
                  days
                    .filter(day => day.selected)
                    .map(day => (
                      <motion.span
                        key={day.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {day.name}
                      </motion.span>
                    ))
                ) : (
                  <span className="text-gray-500">No days selected</span>
                )}
              </div>
            </div>

            {/* Routing Modes Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Routing Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PackageCheck className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Pickup Routing Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pickup_routing"
                        checked={routingModes.pickup === 1}
                        onChange={() => handleRoutingModeChange("pickup", 1)}
                        disabled={!isLastWorkingDay}
                        className="h-4 w-4 text-blue-600 disabled:opacity-50"
                      />
                      <span className="ml-2 text-gray-700">On</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pickup_routing"
                        checked={routingModes.pickup === 0}
                        onChange={() => handleRoutingModeChange("pickup", 0)}
                        disabled={!isLastWorkingDay}
                        className="h-4 w-4 text-blue-600 disabled:opacity-50"
                      />
                      <span className="ml-2 text-gray-700">Off</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Delivery Routing Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="delivery_routing"
                        checked={routingModes.delivery === 1}
                        onChange={() => handleRoutingModeChange("delivery", 1)}
                        disabled={!isLastWorkingDay}
                        className="h-4 w-4 text-blue-600 disabled:opacity-50"
                      />
                      <span className="ml-2 text-gray-700">On</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="delivery_routing"
                        checked={routingModes.delivery === 0}
                        onChange={() => handleRoutingModeChange("delivery", 0)}
                        disabled={!isLastWorkingDay}
                        className="h-4 w-4 text-blue-600 disabled:opacity-50"
                      />
                      <span className="ml-2 text-gray-700">Off</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Routing preferences determine how your pickup and delivery routes are optimized.
                  Changes can only be made on your last working day of the week.
                </p>
              </div>

              <motion.button
                whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
                whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
                onClick={updateRoutingModes}
                disabled={loading || !isLastWorkingDay}
                className={`w-full mt-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-200 text-blue-700"
                    : isLastWorkingDay
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Routing...
                  </>
                ) : (
                  "Update Routing Preferences"
                )}
              </motion.button>
            </div>

            <motion.button
              whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
              whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={loading || !isLastWorkingDay}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-200 text-blue-700"
                  : isLastWorkingDay
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isLastWorkingDay ? "Update Schedule" : "Updates allowed only on your last working day"}
                </>
              )}
            </motion.button>

            {!isLastWorkingDay && (
              <div className="mt-4 text-center text-sm text-gray-500">
                You can only update your schedule and routing preferences on your last working day of the week.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;
