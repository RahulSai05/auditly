// // // import React, { useState, useEffect } from "react";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import {
// // //   Truck,
// // //   Package,
// // //   User,
// // //   CheckCircle2,
// // //   XCircle,
// // //   Loader2,
// // //   ChevronDown,
// // //   ChevronUp,
// // //   MapPin,
// // //   Calendar,
// // //   Info,
// // //   ShieldCheck,
// // //   Clock,
// // //   AlertCircle,
// // //   Home,
// // //   Mail,
// // //   Search,
// // //   Filter,
// // //   RefreshCw,
// // // } from "lucide-react";

// // // interface SaleItem {
// // //   id: number;
// // //   sales_order: string;
// // //   order_line: number;
// // //   serial_number: string;
// // //   sscc_number: string;
// // //   account_number: string;
// // //   customer_email: string;
// // //   shipped_to_city: string;
// // //   shipped_to_state: string;
// // //   shipped_to_zip: string;
// // //   status: string;
// // //   date_purchased: string;
// // //   date_shipped: string;
// // //   date_delivered: string;
// // //   item: {
// // //     item_number: string;
// // //     description: string;
// // //     category: string;
// // //   };
// // // }

// // // interface EligibleAgent {
// // //   agent_id: number;
// // //   agent_name: string;
// // //   servicing_zip: string;
// // //   delivery_type: string;
// // //   gender: string;
// // //   is_verified: boolean;
// // //   work_schedule: {
// // //     days: string;
// // //   };
// // //   assigned_sales_order_count: number;
// // // }

// // // const AssignDeliveries: React.FC = () => {
// // //   const [managerId, setManagerId] = useState<number | null>(null);
// // //   const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
// // //   const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null);
// // //   const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [statusFilter, setStatusFilter] = useState("all");
// // //   const [sortBy, setSortBy] = useState<"date" | "city" | "order">("date");

// // //   useEffect(() => {
// // //     const id = localStorage.getItem("managerId");
// // //     if (id) {
// // //       setManagerId(parseInt(id));
// // //       fetchSaleItems(parseInt(id));
// // //     } else {
// // //       setError("Manager ID not found. Please log in.");
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   const fetchSaleItems = async (managerId: number) => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const response = await fetch("/api/sale-items-by-manager-state", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ manager_id: managerId }),
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error("Failed to fetch sale items");
// // //       }

// // //       const data = await response.json();
// // //       setSaleItems(data.sale_items);
// // //     } catch (err) {
// // //       setError(err instanceof Error ? err.message : "Failed to fetch sale items");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchEligibleAgents = async (salesOrderId: number) => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const response = await fetch("/api/eligible-delivery-agents", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ sales_order_id: salesOrderId }),
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error("Failed to fetch eligible agents");
// // //       }

// // //       const data = await response.json();
// // //       setEligibleAgents(data.eligible_agents);
// // //     } catch (err) {
// // //       setError(err instanceof Error ? err.message : "Failed to fetch eligible agents");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleItemSelect = (item: SaleItem) => {
// // //     setSelectedItem(selectedItem?.id === item.id ? null : item);
// // //     if (item.id !== selectedItem?.id) {
// // //       fetchEligibleAgents(item.id);
// // //     }
// // //   };

// // //   const handleAssignAgent = async (agentId: number) => {
// // //     if (!selectedItem) return;
  
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
  
// // //       const response = await fetch("/api/assign-manual-agent-sales-order", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           order_id: selectedItem.id,
// // //           agent_id: agentId
// // //         }),
// // //       });
  
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData.detail || "Failed to assign agent");
// // //       }
  
// // //       const data = await response.json();
// // //       setSuccessMessage(`Successfully assigned agent to order ${selectedItem.sales_order}`);
// // //       setTimeout(() => setSuccessMessage(null), 5000);
      
// // //       if (managerId) {
// // //         fetchSaleItems(managerId);
// // //       }
// // //       setSelectedItem(null);
// // //       setEligibleAgents([]);
// // //     } catch (err) {
// // //       setError(err instanceof Error ? err.message : "Failed to assign agent");
// // //       setTimeout(() => setError(null), 5000);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const formatDate = (dateString: string) => {
// // //     if (!dateString) return "N/A";
// // //     return new Date(dateString).toLocaleDateString("en-US", {
// // //       year: "numeric",
// // //       month: "short",
// // //       day: "numeric",
// // //     });
// // //   };

