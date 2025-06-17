// // // // import React, { useState, useEffect } from "react";
// // // // import { motion, AnimatePresence } from "framer-motion";
// // // // import { useNavigate } from "react-router-dom";
// // // // import {
// // // //   Truck,
// // // //   Package,
// // // //   MapPin,
// // // //   Calendar,
// // // //   User,
// // // //   Box,
// // // //   Home,
// // // //   Mail,
// // // //   ChevronDown,
// // // //   ChevronUp,
// // // //   Ruler,
// // // //   Loader2,
// // // //   RefreshCw,
// // // //   Search,
// // // //   AlertCircle,
// // // //   Route,
// // // //   Map
// // // // } from "lucide-react";
// // // // import RouteMap from "../../components/RouteMap";

// // // // interface Order {
// // // //   id: number;
// // // //   item_id: number;
// // // //   original_sales_order_number: string;
// // // //   original_sales_order_line: number;
// // // //   ordered_qty: number;
// // // //   serial_number: string;
// // // //   sscc_number: string;
// // // //   tag_number: string;
// // // //   vendor_item_number: string;
// // // //   shipped_from_warehouse: string;
// // // //   shipped_to_person: string;
// // // //   shipped_to_billing_address: string;
// // // //   account_number: string;
// // // //   customer_email: string;
// // // //   shipped_to_apt_number: string;
// // // //   shipped_to_street: string;
// // // //   shipped_to_city: string;
// // // //   shipped_to_zip: number;
// // // //   shipped_to_state: string;
// // // //   shipped_to_country: string;
// // // //   dimension_depth: number;
// // // //   dimension_length: number;
// // // //   dimension_breadth: number;
// // // //   dimension_weight: number;
// // // //   dimension_volume: number;
// // // //   dimension_size: string;
// // // //   date_purchased: string;
// // // //   date_shipped: string;
// // // //   date_delivered: string;
// // // //   delivery_agent_id: number;
// // // //   item?: {
// // // //     item_number: string;
// // // //     item_description: string;
// // // //     category: string;
// // // //     configuration: string;
// // // //   };
// // // //   return_specific?: {
// // // //     return_order_number: string;
// // // //     return_condition: string;
// // // //     return_carrier: string;
// // // //     return_destination: string;
// // // //     return_created_date: string;
// // // //     return_received_date: string;
// // // //   };
// // // // }

// // // // interface RouteResponse {
// // // //   ordered_addresses: string[];
// // // //   total_distance_km: number;
// // // //   total_duration_minutes: number;
// // // //   route_summary: string;
// // // // }

// // // // const ScheduledPickups: React.FC = () => {
// // // //   const [orders, setOrders] = useState<Order[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [sortBy, setSortBy] = useState<"date" | "city">("date");
// // // //   const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
// // // //   const [routeLoading, setRouteLoading] = useState(false);
// // // //   const [routeError, setRouteError] = useState<string | null>(null);
// // // //   const [addressMap, setAddressMap] = useState<Record<string, Order>>({});
// // // //   const navigate = useNavigate();

// // // //   const fetchOrders = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);
      
// // // //       const agentId = localStorage.getItem("agentId");
// // // //       if (!agentId) {
// // // //         throw new Error("Agent ID not found. Please log in again.");
// // // //       }
  
// // // //       const response = await fetch(`/api/agent/return-orders/${agentId}`);
  
// // // //       if (response.status === 404) {
// // // //         setOrders([]); 
// // // //         return;
// // // //       }
  
// // // //       if (!response.ok) {
// // // //         const message = await response.text();
// // // //         throw new Error(`Failed to fetch pickup orders: ${response.status} - ${message}`);
// // // //       }
  
// // // //       const data = await response.json();
// // // //       setOrders(data);
// // // //     } catch (err) {
// // // //       setError(err instanceof Error ? err.message : "Failed to fetch pickup orders");
// // // //     } finally {
// // // //       setLoading(false);
// // // //       setRefreshing(false);
// // // //     }
// // // //   };

// // // //   const fetchOptimizedRoute = async (addresses: string[]) => {
// // // //     try {
// // // //       setRouteLoading(true);
// // // //       setRouteError(null);
// // // //       setRouteInfo(null);
      
// // // //       const response = await fetch("/api/best-route", {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({ addresses }),
// // // //       });

// // // //       if (!response.ok) {
// // // //         const errorText = await response.text();
// // // //         throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
// // // //       }

// // // //       const data = await response.json();
// // // //       setRouteInfo(data);
// // // //     } catch (err) {
// // // //       setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
// // // //     } finally {
// // // //       setRouteLoading(false);
// // // //     }
// // // //   };

// // // //   const handleRefresh = () => {
// // // //     setRefreshing(true);
// // // //     fetchOrders();
// // // //   };

// // // //   const handleOptimizeRoute = () => {
// // // //     if (orders.length < 2) {
// // // //       setRouteError("At least 2 pickups are required to optimize route");
// // // //       return;
// // // //     }

// // // //     const validOrders = orders.filter(order =>
// // // //       order.shipped_to_street &&
// // // //       order.shipped_to_city &&
// // // //       order.shipped_to_state &&
// // // //       order.shipped_to_zip &&
// // // //       order.shipped_to_country
// // // //     );
    
// // // //     const addresses = validOrders.map(order => {
// // // //       const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
// // // //       addressMap[fullAddress.toLowerCase()] = order;
// // // //       return fullAddress;
// // // //     });

// // // //     setAddressMap(addressMap);
// // // //     fetchOptimizedRoute(addresses);
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchOrders();
// // // //   }, []);

// // // //   const toggleOrderExpansion = (orderId: number) => {
// // // //     setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
// // // //   };

// // // //   const formatDate = (dateString: string) => {
// // // //     if (!dateString) return "-";
// // // //     return new Date(dateString).toLocaleDateString('en-US', {
// // // //       year: 'numeric',
// // // //       month: 'short',
// // // //       day: 'numeric'
// // // //     });
// // // //   };

// // // //   const filteredOrders = orders
// // // //   .filter((order) => {
// // // //     return (
// // // //       searchTerm.toLowerCase() === "" ||
// // // //       order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
// // // //     );
// // // //   })
// // // //   .sort((a, b) => {
// // // //     if (sortBy === "date") {
// // // //       return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
// // // //     }
// // // //     return 0;
// // // //   });

// // // //   if (loading && orders.length === 0) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
// // // //         <motion.div
// // // //           animate={{ rotate: 360 }}
// // // //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// // // //           className="text-blue-600"
// // // //         >
// // // //           <Loader2 className="w-12 h-12" />
// // // //         </motion.div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
// // // //       <div className="max-w-7xl mx-auto">
// // // //         <motion.div
// // // //           initial={{ opacity: 0, y: 20 }}
// // // //           animate={{ opacity: 1, y: 0 }}
// // // //           className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
// // // //         >
// // // //           <div className="p-8">
// // // //             {/* Header Section */}
// // // //             <div className="text-center mb-12">
// // // //               <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
// // // //                 <Truck className="w-10 h-10 text-blue-600" />
// // // //               </div>
// // // //               <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
// // // //                 Scheduled Pickups
// // // //               </h1>
// // // //               <p className="text-xl text-slate-600 max-w-2xl mx-auto">
// // // //                 View and manage your pickup assignments
// // // //               </p>
// // // //             </div>

// // // //             <AnimatePresence>
// // // //               {error && (
// // // //                 <motion.div
// // // //                   initial={{ opacity: 0, y: -20 }}
// // // //                   animate={{ opacity: 1, y: 0 }}
// // // //                   exit={{ opacity: 0, y: -20 }}
// // // //                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// // // //                 >
// // // //                   <AlertCircle className="w-5 h-5" />
// // // //                   <span className="font-medium">{error}</span>
// // // //                 </motion.div>
// // // //               )}
// // // //             </AnimatePresence>

// // // //             {/* Route Optimization Section */}
// // // //             <div className="mb-6 flex justify-end">
// // // //               <motion.button
// // // //                 whileHover={{ scale: 1.05 }}
// // // //                 whileTap={{ scale: 0.95 }}
// // // //                 onClick={handleOptimizeRoute}
// // // //                 disabled={routeLoading || orders.length < 2}
// // // //                 className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
// // // //                   orders.length < 2 
// // // //                     ? "bg-slate-200 text-slate-500 cursor-not-allowed"
// // // //                     : "bg-blue-600 text-white hover:bg-blue-700"
// // // //                 }`}
// // // //               >
// // // //                 {routeLoading ? (
// // // //                   <Loader2 className="w-5 h-5 animate-spin" />
// // // //                 ) : (
// // // //                   <Route className="w-5 h-5" />
// // // //                 )}
// // // //                 Optimize Pickup Route
// // // //               </motion.button>
// // // //             </div>

// // // //             {/* Optimized Route Display */}
// // // //             {routeInfo && (
// // // //               <motion.div
// // // //                 initial={{ opacity: 0, height: 0 }}
// // // //                 animate={{ opacity: 1, height: "auto" }}
// // // //                 exit={{ opacity: 0, height: 0 }}
// // // //                 className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
// // // //               >
// // // //                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
// // // //                   <div className="flex items-center gap-3">
// // // //                     <Map className="w-5 h-5 text-blue-600" />
// // // //                     <h3 className="font-medium text-slate-900">Optimized Pickup Route</h3>
// // // //                   </div>
// // // //                   <button 
// // // //                     onClick={() => setRouteInfo(null)}
// // // //                     className="text-slate-400 hover:text-slate-500 transition-colors"
// // // //                     aria-label="Close route information"
// // // //                   >
// // // //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// // // //                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// // // //                     </svg>
// // // //                   </button>
// // // //                 </div>
                
// // // //                 <div className="p-6">
// // // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
// // // //                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
// // // //                       <div className="flex items-center gap-3 mb-2">
// // // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
// // // //                           <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
// // // //                         </svg>
// // // //                         <h4 className="font-medium text-slate-700">Route Summary</h4>
// // // //                       </div>
// // // //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.route_summary || "Standard route"}</p>
// // // //                     </div>

// // // //                     {routeInfo?.ordered_addresses?.length >= 2 && (
// // // //                       <div className="mt-6 rounded-xl overflow-hidden border border-slate-200">
// // // //                         <RouteMap addresses={routeInfo.ordered_addresses} />
// // // //                       </div>
// // // //                     )}

// // // //                     <div className="bg-green-50 p-4 rounded-lg border border-green-100">
// // // //                       <div className="flex items-center gap-3 mb-2">
// // // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
// // // //                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
// // // //                         </svg>
// // // //                         <h4 className="font-medium text-slate-700">Total Distance</h4>
// // // //                       </div>
// // // //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.total_distance_km} km</p>
// // // //                     </div>

// // // //                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
// // // //                       <div className="flex items-center gap-3 mb-2">
// // // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
// // // //                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
// // // //                         </svg>
// // // //                         <h4 className="font-medium text-slate-700">Estimated Time</h4>
// // // //                       </div>
// // // //                       <p className="text-lg font-semibold text-slate-900">
// // // //                         {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>

// // // //                   <div className="border-t border-slate-200 pt-4">
// // // //                     <h4 className="text-sm font-medium text-slate-700 mb-4">Pickup Sequence</h4>
// // // //                     <div className="space-y-3">
// // // //                       {routeInfo.ordered_addresses.map((address, index) => {
// // // //                         const normalizedAddress = address.toLowerCase().trim();
// // // //                         const matchedOrder = Object.entries(addressMap).find(([key]) =>
// // // //                           normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
// // // //                         );
// // // //                         const order = matchedOrder ? matchedOrder[1] : undefined;

// // // //                         return (
// // // //                           <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
// // // //                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
// // // //                               {index + 1}
// // // //                             </div>
// // // //                             <div className="flex-1 min-w-0">
// // // //                               <p className="text-sm font-medium text-slate-900 truncate">
// // // //                                 {order?.shipped_to_person || "Unknown Recipient"}
// // // //                               </p>
// // // //                               <p className="text-xs text-slate-500 truncate">{address}</p>
// // // //                               {order && (
// // // //                                 <div className="mt-1">
// // // //                                   <span className="text-xs text-slate-500">
// // // //                                     Order: {order.original_sales_order_number}
// // // //                                   </span>
// // // //                                 </div>
// // // //                               )}
// // // //                             </div>
// // // //                           </div>
// // // //                         );
// // // //                       })}
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </motion.div>
// // // //             )}

// // // //             {routeError && (
// // // //               <motion.div
// // // //                 initial={{ opacity: 0, y: -20 }}
// // // //                 animate={{ opacity: 1, y: 0 }}
// // // //                 exit={{ opacity: 0, y: -20 }}
// // // //                 className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// // // //               >
// // // //                 <AlertCircle className="w-5 h-5" />
// // // //                 <span className="font-medium">{routeError}</span>
// // // //               </motion.div>
// // // //             )}

