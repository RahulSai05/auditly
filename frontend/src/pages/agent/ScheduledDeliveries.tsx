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
  CreditCard,
  Hash,
  Tag,
  Ruler,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Info,
  ShieldCheck
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
  status: "Pending" | "In Transit" | "Delivered" | "Failed";
  delivery_agent_id: number;
  item?: {
    item_number: string;
    item_description: string;
    category: string;
    configuration: string;
  };
}

const ScheduledDeliveries: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "city" | "status">("date");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Pleaes re-login!");
      }

      const response = await fetch(`/api/agent/sales-orders/${agentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date_shipped).getTime() - new Date(a.date_shipped).getTime();
    } else if (sortBy === "city") {
      return a.shipped_to_city.localeCompare(b.shipped_to_city);
    } else {
      return a.status.localeCompare(b.status);
    }
  });


  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex justify-center items-center">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
                <Truck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Scheduled Deliveries
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by description, number, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "city" | "status")}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="city">Sort by City</option>
                  <option value="status">Sort by Status</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
                className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100"
              >
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  {orders.length === 0
                    ? "No deliveries assigned yet"
                    : searchTerm || statusFilter !== "all"
                    ? "No matching deliveries found"
                    : "All deliveries are complete"}
                </h3>
                <p className="text-gray-500 mt-2">
                  {orders.length === 0
                    ? "You currently have no scheduled deliveries. Check back later."
                    : searchTerm || statusFilter !== "all"
                    ? "Try adjusting filters or updating your search."
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
                        : "border-gray-200 hover:border-blue-200 bg-white hover:shadow-md"
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
                            <h3 className="font-medium text-gray-900">{order.shipped_to_person || "Unknown Recipient"}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {order.shipped_to_city}, {order.shipped_to_state}
                            </p>
                            <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                              order.status === "Delivered" 
                                ? "bg-green-100 text-green-800" 
                                : order.status === "In Transit"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-gray-600">
                            {order.original_sales_order_number}
                          </div>
                          {expandedOrderId === order.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
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
                          className="border-t border-gray-100"
                        >
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Order Information */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    Order Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Order Number</p>
                                      <p className="text-sm font-medium text-gray-800">{order.original_sales_order_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Line Number</p>
                                      <p className="text-sm font-medium text-gray-800">{order.original_sales_order_line || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Serial Number</p>
                                      <p className="text-sm font-medium text-gray-800">{order.serial_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">SSCC Number</p>
                                      <p className="text-sm font-medium text-gray-800">{order.sscc_number || "-"}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Details */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    Shipping Details
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                      <Home className="w-5 h-5 text-blue-400 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-800">{order.shipped_to_street || "Address not specified"}</p>
                                        {order.shipped_to_apt_number && (
                                          <p className="text-xs text-gray-500">Apt: {order.shipped_to_apt_number}</p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                          {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
                                        </p>
                                        <p className="text-xs text-gray-500">{order.shipped_to_country}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <User className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-gray-500">Recipient</p>
                                        <p className="text-sm font-medium text-gray-800">{order.shipped_to_person || "-"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-800">{order.customer_email || "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Item Details */}
                              <div className="space-y-6">
                                {order.item && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                      <Box className="w-4 h-4 text-blue-500" />
                                      Item Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-gray-500">Item Number</p>
                                        <p className="text-sm font-medium text-gray-800">{order.item.item_number || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Description</p>
                                        <p className="text-sm font-medium text-gray-800">{order.item.item_description || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Category</p>
                                        <p className="text-sm font-medium text-gray-800">{order.item.category || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Configuration</p>
                                        <p className="text-sm font-medium text-gray-800">{order.item.configuration || "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Dimensions */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-blue-500" />
                                    Dimensions
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Size</p>
                                      <p className="text-sm font-medium text-gray-800">{order.dimension_size || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Weight</p>
                                      <p className="text-sm font-medium text-gray-800">
                                        {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Volume</p>
                                      <p className="text-sm font-medium text-gray-800">
                                        {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Dimensions (L×W×H)</p>
                                      <p className="text-sm font-medium text-gray-800">
                                        {order.dimension_length && order.dimension_breadth && order.dimension_depth
                                          ? `${order.dimension_length} × ${order.dimension_breadth} × ${order.dimension_depth} cm`
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Dates */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Timeline
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Purchased</p>
                                      <p className="text-sm font-medium text-gray-800">{formatDate(order.date_purchased)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Shipped</p>
                                      <p className="text-sm font-medium text-gray-800">{formatDate(order.date_shipped)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Delivered</p>
                                      <p className="text-sm font-medium text-gray-800">{formatDate(order.date_delivered)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Quantity</p>
                                      <p className="text-sm font-medium text-gray-800">{order.ordered_qty}</p>
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