// // //   const filteredItems = saleItems
// // //     .filter((item) => {
// // //       const matchesSearch = searchTerm.toLowerCase() === "" || 
// // //         item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         item.sales_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         item.shipped_to_city.toLowerCase().includes(searchTerm.toLowerCase());
      
// // //       const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
// // //       return matchesSearch && matchesStatus;
// // //     })
// // //     .sort((a, b) => {
// // //       if (sortBy === "date") {
// // //         return new Date(b.date_purchased).getTime() - new Date(a.date_purchased).getTime();
// // //       } else if (sortBy === "city") {
// // //         return a.shipped_to_city.localeCompare(b.shipped_to_city);
// // //       } else {
// // //         return a.sales_order.localeCompare(b.sales_order);
// // //       }
// // //     });

// // //   if (loading && saleItems.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
// // //         <motion.div
// // //           animate={{ rotate: 360 }}
// // //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// // //           className="text-blue-600"
// // //         >
// // //           <Loader2 className="w-12 h-12" />
// // //         </motion.div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
// // //       <div className="max-w-7xl mx-auto">
// // //         <motion.div
// // //           initial={{ opacity: 0, y: 20 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
// // //         >
// // //           <div className="p-8">
// // //             <div className="flex justify-between items-center mb-8">
// // //               <div className="flex items-center gap-4">
// // //                 <motion.div
// // //                   whileHover={{ scale: 1.1, rotate: 10 }}
// // //                   className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
// // //                 >
// // //                   <Truck className="w-7 h-7 text-white" />
// // //                 </motion.div>
// // //                 <div>
// // //                   <h1 className="text-3xl font-bold text-slate-900">
// // //                     Assign Deliveries
// // //                   </h1>
// // //                   <p className="text-slate-500 mt-1">
// // //                     Manage and assign delivery agents to pending orders
// // //                   </p>
// // //                 </div>
// // //               </div>
              
// // //               <motion.button
// // //                 whileHover={{ scale: 1.05 }}
// // //                 whileTap={{ scale: 0.95 }}
// // //                 onClick={() => managerId && fetchSaleItems(managerId)}
// // //                 className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
// // //                 title="Refresh orders"
// // //               >
// // //                 <RefreshCw className="w-5 h-5" />
// // //               </motion.button>
// // //             </div>

// // //             <AnimatePresence>
// // //               {error && (
// // //                 <motion.div
// // //                   initial={{ opacity: 0, y: -20 }}
// // //                   animate={{ opacity: 1, y: 0 }}
// // //                   exit={{ opacity: 0, y: -20 }}
// // //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// // //                 >
// // //                   <AlertCircle className="w-5 h-5" />
// // //                   <span className="font-medium">{error}</span>
// // //                 </motion.div>
// // //               )}

// // //               {successMessage && (
// // //                 <motion.div
// // //                   initial={{ opacity: 0, y: -20 }}
// // //                   animate={{ opacity: 1, y: 0 }}
// // //                   exit={{ opacity: 0, y: -20 }}
// // //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
// // //                 >
// // //                   <CheckCircle2 className="w-5 h-5" />
// // //                   <span className="font-medium">{successMessage}</span>
// // //                 </motion.div>
// // //               )}
// // //             </AnimatePresence>

// // //             <div className="mb-6 flex flex-col sm:flex-row gap-4">
// // //               <div className="relative flex-grow">
// // //                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Search by description, order number, or location..."
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                 />
// // //               </div>
              
// // //               <div className="flex gap-3">
// // //                 <select
// // //                   value={statusFilter}
// // //                   onChange={(e) => setStatusFilter(e.target.value)}
// // //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// // //                 >
// // //                   <option value="all">All Statuses</option>
// // //                   <option value="Ready to Ship">Ready to Ship</option>
// // //                   <option value="In Transit">In Transit</option>
// // //                   <option value="Delivered">Delivered</option>
// // //                 </select>

// // //                 <select
// // //                   value={sortBy}
// // //                   onChange={(e) => setSortBy(e.target.value as "date" | "city" | "order")}
// // //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// // //                 >
// // //                   <option value="date">Sort by Date</option>
// // //                   <option value="city">Sort by City</option>
// // //                   <option value="order">Sort by Order #</option>
// // //                 </select>
// // //               </div>
// // //             </div>

