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
  CreditCard,
  Ruler,
  Loader2,
  XCircle,
  RefreshCw
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
  status: string;
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Agent ID not found");
      }

      const response = await fetch(`/api/agent/return-orders/${agentId}`);
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

  if (loading && orders.length === 0) {
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
                  className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                >
                  <Truck className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Scheduled Deliveries
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
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                {error ? "Failed to load orders" : "No scheduled deliveries found"}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.7)" }}
                      className="p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            animate={{ 
                              rotate: expandedOrderId === order.id ? 180 : 0,
                              y: expandedOrderId === order.id ? 2 : 0
                            }}
                            className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                          >
                            <Package className="w-6 h-6" />
                          </motion.div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg">{order.shipped_to_person || "Unknown Recipient"}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {order.shipped_to_city}, {order.shipped_to_state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Delivered" 
                              ? "bg-green-100 text-green-800" 
                              : order.status === "In Transit"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status}
                          </div>
                          <motion.div
                            animate={{ 
                              rotate: expandedOrderId === order.id ? 180 : 0,
                              scale: expandedOrderId === order.id ? 1.1 : 1
                            }}
                            className="w-5 h-5 flex items-center justify-center"
                          >
                            <div className={`w-3 h-3 border-t-2 border-r-2 border-gray-500 transition-all duration-300 ${
                              expandedOrderId === order.id 
                                ? "transform rotate-[135deg] mt-1" 
                                : "transform rotate-45 mt-0"
                            }`} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: 1, 
                            height: "auto",
                            transition: { 
                              opacity: { duration: 0.2 },
                              height: { duration: 0.3 }
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            height: 0,
                            transition: { 
                              opacity: { duration: 0.1 },
                              height: { duration: 0.2 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
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
                                      <p className="text-gray-700 font-medium">{order.original_sales_order_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Line Number</p>
                                      <p className="text-gray-700 font-medium">{order.original_sales_order_line || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Serial Number</p>
                                      <p className="text-gray-700 font-medium">{order.serial_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">SSCC Number</p>
                                      <p className="text-gray-700 font-medium">{order.sscc_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Tag Number</p>
                                      <p className="text-gray-700 font-medium">{order.tag_number || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Vendor Item</p>
                                      <p className="text-gray-700 font-medium">{order.vendor_item_number || "-"}</p>
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
                                        <p className="text-gray-700 font-medium">{order.shipped_to_street || "Address not specified"}</p>
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
                                        <p className="text-gray-700 font-medium">{order.shipped_to_person || "-"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-gray-700 font-medium">{order.customer_email || "-"}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <CreditCard className="w-5 h-5 text-blue-400" />
                                      <div>
                                        <p className="text-xs text-gray-500">Account</p>
                                        <p className="text-gray-700 font-medium">{order.account_number || "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
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

                                {/* Dimensions */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-blue-500" />
                                    Dimensions
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Size</p>
                                      <p className="text-gray-700 font-medium">{order.dimension_size || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Weight</p>
                                      <p className="text-gray-700 font-medium">
                                        {order.dimension_weight ? `${order.dimension_weight} kg` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Volume</p>
                                      <p className="text-gray-700 font-medium">
                                        {order.dimension_volume ? `${order.dimension_volume} m³` : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Dimensions (L×W×H)</p>
                                      <p className="text-gray-700 font-medium">
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
                                      <p className="text-xs text-gray-500">Quantity</p>
                                      <p className="text-gray-700 font-medium">{order.ordered_qty}</p>
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
