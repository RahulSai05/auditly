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
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Warehouse,
  ClipboardList,
  Phone,
  ClipboardCheck,
  ArrowLeftRight,
  RefreshCw,
  Loader2
} from "lucide-react";

interface ReturnOrder {
  id: number;
  serial_number: string;
  original_sales_order_number: string;
  return_order_number: string;
  return_order_line: number;
  return_qty: number;
  return_condition: string;
  return_destination: string;
  return_carrier: string;
  return_warehouse: string;
  return_house_number: string;
  return_street: string;
  return_city: string;
  return_zip: string;
  return_state: string;
  return_country: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  return_created_date: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  return_agent_id: number;
  item?: {
    item_number: string;
    item_description: string;
    category: string;
    configuration: string;
  };
}

const ScheduledPickups: React.FC = () => {
  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReturnOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Agent ID not found");
      }

      const response = await fetch(`/api/agent/return-orders/${agentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch return orders: ${response.statusText}`);
      }

      const data = await response.json();
      setReturnOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch return orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReturnOrders();
  };

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading && returnOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
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
                  className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center"
                >
                  <ArrowLeftRight className="w-6 h-6 text-purple-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Scheduled Returns
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {returnOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                {error ? "Failed to load return orders" : "No scheduled returns found"}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {returnOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg">
                              Return #{order.return_order_number}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {order.return_city}, {order.return_state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
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
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                            {/* Return Information */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <ClipboardList className="w-4 h-4 text-purple-500" />
                                  Return Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">Return Number</p>
                                    <p className="text-gray-700 font-medium">{order.return_order_number || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Line Number</p>
                                    <p className="text-gray-700 font-medium">{order.return_order_line || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Original Order</p>
                                    <p className="text-gray-700 font-medium">{order.original_sales_order_number || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Serial Number</p>
                                    <p className="text-gray-700 font-medium">{order.serial_number || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Quantity</p>
                                    <p className="text-gray-700 font-medium">{order.return_qty}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Condition</p>
                                    <p className="text-gray-700 font-medium">{order.return_condition || "-"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Shipping Details */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-purple-500" />
                                  Pickup Address
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <Home className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                      <p className="text-gray-700 font-medium">
                                        {order.return_house_number} {order.return_street}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {order.return_city}, {order.return_state} {order.return_zip}
                                      </p>
                                      <p className="text-xs text-gray-500">{order.return_country}</p>
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
                                    <Box className="w-4 h-4 text-purple-500" />
                                    Item Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Item Number</p>
                                      <p className="text-gray-700 font-medium">{order.item.item_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Description</p>
                                      <p className="text-gray-700 font-medium">{order.item.item_description || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Category</p>
                                      <p className="text-gray-700 font-medium">{order.item.category || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Configuration</p>
                                      <p className="text-gray-700 font-medium">{order.item.configuration || "-"}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Return Details */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <Warehouse className="w-4 h-4 text-purple-500" />
                                  Return Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">Destination</p>
                                    <p className="text-gray-700 font-medium">{order.return_destination || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Carrier</p>
                                    <p className="text-gray-700 font-medium">{order.return_carrier || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Warehouse</p>
                                    <p className="text-gray-700 font-medium">{order.return_warehouse || "-"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Dates */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-purple-500" />
                                  Dates
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">Purchased</p>
                                    <p className="text-gray-700 font-medium">{formatDate(order.date_purchased)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Shipped</p>
                                    <p className="text-gray-700 font-medium">{formatDate(order.date_shipped)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Delivered</p>
                                    <p className="text-gray-700 font-medium">{formatDate(order.date_delivered)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Return Created</p>
                                    <p className="text-gray-700 font-medium">{formatDate(order.return_created_date)}</p>
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

export default ScheduledPickups;