// // // //             <div className="mb-6 flex flex-col sm:flex-row gap-4">
// // // //               <div className="relative flex-grow">
// // // //                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="Search pickups by description, number, or city..."
// // // //                   value={searchTerm}
// // // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // // //                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 />
// // // //               </div>
              
// // // //               <div className="flex gap-3">
// // // //                 <select
// // // //                   value={sortBy}
// // // //                   onChange={(e) => setSortBy(e.target.value as "date" | "city")}
// // // //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// // // //                 >
// // // //                   <option value="date">Sort by Date</option>
// // // //                   <option value="city">Sort by City</option>
// // // //                 </select>

// // // //                 <motion.button
// // // //                   whileHover={{ scale: 1.05 }}
// // // //                   whileTap={{ scale: 0.95 }}
// // // //                   onClick={handleRefresh}
// // // //                   disabled={refreshing}
// // // //                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
// // // //                 >
// // // //                   <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
// // // //                   Refresh
// // // //                 </motion.button>
// // // //               </div>
// // // //             </div>

// // // //             {filteredOrders.length === 0 ? (
// // // //               <motion.div
// // // //                 initial={{ opacity: 0 }}
// // // //                 animate={{ opacity: 1 }}
// // // //                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
// // // //               >
// // // //                 <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
// // // //                 <h3 className="text-lg font-semibold text-slate-700">
// // // //                   {orders.length === 0
// // // //                     ? "No pickup assignments yet"
// // // //                     : "No matching pickups found"}
// // // //                 </h3>
// // // //                 <p className="text-slate-500 mt-2">
// // // //                   {orders.length === 0
// // // //                     ? "You currently have no scheduled return pickups. Check back later."
// // // //                     : "Try updating your search."}
// // // //                 </p>
// // // //               </motion.div>
// // // //             ) : (
// // // //               <div className="space-y-4">
// // // //                   {filteredOrders
// // // //                     .filter(order => order.item_id && order.shipped_to_person)
// // // //                     .map((order) => (
// // // //                   <motion.div
// // // //                     key={order.id}
// // // //                     initial={{ opacity: 0, y: 10 }}
// // // //                     animate={{ opacity: 1, y: 0 }}
// // // //                     transition={{ duration: 0.2 }}
// // // //                     className={`border rounded-xl overflow-hidden transition-all ${
// // // //                       expandedOrderId === order.id
// // // //                         ? "border-blue-300 shadow-md bg-blue-50"
// // // //                         : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
// // // //                     }`}
// // // //                   >
// // // //                     <div 
// // // //                       className="p-6 cursor-pointer"
// // // //                       onClick={() => toggleOrderExpansion(order.id)}
// // // //                     >
// // // //                       <div className="flex justify-between items-center">
// // // //                         <div className="flex items-center gap-4">
// // // //                           <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
// // // //                             <Package className="w-6 h-6" />
// // // //                           </div>
// // // //                           <div>
// // // //                             <h3 className="font-medium text-slate-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
// // // //                             <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// // // //                               <MapPin className="w-4 h-4" />
// // // //                               {order.shipped_to_city}, {order.shipped_to_state}
// // // //                             </p>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="flex items-center gap-4">
// // // //                           <div className="text-sm font-medium text-slate-600">
// // // //                             {order.original_sales_order_number}
// // // //                           </div>
// // // //                           {expandedOrderId === order.id ? (
// // // //                             <ChevronUp className="w-5 h-5 text-slate-500" />
// // // //                           ) : (
// // // //                             <ChevronDown className="w-5 h-5 text-slate-500" />
// // // //                           )}
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>

// // // //                     <AnimatePresence>
// // // //                       {expandedOrderId === order.id && (
// // // //                         <motion.div
// // // //                           initial={{ opacity: 0, height: 0 }}
// // // //                           animate={{ opacity: 1, height: "auto" }}
// // // //                           exit={{ opacity: 0, height: 0 }}
// // // //                           transition={{ duration: 0.3 }}
// // // //                           className="border-t border-slate-100"
// // // //                         >
// // // //                           <div className="p-6 space-y-6">
// // // //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //                               {/* Order Information */}
// // // //                               <div className="space-y-6">
// // // //                                 <div>
// // // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // // //                                     <Package className="w-4 h-4 text-blue-500" />
// // // //                                     Order Information
// // // //                                   </h4>
// // // //                                   <div className="grid grid-cols-2 gap-4">
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Order Number</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_number || "-"}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Line Number</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_line || "-"}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Serial Number</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.serial_number || "-"}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">SSCC Number</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.sscc_number || "-"}</p>
// // // //                                     </div>
// // // //                                     {order.return_specific?.return_order_number && (
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Return Order Number</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">
// // // //                                           {order.return_specific.return_order_number}
// // // //                                         </p>
// // // //                                       </div>
// // // //                                     )}
// // // //                                   </div>
// // // //                                 </div>

// // // //                                 {/* Shipping Details */}
// // // //                                 <div>
// // // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // // //                                     <MapPin className="w-4 h-4 text-blue-500" />
// // // //                                     Shipping Details
// // // //                                   </h4>
// // // //                                   <div className="space-y-3">
// // // //                                     <div className="flex items-start gap-3">
// // // //                                       <Home className="w-5 h-5 text-blue-400 mt-0.5" />
// // // //                                       <div>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_street || "Address not specified"}</p>
// // // //                                         {order.shipped_to_apt_number && (
// // // //                                           <p className="text-xs text-slate-500">Apt: {order.shipped_to_apt_number}</p>
// // // //                                         )}
// // // //                                         <p className="text-sm text-slate-600">
// // // //                                           {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
// // // //                                         </p>
// // // //                                         <p className="text-xs text-slate-500">{order.shipped_to_country}</p>
// // // //                                       </div>
// // // //                                     </div>
// // // //                                     <div className="flex items-center gap-3">
// // // //                                       <User className="w-5 h-5 text-blue-400" />
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Recipient</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_person || "-"}</p>
// // // //                                       </div>
// // // //                                     </div>
// // // //                                     <div className="flex items-center gap-3">
// // // //                                       <Mail className="w-5 h-5 text-blue-400" />
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Email</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.customer_email || "-"}</p>
// // // //                                       </div>
// // // //                                     </div>
// // // //                                   </div>
// // // //                                 </div>
// // // //                               </div>

// // // //                               {/* Item Details */}
// // // //                               <div className="space-y-6">
// // // //                                 {order.item && (
// // // //                                   <div>
// // // //                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // // //                                       <Box className="w-4 h-4 text-blue-500" />
// // // //                                       Item Details
// // // //                                     </h4>
// // // //                                     <div className="grid grid-cols-2 gap-4">
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Item Number</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_number || "-"}</p>
// // // //                                       </div>
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Description</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_description || "-"}</p>
// // // //                                       </div>
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Category</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.item.category || "-"}</p>
// // // //                                       </div>
// // // //                                       <div>
// // // //                                         <p className="text-xs text-slate-500">Configuration</p>
// // // //                                         <p className="text-sm font-medium text-slate-800">{order.item.configuration || "-"}</p>
// // // //                                       </div>
// // // //                                     </div>
// // // //                                   </div>
// // // //                                 )}

// // // //                                 {/* Dimensions */}
// // // //                                 <div>
// // // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // // //                                     <Ruler className="w-4 h-4 text-blue-500" />
// // // //                                     Dimensions
// // // //                                   </h4>
// // // //                                   <div className="grid grid-cols-2 gap-4">
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Size</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.dimension_size || "-"}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Weight</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">
// // // //                                         {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
// // // //                                       </p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Volume</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">
// // // //                                         {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
// // // //                                       </p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Dimensions (L×W×H)</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">
// // // //                                         {order.dimension_length && order.dimension_breadth && order.dimension_depth
// // // //                                           ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
// // // //                                           : "-"}
// // // //                                       </p>
// // // //                                     </div>
// // // //                                   </div>
// // // //                                 </div>

// // // //                                 {/* Dates */}
// // // //                                 <div>
// // // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // // //                                     <Calendar className="w-4 h-4 text-blue-500" />
// // // //                                     Timeline
// // // //                                   </h4>
// // // //                                   <div className="grid grid-cols-2 gap-4">
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Purchased</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_purchased)}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Shipped</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_shipped)}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Delivered</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_delivered)}</p>
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className="text-xs text-slate-500">Quantity</p>
// // // //                                       <p className="text-sm font-medium text-slate-800">{order.ordered_qty}</p>
// // // //                                     </div>
// // // //                                   </div>
// // // //                                 </div>
// // // //                               </div>
// // // //                             </div>
// // // //                             <div className="pt-4 flex justify-end">
// // // //                             <motion.button
// // // //                               whileHover={{ scale: 1.05 }}
// // // //                               whileTap={{ scale: 0.95 }}
// // // //                               onClick={() => {
// // // //                                 if (order.return_specific?.return_order_number) {
// // // //                                   const returnOrder = order.return_specific.return_order_number;

// // // //                                   navigate(`/option/manual/${returnOrder}`);
// // // //                                 }
// // // //                               }}
// // // //                               className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
// // // //                             >
// // // //                               Start Inspection
// // // //                             </motion.button>
// // // //                             </div>
// // // //                           </div>
// // // //                         </motion.div>
// // // //                       )}
// // // //                     </AnimatePresence>
// // // //                   </motion.div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </motion.div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ScheduledPickups;



// // // import React, { useState, useEffect } from "react";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //   Truck,
// // //   Package,
// // //   MapPin,
// // //   Calendar,
// // //   User,
// // //   Box,
// // //   Home,
// // //   Mail,
// // //   ChevronDown,
// // //   ChevronUp,
// // //   Ruler,
// // //   Loader2,
// // //   RefreshCw,
// // //   Search,
// // //   AlertCircle,
// // //   Route,
// // //   Map
// // // } from "lucide-react";
// // // import RouteMap from "../../components/RouteMap";

// // // interface Order {
// // //   id: number;
// // //   item_id: number;
// // //   original_sales_order_number: string;
// // //   original_sales_order_line: number;
// // //   ordered_qty: number;
// // //   serial_number: string;
// // //   sscc_number: string;
// // //   tag_number: string;
// // //   vendor_item_number: string;
// // //   shipped_from_warehouse: string;
// // //   shipped_to_person: string;
// // //   shipped_to_billing_address: string;
// // //   account_number: string;
// // //   customer_email: string;
// // //   shipped_to_apt_number: string;
// // //   shipped_to_street: string;
// // //   shipped_to_city: string;
// // //   shipped_to_zip: number;
// // //   shipped_to_state: string;
// // //   shipped_to_country: string;
// // //   dimension_depth: number;
// // //   dimension_length: number;
// // //   dimension_breadth: number;
// // //   dimension_weight: number;
// // //   dimension_volume: number;
// // //   dimension_size: string;
// // //   date_purchased: string;
// // //   date_shipped: string;
// // //   date_delivered: string;
// // //   delivery_agent_id: number;
// // //   item?: {
// // //     item_number: string;
// // //     item_description: string;
// // //     category: string;
// // //     configuration: string;
// // //   };
// // //   return_specific?: {
// // //     return_order_number: string;
// // //     return_condition: string;
// // //     return_carrier: string;
// // //     return_destination: string;
// // //     return_created_date: string;
// // //     return_received_date: string;
// // //   };
// // // }

// // // interface RouteResponse {
// // //   ordered_addresses: string[];
// // //   total_distance_km: number;
// // //   total_duration_minutes: number;
// // //   route_summary: string;
// // // }

// // // const ScheduledPickups: React.FC = () => {
// // //   const [orders, setOrders] = useState<Order[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [sortBy, setSortBy] = useState<"date" | "city">("date");
// // //   const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
// // //   const [routeLoading, setRouteLoading] = useState(false);
// // //   const [routeError, setRouteError] = useState<string | null>(null);
// // //   const [addressMap, setAddressMap] = useState<Record<string, Order>>({});
// // //   const navigate = useNavigate();

// // //   const fetchOrders = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
      
// // //       const agentId = localStorage.getItem("agentId");
// // //       if (!agentId) {
// // //         throw new Error("Agent ID not found. Please log in again.");
// // //       }
  
// // //       const response = await fetch(`/api/agent/return-orders/${agentId}`);
  
// // //       if (response.status === 404) {
// // //         setOrders([]); 
// // //         return;
// // //       }
  
// // //       if (!response.ok) {
// // //         const message = await response.text();
// // //         throw new Error(`Failed to fetch pickup orders: ${response.status} - ${message}`);
// // //       }
  
