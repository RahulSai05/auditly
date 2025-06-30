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
  AlertCircle,
  Search,
  RefreshCw,
  Archive,
  Users,
  Clock,
  Mail,
  Hash,
  RotateCcw,
} from "lucide-react";

interface ReturnItem {
  id: number;
  return_order: string;
  order_line: number;
  item_id: number;
  return_condition: string;
  return_carrier: string;
  return_destination: string;
  return_city: string;
  return_state: string;
  return_country: string;
  return_zip: string;
  status: "Pending Agent Assignment" | "Agent Assigned" | "Completed";
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  return_created_date: string;
  return_received_date: string;
  assigned_agent: {
    agent_id: number;
    agent_name: string;
  } | null;
  item: {
    item_number: string;
    description: string;
    category: string;
  };
}

interface EligibleAgent {
  agent_id: number;
  agent_name: string;
  servicing_zip: string[];
  pickup_routing_mode: boolean;
  manager_id: string[];
  total_sales_orders: number;
  total_return_orders: number;
}

const AssignPickups: React.FC = () => {
  const [managerId, setManagerId] = useState<string | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null);
  const [eligibleAgents, setEligibleAgents] = useState<EligibleAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "state" | "order">("date");
  const [fetchingAgents, setFetchingAgents] = useState(false);
  const organization = localStorage.getItem("organization") || "";

  useEffect(() => {
    const id = localStorage.getItem("managerId");
    if (id) {
      setManagerId(id);
      fetchReturnItems(id);
    } else {
      setError("Manager ID not found. Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchReturnItems = async (managerId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/return-items/by-manager-grade-region", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manager_id: managerId, organization: organization}),
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

  const fetchEligibleAgents = async (zipCode: string) => {
    if (!managerId) return;
    
    try {
      setFetchingAgents(true);
      setError(null);

      const response = await fetch("/api/agents/manual-return/by-manager-and-zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager_id: managerId,
          return_to_zip: zipCode.toString(),
          organization: organization,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch eligible agents");
      }

      const data = await response.json();
      setEligibleAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch eligible agents");
    } finally {
      setFetchingAgents(false);
    }
  };

  const handleItemSelect = async (item: ReturnItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setEligibleAgents([]);
      return;
    }

    setSelectedItem(item);
    
    if (item.status === "Pending Agent Assignment" && !item.assigned_agent) {
      await fetchEligibleAgents(item.return_zip);
    }
  };

  const handleAssignAgent = async (agentId: number) => {
    if (!selectedItem) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch("/api/assign-manual-agent-return-order", {
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
        throw new Error(errorData.detail || "Failed to assign return agent");
      }

      setSuccessMessage(`Successfully assigned agent to return order ${selectedItem.return_order}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      if (managerId) {
        await fetchReturnItems(managerId);
      }
      setSelectedItem(null);
      setEligibleAgents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign return agent");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignAgent = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/unassign-return-order/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to unassign agent");
      }

      setSuccessMessage(`Successfully unassigned agent from return order`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      if (managerId) {
        await fetchReturnItems(managerId);
      }
      setSelectedItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unassign agent");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (managerId) {
      await fetchReturnItems(managerId);
      setSelectedItem(null);
      setEligibleAgents([]);
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

  const filteredItems = returnItems
    .filter((item) => {
      const matchesSearch = searchTerm.toLowerCase() === "" || 
        item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.return_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.return_state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.return_city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "Pending Agent Assignment" && !item.assigned_agent) ||
        (statusFilter === "Agent Assigned" && item.assigned_agent) ||
        (statusFilter === "Completed" && item.status === "Completed");
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.return_created_date).getTime() - new Date(a.return_created_date).getTime();
      } else if (sortBy === "state") {
        return a.return_state.localeCompare(b.return_state);
      } else {
        return a.return_order.localeCompare(b.return_order);
      }
    });

  if (loading && returnItems.length === 0) {
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
                <RotateCcw className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Return Pickups
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Assign agents to process return pickups and manage your return operations
              </p>
            </div>

            {/* Alert Messages */}
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

            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by return order, item description, or location..."
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
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "state" | "order")}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="state">Sort by State</option>
                  <option value="order">Sort by Order #</option>
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Returns</p>
                    <p className="text-xl font-semibold text-blue-800">{filteredItems.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending Assignment</p>
                    <p className="text-xl font-semibold text-yellow-800">
                      {filteredItems.filter(item => !item.assigned_agent).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Agent Assigned</p>
                    <p className="text-xl font-semibold text-green-800">
                      {filteredItems.filter(item => item.assigned_agent).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns List */}
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <RotateCcw className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  {returnItems.length === 0
                    ? "No returns found for your region"
                    : searchTerm || statusFilter !== "all"
                    ? "No matching results"
                    : "All returns have been processed"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {returnItems.length === 0
                    ? "There are no pending or completed return orders for your managed region."
                    : searchTerm || statusFilter !== "all"
                    ? "Try clearing your search or changing filters to see available returns."
                    : "You're all caught up! No pending return orders remain."}
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
                        ? "border-blue-300 shadow-lg bg-blue-50"
                        : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                    }`}
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <RotateCcw className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-slate-900 text-lg mb-1">
                                  {item.item.description}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Hash className="w-4 h-4" />
                                  <span className="font-medium">{item.return_order}-{item.order_line}</span>
                                  <span className="text-slate-400">•</span>
                                  <span>{item.item.category}</span>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                item.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : item.assigned_agent
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {item.status === "Completed" ? "Completed" : 
                                 item.assigned_agent ? "Agent Assigned" : "Pending Assignment"}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">
                                    {item.return_city}, {item.return_state}, {item.return_country}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="font-medium text-slate-700">{item.return_zip}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">Return Created: {formatDate(item.return_created_date)}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {item.assigned_agent && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">
                                      Agent: <span className="font-medium text-slate-800">{item.assigned_agent.agent_name}</span>
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Package className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">
                                    Condition: <span className="font-medium text-slate-700">{item.return_condition}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
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
                          <div className="p-6 bg-slate-50">
                            {item.assigned_agent ? (
                              <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200">
                                  <div className="text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                      item.status === "Completed" 
                                        ? "bg-green-100" 
                                        : "bg-green-100"
                                    }`}>
                                      {item.status === "Completed" ? (
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                      ) : (
                                        <User className="w-8 h-8 text-green-600" />
                                      )}
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-800 mb-2">
                                      {item.status === "Completed" ? "Return Completed" : "Agent Assigned"}
                                    </h4>
                                    <p className="text-slate-600 mb-4">
                                      <span className="font-medium">{item.assigned_agent.agent_name}</span> 
                                      {item.status === "Completed" 
                                        ? " has completed this return pickup"
                                        : " has been assigned to handle this return pickup"
                                      }
                                    </p>
                                    {item.status === "Agent Assigned" && (
                                      <button
                                        onClick={() => handleUnassignAgent(item.id)}
                                        disabled={loading}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 mx-auto transition-colors"
                                      >
                                        <XCircle className="w-5 h-5" />
                                        Unassign Agent
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Available Agents for ZIP {item.return_zip}
                                  </h4>
                                  {eligibleAgents.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                      {eligibleAgents.length} agent{eligibleAgents.length !== 1 ? 's' : ''} available
                                    </span>
                                  )}
                                </div>

                                {fetchingAgents ? (
                                  <div className="flex justify-center py-12">
                                    <div className="text-center">
                                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                                      <p className="text-slate-600">Finding available agents...</p>
                                    </div>
                                  </div>
                                ) : eligibleAgents.length === 0 ? (
                                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <h5 className="text-lg font-medium text-slate-700 mb-2">No Available Agents</h5>
                                    <p className="text-slate-500">
                                      No agents are currently available to serve ZIP code {item.return_zip}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="grid gap-4">
                                    {eligibleAgents.map((agent) => (
                                      <div key={agent.agent_id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                              <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center gap-3 mb-3">
                                                <h5 className="font-semibold text-slate-800 text-lg">
                                                  {agent.agent_name}
                                                </h5>
                                                {agent.pickup_routing_mode && (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                    Routing Mode
                                                  </span>
                                                )}
                                              </div>
                                              
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex items-center gap-2">
                                                  <MapPin className="w-4 h-4 text-slate-400" />
                                                  <span className="text-sm text-slate-600">
                                                    ZIP: <span className="font-medium">{Array.isArray(agent.servicing_zip) ? agent.servicing_zip.join(", ") : agent.servicing_zip}</span>
                                                  </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                  <Package className="w-4 h-4 text-slate-400" />
                                                  <span className="text-sm text-slate-600">
                                                  Active Sales Orders: <span className="font-medium text-blue-600">{agent.total_sales_orders}</span>
                                                  </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                  <Archive className="w-4 h-4 text-slate-400" />
                                                  <span className="text-sm text-slate-600">
                                                    Active Return Orders: <span className="font-medium text-purple-600">{agent.total_return_orders}</span>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <button
                                            onClick={() => handleAssignAgent(agent.agent_id)}
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors ml-4"
                                          >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Assign Agent
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
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

export default AssignPickups;