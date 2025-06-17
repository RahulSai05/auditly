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
  const actualOrderCount = Math.max((routeInfo?.ordered_orders?.length || 0) - 1, 0);
  const [routeLoading, setRouteLoading] = useState(false);<p>Total Orders Found: {actualOrderCount}</p>
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
    routeMode: "FIFO" | "LIFO"
  ) => {
    console.log("📡 Sending /api/best-route request...");
  
    setRouteLoading(true);
    setRouteError(null);
  
    try {
      const response = await fetch("/api/best-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_location: userLocation,
          addresses,
          route_mode: routeMode,
        }),
      });
  
      const result = await response.json();
  
      console.log("✅ Received /api/best-route response:", result);
  
      if (!response.ok) {
        console.error("❌ API error response:", result);
        throw new Error(result.detail || "Backend error");
      }
  
      // 🔄 Map optimized addresses to orders using addressMap
      const mappedOrders = result.ordered_addresses.map((address: string) => {
        const key = address.toLowerCase().trim();
        return addressMap[key];
      }).filter(Boolean); // Filter out null/undefined
  
      setRouteInfo({
        ...result,
        ordered_orders: mappedOrders,
      });
    } catch (err: any) {
      console.error("❌ Failed to fetch optimized route:", err);
      setRouteError("Route optimization failed. Please try again.");
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
    console.log("🟢 Optimize Route button clicked");
  
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported");
      setRouteError("Geolocation is not supported by your browser.");
      return;
    }
  
    console.log("📡 Requesting current location...");
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("📍 Got current location:", lat, lng);
  
        try {
          const reverseResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE`
          );
          const reverseData = await reverseResponse.json();
  
          if (
            reverseData.status !== "OK" ||
            !reverseData.results ||
            reverseData.results.length === 0
          ) {
            console.error("❌ Reverse geocoding failed:", reverseData);
            throw new Error("Could not get address from coordinates.");
          }
  
          const userLocation = reverseData.results[0].formatted_address;
          console.log("📌 Resolved current address:", userLocation);
  
        const routeMode = window.confirm(
          "🧭 Optimize Route\n\nWe are starting the route from your current location.\n\nClick OK to start the route at your location. Click Cancel to END the route at your location."
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
  
          console.log("✅ Valid orders count:", validOrders.length);
  
          if (validOrders.length < 2) {
            setRouteError("At least 2 valid addresses required for optimization.");
            return;
          }
  
          const addresses: string[] = [];
          const freshMap: Record<string, Order> = {};
  
          validOrders.forEach(order => {
            const fullAddress = `${order.shipped_to_street}, ${order.shipped_to_city}, ${order.shipped_to_state}, ${order.shipped_to_zip}, ${order.shipped_to_country}`;
            addresses.push(fullAddress);
            freshMap[fullAddress.toLowerCase().trim()] = order;
          });
  
          setAddressMap(freshMap);
  
          console.log("📤 Sending to /api/best-route with:", {
            user_location: userLocation,
            addresses,
            route_mode: routeMode,
          });
  
          await fetchOptimizedRoute(userLocation, addresses, routeMode);
        } catch (error) {
          console.error("❌ Error during reverse geocoding or optimization:", error);
          setRouteError("Something went wrong while resolving your location.");
        }
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
  
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setRouteError("Location access denied. Please allow location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setRouteError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setRouteError("Location request timed out.");
            break;
          default:
            setRouteError("An unknown error occurred while getting your location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
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
                    disabled={
                      routeLoading ||
                      orders.filter(order =>
                        order.shipped_to_street &&
                        order.shipped_to_city &&
                        order.shipped_to_state &&
                        order.shipped_to_zip &&
                        order.shipped_to_country
                      ).length < 2
                    }                    
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