// // //       const data = await response.json();
// // //       setOrders(data);
// // //     } catch (err) {
// // //       setError(err instanceof Error ? err.message : "Failed to fetch pickup orders");
// // //     } finally {
// // //       setLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   };

  
// // //   const fetchOptimizedRoute = async (
// // //     userLocation: string,
// // //     addresses: string[],
// // //     mode: "FIFO" | "LIFO"
// // //   ) => {
// // //     try {
// // //       setRouteLoading(true);
// // //       setRouteError(null);
// // //       setRouteInfo(null);
  
// // //       const response = await fetch("/api/best-route", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           user_location: userLocation,
// // //           addresses: addresses,
// // //           route_mode: mode,
// // //         }),
// // //       });
  
// // //       if (!response.ok) {
// // //         const errorText = await response.text();
// // //         throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
// // //       }
  
// // //       const data = await response.json();
// // //       setRouteInfo(data);
// // //     } catch (err) {
// // //       console.error("Route optimization failed:", err);
// // //       setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
// // //     } finally {
// // //       setRouteLoading(false);
// // //     }
// // //   };
  
  

// // //   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
// // //     const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
// // //     const response = await fetch(
// // //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
// // //     );
// // //     const data = await response.json();
// // //     if (data.status === "OK" && data.results.length > 0) {
// // //       return data.results[0].formatted_address;
// // //     } else {
// // //       throw new Error("Failed to get address from coordinates.");
// // //     }
// // //   };
  
// // //   const openGoogleMapsNavigation = (destination: string) => {
// // //     const encodedDestination = encodeURIComponent(destination);
// // //     const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
// // //     window.open(url, "_blank");
// // //   };
  

// // //   const handleRefresh = () => {
// // //     setRefreshing(true);
// // //     fetchOrders();
// // //   };

// // //   const handleOptimizeRoute = async () => {
// // //     if (!navigator.geolocation) {
// // //       setRouteError("Geolocation is not supported by your browser.");
// // //       return;
// // //     }
  
// // //     navigator.geolocation.getCurrentPosition(
// // //       async (position) => {
// // //         try {
// // //           const lat = position.coords.latitude;
// // //           const lng = position.coords.longitude;
  
// // //           const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
// // //           const geocodeRes = await fetch(
// // //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
// // //           );
// // //           const geocodeData = await geocodeRes.json();
  
// // //           if (
// // //             geocodeData.status !== "OK" ||
// // //             !geocodeData.results ||
// // //             geocodeData.results.length === 0
// // //           ) {
// // //             throw new Error("Could not get address from coordinates.");
// // //           }
  
// // //           const userLocation = geocodeData.results[0].formatted_address;
  
// // //           const routeMode = window.confirm(
// // //             "Start at your current location? Click OK for FIFO (start at you), Cancel for LIFO (end at you)"
// // //           )
// // //             ? "FIFO"
// // //             : "LIFO";
  
// // //           const validOrders = orders.filter(order =>
// // //             order.shipped_to_street &&
// // //             order.shipped_to_city &&
// // //             order.shipped_to_state &&
// // //             order.shipped_to_zip &&
// // //             order.shipped_to_country
// // //           );
  
// // //           const addresses: string[] = validOrders.map(order => {
// // //             const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
// // //             addressMap[fullAddress.toLowerCase()] = order;
// // //             return fullAddress;
// // //           });
  
// // //           setAddressMap(addressMap);
// // //           await fetchOptimizedRoute(userLocation, addresses, routeMode);
// // //         } catch (err) {
// // //           console.error(err);
// // //           setRouteError("Failed to determine your location.");
// // //         }
// // //       },
// // //       (err) => {
// // //         console.error("Geolocation error:", err);
// // //         setRouteError("Location access denied. Please allow it and try again.");
// // //       }
// // //     );
// // //   };
  
  

// // //   useEffect(() => {
// // //     fetchOrders();
// // //   }, []);

// // //   const toggleOrderExpansion = (orderId: number) => {
// // //     setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
// // //   };

// // //   const formatDate = (dateString: string) => {
// // //     if (!dateString) return "-";
// // //     return new Date(dateString).toLocaleDateString('en-US', {
// // //       year: 'numeric',
// // //       month: 'short',
// // //       day: 'numeric'
// // //     });
// // //   };

// // //   const filteredOrders = orders
// // //   .filter((order) => {
// // //     return (
// // //       searchTerm.toLowerCase() === "" ||
// // //       order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
// // //     );
// // //   })
// // //   .sort((a, b) => {
// // //     if (sortBy === "date") {
// // //       return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
// // //     }
// // //     return 0;
// // //   });

// // //   if (loading && orders.length === 0) {
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
// // //             {/* Header Section */}
// // //             <div className="text-center mb-12">
// // //               <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
// // //                 <Truck className="w-10 h-10 text-blue-600" />
// // //               </div>
// // //               <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
// // //                 Scheduled Pickups
// // //               </h1>
// // //               <p className="text-xl text-slate-600 max-w-2xl mx-auto">
// // //                 View and manage your pickup assignments
// // //               </p>
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
// // //             </AnimatePresence>

// // //             {/* Route Optimization Section */}
// // //             <div className="mb-6 flex justify-end">
// // //               <motion.button
// // //                 whileHover={{ scale: 1.05 }}
// // //                 whileTap={{ scale: 0.95 }}
// // //                 onClick={handleOptimizeRoute}
// // //                 disabled={routeLoading || orders.length < 2}
// // //                 className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
// // //                   orders.length < 2 
// // //                     ? "bg-slate-200 text-slate-500 cursor-not-allowed"
// // //                     : "bg-blue-600 text-white hover:bg-blue-700"
// // //                 }`}
// // //               >
// // //                 {routeLoading ? (
// // //                   <Loader2 className="w-5 h-5 animate-spin" />
// // //                 ) : (
// // //                   <Route className="w-5 h-5" />
// // //                 )}
// // //                 Optimize Pickup Route
// // //               </motion.button>
// // //             </div>

// // //             {/* Optimized Route Display */}
// // //             {routeInfo && (
// // //               <motion.div
// // //                 initial={{ opacity: 0, height: 0 }}
// // //                 animate={{ opacity: 1, height: "auto" }}
// // //                 exit={{ opacity: 0, height: 0 }}
// // //                 className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
// // //               >
// // //                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
// // //                   <div className="flex items-center gap-3">
// // //                     <Map className="w-5 h-5 text-blue-600" />
// // //                     <h3 className="font-medium text-slate-900">Optimized Pickup Route</h3>
// // //                   </div>
// // //                   <button 
// // //                     onClick={() => setRouteInfo(null)}
// // //                     className="text-slate-400 hover:text-slate-500 transition-colors"
// // //                     aria-label="Close route information"
// // //                   >
// // //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// // //                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// // //                     </svg>
// // //                   </button>
// // //                 </div>
                
// // //                 <div className="p-6">
// // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
// // //                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
// // //                       <div className="flex items-center gap-3 mb-2">
// // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
// // //                           <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
// // //                         </svg>
// // //                         <h4 className="font-medium text-slate-700">Route Summary</h4>
// // //                       </div>
// // //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.route_summary || "Standard route"}</p>
// // //                     </div>

// // //                     {routeInfo?.ordered_addresses?.length >= 2 && (
// // //                       <div className="mt-6 rounded-xl overflow-hidden border border-slate-200">
// // //                         <RouteMap addresses={routeInfo.ordered_addresses} />
// // //                       </div>
// // //                     )}

// // //                     <div className="bg-green-50 p-4 rounded-lg border border-green-100">
// // //                       <div className="flex items-center gap-3 mb-2">
// // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
// // //                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
// // //                         </svg>
// // //                         <h4 className="font-medium text-slate-700">Total Distance</h4>
// // //                       </div>
// // //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.total_distance_km} km</p>
// // //                     </div>

// // //                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
// // //                       <div className="flex items-center gap-3 mb-2">
// // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
// // //                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
// // //                         </svg>
// // //                         <h4 className="font-medium text-slate-700">Estimated Time</h4>
// // //                       </div>
// // //                       <p className="text-lg font-semibold text-slate-900">
// // //                         {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
// // //                       </p>
// // //                     </div>
// // //                   </div>

// // //                   {routeInfo?.ordered_addresses?.[1] && (
// // //                 <div className="mb-6 flex justify-start">
// // //                   <motion.button
// // //                     whileHover={{ scale: 1.05 }}
// // //                     whileTap={{ scale: 0.95 }}
// // //                     onClick={() => openGoogleMapsNavigation(routeInfo.ordered_addresses[1])}
// // //                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
// // //                   >
// // //                     <MapPin className="w-4 h-4" />
// // //                     Start Navigation to First Stop
// // //                   </motion.button>
// // //                 </div>
// // //               )}

// // //                   <div className="border-t border-slate-200 pt-4">
// // //                     <h4 className="text-sm font-medium text-slate-700 mb-4">Pickup Sequence</h4>
// // //                     <div className="space-y-3">
// // //                       {routeInfo.ordered_addresses.map((address, index) => {
// // //                         const normalizedAddress = address.toLowerCase().trim();
// // //                         const matchedOrder = Object.entries(addressMap).find(([key]) =>
// // //                           normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
// // //                         );
// // //                         const order = matchedOrder ? matchedOrder[1] : undefined;

// // //                         return (
// // //                           <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
// // //                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
// // //                               {index + 1}
// // //                             </div>
// // //                             <div className="flex-1 min-w-0">
// // //                               <p className="text-sm font-medium text-slate-900 truncate">
// // //                                 {order?.shipped_to_person || "Unknown Recipient"}
// // //                               </p>
// // //                               <p className="text-xs text-slate-500 truncate">{address}</p>
// // //                               {order && (
// // //                                 <div className="mt-1">
// // //                                   <span className="text-xs text-slate-500">
// // //                                     Order: {order.original_sales_order_number}
// // //                                   </span>
// // //                                 </div>
// // //                               )}
// // //                             </div>
// // //                           </div>
// // //                         );
// // //                       })}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </motion.div>
// // //             )}

// // //             {routeError && (
// // //               <motion.div
// // //                 initial={{ opacity: 0, y: -20 }}
// // //                 animate={{ opacity: 1, y: 0 }}
// // //                 exit={{ opacity: 0, y: -20 }}
// // //                 className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// // //               >
// // //                 <AlertCircle className="w-5 h-5" />
// // //                 <span className="font-medium">{routeError}</span>
// // //               </motion.div>
// // //             )}

// // //             <div className="mb-6 flex flex-col sm:flex-row gap-4">
// // //               <div className="relative flex-grow">
// // //                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Search pickups by description, number, or city..."
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                 />
// // //               </div>
              
// // //               <div className="flex gap-3">
// // //                 <select
// // //                   value={sortBy}
// // //                   onChange={(e) => setSortBy(e.target.value as "date" | "city")}
// // //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// // //                 >
// // //                   <option value="date">Sort by Date</option>
// // //                   <option value="city">Sort by City</option>
// // //                 </select>

// // //                 <motion.button
// // //                   whileHover={{ scale: 1.05 }}
// // //                   whileTap={{ scale: 0.95 }}
// // //                   onClick={handleRefresh}
// // //                   disabled={refreshing}
// // //                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
// // //                 >
// // //                   <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
// // //                   Refresh
// // //                 </motion.button>
// // //               </div>
// // //             </div>