// // //             {filteredItems.length === 0 ? (
// // //               <motion.div
// // //                 initial={{ opacity: 0 }}
// // //                 animate={{ opacity: 1 }}
// // //                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
// // //               >
// // //                 <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
// // //                 <h3 className="text-lg font-medium text-slate-700">No delivery orders found</h3>
// // //                 <p className="text-slate-500 mt-2">
// // //                   {searchTerm || statusFilter !== "all" 
// // //                     ? "Try adjusting your filters or search terms"
// // //                     : "There are currently no orders available for assignment"}
// // //                 </p>
// // //               </motion.div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {filteredItems.map((item) => (
// // //                   <motion.div
// // //                     key={item.id}
// // //                     initial={{ opacity: 0, y: 10 }}
// // //                     animate={{ opacity: 1, y: 0 }}
// // //                     transition={{ duration: 0.2 }}
// // //                     className={`border rounded-xl overflow-hidden transition-all ${
// // //                       selectedItem?.id === item.id
// // //                         ? "border-blue-300 shadow-md bg-blue-50"
// // //                         : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
// // //                     }`}
// // //                   >
// // //                     <div
// // //                       className="p-6 cursor-pointer"
// // //                       onClick={() => handleItemSelect(item)}
// // //                     >
// // //                       <div className="flex justify-between items-center">
// // //                         <div className="flex items-center gap-4">
// // //                           <motion.div
// // //                             whileHover={{ scale: 1.05 }}
// // //                             className={`w-12 h-12 rounded-xl flex items-center justify-center ${
// // //                               selectedItem?.id === item.id
// // //                                 ? "bg-blue-200 text-blue-700"
// // //                                 : "bg-blue-100 text-blue-600"
// // //                             }`}
// // //                           >
// // //                             <Package className="w-6 h-6" />
// // //                           </motion.div>
// // //                           <div>
// // //                             <h3 className="font-medium text-slate-900">
// // //                               {item.item.description}
// // //                             </h3>
// // //                             <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// // //                               <MapPin className="w-4 h-4" />
// // //                               {item.shipped_to_city}, {item.shipped_to_state} {item.shipped_to_zip}
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                         <div className="flex items-center gap-4">
// // //                           <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
// // //                             item.status === "Delivered"
// // //                               ? "bg-green-100 text-green-800"
// // //                               : item.status === "In Transit"
// // //                               ? "bg-blue-100 text-blue-800"
// // //                               : "bg-amber-100 text-amber-800"
// // //                           }`}>
// // //                             {item.status}
// // //                           </div>
// // //                           <div className="text-sm font-medium text-slate-600">
// // //                             {item.sales_order}
// // //                           </div>
// // //                           <button
// // //                             onClick={(e) => {
// // //                               e.stopPropagation();
// // //                               handleItemSelect(item);
// // //                             }}
// // //                             className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
// // //                           >
// // //                             {selectedItem?.id === item.id ? (
// // //                               <ChevronUp className="w-5 h-5" />
// // //                             ) : (
// // //                               <ChevronDown className="w-5 h-5" />
// // //                             )}
// // //                           </button>
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <AnimatePresence>
// // //                       {selectedItem?.id === item.id && (
// // //                         <motion.div
// // //                           initial={{ opacity: 0, height: 0 }}
// // //                           animate={{ opacity: 1, height: "auto" }}
// // //                           exit={{ opacity: 0, height: 0 }}
// // //                           transition={{ duration: 0.3 }}
// // //                           className="border-t border-slate-100"
// // //                         >
// // //                           <div className="p-6 space-y-6">
// // //                             <div>
// // //                               <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
// // //                                 <Info className="w-5 h-5 text-blue-500" />
// // //                                 Order Details
// // //                               </h4>
// // //                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-4 border border-slate-200">
// // //                                 <div>
// // //                                   <div className="mb-4">
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Customer Email</p>
// // //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// // //                                       <Mail className="w-4 h-4 text-slate-400" />
// // //                                       {item.customer_email || "N/A"}
// // //                                     </p>
// // //                                   </div>
// // //                                   <div>
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Account Number</p>
// // //                                     <p className="text-slate-700 font-medium mt-1">{item.account_number || "N/A"}</p>
// // //                                   </div>
// // //                                 </div>
                                
// // //                                 <div>
// // //                                   <div className="mb-4">
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Serial Number</p>
// // //                                     <p className="text-slate-700 font-medium mt-1">{item.serial_number || "N/A"}</p>
// // //                                   </div>
// // //                                   <div>
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">SSCC Number</p>
// // //                                     <p className="text-slate-700 font-medium mt-1">{item.sscc_number || "N/A"}</p>
// // //                                   </div>
// // //                                 </div>
                                
