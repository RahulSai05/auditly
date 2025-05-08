// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   ShieldCheck,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   MapPin,
//   Truck,
//   Mail,
//   RefreshCw,
// } from "lucide-react";

// interface Agent {
//   agent_id: number;
//   agent_name: string;
//   delivery_type: string;
//   current_address: string;
//   servicing_state: string;
//   servicing_city: string;
//   is_verified: boolean;
//   gender: string;
//   dob: string;
//   created_at: string;
//   updated_at: string;
//   agent_to_user_mapping_id: number; // Added this field
// }

// interface User {
//   auditly_user_id: number;
//   auditly_user_name: string;
//   email: string;
//   user_type: string;
//   is_agent: boolean;
//   is_inspection_user: boolean;
//   is_admin: boolean;
// }

// interface PendingAgent {
//   agent: Agent;
//   user: User;
// }

// const UserPermissionRequests: React.FC = () => {
//   const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [processingId, setProcessingId] = useState<number | null>(null);

//   const fetchPendingAgents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/pending-agent-approval?t=${timestamp}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (!data.agents) {
//         throw new Error("Invalid data format: missing agents array");
//       }

//       setPendingAgents(data.agents);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch agents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveAgent = async (agentId: number) => {
//     try {
//       setProcessingId(agentId);
      
//       // Get approver ID from localStorage (assuming it's stored there after login)
//       const approverId = localStorage.getItem("userId");
      
//       if (!approverId) {
//         throw new Error("Approver ID not found in local storage");
//       }

//       const response = await fetch("/api/approve-agent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           agent_id: agentId,
//           approver_id: parseInt(approverId),
//         }),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(responseData.detail || `Approval failed with status: ${response.status}`);
//       }

//       setSuccessMessage(responseData.message || "Agent approved successfully!");
//       setTimeout(() => setSuccessMessage(null), 3000);
//       fetchPendingAgents(); // Refresh the list
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Approval failed");
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   useEffect(() => {
//     fetchPendingAgents();
//   }, []);

//   if (loading && pendingAgents.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="text-blue-600"
//         >
//           <Loader2 className="w-8 h-8" />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-8">
//               <div className="flex items-center gap-3">
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 10 }}
//                   className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//                 >
//                   <ShieldCheck className="w-6 h-6 text-blue-600" />
//                 </motion.div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   Agent Permission Requests
//                 </h1>
//               </div>
//               <button
//                 onClick={fetchPendingAgents}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
//             </div>

//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
//                 >
//                   <XCircle className="w-5 h-5" />
//                   <span className="font-medium">{error}</span>
//                 </motion.div>
//               )}

//               {successMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
//                 >
//                   <CheckCircle2 className="w-5 h-5" />
//                   <span className="font-medium">{successMessage}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {pendingAgents.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 text-gray-500"
//               >
//                 {error ? "Failed to load agents" : "No pending agent requests"}
//               </motion.div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50 text-left">
//                       <th className="px-6 py-4 font-medium text-gray-700">Agent</th>
//                       <th className="px-6 py-4 font-medium text-gray-700">User</th>
//                       <th className="px-6 py-4 font-medium text-gray-700">Contact</th>
//                       <th className="px-6 py-4 font-medium text-gray-700">Service Area</th>
//                       <th className="px-6 py-4 font-medium text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingAgents.map(({ agent, user }) => (
//                       <motion.tr
//                         key={agent.agent_id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="border-b border-gray-100 hover:bg-gray-50/50"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                               <User className="w-5 h-5" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-900">{agent.agent_name}</p>
//                               <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
//                                 <Truck className="w-4 h-4" />
//                                 <span>{agent.delivery_type}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <p className="text-gray-900">{user.auditly_user_name}</p>
//                           <p className="text-sm text-gray-500 mt-1">ID: {user.auditly_user_id}</p>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <Mail className="w-4 h-4 text-gray-400" />
//                             <span className="text-gray-700">{user.email}</span>
//                           </div>
//                           <p className="text-sm text-gray-500 mt-1">{agent.current_address}</p>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <MapPin className="w-4 h-4 text-gray-400" />
//                             <span className="text-gray-700">
//                               {agent.servicing_city}, {agent.servicing_state}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleApproveAgent(agent.agent_id)}
//                             disabled={processingId === agent.agent_id}
//                             className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
//                               processingId === agent.agent_id
//                                 ? 'bg-blue-200 text-blue-700'
//                                 : 'bg-blue-600 text-white hover:bg-blue-700'
//                             }`}
//                           >
//                             {processingId === agent.agent_id ? (
//                               <>
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                 Processing
//                               </>
//                             ) : (
//                               <>
//                                 <CheckCircle2 className="w-4 h-4" />
//                                 Approve
//                               </>
//                             )}
//                           </motion.button>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default UserPermissionRequests;


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

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  if (loading && pendingAgents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6">
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
          <ShieldCheck className="w-10 h-10 text-blue-600" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
        >
          Agent Permission Requests
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Review and approve pending agent requests
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Pending Approvals
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchPendingAgents}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600"
              >
                {successMessage}
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
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpandAgent(agent.agent_id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{agent.agent_name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
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
                        className="px-4 pb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Agent Details</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{agent.delivery_type} Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{agent.current_address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{agent.gender}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">User Details</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{user.auditly_user_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">User ID: {user.auditly_user_id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApproveAgent(agent.agent_id)}
                            disabled={processingId === agent.agent_id}
                            className={`px-6 py-2 rounded-xl flex items-center gap-2 ${
                              processingId === agent.agent_id
                                ? 'bg-blue-200 text-blue-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {processingId === agent.agent_id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
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
  );
};

export default UserPermissionRequests;
