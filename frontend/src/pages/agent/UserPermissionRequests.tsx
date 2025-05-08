import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Truck,
  Mail,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  ClipboardList,
  Navigation2,
} from "lucide-react";

interface Agent {
  agent_id: number;
  agent_name: string;
  delivery_type: string;
  current_address: string;
  servicing_state: string;
  servicing_city: string;
  is_verified: boolean;
  gender: string;
  dob: string;
  created_at: string;
  updated_at: string;
  agent_to_user_mapping_id: number;
  work_schedule?: string;
  pickup_routing_mode?: string;
  delivery_routing_mode?: string;
}

interface User {
  auditly_user_id: number;
  auditly_user_name: string;
  email: string;
  user_type: string;
  is_agent: boolean;
  is_inspection_user: boolean;
  is_admin: boolean;
}

interface PendingAgent {
  agent: Agent;
  user: User;
}

const UserPermissionRequests: React.FC = () => {
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [expandedAgentId, setExpandedAgentId] = useState<number | null>(null);

  const fetchPendingAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/pending-agent-approval?t=${timestamp}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.agents) {
        throw new Error("Invalid data format: missing agents array");
      }

      setPendingAgents(data.agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAgent = async (agentId: number) => {
    try {
      setProcessingId(agentId);
      
      const approverId = localStorage.getItem("userId");
      
      if (!approverId) {
        throw new Error("Approver ID not found in local storage");
      }

      const response = await fetch("/api/approve-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          approver_id: parseInt(approverId),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || `Approval failed with status: ${response.status}`);
      }

      setSuccessMessage(responseData.message || "Agent approved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPendingAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpandAgent = (agentId: number) => {
    setExpandedAgentId(expandedAgentId === agentId ? null : agentId);
  };

  const parseWorkSchedule = (schedule: string | undefined) => {
    if (!schedule) return [];
    try {
      const parsed = JSON.parse(schedule);
      if (parsed && parsed.days) {
        return parsed.days.split(',').map(Number);
      }
      return [];
    } catch {
      return [];
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  if (loading && pendingAgents.length === 0) {
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
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Agent Permission Requests
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPendingAgents}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
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

            {pendingAgents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                {error ? "Failed to load agents" : "No pending agent requests"}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {pendingAgents.map(({ agent, user }) => (
                  <motion.div
                    key={agent.agent_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpandAgent(agent.agent_id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg">{agent.agent_name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            <MapPin className="w-4 h-4" />
                            <span>{agent.servicing_city}, {agent.servicing_state}</span>
                          </div>
                          {expandedAgentId === agent.agent_id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedAgentId === agent.agent_id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4 text-blue-500" />
                                  Agent Details
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">Delivery Type</p>
                                      <p className="text-gray-700 font-medium">{agent.delivery_type || "Not specified"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">Current Address</p>
                                      <p className="text-gray-700 font-medium">{agent.current_address || "Not specified"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">Gender</p>
                                      <p className="text-gray-700 font-medium">{agent.gender || "Not specified"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">Date of Birth</p>
                                      <p className="text-gray-700 font-medium">{agent.dob || "Not specified"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {agent.work_schedule && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Work Schedule
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {parseWorkSchedule(agent.work_schedule).length > 0 ? (
                                      parseWorkSchedule(agent.work_schedule).map(dayId => (
                                        <motion.span
                                          key={dayId}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                          {dayNames[dayId - 1]}
                                        </motion.span>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">No schedule specified</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-500" />
                                  User Details
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">User Name</p>
                                      <p className="text-gray-700 font-medium">{user.auditly_user_name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">Email</p>
                                      <p className="text-gray-700 font-medium">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-xs text-gray-500">User ID</p>
                                      <p className="text-gray-700 font-medium">{user.auditly_user_id}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {(agent.pickup_routing_mode || agent.delivery_routing_mode) && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <Navigation2 className="w-4 h-4 text-blue-500" />
                                    Routing Modes
                                  </h4>
                                  <div className="space-y-2">
                                    {agent.pickup_routing_mode && (
                                      <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-blue-400" />
                                        <div>
                                          <p className="text-xs text-gray-500">Pickup Routing</p>
                                          <p className="text-gray-700 font-medium">
                                            {agent.pickup_routing_mode === "1" ? "Manual" : "Automatic"}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {agent.delivery_routing_mode && (
                                      <div className="flex items-center gap-3">
                                        <Navigation2 className="w-5 h-5 text-blue-400" />
                                        <div>
                                          <p className="text-xs text-gray-500">Delivery Routing</p>
                                          <p className="text-gray-700 font-medium">
                                            {agent.delivery_routing_mode === "1" ? "Manual" : "Automatic"}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproveAgent(agent.agent_id)}
                              disabled={processingId === agent.agent_id}
                              className={`px-8 py-3 rounded-xl flex items-center gap-2 font-medium ${
                                processingId === agent.agent_id
                                  ? 'bg-blue-200 text-blue-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {processingId === agent.agent_id ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                  >
                                    <Loader2 className="w-5 h-5" />
                                  </motion.div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-5 h-5" />
                                  Approve Agent
                                </>
                              )}
                            </motion.button>
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

export default UserPermissionRequests;