// // //                                 <div>
// // //                                   <div className="mb-4">
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Purchased Date</p>
// // //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// // //                                       <Calendar className="w-4 h-4 text-slate-400" />
// // //                                       {formatDate(item.date_purchased)}
// // //                                     </p>
// // //                                   </div>
// // //                                   <div>
// // //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Shipped Date</p>
// // //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// // //                                       <Calendar className="w-4 h-4 text-slate-400" />
// // //                                       {formatDate(item.date_shipped)}
// // //                                     </p>
// // //                                   </div>
// // //                                 </div>
// // //                               </div>
// // //                             </div>

// // //                             <div>
// // //                               <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
// // //                                 <User className="w-5 h-5 text-blue-500" />
// // //                                 Eligible Delivery Agents ({eligibleAgents.length})
// // //                               </h4>

// // //                               {loading ? (
// // //                                 <div className="flex justify-center py-8">
// // //                                   <motion.div
// // //                                     animate={{ rotate: 360 }}
// // //                                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// // //                                   >
// // //                                     <Loader2 className="w-8 h-8 text-blue-500" />
// // //                                   </motion.div>
// // //                                 </div>
// // //                               ) : eligibleAgents.length === 0 ? (
// // //                                 <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
// // //                                   <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
// // //                                   <p className="text-slate-600">No eligible delivery agents found for this order</p>
// // //                                 </div>
// // //                               ) : (
// // //                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                                   {eligibleAgents.map((agent) => (
// // //                                     <motion.div
// // //                                       key={agent.agent_id}
// // //                                       whileHover={{ scale: 1.01 }}
// // //                                       className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all bg-white"
// // //                                     >
// // //                                       <div className="flex justify-between items-start">
// // //                                         <div className="space-y-2">
// // //                                           <div className="flex items-center gap-2">
// // //                                             <h5 className="font-medium text-slate-800">
// // //                                               {agent.agent_name}
// // //                                             </h5>
// // //                                             {agent.is_verified && (
// // //                                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// // //                                                 <ShieldCheck className="w-3 h-3 mr-1" />
// // //                                                 Verified
// // //                                               </span>
// // //                                             )}
// // //                                           </div>
                                          
// // //                                           <div className="flex flex-wrap gap-4 text-sm">
// // //                                             <div className="flex items-center text-slate-600">
// // //                                               <MapPin className="w-4 h-4 mr-1 text-slate-400" />
// // //                                               <span>ZIP: {agent.servicing_zip}</span>
// // //                                             </div>
// // //                                             {agent.work_schedule && (
// // //                                               <div className="flex items-center text-slate-600">
// // //                                                 <Calendar className="w-4 h-4 mr-1 text-slate-400" />
// // //                                                 <span>{agent.work_schedule.days}</span>
// // //                                               </div>
// // //                                             )}
// // //                                           </div>
                                          
// // //                                           <div className="text-sm font-medium text-blue-600">
// // //                                             {agent.assigned_sales_order_count} current assignments
// // //                                           </div>
// // //                                         </div>
                                        
// // //                                         <motion.button
// // //                                           whileHover={{ scale: 1.05 }}
// // //                                           whileTap={{ scale: 0.95 }}
// // //                                           onClick={() => handleAssignAgent(agent.agent_id)}
// // //                                           disabled={loading}
// // //                                           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
// // //                                         >
// // //                                           {loading ? (
// // //                                             <Loader2 className="w-5 h-5 animate-spin" />
// // //                                           ) : (
// // //                                             "Assign"
// // //                                           )}
// // //                                         </motion.button>
// // //                                       </div>
// // //                                     </motion.div>
// // //                                   ))}
// // //                                 </div>
// // //                               )}
// // //                             </div>
// // //                           </div>
// // //                         </motion.div>
// // //                       )}
// // //                     </AnimatePresence>
// // //                   </motion.div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </motion.div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AssignDeliveries;

// // import React, { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   Truck,
// //   Package,
// //   User,
// //   CheckCircle2,
// //   XCircle,
// //   Loader2,
// //   ChevronDown,
// //   ChevronUp,
// //   MapPin,
// //   Calendar,
// //   Info,
// //   ShieldCheck,
// //   Clock,
// //   AlertCircle,
// //   Home,
// //   Mail,
// //   Search,
// //   Filter,
// //   RefreshCw,
// // } from "lucide-react";

// // interface SaleItem {
// //   id: number;
// //   sales_order: string;
// //   order_line: number;
// //   serial_number: string;
// //   sscc_number: string;
// //   account_number: string;
// //   customer_email: string;
// //   shipped_to_city: string;
// //   shipped_to_state: string;
// //   shipped_to_zip: string;
// //   status: string;
// //   date_purchased: string;
// //   date_shipped: string;
// //   date_delivered: string;
// //   item: {
// //     item_number: string;
// //     description: string;
// //     category: string;
// //   };
// // }

