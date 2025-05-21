import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import {
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Mail,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserCog,
  Search,
  Filter,
  Calendar,
  ClipboardList,
  Truck,
  Users,
} from "lucide-react";

interface Agent {
  agent_id: number;
  agent_name: string;
  current_address: string;
  servicing_state: string;
  servicing_city: string;
  servicing_zip?: string;
  is_verified: boolean;
  delivery_type?: string;
  created_at: string;
  updated_at: string;
  gender: string;
  dob: string;
}

interface Manager {
  manager_id: number;
  manager_name: string;
  servicing_state: string;
  servicing_city: string;
  servicing_zip?: string;
  permanent_address: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  gender: string;
  dob: string;
}

interface User {
  auditly_user_id: number;
  email: string;
  auditly_user_name: string;
}

interface PendingAgent {
  agent: Agent;
  user: User;
}

interface PendingManager {
  manager: Manager;
  user: User;
}

type ApprovalType = "agent" | "manager";

const UserPermissionRequests = () => {
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [pendingManagers, setPendingManagers] = useState<PendingManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "managers">("agents");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedManagerIdsMap, setSelectedManagerIdsMap] = useState<Record<number, number[]>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingManagers, setIsFetchingManagers] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [managerOptions, setManagerOptions] = useState<Record<number, Manager[]>>(
    {}
  );

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const [agentsResponse, managersResponse] = await Promise.all([
        fetch("/api/pending-agent-approval"),
        fetch("/api/pending-manager-approval"),
      ]);

      if (!agentsResponse.ok || !managersResponse.ok) {
        throw new Error("Failed to fetch approval requests");
      }

      const [agentsData, managersData] = await Promise.all([
        agentsResponse.json(),
        managersResponse.json(),
      ]);

      setPendingAgents(agentsData.agents || []);
      setPendingManagers(managersData.managers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableManagers = async (state: string, agentId: number) => {
    setIsFetchingManagers(true);
    try {
      const response = await fetch("/api/available-managers-by-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch managers");
  
      const data = await response.json();
      console.log("Fetched managers:", data);
  
      setManagerOptions((prev) => ({
        ...prev,
        [agentId]: data.managers || [],
      }));
    } catch (error) {
      console.error("Error fetching managers:", error);
      setManagerOptions((prev) => ({
        ...prev,
        [agentId]: [],
      }));
    } finally {
      setIsFetchingManagers(false);
    }
  };

  const handleManagerToggle = (agentId: number, managerId: number) => {
    setSelectedManagerIdsMap((prev) => {
      const currentSelected = prev[agentId] || [];
      const updated = currentSelected.includes(managerId)
        ? currentSelected.filter((id) => id !== managerId)
        : [...currentSelected, managerId];
  
      return {
        ...prev,
        [agentId]: updated,
      };
    });
  };

  const handleApprove = async (id: number, type: ApprovalType) => {
    const managerIds = selectedManagerIdsMap[id] || [];
  
    if (type === "agent" && managerIds.length === 0) {
      setError("Please select at least one manager for this agent");
      return;
    }
  
    try {
      setIsProcessing(true);
      setError(null);
  
      const approverId = localStorage.getItem("userId");
      if (!approverId) throw new Error("Approver ID not found");

      console.log("🚀 Submitting approval payload:", {
        agent_id: id,
        approver_id: parseInt(approverId),
        manager_ids: managerIds,  // This line is only included if type === "agent"
      });
      
  
      const endpoint = type === "agent" ? "/api/approve-agent" : `/api/approve-${type}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [`${type}_id`]: id,
          approver_id: parseInt(approverId),
          ...(type === "agent" && { manager_ids: managerIds }),
        }),
      });
  
      if (!response.ok) throw new Error("Approval failed");
  
      setSuccessMessage(`${type === "agent" ? "Agent" : "Manager"} approved successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPendingApprovals();
      setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  const toggleExpand = (id: number, type: ApprovalType, state?: string) => {
    const cleanState = state?.trim();
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (type === "agent" && cleanState) {
        fetchAvailableManagers(cleanState, id);
      }
    }
  };
  
  
  
  
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const filteredData =
    activeTab === "agents"
      ? pendingAgents.filter(({ agent, user }) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          const matchesSearch =
            agent.agent_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            agent.servicing_city.toLowerCase().includes(searchLower) ||
            agent.servicing_state.toLowerCase().includes(searchLower);

          const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" && agent.is_verified) ||
            (verificationFilter === "unverified" && !agent.is_verified);

          return matchesSearch && matchesVerification;
        })
      : pendingManagers.filter(({ manager, user }) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          const matchesSearch =
            manager.manager_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            manager.servicing_city.toLowerCase().includes(searchLower) ||
            manager.servicing_state.toLowerCase().includes(searchLower);

          const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" && manager.is_verified) ||
            (verificationFilter === "unverified" && !manager.is_verified);

          return matchesSearch && matchesVerification;
        });

  if (loading && pendingAgents.length === 0 && pendingManagers.length === 0) {
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
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <ShieldCheck className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Permission Requests
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Review and approve pending user permissions
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPendingApprovals}
                className="p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                title="Refresh requests"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
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

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <select
                value={verificationFilter}
                onChange={(e) =>
                  setVerificationFilter(
                    e.target.value as "all" | "verified" | "unverified"
                  )
                }
                className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Verification Status</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>

            <div className="flex border-b border-slate-200 mb-6">
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "agents"
                    ? "text-indigo-600 border-indigo-600"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("agents")}
              >
                <User className="w-5 h-5" />
                Agents ({pendingAgents.length})
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "managers"
                    ? "text-indigo-600 border-indigo-600"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("managers")}
              >
                <UserCog className="w-5 h-5" />
                Managers ({pendingManagers.length})
              </button>
            </div>

            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700">
                  No pending {activeTab} found
                </h3>
                <p className="text-slate-500 mt-2">
                  {searchTerm || verificationFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : `There are currently no ${activeTab} waiting for approval`}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((item) => {
                  const isAgent = activeTab === "agents";
                  const data = isAgent
                    ? (item as PendingAgent).agent
                    : (item as PendingManager).manager;
                  const user = item.user;
                  const id = isAgent ? data.agent_id : data.manager_id;
                  const selected = selectedManagerIdsMap[id] || [];


                  return (
                    <motion.div
                      key={`${activeTab}-${id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        expandedId === id
                          ? "border-indigo-300 shadow-md bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => {
                          console.log("🧪 Card clicked:", id, activeTab, data.servicing_state);
                          toggleExpand(id, isAgent ? "agent" : "manager", data.servicing_state);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                expandedId === id
                                  ? "bg-indigo-200 text-indigo-700"
                                  : "bg-indigo-100 text-indigo-600"
                              }`}
                            >
                              {isAgent ? (
                                <User className="w-6 h-6" />
                              ) : (
                                <UserCog className="w-6 h-6" />
                              )}
                            </motion.div>
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {isAgent
                                  ? data.agent_name
                                  : data.manager_name || `Manager #${id}`}
                              </h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {data.servicing_city}, {data.servicing_state}
                                {data.servicing_zip && `, ${data.servicing_zip}`}
                              </span>
                            </div>
                            {data.is_verified && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                            {expandedId === id ? (
                              <ChevronUp className="w-5 h-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedId === id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                      {isAgent ? (
                                        <User className="w-4 h-4 text-indigo-500" />
                                      ) : (
                                        <UserCog className="w-4 h-4 text-indigo-500" />
                                      )}
                                      {isAgent ? "Agent Details" : "Manager Details"}
                                    </h4>
                                    <div className="space-y-3">
                                      {isAgent && (
                                        <div className="flex items-center gap-3">
                                          <Truck className="w-5 h-5 text-indigo-400" />
                                          <div>
                                            <p className="text-xs text-slate-500">
                                              Delivery Type
                                            </p>
                                            <p className="text-slate-700 font-medium">
                                              {data.delivery_type || "Not specified"}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">
                                            {isAgent
                                              ? "Current Address"
                                              : "Permanent Address"}
                                          </p>
                                          <p className="text-slate-700 font-medium">
                                            {isAgent
                                              ? data.current_address
                                              : (data as Manager).permanent_address ||
                                                "Not provided"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">Gender</p>
                                          <p className="text-slate-700 font-medium">
                                            {data.gender || "Not specified"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">
                                            Date of Birth
                                          </p>
                                          <p className="text-slate-700 font-medium">
                                            {data.dob
                                              ? new Date(data.dob).toLocaleDateString()
                                              : "Not provided"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                      <ClipboardList className="w-4 h-4 text-indigo-500" />
                                      Additional Information
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">Created At</p>
                                          <p className="text-slate-700 font-medium">
                                            {new Date(data.created_at).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">
                                            Last Updated
                                          </p>
                                          <p className="text-slate-700 font-medium">
                                            {new Date(data.updated_at).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {isAgent && (
                                <div className="mt-6">
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Assign Managers
                                  </label>

                                  {(() => {
                                    const selected = selectedManagerIdsMap[id] || [];

                                    if (isFetchingManagers) {
                                      return (
                                        <div className="flex justify-center py-4">
                                          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                        </div>
                                      );
                                    }
                                    console.log("💡 managerOptions for id", id, managerOptions[id]);
                                    if (!managerOptions[id]?.length) {
                                      return (
                                        <p className="text-sm text-slate-500">
                                          No managers available for {data.servicing_state}
                                        </p>
                                      );
                                    }

                                    return (
                                      <>
                                        <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                                          {(managerOptions[id] || []).map((manager) => (
                                            <div key={manager.manager_id} className="flex items-center">
                                              <input
                                                type="checkbox"
                                                id={`manager-${manager.manager_id}-${id}`}
                                                checked={selected.includes(manager.manager_id)}
                                                onChange={() => handleManagerToggle(id, manager.manager_id)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                                              />
                                              <label
                                                htmlFor={`manager-${manager.manager_id}-${id}`}
                                                className="ml-3 block text-sm text-slate-700"
                                              >
                                                {manager.manager_name || `Manager #${manager.manager_id}`}{" "}
                                                <span className="text-slate-500 ml-2">
                                                  ({manager.servicing_city}, {manager.servicing_state})
                                                </span>
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                        {selected.length > 0 && (
                                          <p className="mt-2 text-sm text-slate-500">
                                            Selected: {selected.length} manager(s)
                                          </p>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                                )}


                              <div className="mt-8 flex justify-end">
                                <motion.button
                                  whileHover={{
                                    scale:
                                      !isProcessing && !(isAgent && selected.length === 0)
                                        ? 1.05
                                        : 1,
                                  }}
                                  whileTap={{
                                    scale:
                                      !isProcessing && !(isAgent && selected.length === 0)
                                        ? 0.95
                                        : 1,
                                  }}
                                  onClick={() =>
                                    handleApprove(id, isAgent ? "agent" : "manager")
                                  }
                                  disabled={
                                    isProcessing || (isAgent && selected.length === 0)
                                  }
                                  className={`px-8 py-3 rounded-xl flex items-center gap-2 font-medium ${
                                    isProcessing || (isAgent && selected.length === 0)
                                      ? "bg-indigo-200 text-indigo-700 cursor-not-allowed"
                                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                                  } shadow-sm`}
                                >
                                  {isProcessing && expandedId === id ? (
                                    <>
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          repeat: Infinity,
                                          duration: 1,
                                          ease: "linear",
                                        }}
                                      >
                                        <Loader2 className="w-5 h-5" />
                                      </motion.div>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      {isAgent ? (
                                        <UserCheck className="w-5 h-5" />
                                      ) : (
                                        <UserCog className="w-5 h-5" />
                                      )}
                                      Approve {isAgent ? "Agent" : "Manager"}
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserPermissionRequests;