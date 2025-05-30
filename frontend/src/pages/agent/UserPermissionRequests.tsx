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
  Info,
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
  Star,
} from "lucide-react";

interface Agent {
  agent_id: number;
  agent_name: string;
  current_address: string;
  servicing_state: string;
  servicing_city: string;
  servicing_zip?: string | string[];
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
  servicing_zip?: string | string[];
  permanent_address: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  gender: string;
  dob: string;
  manager_grade: 'c1' | 'c2' | 'c3';
  work_schedule?: any;
  reporting_manager_id?: number | number[] | null;
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

interface ManagerGroup {
  c1: Manager[];
  c2: Manager[];
  c3: Manager[];
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingManagers, setIsFetchingManagers] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [managerGroups, setManagerGroups] = useState<Record<number, ManagerGroup>>({});
  const [primaryManagerMap, setPrimaryManagerMap] = useState<Record<number, number | null>>({});
  const [secondaryManagerMap, setSecondaryManagerMap] = useState<Record<number, number | null>>({});


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

  const fetchAvailableManagers = async (zipCode: string, id: number, city: string, state: string): Promise<boolean> => {
    setIsFetchingManagers(true);
    try {
      const response = await fetch("/api/available-managers-by-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip_code: zipCode,
          servicing_city: city,
          servicing_state: state,
          agent_id: id
        }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch managers");
  
      const data = await response.json();
      setManagerGroups((prev) => ({
        ...prev,
        [id]: data.managers || { c1: [], c2: [], c3: [] },
      }));
  
      setPrimaryManagerMap((prev) => ({ ...prev, [id]: null }));
      setSecondaryManagerMap((prev) => ({ ...prev, [id]: null }));
      return true;
    } catch (error) {
      console.error("Error fetching managers:", error);
      return false;
    } finally {
      setIsFetchingManagers(false);
    }
  };
  
  
  const handleManagerSelect = (agentId: number, managerId: number) => {
    // If neither primary nor secondary is selected, set as primary
    if (!primaryManagerMap[agentId]) {
      setPrimaryManagerMap(prev => ({ ...prev, [agentId]: managerId }));
      // If the manager was previously set as secondary, remove it
      if (secondaryManagerMap[agentId] === managerId) {
        setSecondaryManagerMap(prev => ({ ...prev, [agentId]: null }));
      }
    } 
    // If primary is already set and it's not this manager, set as secondary
    else if (primaryManagerMap[agentId] !== managerId) {
      // If this manager is already secondary, unselect it
      if (secondaryManagerMap[agentId] === managerId) {
        setSecondaryManagerMap(prev => ({ ...prev, [agentId]: null }));
      } else {
        setSecondaryManagerMap(prev => ({ ...prev, [agentId]: managerId }));
      }
    } 
    // If this manager is already set as primary, unselect it
    else if (primaryManagerMap[agentId] === managerId) {
      // If secondary is set, promote it to primary
      if (secondaryManagerMap[agentId]) {
        setPrimaryManagerMap(prev => ({ ...prev, [agentId]: secondaryManagerMap[agentId] }));
        setSecondaryManagerMap(prev => ({ ...prev, [agentId]: null }));
      } else {
        setPrimaryManagerMap(prev => ({ ...prev, [agentId]: null }));
      }
    }
  };