// // interface EligibleAgent {
// //   agent_id: number;
// //   agent_name: string;
// //   servicing_zip: string;
// //   delivery_type: string;
// //   gender: string;
// //   is_verified: boolean;
// //   work_schedule: {
// //     days: string;
// //   };
// //   assigned_sales_order_count: number;
// // }

// // const AssignDeliveries: React.FC = () => {
// //   const [managerId, setManagerId] = useState<number | null>(null);
// //   const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
// //   const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null);
// //   const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [sortBy, setSortBy] = useState<"date" | "city" | "order">("date");

// //   useEffect(() => {
// //     const id = localStorage.getItem("managerId");
// //     if (id) {
// //       setManagerId(parseInt(id));
// //       fetchSaleItems(parseInt(id));
// //     } else {
// //       setError("Manager ID not found. Please log in.");
// //       setLoading(false);
// //     }
// //   }, []);

// //   const fetchSaleItems = async (managerId: number) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const response = await fetch("/api/sale-items-by-manager-state", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ manager_id: managerId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch sale items");
// //       }

// //       const data = await response.json();
// //       setSaleItems(data.sale_items);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to fetch sale items");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchEligibleAgents = async (salesOrderId: number) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const response = await fetch("/api/eligible-delivery-agents", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ sales_order_id: salesOrderId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch eligible agents");
// //       }

// //       const data = await response.json();
// //       setEligibleAgents(data.eligible_agents);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to fetch eligible agents");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleItemSelect = (item: SaleItem) => {
// //     setSelectedItem(selectedItem?.id === item.id ? null : item);
// //     if (item.id !== selectedItem?.id && item.status === "Ready to Ship") {
// //       fetchEligibleAgents(item.id);
// //     }
// //   };

// //   const handleAssignAgent = async (agentId: number) => {
// //     if (!selectedItem) return;
  
// //     try {
// //       setLoading(true);
// //       setError(null);
  
// //       const response = await fetch("/api/assign-manual-agent-sales-order", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           order_id: selectedItem.id,
// //           agent_id: agentId
// //         }),
// //       });
  
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.detail || "Failed to assign agent");
// //       }
  
// //       const data = await response.json();
// //       setSuccessMessage(`Successfully assigned agent to order ${selectedItem.sales_order}`);
// //       setTimeout(() => setSuccessMessage(null), 5000);
      
// //       if (managerId) {
// //         fetchSaleItems(managerId);
// //       }
// //       setSelectedItem(null);
// //       setEligibleAgents([]);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to assign agent");
// //       setTimeout(() => setError(null), 5000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     if (!dateString) return "N/A";
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   const filteredItems = saleItems
// //     .filter((item) => {
// //       const matchesSearch = searchTerm.toLowerCase() === "" || 
// //         item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         item.sales_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         item.shipped_to_city.toLowerCase().includes(searchTerm.toLowerCase());
      
// //       const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
// //       return matchesSearch && matchesStatus;
// //     })
// //     .sort((a, b) => {
// //       if (sortBy === "date") {
// //         return new Date(b.date_purchased).getTime() - new Date(a.date_purchased).getTime();
// //       } else if (sortBy === "city") {
// //         return a.shipped_to_city.localeCompare(b.shipped_to_city);
// //       } else {
// //         return a.sales_order.localeCompare(b.sales_order);
// //       }
// //     });

// //   if (loading && saleItems.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
// //         <motion.div
// //           animate={{ rotate: 360 }}
// //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //           className="text-blue-600"
// //         >
// //           <Loader2 className="w-12 h-12" />
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
// //       <div className="max-w-7xl mx-auto">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
// //         >
// //           <div className="p-8">
// //             <div className="flex justify-between items-center mb-8">
// //               <div className="flex items-center gap-4">
// //                 <motion.div
// //                   whileHover={{ scale: 1.1, rotate: 10 }}
// //                   className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
// //                 >
// //                   <Truck className="w-7 h-7 text-white" />
// //                 </motion.div>
// //                 <div>
// //                   <h1 className="text-3xl font-bold text-slate-900">
// //                     Assign Deliveries
// //                   </h1>
// //                   <p className="text-slate-500 mt-1">
// //                     Manage and assign delivery agents to pending orders
// //                   </p>
// //                 </div>
// //               </div>
              
// //               <motion.button
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => managerId && fetchSaleItems(managerId)}
// //                 className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
// //                 title="Refresh orders"
// //               >
// //                 <RefreshCw className="w-5 h-5" />
// //               </motion.button>
// //             </div>

