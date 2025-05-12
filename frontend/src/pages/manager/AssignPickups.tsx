// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Truck,
//   Package,
//   User,
//   CheckCircle2,
//   XCircle,
//   Loader2,
//   ChevronDown,
//   ChevronUp,
//   MapPin,
//   Calendar,
//   Info,
//   ShieldCheck,
//   Clock,
//   AlertCircle,
// } from "lucide-react";

// interface ReturnItem {
//   id: number;
//   return_order: string;
//   order_line: number;
//   item_id: number;
//   return_condition: string;
//   return_carrier: string;
//   return_destination: string;
//   return_state: string;
//   return_zip: string;
//   status: string;
//   date_purchased: string;
//   date_shipped: string;
//   date_delivered: string;
//   return_created_date: string;
//   return_received_date: string;
//   item: {
//     item_number: string;
//     description: string;
//     category: string;
//   };
// }

// interface EligibleAgent {
//   agent_id: number;
//   agent_name: string;
//   servicing_zip: string;
//   delivery_type: string;
//   gender: string;
//   is_verified: boolean;
//   work_schedule: {
//     days: string;
//   };
//   assigned_return_order_count: number;
// }

// const AssignPickups: React.FC = () => {
//   const [managerId, setManagerId] = useState<number | null>(null);
//   const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null);
//   const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [isExpanded, setIsExpanded] = useState<number | null>(null);

//   useEffect(() => {
//     const id = localStorage.getItem("managerId");
//     if (id) {
//       setManagerId(parseInt(id));
//       fetchReturnItems(parseInt(id));
//     } else {
//       setError("Manager ID not found. Please log in.");
//       setLoading(false);
//     }
//   }, []);

//   const fetchReturnItems = async (managerId: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch("/api/return-items-by-manager-state", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ manager_id: managerId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch return items");
//       }

//       const data = await response.json();
//       setReturnItems(data.return_items);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch return items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEligibleAgents = async (returnOrderId: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch("/api/eligible-return-agents", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ return_order_id: returnOrderId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch eligible agents");
//       }

//       const data = await response.json();
//       setEligibleAgents(data.eligible_agents);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch eligible agents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleItemSelect = (item: ReturnItem) => {
//     setSelectedItem(item);
//     fetchEligibleAgents(item.id);
//   };

//   const handleAssignAgent = async (agentId: number) => {
//     if (!selectedItem) return;
  
//     try {
//       setLoading(true);
//       setError(null);
  
//       const response = await fetch("/api/assign-manual-agent-return-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           order_id: selectedItem.id,
//           agent_id: agentId
//         }),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to assign return agent");
//       }
  
//       const data = await response.json();
//       setSuccessMessage(data.message || `Agent ${agentId} assigned to return order ${selectedItem.return_order}`);
//       setTimeout(() => setSuccessMessage(null), 3000);
      
//       if (managerId) {
//         fetchReturnItems(managerId);
//       }
//       setSelectedItem(null);
//       setEligibleAgents([]);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to assign return agent");
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   if (loading && returnItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="text-blue-600"
//         >
//           <Loader2 className="w-12 h-12" />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
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
//                   <Truck className="w-6 h-6 text-blue-600" />
//                 </motion.div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   Assign Return Pickups
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

//             {returnItems.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 text-gray-500"
//               >
//                 No return items found in your servicing state
//               </motion.div>
//             ) : (
//               <div className="space-y-4">
//                 <h2 className="text-lg font-medium text-gray-800 mb-2">
//                   Available Return Orders
//                 </h2>
                
//                 {returnItems.map((item) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
//                   >
//                     <motion.div
//                       whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.7)" }}
//                       className="p-6 cursor-pointer"
//                       onClick={() => handleItemSelect(item)}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-4">
//                           <motion.div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                             <Package className="w-6 h-6" />
//                           </motion.div>
//                           <div>
//                             <h3 className="font-medium text-gray-900 text-lg">
//                               {item.item.item_number} - {item.item.description}
//                             </h3>
//                             <p className="text-sm text-gray-500 flex items-center gap-1">
//                               <MapPin className="w-4 h-4" />
//                               {item.return_state}, {item.return_zip}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             item.status === "Completed" 
//                               ? "bg-green-100 text-green-800" 
//                               : item.status === "In Progress"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}>
//                             {item.status}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {item.return_order}-{item.order_line}
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>

//                     {selectedItem?.id === item.id && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="px-6 pb-6 pt-2 border-t border-gray-100"
//                       >
//                         <div className="mt-4">
//                           <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
//                             <Info className="w-5 h-5 text-blue-500" />
//                             Order Details
//                           </h4>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-xs text-gray-500">Return Condition</p>
//                               <p className="text-gray-700 font-medium">{item.return_condition}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Carrier</p>
//                               <p className="text-gray-700 font-medium">{item.return_carrier}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Destination</p>
//                               <p className="text-gray-700 font-medium">{item.return_destination}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Created Date</p>
//                               <p className="text-gray-700 font-medium">{formatDate(item.return_created_date)}</p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mt-6">
//                           <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
//                             <User className="w-5 h-5 text-blue-500" />
//                             Eligible Agents ({eligibleAgents.length})
//                           </h4>

//                           {eligibleAgents.length === 0 ? (
//                             <div className="text-center py-4 text-gray-500">
//                               No eligible agents found for this return order
//                             </div>
//                           ) : (
//                             <div className="space-y-3">
//                               {eligibleAgents.map((agent) => (
//                                 <motion.div
//                                   key={agent.agent_id}
//                                   whileHover={{ scale: 1.01 }}
//                                   className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                                 >
//                                   <div className="flex justify-between items-center">
//                                     <div>
//                                       <h5 className="font-medium text-gray-800">
//                                         {agent.agent_name}
//                                       </h5>
//                                       <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                                         <MapPin className="w-4 h-4" />
//                                         <span>Servicing ZIP: {agent.servicing_zip}</span>
//                                         {agent.is_verified && (
//                                           <span className="flex items-center gap-1 text-green-600">
//                                             <ShieldCheck className="w-4 h-4" />
//                                             Verified
//                                           </span>
//                                         )}
//                                       </div>
//                                       <div className="mt-2 text-sm text-gray-600">
//                                         <span className="font-medium">Current Return Assignments:</span> {agent.assigned_return_order_count}
//                                       </div>
//                                     </div>
//                                     <motion.button
//                                       whileHover={{ scale: 1.05 }}
//                                       whileTap={{ scale: 0.95 }}
//                                       onClick={() => handleAssignAgent(agent.agent_id)}
//                                       disabled={loading}
//                                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                                     >
//                                       {loading ? (
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                       ) : (
//                                         "Assign"
//                                       )}
//                                     </motion.button>
//                                   </div>
//                                 </motion.div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AssignPickups;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Info,
  ShieldCheck,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
} from "lucide-react";

