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
  Calendar,
  Search,
  Filter,
  Hash,
  Mail,
  Clock,
  User,
  Loader2
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "city" | "order">("date");
  
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
    })
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
  }, [successMessage]);

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
      setTimeout(() => setSuccessMessage(null), 5000);
      setAssigning({id: null, type: null});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign order");
      setTimeout(() => setError(null), 5000);
      setAssigning({id: null, type: null});
    }
  };

  const handleRefresh = async () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const agentId = localStorage.getItem("agentId");
        if (!agentId) {
          throw new Error("Agent ID not found. Please log in again.");
        }

        const zipResponse = await fetch(`/api/agent-zip-codes/${agentId}`);
        if (!zipResponse.ok) {
          throw new Error("Failed to fetch agent's zip codes");
        }
        const zipData: AgentZipCodes = await zipResponse.json();
        setAgentZipCodes(zipData.servicing_zip);

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
        setError(err instanceof Error ? err.message : "Failed to refresh data");
        setLoading(false);
      }
    };

    await fetchData();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filterItems = (items: SaleItem[] | ReturnItem[]) => {
    return items
      .filter((item) => {
        const matchesSearch = searchTerm.toLowerCase() === "" || 
          item.item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ('sales_order' in item ? item.sales_order : item.return_order_number).toLowerCase().includes(searchTerm.toLowerCase()) ||
          ('shipped_to_city' in item ? item.shipped_to_city : item.return_city).toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
          item.status.toLowerCase().includes(statusFilter.toLowerCase());
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date_purchased).getTime() - new Date(a.date_purchased).getTime();
        } else if (sortBy === "city") {
          const cityA = 'shipped_to_city' in a ? a.shipped_to_city : a.return_city;
          const cityB = 'shipped_to_city' in b ? b.shipped_to_city : b.return_city;
          return cityA.localeCompare(cityB);
        } else {
          const orderA = 'sales_order' in a ? a.sales_order : a.return_order_number;
          const orderB = 'sales_order' in b ? b.sales_order : b.return_order_number;
          return orderA.localeCompare(orderB);
        }
      });
  };

  const currentItems = activeTab === "sales" ? saleItems : returnItems;
  const filteredItems = filterItems(currentItems);

  if (loading && currentItems.length === 0) {
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-12">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Available Orders
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find and claim deliveries in your service area
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

            {/* Service Area Display */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Your Service Area</p>
                  <p className="text-blue-600">{agentZipCodes.join(", ")}</p>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by order number, item description, or delivery city..."
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
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
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

              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  className={`flex-1 px-4 py-3 font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                    activeTab === "sales"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab("sales")}
                >
                  <Package className="w-5 h-5" />
                  <span>Sales Orders ({filterItems(saleItems).length})</span>
                </button>
                
                <button
                  className={`flex-1 px-4 py-3 font-medium border-b-2 flex items-center justify-center gap-2 transition-all ${
                    activeTab === "returns"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab("returns")}
                >
                  <Archive className="w-5 h-5" />
                  <span>Returns ({filterItems(returnItems).length})</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            <AnimatePresence mode="wait">
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    {activeTab === "sales" ? (
                      <Package className="w-8 h-8 text-slate-400" />
                    ) : (
                      <Archive className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    No {activeTab === "sales" ? "sales" : "return"} orders found
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try clearing your search or changing filters to see available orders."
                      : `There are currently no ${activeTab === "sales" ? "sales" : "return"} orders available in your assigned zip codes.`}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {filteredItems.map((item, index) => {
                    const isSalesItem = 'sales_order' in item;
                    const orderNumber = isSalesItem ? item.sales_order : item.return_order_number;
                    const orderLine = isSalesItem ? item.order_line : item.return_order_line;
                    const city = isSalesItem ? item.shipped_to_city : item.return_city;
                    const state = isSalesItem ? item.shipped_to_state : item.return_state;
                    const zip = isSalesItem ? item.shipped_to_zip : item.return_zip;
                    const agentId = isSalesItem ? item.delivery_agent_id : item.return_agent_id;
                    const isAssignedToCurrentAgent = agentId === parsedAgentId;
                    const canAssign = agentId === null || !isAssignedToCurrentAgent;

                    return (
                      <motion.div
                        key={`${activeTab}-${item.id}`}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="border border-slate-200 hover:border-blue-200 p-6 rounded-xl transition-all duration-200 hover:shadow-md bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                              {isSalesItem ? (
                                <Package className="w-6 h-6" />
                              ) : (
                                <Archive className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-lg mb-1">
                                    {item.item.description}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Hash className="w-4 h-4" />
                                    <span className="font-medium">{orderNumber}-{orderLine}</span>
                                    <span className="text-slate-400">•</span>
                                    <span>{item.item.category}</span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === "delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : item.status === "Assigned to Agent"
                                    ? "bg-purple-100 text-purple-800"
                                    : item.status === "shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {item.status}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">
                                      {city}, {state} {zip}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">
                                      Purchased: {formatDate(item.date_purchased)}
                                    </span>
                                  </div>

                                  {!isSalesItem && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="w-4 h-4 text-slate-400" />
                                      <span className="text-slate-600">
                                        Condition: {item.return_condition}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  {isSalesItem && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="w-4 h-4 text-slate-400" />
                                      <span className="text-slate-600 truncate">{item.customer_email}</span>
                                    </div>
                                  )}
                                  
                                  {item.serial_number && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Hash className="w-4 h-4 text-slate-400" />
                                      <span className="text-slate-600">
                                        Serial: <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">
                                          {item.serial_number}
                                        </code>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {canAssign && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => assignOrder(item.id, !isSalesItem)}
                                disabled={assigning.id === item.id && assigning.type === activeTab}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                  assigning.id === item.id && assigning.type === activeTab
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                {assigning.id === item.id && assigning.type === activeTab ? (
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

                            {isAssignedToCurrentAgent && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-800 rounded-lg text-sm">
                                <User className="w-4 h-4" />
                                <span>Assigned to You</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PickOrder;