// //             <AnimatePresence>
// //               {error && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: -20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// //                 >
// //                   <AlertCircle className="w-5 h-5" />
// //                   <span className="font-medium">{error}</span>
// //                 </motion.div>
// //               )}

// //               {successMessage && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: -20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
// //                 >
// //                   <CheckCircle2 className="w-5 h-5" />
// //                   <span className="font-medium">{successMessage}</span>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>

// //             <div className="mb-6 flex flex-col sm:flex-row gap-4">
// //               <div className="relative flex-grow">
// //                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search by description, order number, or location..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               </div>
              
// //               <div className="flex gap-3">
// //                 <select
// //                   value={statusFilter}
// //                   onChange={(e) => setStatusFilter(e.target.value)}
// //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// //                 >
// //                   <option value="all">All Statuses</option>
// //                   <option value="Ready to Ship">Ready to Ship</option>
// //                   <option value="In Transit">In Transit</option>
// //                   <option value="Delivered">Delivered</option>
// //                 </select>

// //                 <select
// //                   value={sortBy}
// //                   onChange={(e) => setSortBy(e.target.value as "date" | "city" | "order")}
// //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// //                 >
// //                   <option value="date">Sort by Date</option>
// //                   <option value="city">Sort by City</option>
// //                   <option value="order">Sort by Order #</option>
// //                 </select>
// //               </div>
// //             </div>

// //             {filteredItems.length === 0 ? (
// //               <motion.div
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
// //               >
// //                 <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-slate-700">No delivery orders found</h3>
// //                 <p className="text-slate-500 mt-2">
// //                   {searchTerm || statusFilter !== "all" 
// //                     ? "Try adjusting your filters or search terms"
// //                     : "There are currently no orders available for assignment"}
// //                 </p>
// //               </motion.div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {filteredItems.map((item) => (
// //                   <motion.div
// //                     key={item.id}
// //                     initial={{ opacity: 0, y: 10 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     transition={{ duration: 0.2 }}
// //                     className={`border rounded-xl overflow-hidden transition-all ${
// //                       selectedItem?.id === item.id
// //                         ? "border-blue-300 shadow-md bg-blue-50"
// //                         : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
// //                     }`}
// //                   >
// //                     <div
// //                       className="p-6 cursor-pointer"
// //                       onClick={() => handleItemSelect(item)}
// //                     >
// //                       <div className="flex justify-between items-center">
// //                         <div className="flex items-center gap-4">
// //                           <motion.div
// //                             whileHover={{ scale: 1.05 }}
// //                             className={`w-12 h-12 rounded-xl flex items-center justify-center ${
// //                               selectedItem?.id === item.id
// //                                 ? "bg-blue-200 text-blue-700"
// //                                 : "bg-blue-100 text-blue-600"
// //                             }`}
// //                           >
// //                             <Package className="w-6 h-6" />
// //                           </motion.div>
// //                           <div>
// //                             <h3 className="font-medium text-slate-900">
// //                               {item.item.description}
// //                             </h3>
// //                             <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// //                               <MapPin className="w-4 h-4" />
// //                               {item.shipped_to_city}, {item.shipped_to_state} {item.shipped_to_zip}
// //                             </p>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-4">
// //                           <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
// //                             item.status === "Delivered"
// //                               ? "bg-green-100 text-green-800"
// //                               : item.status === "In Transit"
// //                               ? "bg-blue-100 text-blue-800"
// //                               : "bg-amber-100 text-amber-800"
// //                           }`}>
// //                             {item.status}
// //                           </div>
// //                           <div className="text-sm font-medium text-slate-600">
// //                             {item.sales_order}
// //                           </div>
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               handleItemSelect(item);
// //                             }}
// //                             className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
// //                           >
// //                             {selectedItem?.id === item.id ? (
// //                               <ChevronUp className="w-5 h-5" />
// //                             ) : (
// //                               <ChevronDown className="w-5 h-5" />
// //                             )}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <AnimatePresence>
// //                       {selectedItem?.id === item.id && (
// //                         <motion.div
// //                           initial={{ opacity: 0, height: 0 }}
// //                           animate={{ opacity: 1, height: "auto" }}
// //                           exit={{ opacity: 0, height: 0 }}
// //                           transition={{ duration: 0.3 }}
// //                           className="border-t border-slate-100"
// //                         >
// //                           <div className="p-6 space-y-6">
// //                             <div>
// //                               <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
// //                                 <Info className="w-5 h-5 text-blue-500" />
// //                                 Order Details
// //                               </h4>
// //                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-4 border border-slate-200">
// //                                 <div>
// //                                   <div className="mb-4">
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Customer Email</p>
// //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// //                                       <Mail className="w-4 h-4 text-slate-400" />
// //                                       {item.customer_email || "N/A"}
// //                                     </p>
// //                                   </div>
// //                                   <div>
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Account Number</p>
// //                                     <p className="text-slate-700 font-medium mt-1">{item.account_number || "N/A"}</p>
// //                                   </div>
// //                                 </div>
                                
// //                                 <div>
// //                                   <div className="mb-4">
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Serial Number</p>
// //                                     <p className="text-slate-700 font-medium mt-1">{item.serial_number || "N/A"}</p>
// //                                   </div>
// //                                   <div>
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">SSCC Number</p>
// //                                     <p className="text-slate-700 font-medium mt-1">{item.sscc_number || "N/A"}</p>
// //                                   </div>
// //                                 </div>
                                
// //                                 <div>
// //                                   <div className="mb-4">
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Purchased Date</p>
// //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// //                                       <Calendar className="w-4 h-4 text-slate-400" />
// //                                       {formatDate(item.date_purchased)}
// //                                     </p>
// //                                   </div>
// //                                   <div>
// //                                     <p className="text-xs text-slate-500 uppercase tracking-wide">Shipped Date</p>
// //                                     <p className="text-slate-700 font-medium flex items-center gap-1 mt-1">
// //                                       <Calendar className="w-4 h-4 text-slate-400" />
// //                                       {formatDate(item.date_shipped)}
// //                                     </p>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             </div>

// //                             {item.status === "Ready to Ship" && (
// //                               <div>
// //                                 <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
// //                                   <User className="w-5 h-5 text-blue-500" />
// //                                   Eligible Delivery Agents ({eligibleAgents.length})
// //                                 </h4>

// //                                 {loading ? (
// //                                   <div className="flex justify-center py-8">
// //                                     <motion.div
// //                                       animate={{ rotate: 360 }}
// //                                       transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //                                     >
// //                                       <Loader2 className="w-8 h-8 text-blue-500" />
// //                                     </motion.div>
// //                                   </div>
// //                                 ) : eligibleAgents.length === 0 ? (
// //                                   <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
// //                                     <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
// //                                     <p className="text-slate-600">No eligible delivery agents found for this order</p>
// //                                   </div>
// //                                 ) : (
// //                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                     {eligibleAgents.map((agent) => (
// //                                       <motion.div
// //                                         key={agent.agent_id}
// //                                         whileHover={{ scale: 1.01 }}
// //                                         className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all bg-white"
// //                                       >
// //                                         <div className="flex justify-between items-start">
// //                                           <div className="space-y-2">
// //                                             <div className="flex items-center gap-2">
// //                                               <h5 className="font-medium text-slate-800">
// //                                                 {agent.agent_name}
// //                                               </h5>
// //                                               {agent.is_verified && (
// //                                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                                                   <ShieldCheck className="w-3 h-3 mr-1" />
// //                                                   Verified
// //                                                 </span>
// //                                               )}
// //                                             </div>
                                            
// //                                             <div className="flex flex-wrap gap-4 text-sm">
// //                                               <div className="flex items-center text-slate-600">
// //                                                 <MapPin className="w-4 h-4 mr-1 text-slate-400" />
// //                                                 <span>ZIP: {agent.servicing_zip}</span>
// //                                               </div>
// //                                               {agent.work_schedule && (
// //                                                 <div className="flex items-center text-slate-600">
// //                                                   <Calendar className="w-4 h-4 mr-1 text-slate-400" />
// //                                                   <span>{agent.work_schedule.days}</span>
// //                                                 </div>
// //                                               )}
// //                                             </div>
                                            
// //                                             <div className="text-sm font-medium text-blue-600">
// //                                               {agent.assigned_sales_order_count} current assignments
// //                                             </div>
// //                                           </div>
                                          
// //                                           <motion.button
// //                                             whileHover={{ scale: 1.05 }}
// //                                             whileTap={{ scale: 0.95 }}
// //                                             onClick={() => handleAssignAgent(agent.agent_id)}
// //                                             disabled={loading}
// //                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
// //                                           >
// //                                             {loading ? (
// //                                               <Loader2 className="w-5 h-5 animate-spin" />
// //                                             ) : (
// //                                               "Assign"
// //                                             )}
// //                                           </motion.button>
// //                                         </div>
// //                                       </motion.div>
// //                                     ))}
// //                                   </div>
// //                                 )}
// //                               </div>
// //                             )}