// // //             {filteredOrders.length === 0 ? (
// // //               <motion.div
// // //                 initial={{ opacity: 0 }}
// // //                 animate={{ opacity: 1 }}
// // //                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
// // //               >
// // //                 <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
// // //                 <h3 className="text-lg font-semibold text-slate-700">
// // //                   {orders.length === 0
// // //                     ? "No pickup assignments yet"
// // //                     : "No matching pickups found"}
// // //                 </h3>
// // //                 <p className="text-slate-500 mt-2">
// // //                   {orders.length === 0
// // //                     ? "You currently have no scheduled return pickups. Check back later."
// // //                     : "Try updating your search."}
// // //                 </p>
// // //               </motion.div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                   {filteredOrders
// // //                     .filter(order => order.item_id && order.shipped_to_person)
// // //                     .map((order) => (
// // //                   <motion.div
// // //                     key={order.id}
// // //                     initial={{ opacity: 0, y: 10 }}
// // //                     animate={{ opacity: 1, y: 0 }}
// // //                     transition={{ duration: 0.2 }}
// // //                     className={`border rounded-xl overflow-hidden transition-all ${
// // //                       expandedOrderId === order.id
// // //                         ? "border-blue-300 shadow-md bg-blue-50"
// // //                         : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
// // //                     }`}
// // //                   >
// // //                     <div 
// // //                       className="p-6 cursor-pointer"
// // //                       onClick={() => toggleOrderExpansion(order.id)}
// // //                     >
// // //                       <div className="flex justify-between items-center">
// // //                         <div className="flex items-center gap-4">
// // //                           <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
// // //                             <Package className="w-6 h-6" />
// // //                           </div>
// // //                           <div>
// // //                             <h3 className="font-medium text-slate-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
// // //                             <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// // //                               <MapPin className="w-4 h-4" />
// // //                               {order.shipped_to_city}, {order.shipped_to_state}
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                         <div className="flex items-center gap-4">
// // //                           <div className="text-sm font-medium text-slate-600">
// // //                             {order.original_sales_order_number}
// // //                           </div>
// // //                           {expandedOrderId === order.id ? (
// // //                             <ChevronUp className="w-5 h-5 text-slate-500" />
// // //                           ) : (
// // //                             <ChevronDown className="w-5 h-5 text-slate-500" />
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <AnimatePresence>
// // //                       {expandedOrderId === order.id && (
// // //                         <motion.div
// // //                           initial={{ opacity: 0, height: 0 }}
// // //                           animate={{ opacity: 1, height: "auto" }}
// // //                           exit={{ opacity: 0, height: 0 }}
// // //                           transition={{ duration: 0.3 }}
// // //                           className="border-t border-slate-100"
// // //                         >
// // //                           <div className="p-6 space-y-6">
// // //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                               {/* Order Information */}
// // //                               <div className="space-y-6">
// // //                                 <div>
// // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // //                                     <Package className="w-4 h-4 text-blue-500" />
// // //                                     Order Information
// // //                                   </h4>
// // //                                   <div className="grid grid-cols-2 gap-4">
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Order Number</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_number || "-"}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Line Number</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_line || "-"}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Serial Number</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.serial_number || "-"}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">SSCC Number</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.sscc_number || "-"}</p>
// // //                                     </div>
// // //                                     {order.return_specific?.return_order_number && (
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Return Order Number</p>
// // //                                         <p className="text-sm font-medium text-slate-800">
// // //                                           {order.return_specific.return_order_number}
// // //                                         </p>
// // //                                       </div>
// // //                                     )}
// // //                                   </div>
// // //                                 </div>

// // //                                 {/* Shipping Details */}
// // //                                 <div>
// // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // //                                     <MapPin className="w-4 h-4 text-blue-500" />
// // //                                     Shipping Details
// // //                                   </h4>
// // //                                   <div className="space-y-3">
// // //                                     <div className="flex items-start gap-3">
// // //                                       <Home className="w-5 h-5 text-blue-400 mt-0.5" />
// // //                                       <div>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_street || "Address not specified"}</p>
// // //                                         {order.shipped_to_apt_number && (
// // //                                           <p className="text-xs text-slate-500">Apt: {order.shipped_to_apt_number}</p>
// // //                                         )}
// // //                                         <p className="text-sm text-slate-600">
// // //                                           {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
// // //                                         </p>
// // //                                         <p className="text-xs text-slate-500">{order.shipped_to_country}</p>
// // //                                       </div>
// // //                                     </div>
// // //                                     <div className="flex items-center gap-3">
// // //                                       <User className="w-5 h-5 text-blue-400" />
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Recipient</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_person || "-"}</p>
// // //                                       </div>
// // //                                     </div>
// // //                                     <div className="flex items-center gap-3">
// // //                                       <Mail className="w-5 h-5 text-blue-400" />
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Email</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.customer_email || "-"}</p>
// // //                                       </div>
// // //                                     </div>
// // //                                   </div>
// // //                                 </div>
// // //                               </div>

// // //                               {/* Item Details */}
// // //                               <div className="space-y-6">
// // //                                 {order.item && (
// // //                                   <div>
// // //                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // //                                       <Box className="w-4 h-4 text-blue-500" />
// // //                                       Item Details
// // //                                     </h4>
// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Item Number</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_number || "-"}</p>
// // //                                       </div>
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Description</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_description || "-"}</p>
// // //                                       </div>
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Category</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.item.category || "-"}</p>
// // //                                       </div>
// // //                                       <div>
// // //                                         <p className="text-xs text-slate-500">Configuration</p>
// // //                                         <p className="text-sm font-medium text-slate-800">{order.item.configuration || "-"}</p>
// // //                                       </div>
// // //                                     </div>
// // //                                   </div>
// // //                                 )}

// // //                                 {/* Dimensions */}
// // //                                 <div>
// // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // //                                     <Ruler className="w-4 h-4 text-blue-500" />
// // //                                     Dimensions
// // //                                   </h4>
// // //                                   <div className="grid grid-cols-2 gap-4">
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Size</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.dimension_size || "-"}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Weight</p>
// // //                                       <p className="text-sm font-medium text-slate-800">
// // //                                         {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
// // //                                       </p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Volume</p>
// // //                                       <p className="text-sm font-medium text-slate-800">
// // //                                         {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
// // //                                       </p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Dimensions (L×W×H)</p>
// // //                                       <p className="text-sm font-medium text-slate-800">
// // //                                         {order.dimension_length && order.dimension_breadth && order.dimension_depth
// // //                                           ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
// // //                                           : "-"}
// // //                                       </p>
// // //                                     </div>
// // //                                   </div>
// // //                                 </div>

// // //                                 {/* Dates */}
// // //                                 <div>
// // //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// // //                                     <Calendar className="w-4 h-4 text-blue-500" />
// // //                                     Timeline
// // //                                   </h4>
// // //                                   <div className="grid grid-cols-2 gap-4">
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Purchased</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_purchased)}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Shipped</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_shipped)}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Delivered</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_delivered)}</p>
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className="text-xs text-slate-500">Quantity</p>
// // //                                       <p className="text-sm font-medium text-slate-800">{order.ordered_qty}</p>
// // //                                     </div>
// // //                                   </div>
// // //                                 </div>
// // //                               </div>
// // //                             </div>
// // //                             <div className="pt-4 flex justify-end">
// // //                             <motion.button
// // //                               whileHover={{ scale: 1.05 }}
// // //                               whileTap={{ scale: 0.95 }}
// // //                               onClick={() => {
// // //                                 if (order.return_specific?.return_order_number) {
// // //                                   const returnOrder = order.return_specific.return_order_number;

// // //                                   navigate(`/option/manual/${returnOrder}`);
// // //                                 }
// // //                               }}
// // //                               className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
// // //                             >
// // //                               Start Inspection
// // //                             </motion.button>
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

// // // export default ScheduledPickups;


// // import React, { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   Truck,
// //   Package,
// //   MapPin,
// //   Calendar,
// //   User,
// //   Box,
// //   Home,
// //   Mail,
// //   ChevronDown,
// //   ChevronUp,
// //   Ruler,
// //   Loader2,
// //   RefreshCw,
// //   Search,
// //   AlertCircle,
// //   Route,
// //   Map
// // } from "lucide-react";
// // import RouteMap from "../../components/RouteMap";

// // interface Order {
// //   id: number;
// //   item_id: number;
// //   original_sales_order_number: string;
// //   original_sales_order_line: number;
// //   ordered_qty: number;
// //   serial_number: string;
// //   sscc_number: string;
// //   tag_number: string;
// //   vendor_item_number: string;
// //   shipped_from_warehouse: string;
// //   shipped_to_person: string;
// //   shipped_to_billing_address: string;
// //   account_number: string;
// //   customer_email: string;
// //   shipped_to_apt_number: string;
// //   shipped_to_street: string;
// //   shipped_to_city: string;
// //   shipped_to_zip: number;
// //   shipped_to_state: string;
// //   shipped_to_country: string;
// //   dimension_depth: number;
// //   dimension_length: number;
// //   dimension_breadth: number;
// //   dimension_weight: number;
// //   dimension_volume: number;
// //   dimension_size: string;
// //   date_purchased: string;
// //   date_shipped: string;
// //   date_delivered: string;
// //   delivery_agent_id: number;
// //   item?: {
// //     item_number: string;
// //     item_description: string;
// //     category: string;
// //     configuration: string;
// //   };
// //   return_specific?: {
// //     return_order_number: string;
// //     return_condition: string;
// //     return_carrier: string;
// //     return_destination: string;
// //     return_created_date: string;
// //     return_received_date: string;
// //   };
// // }

// // interface RouteResponse {
// //   ordered_addresses: string[];
// //   total_distance_km: number;
// //   total_duration_minutes: number;
// //   route_summary: string;
// // }

// // const ScheduledPickups: React.FC = () => {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [sortBy, setSortBy] = useState<"date" | "city">("date");
// //   const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
// //   const [routeLoading, setRouteLoading] = useState(false);
// //   const [routeError, setRouteError] = useState<string | null>(null);
// //   const [addressMap, setAddressMap] = useState<Record<string, Order>>({});
// //   const navigate = useNavigate();

// //   const fetchOrders = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const agentId = localStorage.getItem("agentId");
// //       if (!agentId) {
// //         throw new Error("Agent ID not found. Please log in again.");
// //       }
  
// //       const response = await fetch(`/api/agent/return-orders/${agentId}`);
  
// //       if (response.status === 404) {
// //         setOrders([]); 
// //         return;
// //       }
  
// //       if (!response.ok) {
// //         const message = await response.text();
// //         throw new Error(`Failed to fetch pickup orders: ${response.status} - ${message}`);
// //       }
  
// //       const data = await response.json();
// //       setOrders(data);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to fetch pickup orders");
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

  
// //   const fetchOptimizedRoute = async (
// //     userLocation: string,
// //     addresses: string[],
// //     mode: "FIFO" | "LIFO"
// //   ) => {
// //     try {
// //       setRouteLoading(true);
// //       setRouteError(null);
// //       setRouteInfo(null);
  
// //       const response = await fetch("/api/best-route", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           user_location: userLocation,
// //           addresses: addresses,
// //           route_mode: mode,
// //         }),
// //       });
  
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
// //       }
  
// //       const data = await response.json();
// //       setRouteInfo(data);
// //     } catch (err) {
// //       console.error("Route optimization failed:", err);
// //       setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
// //     } finally {
// //       setRouteLoading(false);
// //     }
// //   };
  
  

// //   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
// //     const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
// //     const response = await fetch(
// //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
// //     );
// //     const data = await response.json();
// //     if (data.status === "OK" && data.results.length > 0) {
// //       return data.results[0].formatted_address;
// //     } else {
// //       throw new Error("Failed to get address from coordinates.");
// //     }
// //   };
  
// //   const openGoogleMapsNavigation = (destination: string) => {
// //     const encodedDestination = encodeURIComponent(destination);
// //     const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
// //     window.open(url, "_blank");
// //   };
  

// //   const handleRefresh = () => {
// //     setRefreshing(true);
// //     fetchOrders();
// //   };

// //   const handleOptimizeRoute = async () => {
// //     if (!navigator.geolocation) {
// //       setRouteError("Geolocation is not supported by your browser.");
// //       return;
// //     }
  
// //     navigator.geolocation.getCurrentPosition(
// //       async (position) => {
// //         try {
// //           const lat = position.coords.latitude;
// //           const lng = position.coords.longitude;
  
// //           const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
// //           const geocodeRes = await fetch(
// //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
// //           );
// //           const geocodeData = await geocodeRes.json();
  
// //           if (
// //             geocodeData.status !== "OK" ||
// //             !geocodeData.results ||
// //             geocodeData.results.length === 0
// //           ) {
// //             throw new Error("Could not get address from coordinates.");
// //           }
  
// //           const userLocation = geocodeData.results[0].formatted_address;
  
// //           const routeMode = window.confirm(
// //             "Start at your current location? Click OK for FIFO (start at you), Cancel for LIFO (end at you)"
// //           )
// //             ? "FIFO"
// //             : "LIFO";
  
// //           const validOrders = orders.filter(order =>
// //             order.shipped_to_street &&
// //             order.shipped_to_city &&
// //             order.shipped_to_state &&
// //             order.shipped_to_zip &&
// //             order.shipped_to_country
// //           );
  
// //           const freshAddressMap: Record<string, Order> = {};

// //           const addresses: string[] = validOrders.map(order => {
// //             const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
// //             freshAddressMap[fullAddress.toLowerCase()] = order;
// //             return fullAddress;
// //           });

// //           setAddressMap(freshAddressMap);

// //           await fetchOptimizedRoute(userLocation, addresses, routeMode);
// //         } catch (err) {
// //           console.error(err);
// //           setRouteError("Failed to determine your location.");
// //         }
// //       },
// //       (err) => {
// //         console.error("Geolocation error:", err);
// //         setRouteError("Location access denied. Please allow it and try again.");
// //       }
// //     );
// //   };
  
  

