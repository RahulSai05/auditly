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
  status: "Pending Agent Assignment" | "Agent Assigned";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "city" | "order">("date");
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
      setSaleItems(data.sale_items);
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
    
    if (item.status === "Pending Agent Assignment") {
      await fetchEligibleAgents(item.id);
    }
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

  const filteredItems = saleItems
    .filter((item) => {
      const matchesSearch = searchTerm.toLowerCase() === "" || 
        item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sales_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shipped_to_city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_purchased).getTime() - new Date(a.date_purchased).getTime();
      } else if (sortBy === "city") {
        return a.shipped_to_city.localeCompare(b.shipped_to_city);
      } else {
        return a.sales_order.localeCompare(b.sales_order);
      }
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
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
                <Truck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Delivery Assignments
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Assign delivery agents to pending orders
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Agent Assignment">Pending Assignment</option>
                  <option value="Agent Assigned">Agent Assigned</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "city" | "order")}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="city">Sort by City</option>
                  <option value="order">Sort by Order #</option>
                </select>
              </div>
            </div>

            {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">
                    {saleItems.length === 0
                      ? "No orders found for your region"
                      : searchTerm || statusFilter !== "all"
                      ? "No matching results"
                      : "All deliveries are already assigned"}
                  </h3>
                  <p className="text-slate-500 mt-2">
                    {saleItems.length === 0
                      ? "There are no pending or completed sales orders for your managed states."
                      : searchTerm || statusFilter !== "all"
                      ? "Try clearing your search or changing filters to see available orders."
                      : "You're all caught up! No pending orders remain."}
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
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {item.item.description}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {item.shipped_to_city}, {item.shipped_to_state}
                            </p>
                            <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                              item.status === "Agent Assigned"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.status}
                            </div>
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
                            {item.status === "Pending Agent Assignment" ? (
                              <div>
                                <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                  <User className="w-5 h-5 text-blue-500" />
                                  Available Agents ({eligibleAgents.length})
                                </h4>

                                {fetchingAgents ? (
                                  <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                  </div>
                                ) : eligibleAgents.length === 0 ? (
                                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                    <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600">No available agents for this location</p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {eligibleAgents.map((agent) => (
                                      <div key={agent.agent_id} className="p-4 border border-slate-200 rounded-lg bg-white">
                                        <div className="flex justify-between items-start gap-4">
                                          <div>
                                            <div className="flex items-center gap-2 mb-2">
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
                                            <div className="text-sm text-slate-600">
                                              <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>Serves ZIP: {agent.servicing_zip}</span>
                                              </div>
                                              <div className="mt-1">
                                                <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                  Current assignments: {agent.assigned_sales_order_count}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleAssignAgent(agent.agent_id)}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                          >
                                            Assign
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                <p className="text-slate-600">Agent already assigned to this order</p>
                              </div>
                            )}
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