interface ReturnItem {
  id: number;
  return_order: string;
  order_line: number;
  item_id: number;
  return_condition: string;
  return_carrier: string;
  return_destination: string;
  return_state: string;
  return_zip: string;
  status: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  return_created_date: string;
  return_received_date: string;
  item: {
    item_number: string;
    description: string;
    category: string;
  };
}

interface EligibleAgent {
  agent_id: number;
  agent_name: string;
  servicing_zip: string;
  delivery_type: string;
  gender: string;
  is_verified: boolean;
  work_schedule: {
    days: string;
  };
  assigned_return_order_count: number;
}

const AssignPickups: React.FC = () => {
  const [managerId, setManagerId] = useState<number | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null);
  const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchingAgents, setFetchingAgents] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("managerId");
    if (id) {
      setManagerId(parseInt(id));
      fetchReturnItems(parseInt(id));
    } else {
      setError("Manager ID not found. Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchReturnItems = async (managerId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/return-items-by-manager-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manager_id: managerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch return items");
      }

      const data = await response.json();
      setReturnItems(data.return_items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch return items");
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleAgents = async (returnOrderId: number) => {
    try {
      setFetchingAgents(true);
      setError(null);

      const response = await fetch("/api/eligible-return-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ return_order_id: returnOrderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch eligible agents");
      }

      const data = await response.json();
      setEligibleAgents(data.eligible_agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch eligible agents");
    } finally {
      setFetchingAgents(false);
    }
  };

  const handleItemSelect = async (item: ReturnItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setEligibleAgents([]);
      return;
    }

    setSelectedItem(item);
    await fetchEligibleAgents(item.id);
  };

  const handleAssignAgent = async (agentId: number) => {
    if (!selectedItem) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch("/api/assign-manual-agent-return-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: selectedItem.id,
          agent_id: agentId
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to assign return agent");
      }
  
      const data = await response.json();
      setSuccessMessage(`Successfully assigned agent to return order ${selectedItem.return_order}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      if (managerId) {
        await fetchReturnItems(managerId);
      }
      setSelectedItem(null);
      setEligibleAgents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign return agent");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredItems = returnItems.filter((item) => {
    return searchTerm.toLowerCase() === "" || 
      item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.return_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.return_state.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && returnItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
                <Truck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Return Pickups
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Assign agents to process return pickups
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search returns by description, order number, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => managerId && fetchReturnItems(managerId)}
                disabled={loading}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700">
                  {searchTerm 
                    ? "No matching returns found" 
                    : "No returns available"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "All returns have been processed"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      selectedItem?.id === item.id
                        ? "border-blue-300 shadow-md bg-blue-50"
                        : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                    }`}
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {item.item.description}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {item.return_state}, {item.return_zip}
                            </p>
                            <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                              item.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-slate-600">
                            {item.return_order}-{item.order_line}
                          </div>
                          {selectedItem?.id === item.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedItem?.id === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-100"
                        >
                          <div className="p-6 space-y-6">
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-500" />
                                    Return Details
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-slate-500">Condition</p>
                                        <p className="text-sm font-medium text-slate-800">{item.return_condition}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Carrier</p>
                                        <p className="text-sm font-medium text-slate-800">{item.return_carrier}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Destination</p>
                                        <p className="text-sm font-medium text-slate-800">{item.return_destination}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Created Date</p>
                                        <p className="text-sm font-medium text-slate-800">{formatDate(item.return_created_date)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    Timeline
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-slate-500">Purchased</p>
                                        <p className="text-sm font-medium text-slate-800">{formatDate(item.date_purchased)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Return Initiated</p>
                                        <p className="text-sm font-medium text-slate-800">{formatDate(item.return_created_date)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Available Agents ({eligibleAgents.length})
                              </h4>

                              {fetchingAgents ? (
                                <div className="flex justify-center py-8">
                                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                              ) : eligibleAgents.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                  <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                  <p className="text-slate-600">No available agents for this location</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {eligibleAgents.map((agent) => (
                                    <div key={agent.agent_id} className="p-4 border border-slate-200 rounded-lg bg-white">
                                      <div className="flex justify-between items-start gap-4">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <h5 className="font-medium text-slate-800">
                                              {agent.agent_name}
                                            </h5>
                                            {agent.is_verified && (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                Verified
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                              <MapPin className="w-4 h-4" />
                                              <span>Serves ZIP: {agent.servicing_zip}</span>
                                            </div>
                                            <div className="mt-1">
                                              <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Current assignments: {agent.assigned_return_order_count}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleAssignAgent(agent.agent_id)}
                                          disabled={loading}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                          Assign
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignPickups;