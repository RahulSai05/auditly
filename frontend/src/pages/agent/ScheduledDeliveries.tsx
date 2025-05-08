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
  CreditCard,
  Hash,
  Tag,
  Ruler,
  Scale,
  Clock,
  CheckCircle,
  AlertCircle
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get agent_id from localStorage or wherever it's stored
        const agentId = localStorage.getItem("agentId");
        if (!agentId) {
          throw new Error("Agent ID not found");
        }

        const response = await fetch(`/api/agent/orders/${agentId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        No scheduled deliveries found
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Scheduled Deliveries
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <motion.div
              whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{order.shipped_to_person}</h3>
                  <p className="text-sm text-gray-600">{order.shipped_to_city}, {order.shipped_to_state}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === "Delivered" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedOrderId === order.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {expandedOrderId === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white"
                >
                  <div className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Number</p>
                          <p className="font-medium">{order.original_sales_order_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Serial Number</p>
                          <p className="font-medium">{order.serial_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">SSCC Number</p>
                          <p className="font-medium">{order.sscc_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Vendor Item</p>
                          <p className="font-medium">{order.vendor_item_number}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Home className="w-4 h-4 mt-0.5 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.shipped_to_street}</p>
                            {order.shipped_to_apt_number && (
                              <p className="text-sm">Apt: {order.shipped_to_apt_number}</p>
                            )}
                            <p className="text-sm">
                              {order.shipped_to_city}, {order.shipped_to_state} {order.shipped_to_zip}
                            </p>
                            <p className="text-sm">{order.shipped_to_country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p>{order.shipped_to_person}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p>{order.customer_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <p>Account: {order.account_number}</p>
                        </div>
                      </div>
                    </div>

                    {/* Item Details */}
                    {order.item && (
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Box className="w-4 h-4" />
                          Item Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Item Number</p>
                            <p className="font-medium">{order.item.item_number || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="font-medium">{order.item.item_description || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">{order.item.category || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Configuration</p>
                            <p className="font-medium">{order.item.configuration || "-"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dimensions */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Dimensions
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Size</p>
                          <p className="font-medium">{order.dimension_size}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">{order.dimension_weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Volume</p>
                          <p className="font-medium">{order.dimension_volume} m³</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dimensions</p>
                          <p className="font-medium">
                            {order.dimension_length} × {order.dimension_breadth} × {order.dimension_depth} cm
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Dates
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Purchased</p>
                          <p className="font-medium">{formatDate(order.date_purchased)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Shipped</p>
                          <p className="font-medium">{formatDate(order.date_shipped)}</p>
                        </div>
                        {order.date_delivered && (
                          <div>
                            <p className="text-sm text-gray-500">Delivered</p>
                            <p className="font-medium">{formatDate(order.date_delivered)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{order.ordered_qty}</p>
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
    </div>
  );
};

export default ScheduledDeliveries;
