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
}

const AssignPickups: React.FC = () => {
  const [managerId, setManagerId] = useState<number | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null);
  const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<number | null>(null);

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
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleItemSelect = (item: ReturnItem) => {
    setSelectedItem(item);
    fetchEligibleAgents(item.id);
  };

  const handleAssignAgent = async (agentId: number) => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      setError(null);

      // In a real implementation, you would call an API to assign the agent
      // This is just a simulation
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage(`Agent ${agentId} assigned to return order ${selectedItem.return_order}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the list
      if (managerId) {
        fetchReturnItems(managerId);
      }
      setSelectedItem(null);
      setEligibleAgents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign agent");
      setTimeout(() => setError(null), 3000);
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

  if (loading && returnItems.length === 0) {
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
                  Assign Return Pickups
                </h1>
              </div>
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

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {returnItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                No return items found in your servicing state
              </motion.div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  Available Return Orders
                </h2>
                
                {returnItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.7)" }}
                      className="p-6 cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <motion.div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Package className="w-6 h-6" />
                          </motion.div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg">
                              {item.item.item_number} - {item.item.description}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.return_state}, {item.return_zip}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : item.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.status}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.return_order}-{item.order_line}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {selectedItem?.id === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 pt-2 border-t border-gray-100"
                      >
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            Order Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Return Condition</p>
                              <p className="text-gray-700 font-medium">{item.return_condition}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Carrier</p>
                              <p className="text-gray-700 font-medium">{item.return_carrier}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Destination</p>
                              <p className="text-gray-700 font-medium">{item.return_destination}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Created Date</p>
                              <p className="text-gray-700 font-medium">{formatDate(item.return_created_date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            Eligible Agents ({eligibleAgents.length})
                          </h4>

                          {eligibleAgents.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              No eligible agents found for this return order
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {eligibleAgents.map((agent) => (
                                <motion.div
                                  key={agent.agent_id}
                                  whileHover={{ scale: 1.01 }}
                                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h5 className="font-medium text-gray-800">
                                        {agent.agent_name}
                                      </h5>
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Servicing ZIP: {agent.servicing_zip}</span>
                                        {agent.is_verified && (
                                          <span className="flex items-center gap-1 text-green-600">
                                            <ShieldCheck className="w-4 h-4" />
                                            Verified
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleAssignAgent(agent.agent_id)}
                                      disabled={loading}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
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
                      </motion.div>
                    )}
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