// //   useEffect(() => {
// //     fetchOrders();
// //   }, []);

// //   const toggleOrderExpansion = (orderId: number) => {
// //     setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
// //   };

// //   const formatDate = (dateString: string) => {
// //     if (!dateString) return "-";
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   const filteredOrders = orders
// //   .filter((order) => {
// //     return (
// //       searchTerm.toLowerCase() === "" ||
// //       order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //   })
// //   .sort((a, b) => {
// //     if (sortBy === "date") {
// //       return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
// //     }
// //     return 0;
// //   });

// //   if (loading && orders.length === 0) {
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
// //             {/* Header Section */}
// //             <div className="text-center mb-12">
// //               <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
// //                 <Truck className="w-10 h-10 text-blue-600" />
// //               </div>
// //               <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
// //                 Scheduled Pickups
// //               </h1>
// //               <p className="text-xl text-slate-600 max-w-2xl mx-auto">
// //                 View and manage your pickup assignments
// //               </p>
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
// //             </AnimatePresence>

// //             {/* Route Optimization Section */}
// //             <div className="mb-6 flex justify-end">
// //               <motion.button
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={handleOptimizeRoute}
// //                 disabled={routeLoading || orders.length < 2}
// //                 className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
// //                   orders.length < 2 
// //                     ? "bg-slate-200 text-slate-500 cursor-not-allowed"
// //                     : "bg-blue-600 text-white hover:bg-blue-700"
// //                 }`}
// //               >
// //                 {routeLoading ? (
// //                   <Loader2 className="w-5 h-5 animate-spin" />
// //                 ) : (
// //                   <Route className="w-5 h-5" />
// //                 )}
// //                 Optimize Pickup Route
// //               </motion.button>
// //             </div>

// //             {/* Optimized Route Display */}
// //             {routeInfo && (
// //               <motion.div
// //                 initial={{ opacity: 0, height: 0 }}
// //                 animate={{ opacity: 1, height: "auto" }}
// //                 exit={{ opacity: 0, height: 0 }}
// //                 className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
// //               >
// //                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
// //                   <div className="flex items-center gap-3">
// //                     <Map className="w-5 h-5 text-blue-600" />
// //                     <h3 className="font-medium text-slate-900">Optimized Pickup Route</h3>
// //                   </div>
// //                   <button 
// //                     onClick={() => setRouteInfo(null)}
// //                     className="text-slate-400 hover:text-slate-500 transition-colors"
// //                     aria-label="Close route information"
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                     </svg>
// //                   </button>
// //                 </div>
                
// //                 <div className="p-6">
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
// //                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
// //                       <div className="flex items-center gap-3 mb-2">
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
// //                         </svg>
// //                         <h4 className="font-medium text-slate-700">Route Summary</h4>
// //                       </div>
// //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.route_summary || "Standard route"}</p>
// //                     </div>

// //                     {routeInfo?.ordered_addresses?.length >= 2 && (
// //                       <div className="mt-6 rounded-xl overflow-hidden border border-slate-200">
// //                         <RouteMap addresses={routeInfo.ordered_addresses} />
// //                       </div>
// //                     )}

// //                     <div className="bg-green-50 p-4 rounded-lg border border-green-100">
// //                       <div className="flex items-center gap-3 mb-2">
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
// //                         </svg>
// //                         <h4 className="font-medium text-slate-700">Total Distance</h4>
// //                       </div>
// //                       <p className="text-lg font-semibold text-slate-900">{routeInfo.total_distance_km} km</p>
// //                     </div>

// //                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
// //                       <div className="flex items-center gap-3 mb-2">
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
// //                         </svg>
// //                         <h4 className="font-medium text-slate-700">Estimated Time</h4>
// //                       </div>
// //                       <p className="text-lg font-semibold text-slate-900">
// //                         {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {routeInfo?.ordered_addresses?.[1] && (
// //                 <div className="mb-6 flex justify-start">
// //                   <motion.button
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     onClick={() => openGoogleMapsNavigation(routeInfo.ordered_addresses[1])}
// //                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
// //                   >
// //                     <MapPin className="w-4 h-4" />
// //                     Start Navigation to First Stop
// //                   </motion.button>
// //                 </div>
// //               )}

// //                   <div className="border-t border-slate-200 pt-4">
// //                     <h4 className="text-sm font-medium text-slate-700 mb-4">Pickup Sequence</h4>
// //                     <div className="space-y-3">
// //                       {routeInfo.ordered_addresses.map((address, index) => {
// //                         const normalizedAddress = address.toLowerCase().trim();
// //                         const matchedOrder = Object.entries(addressMap).find(([key]) =>
// //                           normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
// //                         );
// //                         const order = matchedOrder ? matchedOrder[1] : undefined;

// //                         return (
// //                           <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
// //                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
// //                               {index + 1}
// //                             </div>
// //                             <div className="flex-1 min-w-0">
// //                               <p className="text-sm font-medium text-slate-900 truncate">
// //                                 {order?.shipped_to_person || "Unknown Recipient"}
// //                               </p>
// //                               <p className="text-xs text-slate-500 truncate">{address}</p>
// //                               {order && (
// //                                 <div className="mt-1">
// //                                   <span className="text-xs text-slate-500">
// //                                     Order: {order.original_sales_order_number}
// //                                   </span>
// //                                 </div>
// //                               )}
// //                             </div>
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </motion.div>
// //             )}

// //             {routeError && (
// //               <motion.div
// //                 initial={{ opacity: 0, y: -20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //                 className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
// //               >
// //                 <AlertCircle className="w-5 h-5" />
// //                 <span className="font-medium">{routeError}</span>
// //               </motion.div>
// //             )}

// //             <div className="mb-6 flex flex-col sm:flex-row gap-4">
// //               <div className="relative flex-grow">
// //                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search pickups by description, number, or city..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               </div>
              
// //               <div className="flex gap-3">
// //                 <select
// //                   value={sortBy}
// //                   onChange={(e) => setSortBy(e.target.value as "date" | "city")}
// //                   className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
// //                 >
// //                   <option value="date">Sort by Date</option>
// //                   <option value="city">Sort by City</option>
// //                 </select>

// //                 <motion.button
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                   onClick={handleRefresh}
// //                   disabled={refreshing}
// //                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
// //                 >
// //                   <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
// //                   Refresh
// //                 </motion.button>
// //               </div>
// //             </div>

// //             {filteredOrders.length === 0 ? (
// //               <motion.div
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
// //               >
// //                 <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
// //                 <h3 className="text-lg font-semibold text-slate-700">
// //                   {orders.length === 0
// //                     ? "No pickup assignments yet"
// //                     : "No matching pickups found"}
// //                 </h3>
// //                 <p className="text-slate-500 mt-2">
// //                   {orders.length === 0
// //                     ? "You currently have no scheduled return pickups. Check back later."
// //                     : "Try updating your search."}
// //                 </p>
// //               </motion.div>
// //             ) : (
// //               <div className="space-y-4">
// //                   {filteredOrders
// //                     .filter(order => order.item_id && order.shipped_to_person)
// //                     .map((order) => (
// //                   <motion.div
// //                     key={order.id}
// //                     initial={{ opacity: 0, y: 10 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     transition={{ duration: 0.2 }}
// //                     className={`border rounded-xl overflow-hidden transition-all ${
// //                       expandedOrderId === order.id
// //                         ? "border-blue-300 shadow-md bg-blue-50"
// //                         : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
// //                     }`}
// //                   >
// //                     <div 
// //                       className="p-6 cursor-pointer"
// //                       onClick={() => toggleOrderExpansion(order.id)}
// //                     >
// //                       <div className="flex justify-between items-center">
// //                         <div className="flex items-center gap-4">
// //                           <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
// //                             <Package className="w-6 h-6" />
// //                           </div>
// //                           <div>
// //                             <h3 className="font-medium text-slate-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
// //                             <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// //                               <MapPin className="w-4 h-4" />
// //                               {order.shipped_to_city}, {order.shipped_to_state}
// //                             </p>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-4">
// //                           <div className="text-sm font-medium text-slate-600">
// //                             {order.original_sales_order_number}
// //                           </div>
// //                           {expandedOrderId === order.id ? (
// //                             <ChevronUp className="w-5 h-5 text-slate-500" />
// //                           ) : (
// //                             <ChevronDown className="w-5 h-5 text-slate-500" />
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <AnimatePresence>
// //                       {expandedOrderId === order.id && (
// //                         <motion.div
// //                           initial={{ opacity: 0, height: 0 }}
// //                           animate={{ opacity: 1, height: "auto" }}
// //                           exit={{ opacity: 0, height: 0 }}
// //                           transition={{ duration: 0.3 }}
// //                           className="border-t border-slate-100"
// //                         >
// //                           <div className="p-6 space-y-6">
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                               {/* Order Information */}
// //                               <div className="space-y-6">
// //                                 <div>
// //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// //                                     <Package className="w-4 h-4 text-blue-500" />
// //                                     Order Information
// //                                   </h4>
// //                                   <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Order Number</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_number || "-"}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Line Number</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.original_sales_order_line || "-"}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Serial Number</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.serial_number || "-"}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">SSCC Number</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.sscc_number || "-"}</p>
// //                                     </div>
// //                                     {order.return_specific?.return_order_number && (
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Return Order Number</p>
// //                                         <p className="text-sm font-medium text-slate-800">
// //                                           {order.return_specific.return_order_number}
// //                                         </p>
// //                                       </div>
// //                                     )}
// //                                   </div>
// //                                 </div>

// //                                 {/* Shipping Details */}
// //                                 <div>
// //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// //                                     <MapPin className="w-4 h-4 text-blue-500" />
// //                                     Shipping Details
// //                                   </h4>
// //                                   <div className="space-y-3">
// //                                     <div className="flex items-start gap-3">
// //                                       <Home className="w-5 h-5 text-blue-400 mt-0.5" />
// //                                       <div>
// //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_street || "Address not specified"}</p>
// //                                         {order.shipped_to_apt_number && (
// //                                           <p className="text-xs text-slate-500">Apt: {order.shipped_to_apt_number}</p>
// //                                         )}
// //                                         <p className="text-sm text-slate-600">
// //                                           {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
// //                                         </p>
// //                                         <p className="text-xs text-slate-500">{order.shipped_to_country}</p>
// //                                       </div>
// //                                     </div>
// //                                     <div className="flex items-center gap-3">
// //                                       <User className="w-5 h-5 text-blue-400" />
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Recipient</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.shipped_to_person || "-"}</p>
// //                                       </div>
// //                                     </div>
// //                                     <div className="flex items-center gap-3">
// //                                       <Mail className="w-5 h-5 text-blue-400" />
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Email</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.customer_email || "-"}</p>
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>

// //                               {/* Item Details */}
// //                               <div className="space-y-6">
// //                                 {order.item && (
// //                                   <div>
// //                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// //                                       <Box className="w-4 h-4 text-blue-500" />
// //                                       Item Details
// //                                     </h4>
// //                                     <div className="grid grid-cols-2 gap-4">
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Item Number</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_number || "-"}</p>
// //                                       </div>
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Description</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.item.item_description || "-"}</p>
// //                                       </div>
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Category</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.item.category || "-"}</p>
// //                                       </div>
// //                                       <div>
// //                                         <p className="text-xs text-slate-500">Configuration</p>
// //                                         <p className="text-sm font-medium text-slate-800">{order.item.configuration || "-"}</p>
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 )}

// //                                 {/* Dimensions */}
// //                                 <div>
// //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// //                                     <Ruler className="w-4 h-4 text-blue-500" />
// //                                     Dimensions
// //                                   </h4>
// //                                   <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Size</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.dimension_size || "-"}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Weight</p>
// //                                       <p className="text-sm font-medium text-slate-800">
// //                                         {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
// //                                       </p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Volume</p>
// //                                       <p className="text-sm font-medium text-slate-800">
// //                                         {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
// //                                       </p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Dimensions (L×W×H)</p>
// //                                       <p className="text-sm font-medium text-slate-800">
// //                                         {order.dimension_length && order.dimension_breadth && order.dimension_depth
// //                                           ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
// //                                           : "-"}
// //                                       </p>
// //                                     </div>
// //                                   </div>
// //                                 </div>

