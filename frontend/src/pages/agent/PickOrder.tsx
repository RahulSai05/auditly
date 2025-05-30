import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  Archive, 
  UserPlus, 
  MapPin,
  Truck,
  ArrowLeft,
  Calendar
} from "lucide-react";

interface SaleItem {
  id: number;
  sales_order: string;
  order_line: string;
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
  delivery_agent_id: number | null;
  item: {
    item_number: string;
    description: string;
    category: string;
  };
}

interface ReturnItem {
  id: number;
  return_order_number: string;
  return_order_line: string;
  original_sales_order_number: string;
  return_qty: number;
  return_condition: string;
  return_carrier: string;
  return_warehouse: string;
  return_city: string;
  return_state: string;
  return_zip: string;
  status: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  return_created_date: string;
  return_received_date: string;
  return_agent_id: number | null;
  item: {
    item_number: string;
    description: string;
    category: string;
  };
}

interface AgentZipCodes {
  agent_id: number;
  agent_name: string;
  servicing_zip: string[];
}

interface AssignmentResponse {
  message: string;
  order_id: number;
  assigned_agent_id: number;
}

const PickOrder: React.FC = () => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [agentZipCodes, setAgentZipCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sales" | "returns">("sales");
  const [assigning, setAssigning] = useState<{id: number | null, type: 'sales' | 'returns' | null}>({id: null, type: null});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const agentId = localStorage.getItem("agentId");
  const parsedAgentId = agentId ? parseInt(agentId) : null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const tabVariants = {
    inactive: { 
      color: "#6B7280", 
      borderColor: "transparent",
      transition: { duration: 0.2 }
    },
    active: { 
      color: "#3B82F6", 
      borderColor: "#3B82F6",
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const agentId = localStorage.getItem("agentId");
        if (!agentId) {
          throw new Error("Agent ID not found. Please log in again.");
        }

        // Fetch agent's zip codes
        const zipResponse = await fetch(`/api/agent-zip-codes/${agentId}`);
        if (!zipResponse.ok) {
          throw new Error("Failed to fetch agent's zip codes");
        }
        const zipData: AgentZipCodes = await zipResponse.json();
        
        if (!zipData.servicing_zip || zipData.servicing_zip.length === 0) {
          throw new Error("No zip codes assigned to this agent");
        }
        setAgentZipCodes(zipData.servicing_zip);

        // Fetch sale items
        const saleResponse = await fetch("/api/sale-items-by-zip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agent_id: parseInt(agentId),
            zip_code: zipData.servicing_zip,
          }),
        });

        if (!saleResponse.ok) {
          throw new Error("Failed to fetch sale items");
        }
        const saleData = await saleResponse.json();

        // Fetch return items
        const returnResponse = await fetch("/api/return-items-by-zip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agent_id: parseInt(agentId),
            zip_code: zipData.servicing_zip,
          }),
        });

        if (!returnResponse.ok) {
          throw new Error("Failed to fetch return items");
        }
        const returnData = await returnResponse.json();

        setSaleItems(saleData.sale_items);
        setReturnItems(returnData.return_items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [successMessage]); // Refetch when assignment succeeds

  const assignOrder = async (orderId: number, isReturnOrder: boolean) => {
    try {
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        throw new Error("Agent ID not found");
      }

      setAssigning({id: orderId, type: isReturnOrder ? 'returns' : 'sales'});

      const endpoint = isReturnOrder 
        ? "/api/assign-manual-agent-return-order" 
        : "/api/assign-manual-agent-sales-order";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          agent_id: parseInt(agentId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign order");
      }

      const data: AssignmentResponse = await response.json();
      setSuccessMessage(data.message);
      setAssigning({id: null, type: null});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign order");
      setAssigning({id: null, type: null});
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-4 bg-white rounded-full shadow-md">
            <RefreshCw className="animate-spin w-10 h-10 text-blue-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-red-50 p-8 max-w-lg"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600">{error}</p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <Truck className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
            Available Orders
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and claim deliveries in your service area
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-800"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zip Code Display */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Your Service Area</p>
            <p className="text-blue-600">{agentZipCodes.join(", ")}</p>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-blue-100">
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "sales" ? "active" : "inactive"}
              className="flex-1 px-4 py-4 font-medium border-b-2 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("sales")}
              whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Package className="w-5 h-5" />
              <span>Sales Orders ({saleItems.length})</span>
            </motion.button>
            
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "returns" ? "active" : "inactive"}
              className="flex-1 px-4 py-4 font-medium border-b-2 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("returns")}
              whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Archive className="w-5 h-5" />
              <span>Returns ({returnItems.length})</span>
            </motion.button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Sales Tab Content */}
              {activeTab === "sales" && (
                <motion.div
                  key="sales-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {saleItems.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 px-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No sales orders found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        There are currently no sales orders available in your assigned zip codes.
                      </p>
                    </motion.div>
                  ) : (
                    saleItems.map((item, index) => (
                      <motion.div
                        key={`sale-${item.id}`}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-2 border-blue-50 hover:border-blue-100 p-5 rounded-2xl transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">{item.item.description}</h3>
                            <div className="flex gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Order:</span>
                                <span className="font-medium">{item.sales_order}-{item.order_line}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Item:</span>
                                <span>{item.item.item_number}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center text-sm text-gray-600">
                              <span className="text-gray-500">Serial:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                                {item.serial_number || "N/A"}
                              </code>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium mb-2 ${
                              item.status === "delivered" 
                                ? "bg-green-100 text-green-800" 
                                : item.status === "Assigned to Agent"
                                ? "bg-purple-100 text-purple-800"
                                : item.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>Delivered: {formatDate(item.date_delivered)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                          <div className="text-sm">
                            <p className="text-gray-600 mb-1">
                              <span className="text-gray-500">Customer:</span> {item.customer_email}
                            </p>
                            <p className="text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{item.shipped_to_city}, {item.shipped_to_state} {item.shipped_to_zip}</span>
                            </p>
                          </div>
                          
                          {(item.delivery_agent_id === null || item.delivery_agent_id !== parsedAgentId) && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => assignOrder(item.id, false)}
                              disabled={assigning.id === item.id && assigning.type === 'sales'}
                              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                                assigning.id === item.id && assigning.type === 'sales'
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {assigning.id === item.id && assigning.type === 'sales' ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Assigning...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  Assign to Me
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Returns Tab Content */}
              {activeTab === "returns" && (
                <motion.div
                  key="returns-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {returnItems.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 px-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <Archive className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No return orders found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        There are currently no return orders available in your assigned zip codes.
                      </p>
                    </motion.div>
                  ) : (
                    returnItems.map((item, index) => (
                      <motion.div
                        key={`return-${item.id}`}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-2 border-blue-50 hover:border-blue-100 p-5 rounded-2xl transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">{item.item.description}</h3>
                            <div className="flex gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Return:</span>
                                <span className="font-medium">{item.return_order_number}-{item.return_order_line}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Original Order:</span>
                                <span>{item.original_sales_order_number}</span>
                              </div>
                            </div>
                            <div className="flex gap-4 items-center text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Item:</span>
                                <span>{item.item.item_number}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Qty:</span>
                                <span className="font-medium">{item.return_qty}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium mb-2 ${
                              item.status === "received" 
                                ? "bg-green-100 text-green-800" 
                                : item.status === "Assigned to Agent"
                                ? "bg-purple-100 text-purple-800"
                                : item.status === "in transit"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>Received: {formatDate(item.return_received_date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                          <div className="text-sm">
                            <p className="text-gray-600 mb-1">
                              <span className="text-gray-500">Condition:</span> {item.return_condition}
                            </p>
                            <p className="text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{item.return_city}, {item.return_state} {item.return_zip}</span>
                            </p>
                          </div>
                          
                          {(item.return_agent_id === null || item.return_agent_id !== parsedAgentId) && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => assignOrder(item.id, true)}
                              disabled={assigning.id === item.id && assigning.type === 'returns'}
                              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                                assigning.id === item.id && assigning.type === 'returns'
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {assigning.id === item.id && assigning.type === 'returns' ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Assigning...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  Assign to Me
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PickOrder;