  const handleApprove = async (id: number, type: ApprovalType) => {
    // For agents, validate C1 manager requirement, but only if managers are available
    if (type === "agent") {
      const allManagers = [
        ...(managerGroups[id]?.c1 || []),
        ...(managerGroups[id]?.c2 || []),
        ...(managerGroups[id]?.c3 || [])
      ];
      
      // Only validate if managers are available
      if (allManagers.length > 0 && !primaryManagerMap[id]) {
        setError("Please select a primary manager before approving this agent.");
        return;
      }
      
      // Validate that primary manager is C1 if one is selected
      if (primaryManagerMap[id]) {
        const primaryManager = allManagers.find(m => m.manager_id === primaryManagerMap[id]);
        if (primaryManager && primaryManager.manager_grade !== 'c1') {
          setError("Primary manager must be a C1 grade manager. Please select a C1 manager as primary.");
          return;
        }
      }
    }

    try {
      setIsProcessing(true);
      setError(null);

      const approverId = localStorage.getItem("userId");
      if (!approverId) throw new Error("Approver ID not found");

      const endpoint = type === "agent" ? "/api/approve-agent" : "/api/approve-manager";
      const body: any = {
        [`${type}_id`]: id,
        approver_id: parseInt(approverId),
      };

      if (type === "agent") {
        body.manager_ids = [
          primaryManagerMap[id],
          secondaryManagerMap[id]
        ].filter(Boolean).map(String);
      } else {
        if (primaryManagerMap[id]) {
          body.reporting_manager_id = [primaryManagerMap[id].toString()];
        } else {
          body.reporting_manager_id = null; 
        }        
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const toggleExpand = async (
    id: number,
    type: ApprovalType,
    zipCodes?: string[],
    city?: string,
    state?: string
  ) => {
      if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (zipCodes && zipCodes.length > 0) {
        for (const zip of zipCodes) {
          const success = await fetchAvailableManagers(zip, id, city!, state!);
          if (
            success &&
            (managerGroups[id]?.c1?.length || managerGroups[id]?.c2?.length || managerGroups[id]?.c3?.length)
          ) break; 
        }
      }
    }
  };
  
  // Get manager role for display purposes
  const getManagerRole = (agentId: number, managerId: number) => {
    if (primaryManagerMap[agentId] === managerId) return "Primary";
    if (secondaryManagerMap[agentId] === managerId) return "Secondary";
    return null;
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
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Permission Requests
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Review and approve pending user permissions
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
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as "all" | "verified" | "unverified")}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>

                <button
                  onClick={fetchPendingApprovals}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-6">
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "agents"
                    ? "text-blue-600 border-blue-600"
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
                    ? "text-blue-600 border-blue-600"
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
                <h3 className="text-lg font-semibold text-slate-700">
                  {pendingAgents.length === 0 && pendingManagers.length === 0
                    ? `No ${activeTab} found for your region`
                    : searchTerm || verificationFilter !== "all"
                    ? "No matching results"
                    : "All permissions have been approved"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {pendingAgents.length === 0 && pendingManagers.length === 0
                    ? `There are currently no ${activeTab} pending approval in your managed states.`
                    : searchTerm || verificationFilter !== "all"
                    ? "Try clearing your search or changing filters to see available requests."
                    : "You're all caught up! No pending requests remain."}
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
                  const hasManagers =
                  (managerGroups[id]?.c1?.length || 0) +
                  (managerGroups[id]?.c2?.length || 0) +
                  (managerGroups[id]?.c3?.length || 0) > 0;
              
                const primarySelectedIsValid =
                  primaryManagerMap[id] &&
                  managerGroups[id]?.c1?.some((m) => m.manager_id === primaryManagerMap[id]);
              
                const canApproveAgent = !hasManagers || primarySelectedIsValid;
              
                  const zipCodes = Array.isArray(data.servicing_zip)
                    ? data.servicing_zip
                    : typeof data.servicing_zip === 'string'
                      ? data.servicing_zip.split(',').map((z) => z.trim())
                      : [];


                  return (
                    <motion.div
                      key={`${activeTab}-${id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        expandedId === id
                          ? "border-blue-300 shadow-md bg-blue-50"
                          : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() =>
                          toggleExpand(
                            id,
                            isAgent ? "agent" : "manager",
                            zipCodes,
                            data.servicing_city,
                            data.servicing_state
                          )
                        }                        >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                              {isAgent ? <User className="w-6 h-6" /> : <UserCog className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {isAgent ? data.agent_name : data.manager_name}
                              </h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm text-slate-600">
                                  {data.servicing_city}, {data.servicing_state}
                                </span>
                                {zipCodes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {zipCodes.map((zip) => (
                                      <span
                                        key={zip}
                                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                                      >
                                        {zip}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {!isAgent && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    data.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                    data.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {data.manager_grade ? data.manager_grade.toUpperCase() : "N/A"}
                                  </span>
                                  
                                  {data.reporting_manager_id && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      <Users className="w-3 h-3 mr-1" />
                                      Reports to: {Array.isArray(data.reporting_manager_id) 
                                        ? data.reporting_manager_id.join(', ') 
                                        : data.reporting_manager_id}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {data.is_verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <ShieldCheck className="w-3 h-3 mr-1" />
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-500" />
                                    {isAgent ? "Agent Details" : "Manager Details"}
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-4">
                                      {isAgent && (
                                        <div>
                                          <p className="text-xs text-slate-500">Delivery Type</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            {data.delivery_type || "Not specified"}
                                          </p>
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-xs text-slate-500">
                                          {isAgent ? "Current Address" : "Permanent Address"}
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {isAgent ? data.current_address : (data as Manager).permanent_address}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Gender</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {data.gender || "Not specified"}
                                        </p>
                                      </div>
                                      {!isAgent && (
                                        <div>
                                          <p className="text-xs text-slate-500">Manager Grade</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                              data.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                              data.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                              'bg-green-100 text-green-800'
                                            }`}>
                                              {data.manager_grade ? data.manager_grade.toUpperCase() : "N/A"}
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    Timeline
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-xs text-slate-500">Date of Birth</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {data.dob ? new Date(data.dob).toLocaleDateString() : "Not provided"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Created At</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {new Date(data.created_at).toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Last Updated</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {new Date(data.updated_at).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {isAgent ? (
                                <div>
                                  <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Assign Managers
                                  </h4>
                                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                                  <Info className="w-4 h-4 text-blue-500" />
                                  <div className="space-x-3">
                                    <span className="inline-flex items-center gap-1">
                                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                                      <b>C1</b>: City-Level Manager
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                                      <b>C2</b>: State-Level Manager
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                      <b>C3</b>: Country-Level Manager
                                    </span>
                                  </div>
                                </div>

                                  <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                                    <div className="flex items-start gap-2">
                                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                      <p className="text-sm text-blue-800">
                                        It is mandatory to assign a Primary (C1) Manager to get an agent approved. 
                                        You may optionally select a Secondary (C2) Manager if needed.
                                      </p>
                                    </div>
                                  </div>

                                  {isFetchingManagers ? (
                                    <div className="flex justify-center py-8">
                                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    </div>
                                  ) : (
                                    <div className="space-y-6">
                                      {/* Combined list of all managers */}
                                      <div>
                                        {(managerGroups[id]?.c1.length === 0 && 
                                         managerGroups[id]?.c2.length === 0 && 
                                         managerGroups[id]?.c3.length === 0) ? (
                                          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800">
                                            No managers available for this zip code. The agent can still be approved without assigning managers.
                                          </div>
                                        ) : (
                                          <>
                                            <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                                              <Star className="w-4 h-4 text-yellow-500" />
                                              Available Managers
                                            </h5>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {/* C1 Managers first (for primary selection) */}
                                              {managerGroups[id]?.c1.map((manager) => (
                                                <div 
                                                  key={`manager-${manager.manager_id}`} 
                                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    primaryManagerMap[id] === manager.manager_id
                                                      ? "border-green-300 bg-green-50"
                                                      : secondaryManagerMap[id] === manager.manager_id
                                                      ? "border-purple-300 bg-purple-50"
                                                      : "border-slate-200 hover:border-blue-200 bg-white"
                                                  }`}
                                                  onClick={() => handleManagerSelect(id, manager.manager_id)}
                                                >
                                                  <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                      <div className="flex items-center gap-2 mb-2">
                                                        <h6 className="font-medium text-slate-800">
                                                          {manager.manager_name}
                                                        </h6>
                                                        {/* <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          manager.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                                          manager.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                                          'bg-green-100 text-green-800'
                                                        }`}>
                                                          {manager.manager_grade ? manager.manager_grade.toUpperCase() : 'N/A'}
                                                        </span> */}
                                                        <span
                                                          title={
                                                            manager.manager_grade === 'c1'
                                                              ? 'City-Level Manager'
                                                              : manager.manager_grade === 'c2'
                                                              ? 'State-Level Manager'
                                                              : 'Country-Level Manager'
                                                          }
                                                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            manager.manager_grade === 'c1'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : manager.manager_grade === 'c2'
                                                              ? 'bg-purple-100 text-purple-800'
                                                              : 'bg-green-100 text-green-800'
                                                          }`}
                                                        >
                                                          {manager.manager_grade.toUpperCase()}
                                                        </span>
                                                        {manager.is_verified && (
                                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Verified
                                                          </span>
                                                        )}
                                                      </div>
                                                      <div className="text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                          <MapPin className="w-4 h-4" />
                                                          <span>{manager.servicing_city}, {manager.servicing_state}</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {getManagerRole(id, manager.manager_id) && (
                                                      <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
                                                        primaryManagerMap[id] === manager.manager_id
                                                          ? "bg-green-100 text-green-800"
                                                          : "bg-purple-100 text-purple-800"
                                                      }`}>
                                                        {getManagerRole(id, manager.manager_id)}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                              
                                              {/* Then C2 Managers */}
                                              {managerGroups[id]?.c2.map((manager) => (
                                                <div 
                                                  key={`manager-${manager.manager_id}`} 
                                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    primaryManagerMap[id] === manager.manager_id
                                                      ? "border-green-300 bg-green-50"
                                                      : secondaryManagerMap[id] === manager.manager_id
                                                      ? "border-purple-300 bg-purple-50"
                                                      : "border-slate-200 hover:border-blue-200 bg-white"
                                                  }`}
                                                  onClick={() => handleManagerSelect(id, manager.manager_id)}
                                                >
                                                  <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                      <div className="flex items-center gap-2 mb-2">
                                                        <h6 className="font-medium text-slate-800">
                                                          {manager.manager_name}
                                                        </h6>
                                                        {/* <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          manager.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                                          manager.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                                          'bg-green-100 text-green-800'
                                                        }`}>
                                                          {manager.manager_grade ? manager.manager_grade.toUpperCase() : 'N/A'}
                                                        </span> */}
                                                        <span
                                                        title={
                                                          manager.manager_grade === 'c1'
                                                            ? 'City-Level Manager'
                                                            : manager.manager_grade === 'c2'
                                                            ? 'State-Level Manager'
                                                            : 'Country-Level Manager'
                                                        }
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          manager.manager_grade === 'c1'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : manager.manager_grade === 'c2'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                      >
                                                        {manager.manager_grade.toUpperCase()}
                                                      </span>
                                                      </div>
                                                      <div className="text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                          <MapPin className="w-4 h-4" />
                                                          <span>{manager.servicing_city}, {manager.servicing_state}</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {getManagerRole(id, manager.manager_id) && (
                                                      <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
                                                        primaryManagerMap[id] === manager.manager_id
                                                          ? "bg-green-100 text-green-800"
                                                          : "bg-purple-100 text-purple-800"
                                                      }`}>
                                                        {getManagerRole(id, manager.manager_id)}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                              
                                              {/* Finally C3 Managers */}
                                              {managerGroups[id]?.c3.map((manager) => (
                                                <div 
                                                  key={`manager-${manager.manager_id}`} 
                                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    primaryManagerMap[id] === manager.manager_id
                                                      ? "border-green-300 bg-green-50"
                                                      : secondaryManagerMap[id] === manager.manager_id
                                                      ? "border-purple-300 bg-purple-50"
                                                      : "border-slate-200 hover:border-blue-200 bg-white"
                                                  }`}
                                                  onClick={() => handleManagerSelect(id, manager.manager_id)}
                                                >
                                                  <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                      <div className="flex items-center gap-2 mb-2">
                                                        <h6 className="font-medium text-slate-800">
                                                          {manager.manager_name}
                                                        </h6>
                                                        {/* <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          manager.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                                          manager.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                                          'bg-green-100 text-green-800'
                                                        }`}>
                                                          {manager.manager_grade ? manager.manager_grade.toUpperCase() : 'N/A'}
                                                        </span> */}
                                                        <span
                                                        title={
                                                          manager.manager_grade === 'c1'
                                                            ? 'City-Level Manager'
                                                            : manager.manager_grade === 'c2'
                                                            ? 'State-Level Manager'
                                                            : 'Country-Level Manager'
                                                        }
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          manager.manager_grade === 'c1'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : manager.manager_grade === 'c2'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                      >
                                                        {manager.manager_grade.toUpperCase()}
                                                      </span>
                                                      </div>
                                                      <div className="text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                          <MapPin className="w-4 h-4" />
                                                          <span>{manager.servicing_city}, {manager.servicing_state}</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {getManagerRole(id, manager.manager_id) && (
                                                      <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
                                                        primaryManagerMap[id] === manager.manager_id
                                                          ? "bg-green-100 text-green-800"
                                                          : "bg-purple-100 text-purple-800"
                                                      }`}>
                                                        {getManagerRole(id, manager.manager_id)}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Assign Reporting Manager (Optional)
                                  </h4>
                                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    <div className="space-x-3">
                                      <span className="inline-flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                                        <b>C1</b>: City-Level Manager
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                                        <b>C2</b>: State-Level Manager
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                        <b>C3</b>: Country-Level Manager
                                      </span>
                                    </div>
                                  </div>

                                  {isFetchingManagers ? (
                                    <div className="flex justify-center py-8">
                                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* All available managers for reporting */}
                                      {managerGroups[id]?.c1.concat(
                                        managerGroups[id]?.c2 || [], 
                                        managerGroups[id]?.c3 || []
                                      ).length === 0 ? (
                                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 col-span-2">
                                          No reporting managers available for this manager. They can still be approved without assigning a reporting manager.
                                        </div>
                                      ) : (
                                        managerGroups[id]?.c1.concat(
                                          managerGroups[id]?.c2 || [], 
                                          managerGroups[id]?.c3 || []
                                        ).map((manager) => (
                                          <div 
                                            key={`reporting-${manager.manager_id}`}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                              primaryManagerMap[id] === manager.manager_id
                                                ? "border-green-300 bg-green-50"
                                                : "border-slate-200 hover:border-blue-200 bg-white"
                                            }`}
                                            onClick={() => handleManagerSelect(id, manager.manager_id)}
                                          >
                                            <div className="flex justify-between items-start gap-4">
                                              <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                  <h6 className="font-medium text-slate-800">
                                                    {manager.manager_name}
                                                  </h6>
                                                  {/* <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    manager.manager_grade === 'c1' ? 'bg-blue-100 text-blue-800' :
                                                    manager.manager_grade === 'c2' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                                  }`}>
                                                    {manager.manager_grade ? manager.manager_grade.toUpperCase() : 'N/A'}
                                                  </span> */}
                                                  <span
                                                  title={
                                                    manager.manager_grade === 'c1'
                                                      ? 'City-Level Manager'
                                                      : manager.manager_grade === 'c2'
                                                      ? 'State-Level Manager'
                                                      : 'Country-Level Manager'
                                                  }
                                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    manager.manager_grade === 'c1'
                                                      ? 'bg-blue-100 text-blue-800'
                                                      : manager.manager_grade === 'c2'
                                                      ? 'bg-purple-100 text-purple-800'
                                                      : 'bg-green-100 text-green-800'
                                                  }`}
                                                >
                                                  {manager.manager_grade.toUpperCase()}
                                                </span>
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                  <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{manager.servicing_city}, {manager.servicing_state}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              {primaryManagerMap[id] === manager.manager_id && (
                                                <div className="px-2 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                                                  Selected
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={() => handleApprove(id, isAgent ? "agent" : "manager")}
                                  disabled={isProcessing || (isAgent && !canApproveAgent)}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      {isAgent ? <UserCheck className="w-5 h-5" /> : <UserCog className="w-5 h-5" />}
                                      Approve {isAgent ? "Agent" : "Manager"}
                                    </>
                                  )}
                                </button>
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