// //                             {item.status !== "Ready to Ship" && (
// //                               <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
// //                                 <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
// //                                 <p className="text-slate-600">
// //                                   This order has already been assigned to a delivery agent and is {item.status.toLowerCase()}.
// //                                 </p>
// //                                 <p className="text-sm text-slate-500 mt-2">
// //                                   Shipped on: {formatDate(item.date_shipped)}
// //                                   {item.date_delivered && ` • Delivered on: ${formatDate(item.date_delivered)}`}
// //                                 </p>
// //                               </div>
// //                             )}
// //                           </div>
// //                         </motion.div>
// //                       )}
// //                     </AnimatePresence>
// //                   </motion.div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AssignDeliveries;


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
  Home,
  Mail,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

interface SaleItem {
  id: number;
  sales_order: string;
  order_line: number;
  serial_number: string;
  sscc_number: string;
  account_number: string;
  customer_email: string;
  shipped_to_city: string;
  shipped_to_state: string;
  shipped_to_zip: string;
  status: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
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
  assigned_sales_order_count: number;
}

const AssignDeliveries: React.FC = () => {
  const [managerId, setManagerId] = useState<number | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null);
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
      fetchSaleItems(parseInt(id));
    } else {
      setError("Manager ID not found. Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchSaleItems = async (managerId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/sale-items-by-manager-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manager_id: managerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sale items");
      }

      const data = await response.json();
      // Filter to only show "Ready to Ship" items
      setSaleItems(data.sale_items.filter((item: SaleItem) => item.status === "Ready to Ship"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sale items");
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleAgents = async (salesOrderId: number) => {
    try {
      setFetchingAgents(true);
      setError(null);

      const response = await fetch("/api/eligible-delivery-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sales_order_id: salesOrderId }),
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

  const handleItemSelect = async (item: SaleItem) => {
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
  
      const response = await fetch("/api/assign-manual-agent-sales-order", {
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
        throw new Error(errorData.detail || "Failed to assign agent");
      }
  
      const data = await response.json();
      setSuccessMessage(`Successfully assigned agent to order ${selectedItem.sales_order}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      if (managerId) {
        await fetchSaleItems(managerId);
      }
      setSelectedItem(null);
      setEligibleAgents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign agent");
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

  const filteredItems = saleItems.filter((item) => {
    return searchTerm.toLowerCase() === "" || 
      item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sales_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shipped_to_city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && saleItems.length === 0) {
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
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Truck className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Assign Deliveries
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Assign agents to unassigned orders
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => managerId && fetchSaleItems(managerId)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                title="Refresh orders"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
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

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by description, number, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700">
                  {searchTerm ? "No matching orders found" : "No unassigned orders available"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {searchTerm ? "Try a different search term" : "All orders have been assigned to agents"}
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
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedItem?.id === item.id
                              ? "bg-blue-200 text-blue-700"
                              : "bg-blue-100 text-blue-600"
                          }`}>
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {item.item.description}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {item.shipped_to_city}, {item.shipped_to_state} {item.shipped_to_zip}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-slate-600">
                            {item.sales_order}
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
                              <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Available Agents ({eligibleAgents.length})
                              </h4>

                              {fetchingAgents ? (
                                <div className="flex justify-center py-8">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                  >
                                    <Loader2 className="w-8 h-8 text-blue-500" />
                                  </motion.div>
                                </div>
                              ) : eligibleAgents.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                  <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                  <p className="text-slate-600">No available agents for this location</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {eligibleAgents.map((agent) => (
                                    <motion.div
                                      key={agent.agent_id}
                                      whileHover={{ scale: 1.01 }}
                                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all bg-white"
                                    >
                                      <div className="flex justify-between items-start gap-4">
                                        <div>
                                          <div className="flex items-center gap-2">
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
                                          
                                          <div className="flex flex-wrap gap-4 text-sm mt-2">
                                            <div className="flex items-center text-slate-600">
                                              <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                              <span>ZIP: {agent.servicing_zip}</span>
                                            </div>
                                            <div className="flex items-center text-slate-600">
                                              <span className="font-medium">
                                                Current assignments: {agent.assigned_sales_order_count}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleAssignAgent(agent.agent_id)}
                                          disabled={loading}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                                        >
                                          {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                          ) : (
                                            "Assign"
                                          )}
                                        </motion.button>
                                      </div>
                                    </motion.div>
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

export default AssignDeliveries;