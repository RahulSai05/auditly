// import React, { useEffect, useState } from "react";

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

//   useEffect(() => {
//     fetchPendingAgents();
//   }, []);

//   const fetchPendingAgents = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/pending-agent-approval");
//       if (!response.ok) {
//         throw new Error("Failed to fetch pending agents");
//       }
//       const data = await response.json();
//       setPendingAgents(data.agents);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveAgent = async (agentId: number) => {
//     try {
//       setLoading(true);
//       const auditlyUserId = localStorage.getItem("userId");
//       if (!auditlyUserId) {
//         throw new Error("User ID not found in local storage");
//       }

//       const response = await fetch("/api/approve-agent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           agent_id: agentId,
//           auditly_user_id: parseInt(auditlyUserId),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to approve agent");
//       }

//       setSuccessMessage("Agent approved successfully!");
//       // Refresh the list after approval
//       await fetchPendingAgents();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && pendingAgents.length === 0) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div style={{ color: "red" }}>Error: {error}</div>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Agent Permission Requests</h1>
      
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "20px" }}>
//           {successMessage}
//         </div>
//       )}

//       {pendingAgents.length === 0 ? (
//         <div>No pending agent requests</div>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f2f2f2" }}>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>Agent Name</th>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Name</th>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>Delivery Type</th>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>Location</th>
//               <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingAgents.map(({ agent, user }) => (
//               <tr key={agent.agent_id} style={{ borderBottom: "1px solid #ddd" }}>
//                 <td style={{ padding: "10px" }}>{agent.agent_name}</td>
//                 <td style={{ padding: "10px" }}>{user.auditly_user_name}</td>
//                 <td style={{ padding: "10px" }}>{user.email}</td>
//                 <td style={{ padding: "10px" }}>{agent.delivery_type}</td>
//                 <td style={{ padding: "10px" }}>
//                   {agent.servicing_city}, {agent.servicing_state}
//                 </td>
//                 <td style={{ padding: "10px" }}>
//                   <button
//                     onClick={() => handleApproveAgent(agent.agent_id)}
//                     disabled={loading}
//                     style={{
//                       padding: "5px 10px",
//                       backgroundColor: "#4CAF50",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {loading ? "Processing..." : "Approve"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
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

  const fetchPendingAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cache-busting technique
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/pending-agent-approval?t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

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
      const auditlyUserId = localStorage.getItem("userId");
      
      if (!auditlyUserId) {
        throw new Error("User ID not found");
      }

      const response = await fetch("/api/approve-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          auditly_user_id: parseInt(auditlyUserId),
        }),
      });

      if (!response.ok) {
        throw new Error(`Approval failed with status: ${response.status}`);
      }

      setSuccessMessage("Agent approved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPendingAgents(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingId(null);
    }
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
              <button
                onClick={fetchPendingAgents}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
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
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 font-medium text-gray-700">Agent</th>
                      <th className="px-6 py-4 font-medium text-gray-700">User</th>
                      <th className="px-6 py-4 font-medium text-gray-700">Contact</th>
                      <th className="px-6 py-4 font-medium text-gray-700">Service Area</th>
                      <th className="px-6 py-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAgents.map(({ agent, user }) => (
                      <motion.tr
                        key={agent.agent_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{agent.agent_name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Truck className="w-4 h-4" />
                                <span>{agent.delivery_type}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{user.auditly_user_name}</p>
                          <p className="text-sm text-gray-500 mt-1">ID: {user.auditly_user_id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{agent.current_address}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {agent.servicing_city}, {agent.servicing_state}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApproveAgent(agent.agent_id)}
                            disabled={processingId === agent.agent_id}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
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
                                Approve
                              </>
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserPermissionRequests;
