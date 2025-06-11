// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
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
// } from "lucide-react";

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
//   item?: {
//     item_number: number;
//     item_description: string;
//     category: string;
//     configuration: string;
//   };
// }

// interface RouteResponse {
//   ordered_addresses: string[];
//   total_distance_km: number;
//   total_duration_minutes: number;
//   route_summary: string;
// }

// const ScheduledDeliveries: React.FC = () => {
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

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const agentId = localStorage.getItem("agentId");
//       if (!agentId) {
//         throw new Error("Please re-login!");
//       }

//       const response = await fetch(`/api/agent/sales-orders/${agentId}`);
//       if (response.status === 404) {
//         setOrders([]);
//         return;
//       }
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
//       }
      
//       const data = await response.json();
      
//       // The last item in the array is the address list
//       const addressList = data[data.length - 1]?.address_list || [];
//       const ordersData = data.slice(0, -1); // All items except the last one are orders
      
//       setOrders(ordersData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchOptimizedRoute = async (addresses: string[]) => {
//     try {
//       setRouteLoading(true);
//       setRouteError(null);
//       setRouteInfo(null);
      
//       const response = await fetch("/api/best-route", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ addresses }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       setRouteInfo(data);
//     } catch (err) {
//       setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
//     } finally {
//       setRouteLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const handleOptimizeRoute = () => {
//     if (orders.length < 2) {
//       setRouteError("At least 2 deliveries are required to optimize route");
//       return;
//     }

//     const addressMap: Record<string, Order> = {};
//     const addresses = orders.map(order => {
//       const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
//       addressMap[fullAddress.toLowerCase()] = order;
//       return fullAddress;
//     });

//     setAddressMap(addressMap);
//     fetchOptimizedRoute(addresses);
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
//       const matchesSearch = searchTerm.toLowerCase() === "" || 
//         (
//           order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       return matchesSearch;
//     })
//     .sort((a, b) => {
//       if (sortBy === "date") {
//         return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
//       } else {
//         return a.shipped_to_city.localeCompare(b.shipped_to_city);
//       }
//     });

//   if (loading && orders.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex justify-center items-center">
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
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
//         >
//           <div className="p-8">
//             {/* Header Section */}
//             <div className="text-center mb-12">
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
//                 <Truck className="w-10 h-10 text-blue-600" />
//               </div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
//                 Scheduled Deliveries
//               </h1>
//               <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//                 View and manage your delivery assignments
//               </p>
//             </div>

//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
//                 >
//                   <AlertCircle className="w-5 h-5" />
//                   <span className="font-medium">{error}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Route Optimization Section */}
//             <div className="mb-6 flex justify-end">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleOptimizeRoute}
//                 disabled={routeLoading || orders.length < 2}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                   orders.length < 2 
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }`}
//               >
//                 {routeLoading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Route className="w-5 h-5" />
//                 )}
//                 Optimize Delivery Route
//               </motion.button>
//             </div>

//             {/* Optimized Route Display */}
//             {routeInfo && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
//               >
//                 <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <Map className="w-5 h-5 text-blue-600" />
//                     <h3 className="font-medium text-gray-900">Optimized Delivery Route</h3>
//                   </div>
//                   <button 
//                     onClick={() => setRouteInfo(null)}
//                     className="text-gray-400 hover:text-gray-500 transition-colors"
//                     aria-label="Close route information"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
                
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                       <div className="flex items-center gap-3 mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
//                         </svg>
//                         <h4 className="font-medium text-gray-700">Route Summary</h4>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-900">{routeInfo.route_summary || "Standard route"}</p>
//                     </div>

//                     <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                       <div className="flex items-center gap-3 mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                         </svg>
//                         <h4 className="font-medium text-gray-700">Total Distance</h4>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-900">{routeInfo.total_distance_km} km</p>
//                     </div>

//                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//                       <div className="flex items-center gap-3 mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                         </svg>
//                         <h4 className="font-medium text-gray-700">Estimated Time</h4>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-900">
//                         {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
//                       </p>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-4">Delivery Sequence</h4>
//                     <div className="space-y-3">
//                       {routeInfo.ordered_addresses.map((address, index) => {
//                         const normalizedAddress = address.toLowerCase().trim();
//                         const matchedOrder = Object.entries(addressMap).find(([key]) =>
//                           normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
//                         );
//                         const order = matchedOrder ? matchedOrder[1] : undefined;

//                         return (
//                           <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
//                               {index + 1}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-gray-900 truncate">
//                                 {order?.shipped_to_person || "Unknown Recipient"}
//                               </p>
//                               <p className="text-xs text-gray-500 truncate">{address}</p>
//                               {order && (
//                                 <div className="mt-1">
//                                   <span className="text-xs text-gray-500">
//                                     Order: {order.original_sales_order_number}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {routeError && (
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
//               >
//                 <AlertCircle className="w-5 h-5" />
//                 <span className="font-medium">{routeError}</span>
//               </motion.div>
//             )}

//             <div className="mb-6 flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search orders by description, number, or city..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div className="flex gap-3">
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value as "date" | "city")}
//                   className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                 >
//                   <option value="date">Sort by Date</option>
//                   <option value="city">Sort by City</option>
//                 </select>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
//                   Refresh
//                 </motion.button>
//               </div>
//             </div>

//             {filteredOrders.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100"
//               >
//                 <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-700">
//                   {orders.length === 0
//                     ? "No deliveries assigned yet"
//                     : searchTerm
//                     ? "No matching deliveries found"
//                     : "All deliveries are complete"}
//                 </h3>
//                 <p className="text-gray-500 mt-2">
//                   {orders.length === 0
//                     ? "You currently have no scheduled deliveries. Check back later."
//                     : searchTerm
//                     ? "Try adjusting your search."
//                     : "You're all caught up! All deliveries have been handled."}
//                 </p>
//               </motion.div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredOrders.map((order) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className={`border rounded-xl overflow-hidden transition-all ${
//                       expandedOrderId === order.id
//                         ? "border-blue-300 shadow-md bg-blue-50"
//                         : "border-gray-200 hover:border-blue-200 bg-white hover:shadow-md"
//                     }`}
//                   >
//                     <div 
//                       className="p-6 cursor-pointer"
//                       onClick={() => toggleOrderExpansion(order.id)}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
//                             <Package className="w-6 h-6" />
//                           </div>
//                           <div>
//                             <h3 className="font-medium text-gray-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
//                             <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//                               <MapPin className="w-4 h-4" />
//                               {order.shipped_to_city}, {order.shipped_to_state}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="text-sm font-medium text-gray-600">
//                             {order.original_sales_order_number}
//                           </div>
//                           {expandedOrderId === order.id ? (
//                             <ChevronUp className="w-5 h-5 text-gray-500" />
//                           ) : (
//                             <ChevronDown className="w-5 h-5 text-gray-500" />
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <AnimatePresence>
//                       {expandedOrderId === order.id && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="border-t border-gray-100"
//                         >
//                           <div className="p-6 space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                               {/* Order Information */}
//                               <div className="space-y-6">
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
//                                     <Package className="w-4 h-4 text-blue-500" />
//                                     Order Information
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                       <p className="text-xs text-gray-500">Order Number</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.original_sales_order_number || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Line Number</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.original_sales_order_line || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Serial Number</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.serial_number || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">SSCC Number</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.sscc_number || "-"}</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Shipping Details */}
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
//                                     <MapPin className="w-4 h-4 text-blue-500" />
//                                     Shipping Details
//                                   </h4>
//                                   <div className="space-y-3">
//                                     <div className="flex items-start gap-3">
//                                       <Home className="w-5 h-5 text-blue-400 mt-0.5" />
//                                       <div>
//                                         <p className="text-sm font-medium text-gray-800">{order.shipped_to_street || "Address not specified"}</p>
//                                         {order.shipped_to_apt_number && (
//                                           <p className="text-xs text-gray-500">Apt: {order.shipped_to_apt_number}</p>
//                                         )}
//                                         <p className="text-sm text-gray-600">
//                                           {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
//                                         </p>
//                                         <p className="text-xs text-gray-500">{order.shipped_to_country}</p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                       <User className="w-5 h-5 text-blue-400" />
//                                       <div>
//                                         <p className="text-xs text-gray-500">Recipient</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.shipped_to_person || "-"}</p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                       <Mail className="w-5 h-5 text-blue-400" />
//                                       <div>
//                                         <p className="text-xs text-gray-500">Email</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.customer_email || "-"}</p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Item Details */}
//                               <div className="space-y-6">
//                                 {order.item && (
//                                   <div>
//                                     <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
//                                       <Box className="w-4 h-4 text-blue-500" />
//                                       Item Details
//                                     </h4>
//                                     <div className="grid grid-cols-2 gap-4">
//                                       <div>
//                                         <p className="text-xs text-gray-500">Item Number</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.item.item_number || "-"}</p>
//                                       </div>
//                                       <div>
//                                         <p className="text-xs text-gray-500">Description</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.item.item_description || "-"}</p>
//                                       </div>
//                                       <div>
//                                         <p className="text-xs text-gray-500">Category</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.item.category || "-"}</p>
//                                       </div>
//                                       <div>
//                                         <p className="text-xs text-gray-500">Configuration</p>
//                                         <p className="text-sm font-medium text-gray-800">{order.item.configuration || "-"}</p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Dimensions */}
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
//                                     <Ruler className="w-4 h-4 text-blue-500" />
//                                     Dimensions
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                       <p className="text-xs text-gray-500">Size</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.dimension_size || "-"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Weight</p>
//                                       <p className="text-sm font-medium text-gray-800">
//                                         {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
//                                       </p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Volume</p>
//                                       <p className="text-sm font-medium text-gray-800">
//                                         {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
//                                       </p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Dimensions (L×W×H)</p>
//                                       <p className="text-sm font-medium text-gray-800">
//                                         {order.dimension_length && order.dimension_breadth && order.dimension_depth
//                                           ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
//                                           : "-"}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Dates */}
//                                 <div>
//                                   <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
//                                     <Calendar className="w-4 h-4 text-blue-500" />
//                                     Timeline
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                       <p className="text-xs text-gray-500">Purchased</p>
//                                       <p className="text-sm font-medium text-gray-800">{formatDate(order.date_purchased)}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Shipped</p>
//                                       <p className="text-sm font-medium text-gray-800">{formatDate(order.date_shipped)}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Delivered</p>
//                                       <p className="text-sm font-medium text-gray-800">{formatDate(order.date_delivered)}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-500">Quantity</p>
//                                       <p className="text-sm font-medium text-gray-800">{order.ordered_qty}</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
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

// export default ScheduledDeliveries;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

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
  item?: {
    item_number: number;
    item_description: string;
    category: string;
    configuration: string;
  };
}

interface RouteResponse {
  ordered_addresses: string[];
  total_distance_km: number;
  total_duration_minutes: number;
  route_summary: string;
}

const ScheduledDeliveries: React.FC = () => {
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Please re-login!");
      }

      const response = await fetch(`/api/agent/sales-orders/${agentId}`);
      if (response.status === 404) {
        setOrders([]);
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // The last item in the array is the address list
      const addressList = data[data.length - 1]?.address_list || [];
      const ordersData = data.slice(0, -1); // All items except the last one are orders
      
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchOptimizedRoute = async (addresses: string[]) => {
    try {
      setRouteLoading(true);
      setRouteError(null);
      setRouteInfo(null);
      
      const response = await fetch("/api/best-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch route: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setRouteInfo(data);
    } catch (err) {
      setRouteError(err instanceof Error ? err.message : "Failed to fetch route");
    } finally {
      setRouteLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleOptimizeRoute = () => {
    if (orders.length < 2) {
      setRouteError("At least 2 deliveries are required to optimize route");
      return;
    }

    const addressMap: Record<string, Order> = {};
    const addresses = orders.map(order => {
      const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
      addressMap[fullAddress.toLowerCase()] = order;
      return fullAddress;
    });

    setAddressMap(addressMap);
    fetchOptimizedRoute(addresses);
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
      const matchesSearch = searchTerm.toLowerCase() === "" || 
        (
          order.item?.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.original_sales_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shipped_to_city?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
      } else {
        return a.shipped_to_city.localeCompare(b.shipped_to_city);
      }
    });

  if (loading && orders.length === 0) {
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
              <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Scheduled Deliveries
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                View and manage your delivery assignments
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
            </AnimatePresence>

            {/* Route Optimization Section */}
            <div className="mb-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOptimizeRoute}
                disabled={routeLoading || orders.length < 2}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  orders.length < 2 
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {routeLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Route className="w-5 h-5" />
                )}
                Optimize Delivery Route
              </motion.button>
            </div>

            {/* Optimized Route Display */}
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-slate-900">Optimized Delivery Route</h3>
                  </div>
                  <button 
                    onClick={() => setRouteInfo(null)}
                    className="text-slate-400 hover:text-slate-500 transition-colors"
                    aria-label="Close route information"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-medium text-slate-700">Route Summary</h4>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{routeInfo.route_summary || "Standard route"}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-medium text-slate-700">Total Distance</h4>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{routeInfo.total_distance_km} km</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-medium text-slate-700">Estimated Time</h4>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {Math.floor(routeInfo.total_duration_minutes / 60)}h {Math.round(routeInfo.total_duration_minutes % 60)}m
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-4">Delivery Sequence</h4>
                    <div className="space-y-3">
                      {routeInfo.ordered_addresses.map((address, index) => {
                        const normalizedAddress = address.toLowerCase().trim();
                        const matchedOrder = Object.entries(addressMap).find(([key]) =>
                          normalizedAddress.includes(key.split(",")[0].toLowerCase().trim())
                        );
                        const order = matchedOrder ? matchedOrder[1] : undefined;

                        return (
                          <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {order?.shipped_to_person || "Unknown Recipient"}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{address}</p>
                              {order && (
                                <div className="mt-1">
                                  <span className="text-xs text-slate-500">
                                    Order: {order.original_sales_order_number}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {routeError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{routeError}</span>
              </motion.div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by description, number, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "city")}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="city">Sort by City</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  {orders.length === 0
                    ? "No deliveries assigned yet"
                    : searchTerm
                    ? "No matching deliveries found"
                    : "All deliveries are complete"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {orders.length === 0
                    ? "You currently have no scheduled deliveries. Check back later."
                    : searchTerm
                    ? "Try adjusting your search."
                    : "You're all caught up! All deliveries have been handled."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      expandedOrderId === order.id
                        ? "border-blue-300 shadow-md bg-blue-50"
                        : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                    }`}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {order.shipped_to_city}, {order.shipped_to_state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-slate-600">
                            {order.original_sales_order_number}
                          </div>
                          {expandedOrderId === order.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-100"
                        >
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Order Information */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    Order Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-slate-500">Order Number</p>
                                      <p className="text-sm font-medium text-slate-800">{order.original_sales_order_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Line Number</p>
                                      <p className="text-sm font-medium text-slate-800">{order.original_sales_order_line || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Serial Number</p>
                                      <p className="text-sm font-medium text-slate-800">{order.serial_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">SSCC Number</p>
                                      <p className="text-sm font-medium text-slate-800">{order.sscc_number || "-"}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Details */}
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    Shipping Details
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                      <Home className="w-5 h-5 text-blue-400 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-medium text-slate-800">{order.shipped_to_street || "Address not specified"}</p>
                                        {order.shipped_to_apt_number && (
                                          <p className="text-xs text-slate-500">Apt: {order.shipped_to_apt_number}</p>
                                        )}
                                        <p className="text-sm text-slate-600">
                                          {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
                                        </p>
                                        <p className="text-xs text-slate-500">{order.shipped_to_country}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <User className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-slate-500">Recipient</p>
                                        <p className="text-sm font-medium text-slate-800">{order.shipped_to_person || "-"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-sm font-medium text-slate-800">{order.customer_email || "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Item Details */}
                              <div className="space-y-6">
                                {order.item && (
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                      <Box className="w-4 h-4 text-blue-500" />
                                      Item Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-slate-500">Item Number</p>
                                        <p className="text-sm font-medium text-slate-800">{order.item.item_number || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Description</p>
                                        <p className="text-sm font-medium text-slate-800">{order.item.item_description || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Category</p>
                                        <p className="text-sm font-medium text-slate-800">{order.item.category || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Configuration</p>
                                        <p className="text-sm font-medium text-slate-800">{order.item.configuration || "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Dimensions */}
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-blue-500" />
                                    Dimensions
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-slate-500">Size</p>
                                      <p className="text-sm font-medium text-slate-800">{order.dimension_size || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Weight</p>
                                      <p className="text-sm font-medium text-slate-800">
                                        {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Volume</p>
                                      <p className="text-sm font-medium text-slate-800">
                                        {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Dimensions (L×W×H)</p>
                                      <p className="text-sm font-medium text-slate-800">
                                        {order.dimension_length && order.dimension_breadth && order.dimension_depth
                                          ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Dates */}
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Timeline
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-slate-500">Purchased</p>
                                      <p className="text-sm font-medium text-slate-800">{formatDate(order.date_purchased)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Shipped</p>
                                      <p className="text-sm font-medium text-slate-800">{formatDate(order.date_shipped)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Delivered</p>
                                      <p className="text-sm font-medium text-slate-800">{formatDate(order.date_delivered)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Quantity</p>
                                      <p className="text-sm font-medium text-slate-800">{order.ordered_qty}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
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

export default ScheduledDeliveries;