// //                                 {/* Dates */}
// //                                 <div>
// //                                   <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
// //                                     <Calendar className="w-4 h-4 text-blue-500" />
// //                                     Timeline
// //                                   </h4>
// //                                   <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Purchased</p>
// //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_purchased)}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Shipped</p>
// //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_shipped)}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Delivered</p>
// //                                       <p className="text-sm font-medium text-slate-800">{formatDate(order.date_delivered)}</p>
// //                                     </div>
// //                                     <div>
// //                                       <p className="text-xs text-slate-500">Quantity</p>
// //                                       <p className="text-sm font-medium text-slate-800">{order.ordered_qty}</p>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                             <div className="pt-4 flex justify-end">
// //                             <motion.button
// //                               whileHover={{ scale: 1.05 }}
// //                               whileTap={{ scale: 0.95 }}
// //                               onClick={() => {
// //                                 if (order.return_specific?.return_order_number) {
// //                                   const returnOrder = order.return_specific.return_order_number;

// //                                   navigate(`/option/manual/${returnOrder}`);
// //                                 }
// //                               }}
// //                               className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
// //                             >
// //                               Start Inspection
// //                             </motion.button>
// //                             </div>
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

// // export default ScheduledPickups;


// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import {
//   Truck,
//   Package,
//   MapPin,
//   Calendar,
//   User,
//   Box,
//   Home,
//   Mail,
//   ChevronDown,
//   ChevronUp,
//   Ruler,
//   Route,
//   Map,
//   Loader2,
//   AlertCircle,
//   RefreshCw,
//   Search,
//   Clock,
//   Navigation,
//   CheckCircle2,
//   Info,
//   Star,
//   ArrowLeft,
//   Play,
//   RotateCcw,
// } from "lucide-react";
// import RouteMap from "../../components/RouteMap";

// interface Order {
//   id: number;
//   item_id: number;
//   original_sales_order_number: string;
//   original_sales_order_line: number;
//   ordered_qty: number;
//   serial_number: string;
//   sscc_number: string;
//   tag_number: string;
//   vendor_item_number: string;
//   shipped_from_warehouse: string;
//   shipped_to_person: string;
//   shipped_to_billing_address: string;
//   account_number: string;
//   customer_email: string;
//   shipped_to_apt_number: string;
//   shipped_to_street: string;
//   shipped_to_city: string;
//   shipped_to_zip: number;
//   shipped_to_state: string;
//   shipped_to_country: string;
//   dimension_depth: number;
//   dimension_length: number;
//   dimension_breadth: number;
//   dimension_weight: number;
//   dimension_volume: number;
//   dimension_size: string;
//   date_purchased: string;
//   date_shipped: string;
//   date_delivered: string;
//   delivery_agent_id: number;
//   item?: {
//     item_number: string;
//     item_description: string;
//     category: string;
//     configuration: string;
//   };
//   return_specific?: {
//     return_order_number: string;
//     return_condition: string;
//     return_carrier: string;
//     return_destination: string;
//     return_created_date: string;
//     return_received_date: string;
//   };
// }

// interface RouteResponse {
//   ordered_addresses: string[];
//   total_distance_km: number;
//   total_duration_minutes: number;
//   route_summary: string;
// }

// const ScheduledPickups: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState<"date" | "city">("date");
//   const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
//   const [routeLoading, setRouteLoading] = useState(false);
//   const [routeError, setRouteError] = useState<string | null>(null);
//   const [addressMap, setAddressMap] = useState<Record<string, Order>>({});
//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const agentId = localStorage.getItem("agentId");
//       if (!agentId) {
//         throw new Error("Agent ID not found. Please log in again.");
//       }
  
//       const response = await fetch(`/api/agent/return-orders/${agentId}`);
  
//       if (response.status === 404) {
//         setOrders([]); 
//         return;
//       }
  
//       if (!response.ok) {
//         const message = await response.text();
//         throw new Error(`Failed to fetch pickup orders: ${response.status} - ${message}`);
//       }
  
//       const data = await response.json();
//       setOrders(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch pickup orders");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchOptimizedRoute = async (
//     userLocation: string,
//     addresses: string[],
//     mode: "FIFO" | "LIFO"
//   ) => {
//     try {
//       setRouteLoading(true);
//       setRouteError(null);
//       setRouteInfo(null);

//       console.log("📤 Sending route request with:", {
//         user_location: userLocation,
//         addresses: addresses,
//         route_mode: mode
//       });
      
//       const response = await fetch("/api/best-route", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_location: userLocation,
//           addresses: addresses,
//           route_mode: mode,
//         }),
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
//       }
  
//       const data = await response.json();
//       console.log("✅ Got route back:", data);

//       setRouteInfo(data);
//     } catch (err) {
//       console.error("Route optimization failed:", err);
//       setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
//     } finally {
//       setRouteLoading(false);
//     }
//   };

//   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//     const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
//     );
//     const data = await response.json();
//     console.log("✅ Got geocode back:", data);

//     if (data.status === "OK" && data.results.length > 0) {
//       return data.results[0].formatted_address;
//     } else {
//       throw new Error("Failed to get address from coordinates.");
//     }
//   };
  
//   const openGoogleMapsNavigation = (destination: string) => {
//     const encodedDestination = encodeURIComponent(destination);
//     const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
//     window.open(url, "_blank");
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const handleOptimizeRoute = async () => {
//     if (!navigator.geolocation) {
//       setRouteError("Geolocation is not supported by your browser.");
//       return;
//     }
  
//     console.log("📡 Requesting location...");
  
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         console.log("📍 Got location:", position.coords);
  
//         try {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
  
//           // Reverse geocode
//           const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
//           const geocodeRes = await fetch(
//             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
//           );
//           const geocodeData = await geocodeRes.json();
  
//           if (
//             geocodeData.status !== "OK" ||
//             !geocodeData.results ||
//             geocodeData.results.length === 0
//           ) {
//             throw new Error("Could not get address from coordinates.");
//           }
  
//           const userLocation = geocodeData.results[0].formatted_address;
//           console.log("📌 Current address:", userLocation);
  
//           const routeMode = window.confirm(
//             "Start at your current location? Click OK for FIFO (start at you), Cancel for LIFO (end at you)"
//           )
//             ? "FIFO"
//             : "LIFO";
  
//           const validOrders = orders.filter(order =>
//             order.shipped_to_street &&
//             order.shipped_to_city &&
//             order.shipped_to_state &&
//             order.shipped_to_zip &&
//             order.shipped_to_country
//           );
  
//           const freshAddressMap: Record<string, Order> = {};
//           const addresses: string[] = [];

//           validOrders.forEach(order => {
//             const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
//             addresses.push(fullAddress);
//             freshAddressMap[fullAddress.toLowerCase().trim()] = order;
//           });

//           setAddressMap(freshAddressMap);

//           await fetchOptimizedRoute(userLocation, addresses, routeMode);
//         } catch (err) {
//           console.error("❌ Error during route optimization:", err);
//           setRouteError("Failed to determine your location.");
//         }
//       },
//       (err) => {
//         console.error("❌ Geolocation error:", err);
      
//         switch (err.code) {
//           case err.PERMISSION_DENIED:
//             setRouteError("Location access denied. Please allow location access and try again.");
//             break;
//           case err.POSITION_UNAVAILABLE:
//             setRouteError("Location position unavailable. Try again later.");
//             break;
//           case err.TIMEOUT:
//             setRouteError("Location request timed out. Please try again.");
//             break;
//           default:
//             setRouteError("Failed to get your location. Please try again.");
//         }
//       }      
//     );
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const toggleOrderExpansion = (orderId: number) => {
//     setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const filteredOrders = orders
//     .filter((order) => {
//       return (
//         searchTerm.toLowerCase() === "" ||
//         order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     })
//     .sort((a, b) => {
//       if (sortBy === "date") {
//         return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
//       }
//       return 0;
//     });

//   if (loading && orders.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 sm:p-8 flex justify-center items-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
//             className="text-orange-600 mb-4"
//           >
//             <Loader2 className="w-16 h-16 mx-auto" />
//           </motion.div>
//           <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Your Pickups</h3>
//           <p className="text-slate-500">Please wait while we fetch your scheduled return pickups...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
//         >
//           <div className="p-6 sm:p-8">
//             {/* Enhanced Header Section */}
//             <div className="text-center mb-8">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", bounce: 0.5 }}
//                 className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:shadow-orange-300 transition-all duration-300"
//               >
//                 <RotateCcw className="w-12 h-12 text-white" />
//               </motion.div>
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-700"
//               >
//                 My Pickups
//               </motion.h1>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
//               >
//                 Manage your return pickup schedule and optimize your routes
//               </motion.p>
//             </div>

//             {/* Enhanced Error Display */}
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20, scale: 0.9 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -20, scale: 0.9 }}
//                   className="mb-6 flex items-start gap-3 px-6 py-4 rounded-2xl bg-red-50 text-red-800 border-2 border-red-100 shadow-sm"
//                 >
//                   <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <h4 className="font-semibold mb-1">Something went wrong</h4>
//                     <p className="text-sm">{error}</p>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Enhanced Route Optimization Section */}
//             <div className="mb-8">
//               <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
//                       <Route className="w-6 h-6 text-orange-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">Smart Route Optimization</h3>
//                       <p className="text-sm text-slate-600">Find the fastest pickup route based on your location</p>
//                     </div>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       console.log("🟢 Optimize Route button clicked");
//                       handleOptimizeRoute();
//                     }}
//                     disabled={routeLoading || orders.length < 2}
//                     className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
//                       orders.length < 2 
//                         ? "bg-slate-200 text-slate-500 cursor-not-allowed"
//                         : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-orange-300"
//                     }`}
//                   >
//                     {routeLoading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         <span>Optimizing...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Navigation className="w-5 h-5" />
//                         <span>Optimize Route</span>
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
                
//                 {orders.length < 2 && (
//                   <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
//                     <Info className="w-4 h-4" />
//                     <span>You need at least 2 pickups to optimize your route</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Enhanced Optimized Route Display */}
//             {routeInfo && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-lg overflow-hidden"
//               >
//                 <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 flex justify-between items-center">
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
//                       <CheckCircle2 className="w-6 h-6 text-green-700" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-green-900">Route Optimized Successfully!</h3>
//                       <p className="text-sm text-green-700">Your most efficient pickup path is ready</p>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={() => setRouteInfo(null)}
//                     className="text-green-400 hover:text-green-600 transition-colors p-2 hover:bg-green-200 rounded-lg"
//                     aria-label="Close route information"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
                
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
//                       <div className="flex items-center gap-3 mb-3">
//                         <Star className="h-6 w-6 text-green-600" />
//                         <h4 className="font-semibold text-slate-700">Route Type</h4>
//                       </div>
//                       <p className="text-xl font-bold text-slate-900">{routeInfo.route_summary || "Optimized"}</p>
//                     </div>

//                     <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
//                       <div className="flex items-center gap-3 mb-3">
//                         <MapPin className="h-6 w-6 text-green-600" />
//                         <h4 className="font-semibold text-slate-700">Total Distance</h4>
//                       </div>
//                       <p className="text-xl font-bold text-slate-900">{routeInfo.total_distance_km} km</p>
//                     </div>

//                     <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
//                       <div className="flex items-center gap-3 mb-3">
//                         <Clock className="h-6 w-6 text-green-600" />
//                         <h4 className="font-semibold text-slate-700">Estimated Time</h4>
//                       </div>
//                       <p className="text-xl font-bold text-slate-900">
//                         {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
//                       </p>
//                     </div>
//                   </div>

//                   {routeInfo?.ordered_addresses?.length >= 2 && (
//                     <div className="mb-8 rounded-2xl overflow-hidden border-2 border-green-200 shadow-lg">
//                       <RouteMap addresses={routeInfo.ordered_addresses} />
//                     </div>
//                   )}

//                   {routeInfo?.ordered_addresses?.[1] && (
//                     <div className="mb-8 text-center">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => openGoogleMapsNavigation(routeInfo.ordered_addresses[1])}
//                         className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-300 mx-auto font-semibold text-lg"
//                       >
//                         <Navigation className="w-6 h-6" />
//                         Start Navigation
//                       </motion.button>
//                       <p className="text-sm text-green-700 mt-2">Navigate to your first pickup stop</p>
//                     </div>
//                   )}

//                   <div className="border-t border-green-200 pt-6">
//                     <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
//                       <Route className="w-5 h-5 text-green-600" />
//                       Your Pickup Sequence
//                     </h4>
//                     <div className="space-y-4">
//                       {routeInfo.ordered_addresses.map((address, index) => {
//                         const normalizedAddress = address.toLowerCase().trim();
//                         const matchedOrder = Object.entries(addressMap).find(([key]) =>
//                           normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
//                         );
//                         const order = matchedOrder ? matchedOrder[1] : undefined;

//                         return (
//                           <motion.div
//                             key={index}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
//                           >
//                             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-sm font-bold border-2 border-green-200">
//                               {index + 1}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-base font-semibold text-slate-900 truncate">
//                                 {order?.shipped_to_person || "Location"}
//                               </p>
//                               <p className="text-sm text-slate-600 truncate mb-1">{address}</p>
//                               {order && (
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-lg font-medium">
//                                     Order #{order.original_sales_order_number}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Enhanced Route Error Display */}
//             {routeError && (
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="mb-6 flex items-start gap-3 px-6 py-4 rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-100"
//               >
//                 <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h4 className="font-semibold mb-1">Route Optimization Failed</h4>
//                   <p className="text-sm">{routeError}</p>
//                 </div>
//               </motion.div>
//             )}

//             {/* Enhanced Search and Filter Section */}
//             <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="relative flex-grow">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Search by item, order number, or city..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all"
//                   />
//                 </div>
                
//                 <div className="flex gap-3">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value as "date" | "city")}
//                     className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm font-medium"
//                   >
//                     <option value="date">📅 Sort by Date</option>
//                     <option value="city">🏙️ Sort by City</option>
//                   </select>

//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleRefresh}
//                     disabled={refreshing}
//                     className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 shadow-sm font-medium transition-all"
//                   >
//                     <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
//                     <span className="hidden sm:inline">Refresh</span>
//                   </motion.button>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Empty State */}
//             {filteredOrders.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-200"
//               >
//                 <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                   <RotateCcw className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-slate-700 mb-3">
//                   {orders.length === 0
//                     ? "No pickups scheduled"
//                     : "No matching pickups"}
//                 </h3>
//                 <p className="text-lg text-slate-500 mb-6 max-w-md mx-auto">
//                   {orders.length === 0
//                     ? "You don't have any scheduled return pickups at the moment. New pickups will appear here when assigned."
//                     : "Try adjusting your search terms or filters to find what you're looking for."}
//                 </p>
//                 {searchTerm && (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSearchTerm("")}
//                     className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold"
//                   >
//                     Clear Search
//                   </motion.button>
//                 )}
//               </motion.div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-slate-900">
//                     {filteredOrders.length} Pickup{filteredOrders.length !== 1 ? 's' : ''} Found
//                   </h2>
//                   <div className="text-sm text-slate-500">
//                     Click on any pickup to view details
//                   </div>
//                 </div>

//                 {filteredOrders
//                   .filter(order => order.item_id && order.shipped_to_person)
//                   .map((order, index) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
//                       expandedOrderId === order.id
//                         ? "border-orange-300 shadow-xl bg-orange-50"
//                         : "border-slate-200 hover:border-orange-200 bg-white"
//                     }`}
//                   >
//                     <div 
//                       className="p-6 cursor-pointer"
//                       onClick={() => toggleOrderExpansion(order.id)}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-6">
//                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
//                             expandedOrderId === order.id 
//                               ? "bg-orange-200 text-orange-700" 
//                               : "bg-orange-100 text-orange-600"
//                           }`}>
//                             <RotateCcw className="w-8 h-8" />
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-semibold text-slate-900 mb-1">
//                               {order.shipped_to_person || "Unknown Recipient"}
//                             </h3>
//                             <p className="text-base text-slate-600 flex items-center gap-2 mb-2">
//                               <MapPin className="w-4 h-4" />
//                               {order.shipped_to_city}, {order.shipped_to_state}
//                             </p>
//                             <div className="flex items-center gap-4 text-sm text-slate-500">
//                               <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">
//                                 Order #{order.original_sales_order_number}
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <Calendar className="w-4 h-4" />
//                                 {formatDate(order.date_shipped)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <motion.div
//                             animate={{ rotate: expandedOrderId === order.id ? 180 : 0 }}
//                             transition={{ duration: 0.3 }}
//                             className={`p-2 rounded-xl ${
//                               expandedOrderId === order.id 
//                                 ? "bg-orange-200 text-orange-700" 
//                                 : "bg-slate-100 text-slate-500"
//                             }`}
//                           >
//                             <ChevronDown className="w-6 h-6" />
//                           </motion.div>
//                         </div>
//                       </div>
//                     </div>

//                     <AnimatePresence>
//                       {expandedOrderId === order.id && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.4 }}
//                           className="border-t-2 border-orange-100"
//                         >
//                           <div className="p-8 space-y-8 bg-gradient-to-br from-orange-50 to-red-50">
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                               {/* Enhanced Order Information */}
//                               <div className="space-y-8">
//                                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
//                                   <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                                       <Package className="w-5 h-5 text-orange-600" />
//                                     </div>
//                                     Order Details
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-6">
//                                     <div>
//                                       <p className="text-sm font-medium text-slate-500 mb-1">Order Number</p>
//                                       <p className="text-base font-semibold text-slate-800">{order.original_sales_order_number || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-sm font-medium text-slate-500 mb-1">Line Number</p>
//                                       <p className="text-base font-semibold text-slate-800">{order.original_sales_order_line || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-sm font-medium text-slate-500 mb-1">Serial Number</p>
//                                       <p className="text-base font-semibold text-slate-800">{order.serial_number || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-sm font-medium text-slate-500 mb-1">SSCC Number</p>
//                                       <p className="text-base font-semibold text-slate-800">{order.sscc_number || "-"}</p>
//                                     </div>
//                                     {order.return_specific?.return_order_number && (
//                                       <div className="col-span-2">
//                                         <p className="text-sm font-medium text-slate-500 mb-1">Return Order Number</p>
//                                         <p className="text-base font-semibold text-orange-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
//                                           {order.return_specific.return_order_number}
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* Enhanced Pickup Address */}
//                                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
//                                   <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                                       <MapPin className="w-5 h-5 text-green-600" />
//                                     </div>
//                                     Pickup Address
//                                   </h4>
//                                   <div className="space-y-4">
//                                     <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
//                                       <Home className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
//                                       <div className="flex-1">
//                                         <p className="text-base font-semibold text-slate-800 mb-1">
//                                           {order.shipped_to_street || "Address not specified"}
//                                         </p>
//                                         {order.shipped_to_apt_number && (
//                                           <p className="text-sm text-slate-600 mb-1">Apartment: {order.shipped_to_apt_number}</p>
//                                         )}
//                                         <p className="text-base text-slate-700">
//                                           {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
//                                         </p>
//                                         <p className="text-sm text-slate-500">{order.shipped_to_country}</p>
//                                       </div>
//                                     </div>
                                    
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                       <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
//                                         <User className="w-5 h-5 text-orange-500" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Contact Person</p>
//                                           <p className="text-sm font-semibold text-slate-800">{order.shipped_to_person || "-"}</p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
//                                         <Mail className="w-5 h-5 text-orange-500" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Email</p>
//                                           <p className="text-sm font-semibold text-slate-800">{order.customer_email || "-"}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Enhanced Item Details */}
//                               <div className="space-y-8">
//                                 {order.item && (
//                                   <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
//                                     <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
//                                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                                         <Box className="w-5 h-5 text-purple-600" />
//                                       </div>
//                                       Item Information
//                                     </h4>
//                                     <div className="space-y-4">
//                                       <div>
//                                         <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
//                                         <p className="text-base font-semibold text-slate-800">{order.item.item_description || "-"}</p>
//                                       </div>
//                                       <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                           <p className="text-sm font-medium text-slate-500 mb-1">Item Number</p>
//                                           <p className="text-sm font-semibold text-slate-800">{order.item.item_number || "-"}</p>
//                                         </div>
//                                         <div>
//                                           <p className="text-sm font-medium text-slate-500 mb-1">Category</p>
//                                           <p className="text-sm font-semibold text-slate-800">{order.item.category || "-"}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Enhanced Dimensions */}
//                                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
//                                   <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                       <Ruler className="w-5 h-5 text-blue-600" />
//                                     </div>
//                                     Package Details
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-4">
//                                     <div className="p-3 bg-slate-50 rounded-xl">
//                                       <p className="text-xs text-slate-500">Size</p>
//                                       <p className="text-sm font-semibold text-slate-800">{order.dimension_size || "-"}</p>
//                                     </div>
//                                     <div className="p-3 bg-slate-50 rounded-xl">
//                                       <p className="text-xs text-slate-500">Weight</p>
//                                       <p className="text-sm font-semibold text-slate-800">
//                                         {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
//                                       </p>
//                                     </div>
//                                     <div className="p-3 bg-slate-50 rounded-xl">
//                                       <p className="text-xs text-slate-500">Volume</p>
//                                       <p className="text-sm font-semibold text-slate-800">
//                                         {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
//                                       </p>
//                                     </div>
//                                     <div className="p-3 bg-slate-50 rounded-xl">
//                                       <p className="text-xs text-slate-500">Dimensions</p>
//                                       <p className="text-sm font-semibold text-slate-800">
//                                         {order.dimension_length && order.dimension_breadth && order.dimension_depth
//                                           ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
//                                           : "-"}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Enhanced Timeline */}
//                                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
//                                   <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
//                                       <Calendar className="w-5 h-5 text-indigo-600" />
//                                     </div>
//                                     Return Timeline
//                                   </h4>
//                                   <div className="space-y-4">
//                                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
//                                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                                       <div className="flex-1">
//                                         <p className="text-sm font-medium text-slate-700">Order Purchased</p>
//                                         <p className="text-xs text-slate-500">{formatDate(order.date_purchased)}</p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
//                                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                                       <div className="flex-1">
//                                         <p className="text-sm font-medium text-slate-700">Originally Shipped</p>
//                                         <p className="text-xs text-slate-500">{formatDate(order.date_shipped)}</p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
//                                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                                       <div className="flex-1">
//                                         <p className="text-sm font-medium text-slate-700">Return Requested</p>
//                                         <p className="text-xs text-slate-500">
//                                           {order.return_specific?.return_created_date 
//                                             ? formatDate(order.return_specific.return_created_date) 
//                                             : 'Pending pickup'}
//                                         </p>
//                                       </div>
//                                     </div>
//                                     <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
//                                       <p className="text-sm font-medium text-orange-800">Quantity: {order.ordered_qty} item(s)</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             {/* Enhanced Action Button */}
//                             <div className="pt-6 border-t border-orange-200 flex justify-end">
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => {
//                                   if (order.return_specific?.return_order_number) {
//                                     const returnOrder = order.return_specific.return_order_number;
//                                     navigate(`/option/manual/${returnOrder}`);
//                                   }
//                                 }}
//                                 className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-orange-300 font-semibold text-lg"
//                               >
//                                 <Play className="w-6 h-6" />
//                                 Start Inspection
//                               </motion.button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
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

// export default ScheduledPickups;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Box,
  Home,
  Mail,
  ChevronDown,
  ChevronUp,
  Ruler,
  Route,
  Map,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Clock,
  Navigation,
  CheckCircle2,
  Info,
  Star,
  ArrowLeft,
  Play,
  RotateCcw,
} from "lucide-react";
import RouteMap from "../../components/RouteMap";

interface Order {
  id: number;
  item_id: number;
  original_sales_order_number: string;
  original_sales_order_line: number;
  ordered_qty: number;
  serial_number: string;
  sscc_number: string;
  tag_number: string;
  vendor_item_number: string;
  shipped_from_warehouse: string;
  shipped_to_person: string;
  shipped_to_billing_address: string;
  account_number: string;
  customer_email: string;
  shipped_to_apt_number: string;
  shipped_to_street: string;
  shipped_to_city: string;
  shipped_to_zip: number;
  shipped_to_state: string;
  shipped_to_country: string;
  dimension_depth: number;
  dimension_length: number;
  dimension_breadth: number;
  dimension_weight: number;
  dimension_volume: number;
  dimension_size: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  delivery_agent_id: number;
  item?: {
    item_number: string;
    item_description: string;
    category: string;
    configuration: string;
  };
  return_specific?: {
    return_order_number: string;
    return_condition: string;
    return_carrier: string;
    return_destination: string;
    return_created_date: string;
    return_received_date: string;
  };
}

interface RouteResponse {
  ordered_addresses: string[];
  total_distance_km: number;
  total_duration_minutes: number;
  route_summary: string;
}

const ScheduledPickups: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "city">("date");
  const [routeInfo, setRouteInfo] = useState<RouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [addressMap, setAddressMap] = useState<Record<string, Order>>({});
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Agent ID not found. Please log in again.");
      }
  
      const response = await fetch(`/api/agent/return-orders/${agentId}`);
  
      if (response.status === 404) {
        setOrders([]); 
        return;
      }
  
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to fetch pickup orders: ${response.status} - ${message}`);
      }
  
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pickup orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchOptimizedRoute = async (
    userLocation: string,
    addresses: string[],
    mode: "FIFO" | "LIFO"
  ) => {
    try {
      setRouteLoading(true);
      setRouteError(null);
      setRouteInfo(null);

      console.log("📤 Sending route request with:", {
        user_location: userLocation,
        addresses: addresses,
        route_mode: mode
      });
      
      const response = await fetch("/api/best-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_location: userLocation,
          addresses: addresses,
          route_mode: mode,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Got route back:", data);

      setRouteInfo(data);
    } catch (err) {
      console.error("Route optimization failed:", err);
      setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
    } finally {
      setRouteLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    console.log("✅ Got geocode back:", data);

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("Failed to get address from coordinates.");
    }
  };
  
  const openGoogleMapsNavigation = (destination: string) => {
    const encodedDestination = encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleOptimizeRoute = async () => {
    if (!navigator.geolocation) {
      setRouteError("Geolocation is not supported by your browser.");
      return;
    }
  
    console.log("📡 Requesting location...");
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("📍 Got location:", position.coords);
  
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
  
          // Reverse geocode
          const apiKey = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";
          const geocodeRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          );
          const geocodeData = await geocodeRes.json();
  
          if (
            geocodeData.status !== "OK" ||
            !geocodeData.results ||
            geocodeData.results.length === 0
          ) {
            throw new Error("Could not get address from coordinates.");
          }
  
          const userLocation = geocodeData.results[0].formatted_address;
          console.log("📌 Current address:", userLocation);
  
          const routeMode = window.confirm(
            "Start at your current location? Click OK for FIFO (start at you), Cancel for LIFO (end at you)"
          )
            ? "FIFO"
            : "LIFO";
  
          const validOrders = orders.filter(order =>
            order.shipped_to_street &&
            order.shipped_to_city &&
            order.shipped_to_state &&
            order.shipped_to_zip &&
            order.shipped_to_country
          );
  
          const freshAddressMap: Record<string, Order> = {};
          const addresses: string[] = [];

          validOrders.forEach(order => {
            const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
            addresses.push(fullAddress);
            freshAddressMap[fullAddress.toLowerCase().trim()] = order;
          });

          setAddressMap(freshAddressMap);

          await fetchOptimizedRoute(userLocation, addresses, routeMode);
        } catch (err) {
          console.error("❌ Error during route optimization:", err);
          setRouteError("Failed to determine your location.");
        }
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
      
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setRouteError("Location access denied. Please allow location access and try again.");
            break;
          case err.POSITION_UNAVAILABLE:
            setRouteError("Location position unavailable. Try again later.");
            break;
          case err.TIMEOUT:
            setRouteError("Location request timed out. Please try again.");
            break;
          default:
            setRouteError("Failed to get your location. Please try again.");
        }
      }      
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders
    .filter((order) => {
      return (
        searchTerm.toLowerCase() === "" ||
        order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
      }
      return 0;
    });

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="text-blue-600 mb-4"
          >
            <Loader2 className="w-16 h-16 mx-auto" />
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Your Pickups</h3>
          <p className="text-slate-500">Please wait while we fetch your scheduled return pickups...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            {/* Enhanced Header Section */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:shadow-blue-300 transition-all duration-300"
              >
                <RotateCcw className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
              >
                My Pickups
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
              >
                Manage your return pickup schedule and optimize your routes
              </motion.p>
            </div>

            {/* Enhanced Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="mb-6 flex items-start gap-3 px-6 py-4 rounded-2xl bg-red-50 text-red-800 border-2 border-red-100 shadow-sm"
                >
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Something went wrong</h4>
                    <p className="text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Route Optimization Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Route className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Smart Route Optimization</h3>
                      <p className="text-sm text-slate-600">Find the fastest pickup route based on your location</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log("🟢 Optimize Route button clicked");
                      handleOptimizeRoute();
                    }}
                    disabled={routeLoading || orders.length < 2}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                      orders.length < 2 
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-300"
                    }`}
                  >
                    {routeLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5" />
                        <span>Optimize Route</span>
                      </>
                    )}
                  </motion.button>
                </div>
                
                {orders.length < 2 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Info className="w-4 h-4" />
                    <span>You need at least 2 pickups to optimize your route</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Optimized Route Display */}
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Route Optimized Successfully!</h3>
                      <p className="text-sm text-green-700">Your most efficient pickup path is ready</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRouteInfo(null)}
                    className="text-green-400 hover:text-green-600 transition-colors p-2 hover:bg-green-200 rounded-lg"
                    aria-label="Close route information"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <Star className="h-6 w-6 text-green-600" />
                        <h4 className="font-semibold text-slate-700">Route Type</h4>
                      </div>
                      <p className="text-xl font-bold text-slate-900">{routeInfo.route_summary || "Optimized"}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <h4 className="font-semibold text-slate-700">Total Distance</h4>
                      </div>
                      <p className="text-xl font-bold text-slate-900">{routeInfo.total_distance_km} km</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="h-6 w-6 text-green-600" />
                        <h4 className="font-semibold text-slate-700">Estimated Time</h4>
                      </div>
                      <p className="text-xl font-bold text-slate-900">
                        {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
                      </p>
                    </div>
                  </div>

                  {routeInfo?.ordered_addresses?.length >= 2 && (
                    <div className="mb-8 rounded-2xl overflow-hidden border-2 border-green-200 shadow-lg">
                      <RouteMap addresses={routeInfo.ordered_addresses} />
                    </div>
                  )}

                  {routeInfo?.ordered_addresses?.[1] && (
                    <div className="mb-8 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openGoogleMapsNavigation(routeInfo.ordered_addresses[1])}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-300 mx-auto font-semibold text-lg"
                      >
                        <Navigation className="w-6 h-6" />
                        Start Navigation
                      </motion.button>
                      <p className="text-sm text-green-700 mt-2">Navigate to your first pickup stop</p>
                    </div>
                  )}

                  <div className="border-t border-green-200 pt-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                      <Route className="w-5 h-5 text-green-600" />
                      Your Pickup Sequence
                    </h4>
                    <div className="space-y-4">
                      {routeInfo.ordered_addresses.map((address, index) => {
                        const normalizedAddress = address.toLowerCase().trim();
                        const matchedOrder = Object.entries(addressMap).find(([key]) =>
                          normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
                        );
                        const order = matchedOrder ? matchedOrder[1] : undefined;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-sm font-bold border-2 border-green-200">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-slate-900 truncate">
                                {order?.shipped_to_person || "Location"}
                              </p>
                              <p className="text-sm text-slate-600 truncate mb-1">{address}</p>
                              {order && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
                                    Order #{order.original_sales_order_number}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Route Error Display */}
            {routeError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 flex items-start gap-3 px-6 py-4 rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-100"
              >
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Route Optimization Failed</h4>
                  <p className="text-sm">{routeError}</p>
                </div>
              </motion.div>
            )}

            {/* Enhanced Search and Filter Section */}
            <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by item, order number, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "city")}
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium"
                  >
                    <option value="date">📅 Sort by Date</option>
                    <option value="city">🏙️ Sort by City</option>
                  </select>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 shadow-sm font-medium transition-all"
                  >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Enhanced Empty State */}
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <RotateCcw className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-3">
                  {orders.length === 0
                    ? "No pickups scheduled"
                    : "No matching pickups"}
                </h3>
                <p className="text-lg text-slate-500 mb-6 max-w-md mx-auto">
                  {orders.length === 0
                    ? "You don't have any scheduled return pickups at the moment. New pickups will appear here when assigned."
                    : "Try adjusting your search terms or filters to find what you're looking for."}
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {filteredOrders.length} Pickup{filteredOrders.length !== 1 ? 's' : ''} Found
                  </h2>
                  <div className="text-sm text-slate-500">
                    Click on any pickup to view details
                  </div>
                </div>

                {filteredOrders
                  .filter(order => order.item_id && order.shipped_to_person)
                  .map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      expandedOrderId === order.id
                        ? "border-blue-300 shadow-xl bg-blue-50"
                        : "border-slate-200 hover:border-blue-200 bg-white"
                    }`}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                            expandedOrderId === order.id 
                              ? "bg-blue-200 text-blue-700" 
                              : "bg-blue-100 text-blue-600"
                          }`}>
                            <RotateCcw className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">
                              {order.shipped_to_person || "Unknown Recipient"}
                            </h3>
                            <p className="text-base text-slate-600 flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4" />
                              {order.shipped_to_city}, {order.shipped_to_state}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">
                                Order #{order.original_sales_order_number}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.date_shipped)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{ rotate: expandedOrderId === order.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-2 rounded-xl ${
                              expandedOrderId === order.id 
                                ? "bg-blue-200 text-blue-700" 
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <ChevronDown className="w-6 h-6" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="border-t-2 border-blue-100"
                        >
                          <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Enhanced Order Information */}
                              <div className="space-y-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Order Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-sm font-medium text-slate-500 mb-1">Order Number</p>
                                      <p className="text-base font-semibold text-slate-800">{order.original_sales_order_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-500 mb-1">Line Number</p>
                                      <p className="text-base font-semibold text-slate-800">{order.original_sales_order_line || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-500 mb-1">Serial Number</p>
                                      <p className="text-base font-semibold text-slate-800">{order.serial_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-500 mb-1">SSCC Number</p>
                                      <p className="text-base font-semibold text-slate-800">{order.sscc_number || "-"}</p>
                                    </div>
                                    {order.return_specific?.return_order_number && (
                                      <div className="col-span-2">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Return Order Number</p>
                                        <p className="text-base font-semibold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                          {order.return_specific.return_order_number}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Enhanced Pickup Address */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                      <MapPin className="w-5 h-5 text-green-600" />
                                    </div>
                                    Pickup Address
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                      <Home className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                      <div className="flex-1">
                                        <p className="text-base font-semibold text-slate-800 mb-1">
                                          {order.shipped_to_street || "Address not specified"}
                                        </p>
                                        {order.shipped_to_apt_number && (
                                          <p className="text-sm text-slate-600 mb-1">Apartment: {order.shipped_to_apt_number}</p>
                                        )}
                                        <p className="text-base text-slate-700">
                                          {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
                                        </p>
                                        <p className="text-sm text-slate-500">{order.shipped_to_country}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <User className="w-5 h-5 text-blue-500" />
                                        <div>
                                          <p className="text-xs text-slate-500">Contact Person</p>
                                          <p className="text-sm font-semibold text-slate-800">{order.shipped_to_person || "-"}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                        <div>
                                          <p className="text-xs text-slate-500">Email</p>
                                          <p className="text-sm font-semibold text-slate-800">{order.customer_email || "-"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Item Details */}
                              <div className="space-y-8">
                                {order.item && (
                                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Box className="w-5 h-5 text-purple-600" />
                                      </div>
                                      Item Information
                                    </h4>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
                                        <p className="text-base font-semibold text-slate-800">{order.item.item_description || "-"}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-slate-500 mb-1">Item Number</p>
                                          <p className="text-sm font-semibold text-slate-800">{order.item.item_number || "-"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-slate-500 mb-1">Category</p>
                                          <p className="text-sm font-semibold text-slate-800">{order.item.category || "-"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Enhanced Dimensions */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Ruler className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Package Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-xs text-slate-500">Size</p>
                                      <p className="text-sm font-semibold text-slate-800">{order.dimension_size || "-"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-xs text-slate-500">Weight</p>
                                      <p className="text-sm font-semibold text-slate-800">
                                        {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
                                      </p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-xs text-slate-500">Volume</p>
                                      <p className="text-sm font-semibold text-slate-800">
                                        {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
                                      </p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-xs text-slate-500">Dimensions</p>
                                      <p className="text-sm font-semibold text-slate-800">
                                        {order.dimension_length && order.dimension_breadth && order.dimension_depth
                                          ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Timeline */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                      <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    Return Timeline
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700">Order Purchased</p>
                                        <p className="text-xs text-slate-500">{formatDate(order.date_purchased)}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700">Originally Shipped</p>
                                        <p className="text-xs text-slate-500">{formatDate(order.date_shipped)}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700">Return Requested</p>
                                        <p className="text-xs text-slate-500">
                                          {order.return_specific?.return_created_date 
                                            ? formatDate(order.return_specific.return_created_date) 
                                            : 'Pending pickup'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                      <p className="text-sm font-medium text-blue-800">Quantity: {order.ordered_qty} item(s)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Action Button */}
                            <div className="pt-6 border-t border-blue-200 flex justify-end">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (order.return_specific?.return_order_number) {
                                    const returnOrder = order.return_specific.return_order_number;
                                    navigate(`/option/manual/${returnOrder}`);
                                  }
                                }}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-300 font-semibold text-lg"
                              >
                                <Play className="w-6 h-6" />
                                Start Inspection
                              </motion.button>
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

export default ScheduledPickups;