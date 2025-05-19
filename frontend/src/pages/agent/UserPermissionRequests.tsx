// import React, { useState, useEffect } from "react";
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
//   ChevronDown,
//   ChevronUp,
//   Users,
//   Calendar,
//   ClipboardList,
//   Navigation2,
//   UserCog,
//   UserCheck,
//   Search,
//   Filter,
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
//   agent_to_user_mapping_id: number;
//   work_schedule?: string;
//   pickup_routing_mode?: string;
//   delivery_routing_mode?: string;
// }

// interface Manager {
//   manager_id: number;
//   manager_name: string;
//   servicing_state: string;
//   servicing_city: string;
//   servicing_zip: string;
//   permanent_address: string;
//   permanent_address_state: string;
//   permanent_address_city: string;
//   permanent_address_zip: string;
//   address: string;
//   is_verified: boolean;
//   gender: string;
//   dob: string;
//   created_at: string;
//   updated_at: string;
//   manager_user_mapping_id: number;
// }

// interface User {
//   auditly_user_id: number;
//   auditly_user_name: string;
//   email: string;
//   user_type: string;
//   is_agent: boolean;
//   is_inspection_user: boolean;
//   is_admin: boolean;
//   is_manager: boolean;
// }

// interface PendingAgent {
//   agent: Agent;
//   user: User;
// }

// interface PendingManager {
//   manager: Manager;
//   user: User;
// }

// type ApprovalType = 'agent' | 'manager';

// const UserPermissionRequests: React.FC = () => {
//   const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
//   const [pendingManagers, setPendingManagers] = useState<PendingManager[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [processingId, setProcessingId] = useState<number | null>(null);
//   const [processingType, setProcessingType] = useState<ApprovalType | null>(null);
//   const [expandedId, setExpandedId] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<'agents' | 'managers'>('agents');
//   const [searchTerm, setSearchTerm] = useState("");
//   const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "unverified">("all");

//   const fetchPendingApprovals = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const timestamp = new Date().getTime();
//       const [agentsResponse, managersResponse] = await Promise.all([
//         fetch(`/api/pending-agent-approval?t=${timestamp}`),
//         fetch(`/api/pending-manager-approval?t=${timestamp}`)
//       ]);

//       if (!agentsResponse.ok || !managersResponse.ok) {
//         throw new Error("Failed to fetch approval requests");
//       }

//       const [agentsData, managersData] = await Promise.all([
//         agentsResponse.json(),
//         managersResponse.json()
//       ]);
      
//       setPendingAgents(agentsData.agents || []);
//       setPendingManagers(managersData.managers || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (id: number, type: ApprovalType) => {
//     try {
//       setProcessingId(id);
//       setProcessingType(type);
      
//       const approverId = localStorage.getItem("userId");
//       if (!approverId) throw new Error("Approver ID not found");

//       const response = await fetch(`/api/approve-${type}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           [`${type}_id`]: id,
//           approver_id: parseInt(approverId),
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.detail || "Approval failed");

//       setSuccessMessage(`${type === 'agent' ? 'Agent' : 'Manager'} approved successfully`);
//       fetchPendingApprovals();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Approval failed");
//     } finally {
//       setProcessingId(null);
//       setProcessingType(null);
//       setTimeout(() => {
//         setSuccessMessage(null);
//         setError(null);
//       }, 5000);
//     }
//   };

//   const toggleExpand = (id: number) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const filteredData = activeTab === 'agents' 
//     ? pendingAgents.filter(({ agent, user }) => {
//         const searchMatch = searchTerm.toLowerCase() === '' ||
//           agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           agent.servicing_city.toLowerCase().includes(searchTerm.toLowerCase());
        
//         const verificationMatch = verificationFilter === 'all' ||
//           (verificationFilter === 'verified' && agent.is_verified) ||
//           (verificationFilter === 'unverified' && !agent.is_verified);
        
//         return searchMatch && verificationMatch;
//       })
//     : pendingManagers.filter(({ manager, user }) => {
//         const searchMatch = searchTerm.toLowerCase() === '' ||
//           manager.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           manager.servicing_city.toLowerCase().includes(searchTerm.toLowerCase());
        
//         const verificationMatch = verificationFilter === 'all' ||
//           (verificationFilter === 'verified' && manager.is_verified) ||
//           (verificationFilter === 'unverified' && !manager.is_verified);
        
//         return searchMatch && verificationMatch;
//       });

//   useEffect(() => {
//     fetchPendingApprovals();
//   }, []);

//   if (loading && pendingAgents.length === 0 && pendingManagers.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="text-blue-600"
//         >
//           <Loader2 className="w-12 h-12" />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
//         >
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-8">
//               <div className="flex items-center gap-4">
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 10 }}
//                   className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
//                 >
//                   <ShieldCheck className="w-7 h-7 text-white" />
//                 </motion.div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-slate-900">
//                     Permission Requests
//                   </h1>
//                   <p className="text-slate-500 mt-1">
//                     Review and approve pending user permissions
//                   </p>
//                 </div>
//               </div>
              
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={fetchPendingApprovals}
//                 className="p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
//                 title="Refresh requests"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </motion.button>
//             </div>

//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
//                 >
//                   <AlertCircle className="w-5 h-5" />
//                   <span className="font-medium">{error}</span>
//                 </motion.div>
//               )}

//               {successMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
//                 >
//                   <CheckCircle2 className="w-5 h-5" />
//                   <span className="font-medium">{successMessage}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
              
//               <select
//                 value={verificationFilter}
//                 onChange={(e) => setVerificationFilter(e.target.value as "all" | "verified" | "unverified")}
//                 className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
//               >
//                 <option value="all">All Verification Status</option>
//                 <option value="verified">Verified Only</option>
//                 <option value="unverified">Unverified Only</option>
//               </select>
//             </div>

//             <div className="flex border-b border-slate-200 mb-6">
//               <button
//                 className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
//                   activeTab === 'agents'
//                     ? 'text-indigo-600 border-indigo-600'
//                     : 'text-slate-500 border-transparent hover:text-slate-700'
//                 }`}
//                 onClick={() => setActiveTab('agents')}
//               >
//                 <User className="w-5 h-5" />
//                 Agents ({pendingAgents.length})
//               </button>
//               <button
//                 className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
//                   activeTab === 'managers'
//                     ? 'text-indigo-600 border-indigo-600'
//                     : 'text-slate-500 border-transparent hover:text-slate-700'
//                 }`}
//                 onClick={() => setActiveTab('managers')}
//               >
//                 <UserCog className="w-5 h-5" />
//                 Managers ({pendingManagers.length})
//               </button>
//             </div>

//             {filteredData.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
//               >
//                 <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-slate-700">
//                   No pending {activeTab} found
//                 </h3>
//                 <p className="text-slate-500 mt-2">
//                   {searchTerm || verificationFilter !== "all"
//                     ? "Try adjusting your filters or search terms"
//                     : `There are currently no ${activeTab} waiting for approval`}
//                 </p>
//               </motion.div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredData.map((item) => {
//                   const data = activeTab === 'agents' 
//                     ? (item as PendingAgent).agent 
//                     : (item as PendingManager).manager;
//                   const user = item.user;
//                   const id = activeTab === 'agents' ? data.agent_id : (data as Manager).manager_id;
                  
//                   return (
//                     <motion.div
//                       key={`${activeTab}-${id}`}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className={`border rounded-xl overflow-hidden transition-all ${
//                         expandedId === id
//                           ? 'border-indigo-300 shadow-md bg-indigo-50'
//                           : 'border-slate-200 hover:border-indigo-200 bg-white hover:shadow-md'
//                       }`}
//                     >
//                       <div
//                         className="p-6 cursor-pointer"
//                         onClick={() => toggleExpand(id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-4">
//                             <motion.div
//                               whileHover={{ scale: 1.05 }}
//                               className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//                                 expandedId === id
//                                   ? 'bg-indigo-200 text-indigo-700'
//                                   : 'bg-indigo-100 text-indigo-600'
//                               }`}
//                             >
//                               {activeTab === 'agents' ? (
//                                 <User className="w-6 h-6" />
//                               ) : (
//                                 <UserCog className="w-6 h-6" />
//                               )}
//                             </motion.div>
//                             <div>
//                               <h3 className="font-medium text-slate-900">
//                                 {activeTab === 'agents' ? data.agent_name : (data as Manager).manager_name}
//                               </h3>
//                               <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
//                                 <Mail className="w-4 h-4" />
//                                 {user.email}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-4">
//                             <div className="flex items-center gap-1 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//                               <MapPin className="w-4 h-4" />
//                               <span>
//                                 {activeTab === 'agents' 
//                                   ? `${data.servicing_city}, ${data.servicing_state}`
//                                   : `${(data as Manager).servicing_city}, ${(data as Manager).servicing_state}`}
//                               </span>
//                             </div>
//                             {data.is_verified && (
//                               <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                                 <ShieldCheck className="w-3 h-3" />
//                                 Verified
//                               </span>
//                             )}
//                             {expandedId === id ? (
//                               <ChevronUp className="w-5 h-5 text-slate-500" />
//                             ) : (
//                               <ChevronDown className="w-5 h-5 text-slate-500" />
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <AnimatePresence>
//                         {expandedId === id && (
//                           <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="border-t border-slate-100"
//                           >
//                             <div className="p-6 space-y-6">
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 <div className="space-y-6">
//                                   <div>
//                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
//                                       {activeTab === 'agents' ? (
//                                         <User className="w-4 h-4 text-indigo-500" />
//                                       ) : (
//                                         <UserCog className="w-4 h-4 text-indigo-500" />
//                                       )}
//                                       {activeTab === 'agents' ? 'Agent Details' : 'Manager Details'}
//                                     </h4>
//                                     <div className="space-y-3">
//                                       {activeTab === 'agents' && (
//                                         <div className="flex items-center gap-3">
//                                           <Truck className="w-5 h-5 text-indigo-400" />
//                                           <div>
//                                             <p className="text-xs text-slate-500">Delivery Type</p>
//                                             <p className="text-slate-700 font-medium">
//                                               {(data as Agent).delivery_type || "Not specified"}
//                                             </p>
//                                           </div>
//                                         </div>
//                                       )}
//                                       <div className="flex items-center gap-3">
//                                         <MapPin className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">
//                                             {activeTab === 'agents' ? 'Current Address' : 'Permanent Address'}
//                                           </p>
//                                           <p className="text-slate-700 font-medium">
//                                             {activeTab === 'agents'
//                                               ? (data as Agent).current_address
//                                               : (data as Manager).permanent_address}
//                                           </p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         <User className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Gender</p>
//                                           <p className="text-slate-700 font-medium">{data.gender}</p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         <Calendar className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Date of Birth</p>
//                                           <p className="text-slate-700 font-medium">{data.dob}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {activeTab === 'agents' && (data as Agent).work_schedule && (
//                                     <div>
//                                       <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
//                                         <Calendar className="w-4 h-4 text-indigo-500" />
//                                         Work Schedule
//                                       </h4>
//                                       <p className="text-slate-700">
//                                         {(data as Agent).work_schedule}
//                                       </p>
//                                     </div>
//                                   )}
//                                 </div>

//                                 <div className="space-y-6">
//                                   <div>
//                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
//                                       <Users className="w-4 h-4 text-indigo-500" />
//                                       User Details
//                                     </h4>
//                                     <div className="space-y-3">
//                                       <div className="flex items-center gap-3">
//                                         <User className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">User Name</p>
//                                           <p className="text-slate-700 font-medium">{user.auditly_user_name}</p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         <Mail className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Email</p>
//                                           <p className="text-slate-700 font-medium">{user.email}</p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         <ShieldCheck className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">User ID</p>
//                                           <p className="text-slate-700 font-medium">{user.auditly_user_id}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div>
//                                     <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
//                                       <ClipboardList className="w-4 h-4 text-indigo-500" />
//                                       Additional Information
//                                     </h4>
//                                     <div className="space-y-3">
//                                       <div className="flex items-center gap-3">
//                                         <Calendar className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Created At</p>
//                                           <p className="text-slate-700 font-medium">
//                                             {new Date(data.created_at).toLocaleString()}
//                                           </p>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-3">
//                                         <Calendar className="w-5 h-5 text-indigo-400" />
//                                         <div>
//                                           <p className="text-xs text-slate-500">Last Updated</p>
//                                           <p className="text-slate-700 font-medium">
//                                             {new Date(data.updated_at).toLocaleString()}
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="mt-8 flex justify-end">
//                                 <motion.button
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                   onClick={() => handleApprove(id, activeTab === 'agents' ? 'agent' : 'manager')}
//                                   disabled={processingId === id}
//                                   className={`px-8 py-3 rounded-xl flex items-center gap-2 font-medium ${
//                                     processingId === id
//                                       ? 'bg-indigo-200 text-indigo-700'
//                                       : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                                   } shadow-sm`}
//                                 >
//                                   {processingId === id ? (
//                                     <>
//                                       <motion.div
//                                         animate={{ rotate: 360 }}
//                                         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                                       >
//                                         <Loader2 className="w-5 h-5" />
//                                       </motion.div>
//                                       Processing...
//                                     </>
//                                   ) : (
//                                     <>
//                                       {activeTab === 'agents' ? (
//                                         <UserCheck className="w-5 h-5" />
//                                       ) : (
//                                         <UserCog className="w-5 h-5" />
//                                       )}
//                                       Approve {activeTab === 'agents' ? 'Agent' : 'Manager'}
//                                     </>
//                                   )}
//                                 </motion.button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default UserPermissionRequests;


// // import React, { useState, useEffect } from 'react';
// // import {
// //   User,
// //   ShieldCheck,
// //   Loader2,
// //   AlertCircle,
// //   CheckCircle2,
// //   MapPin,
// //   Mail,
// //   RefreshCw,
// //   ChevronDown,
// //   ChevronUp,
// //   UserCheck,
// //   Search,
// // } from 'lucide-react';

// // interface Agent {
// //   agent_id: number;
// //   agent_name: string;
// //   current_address: string;
// //   servicing_state: string;
// //   servicing_city: string;
// //   is_verified: boolean;
// //   delivery_type?: string;
// //   created_at: string;
// //   updated_at: string;
// // }

// // interface Manager {
// //   manager_id: number;
// //   manager_name: string;
// //   servicing_state: string;
// //   servicing_city: string;
// // }

// // interface User {
// //   auditly_user_id: number;
// //   email: string;
// //   auditly_user_name: string;
// // }

// // interface PendingAgent {
// //   agent: Agent;
// //   user: User;
// // }

// // const UserPermissionRequests = () => {
// //   const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// //   const [expandedId, setExpandedId] = useState<number | null>(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [availableManagers, setAvailableManagers] = useState<Manager[]>([]);
// //   const [selectedManagerId, setSelectedManagerId] = useState<string>('');
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   const fetchPendingAgents = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch('/api/pending-agent-approval');
// //       if (!response.ok) throw new Error('Failed to fetch agents');
// //       const data = await response.json();
// //       setPendingAgents(data.agents || []);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Failed to fetch agents');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAvailableManagers = async (state: string) => {
// //     try {
// //       const response = await fetch('/api/available-managers-by-state', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ state }),
// //       });
// //       if (!response.ok) throw new Error('Failed to fetch managers');
// //       const data = await response.json();
// //       setAvailableManagers(data.managers || []);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Failed to fetch managers');
// //     }
// //   };

// //   const handleApprove = async (agentId: number) => {
// //     if (!selectedManagerId) {
// //       setError('Please select a manager');
// //       return;
// //     }

// //     try {
// //       setIsProcessing(true);
// //       setError(null);

// //       // First assign manager
// //       const assignResponse = await fetch('/api/assign-managers-to-agent', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           agent_id: agentId,
// //           manager_id: selectedManagerId,
// //         }),
// //       });

// //       if (!assignResponse.ok) {
// //         throw new Error('Manager assignment failed');
// //       }

// //       // Then approve agent
// //       const approverId = localStorage.getItem('userId');
// //       const approveResponse = await fetch('/api/approve-agent', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           agent_id: agentId,
// //           approver_id: parseInt(approverId || '0'),
// //         }),
// //       });

// //       if (!approveResponse.ok) {
// //         throw new Error('Approval failed');
// //       }

// //       setSuccessMessage('Agent approved successfully');
// //       setTimeout(() => setSuccessMessage(null), 3000);
// //       fetchPendingAgents();
// //       setSelectedManagerId('');
// //       setExpandedId(null);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Approval failed');
// //       setTimeout(() => setError(null), 5000);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const toggleExpand = (agentId: number, state: string) => {
// //     if (expandedId === agentId) {
// //       setExpandedId(null);
// //     } else {
// //       setExpandedId(agentId);
// //       fetchAvailableManagers(state);
// //       setSelectedManagerId('');
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPendingAgents();
// //   }, []);

// //   const filteredAgents = pendingAgents.filter(({ agent, user }) => {
// //     const searchLower = searchTerm.toLowerCase();
// //     return (
// //       agent.agent_name.toLowerCase().includes(searchLower) ||
// //       user.email.toLowerCase().includes(searchLower) ||
// //       agent.servicing_city.toLowerCase().includes(searchLower) ||
// //       agent.servicing_state.toLowerCase().includes(searchLower)
// //     );
// //   });

// //   if (loading && pendingAgents.length === 0) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
// //         <div className="p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <div className="flex items-center gap-3">
// //               <ShieldCheck className="w-8 h-8 text-blue-600" />
// //               <h1 className="text-2xl font-bold text-gray-800">Agent Approval Requests</h1>
// //             </div>
// //             <button
// //               onClick={fetchPendingAgents}
// //               className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
// //               title="Refresh"
// //             >
// //               <RefreshCw className="w-5 h-5 text-gray-600" />
// //             </button>
// //           </div>

// //           {error && (
// //             <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
// //               <AlertCircle className="w-5 h-5" />
// //               <span>{error}</span>
// //             </div>
// //           )}

// //           {successMessage && (
// //             <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
// //               <CheckCircle2 className="w-5 h-5" />
// //               <span>{successMessage}</span>
// //             </div>
// //           )}

// //           <div className="mb-6 relative">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <Search className="w-5 h-5 text-gray-400" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search agents by name, email, or location..."
// //               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>

// //           {filteredAgents.length === 0 ? (
// //             <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
// //               <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //               <h3 className="text-lg font-medium text-gray-700">
// //                 {searchTerm ? 'No matching agents found' : 'No pending agents'}
// //               </h3>
// //               <p className="text-gray-500 mt-1">
// //                 {searchTerm ? 'Try a different search term' : 'All agents have been approved'}
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="space-y-3">
// //               {filteredAgents.map(({ agent, user }) => (
// //                 <div
// //                   key={agent.agent_id}
// //                   className="border border-gray-200 rounded-lg overflow-hidden transition-all"
// //                 >
// //                   <div
// //                     className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
// //                     onClick={() => toggleExpand(agent.agent_id, agent.servicing_state)}
// //                   >
// //                     <div>
// //                       <h3 className="font-medium text-gray-900">{agent.agent_name}</h3>
// //                       <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
// //                         <MapPin className="w-4 h-4" />
// //                         <span>
// //                           {agent.servicing_city}, {agent.servicing_state}
// //                         </span>
// //                         {agent.is_verified && (
// //                           <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
// //                             <ShieldCheck className="w-3 h-3" />
// //                             Verified
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                     {expandedId === agent.agent_id ? (
// //                       <ChevronUp className="w-5 h-5 text-gray-500" />
// //                     ) : (
// //                       <ChevronDown className="w-5 h-5 text-gray-500" />
// //                     )}
// //                   </div>

// //                   {expandedId === agent.agent_id && (
// //                     <div className="p-4 border-t border-gray-200">
// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                         <div>
// //                           <h4 className="font-medium text-gray-700 mb-3">Agent Details</h4>
// //                           <div className="space-y-3">
// //                             <div>
// //                               <p className="text-xs text-gray-500">Delivery Type</p>
// //                               <p className="text-gray-800">
// //                                 {agent.delivery_type || 'Not specified'}
// //                               </p>
// //                             </div>
// //                             <div>
// //                               <p className="text-xs text-gray-500">Address</p>
// //                               <p className="text-gray-800">{agent.current_address}</p>
// //                             </div>
// //                           </div>
// //                         </div>

// //                         <div>
// //                           <h4 className="font-medium text-gray-700 mb-3">User Details</h4>
// //                           <div className="space-y-3">
// //                             <div>
// //                               <p className="text-xs text-gray-500">Email</p>
// //                               <p className="text-gray-800">{user.email}</p>
// //                             </div>
// //                             <div>
// //                               <p className="text-xs text-gray-500">User ID</p>
// //                               <p className="text-gray-800">{user.auditly_user_id}</p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="mt-6">
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Assign Manager
// //                         </label>
// //                         <select
// //                           value={selectedManagerId}
// //                           onChange={(e) => setSelectedManagerId(e.target.value)}
// //                           className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //                         >
// //                           <option value="">Select a manager</option>
// //                           {availableManagers.map((manager) => (
// //                             <option
// //                               key={manager.manager_id}
// //                               value={manager.manager_id.toString()}
// //                             >
// //                               {manager.manager_name} ({manager.servicing_city})
// //                             </option>
// //                           ))}
// //                         </select>
// //                       </div>

// //                       <div className="mt-6 flex justify-end">
// //                         <button
// //                           onClick={() => handleApprove(agent.agent_id)}
// //                           disabled={!selectedManagerId || isProcessing}
// //                           className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
// //                             !selectedManagerId || isProcessing
// //                               ? 'bg-gray-400 cursor-not-allowed'
// //                               : 'bg-blue-600 hover:bg-blue-700'
// //                           }`}
// //                         >
// //                           {isProcessing ? (
// //                             <>
// //                               <Loader2 className="w-4 h-4 animate-spin" />
// //                               Processing...
// //                             </>
// //                           ) : (
// //                             <>
// //                               <UserCheck className="w-4 h-4" />
// //                               Approve Agent
// //                             </>
// //                           )}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserPermissionRequests;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type ApprovalType = 'agent' | 'manager';

const UserPermissionRequests = () => {
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [pendingManagers, setPendingManagers] = useState<PendingManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'managers'>('agents');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableManagers, setAvailableManagers] = useState<Manager[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "unverified">("all");
  const [managerOptions, setManagerOptions] = useState<Record<number, Manager[]>>({});

  const fetchPendingApprovals = async () => {
    console.log("Fetching approvals...");  // ✅ Debug log
    try {
      setLoading(true);
      const [agentsResponse, managersResponse] = await Promise.all([
        fetch('/api/pending-agent-approval'),
        fetch('/api/pending-manager-approval')
      ]);
      console.log("Agent API status:", agentsResponse.status); // ✅ Debug log
      console.log("Manager API status:", managersResponse.status); // ✅ Debug log
  
      if (!agentsResponse.ok || !managersResponse.ok) {
        throw new Error('Failed to fetch approval requests');
      }
  
      const [agentsData, managersData] = await Promise.all([
        agentsResponse.json(),
        managersResponse.json()
      ]);
  
      console.log("Fetched agent data:", agentsData); // ✅ Debug log
      console.log("Fetched manager data:", managersData); // ✅ Debug log
  
      setPendingAgents(agentsData.agents || []);
      setPendingManagers(managersData.managers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, type: ApprovalType) => {
    if (type === 'agent' && !selectedManagerId && availableManagers.length > 0) {
      setError('Please select a manager for this agent');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const approverId = localStorage.getItem('userId');
      if (!approverId) throw new Error('Approver ID not found');

      // For agents, first assign manager if available
      if (type === 'agent' && availableManagers.length > 0) {
        const assignResponse = await fetch('/api/assign-managers-to-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent_id: id,
            manager_id: selectedManagerId,
          }),
        });

        if (!assignResponse.ok) {
          throw new Error('Manager assignment failed');
        }
      }

      // Then approve the user (agent or manager)
      const approveResponse = await fetch(`/api/approve-${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [`${type}_id`]: id,
          approver_id: parseInt(approverId),
        }),
      });

      if (!approveResponse.ok) {
        throw new Error('Approval failed');
      }

      setSuccessMessage(`${type === 'agent' ? 'Agent' : 'Manager'} approved successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPendingApprovals();
      setSelectedManagerId('');
      setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };


const fetchAvailableManagers = async (state: string) => {
  console.log("Fetching available managers for:", state); // ✅ This should now log
  try {
    const response = await fetch('/api/available-managers-by-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });

    console.log("Response status:", response.status); // ✅ Confirm this too

    if (!response.ok) throw new Error('Failed to fetch managers');
    const data = await response.json();
    console.log("Fetched managers:", data); // ✅ Check this in devtools
    setAvailableManagers(data.managers || []);
  } catch (err) {
    console.error("Error fetching managers:", err);
    setError(err instanceof Error ? err.message : 'Failed to fetch managers');
  }
};

const toggleExpand = (id: number, type: ApprovalType, state?: string) => {
  const cleanState = state?.trim();
  console.log("Toggling expand for:", { id, type, cleanState });

  if (expandedId === id) {
    setExpandedId(null);
  } else {
    setExpandedId(id);
    if (type === 'agent' && cleanState) {
      console.log("Calling fetchAvailableManagers for state:", cleanState); // ✅ Appears
      fetchAvailableManagers(cleanState); // ✅ NOW it works
    }
    setSelectedManagerId('');
  }
};

const fetchManagersForAgent = async (agentId: number, state: string) => {
  console.log(`Fetching managers for agent ${agentId} in state: ${state}`);
  try {
    const response = await fetch('/api/available-managers-by-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });

    const data = await response.json();
    setManagerOptions(prev => ({
      ...prev,
      [agentId]: data.managers || [],
    }));
  } catch (err) {
    console.error("Error fetching managers:", err);
  }
};

  
  
  
  
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const filteredData = activeTab === 'agents' 
    ? pendingAgents.filter(({ agent, user }) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          agent.agent_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          agent.servicing_city.toLowerCase().includes(searchLower) ||
          agent.servicing_state.toLowerCase().includes(searchLower);
        
        const matchesVerification = 
          verificationFilter === 'all' ||
          (verificationFilter === 'verified' && agent.is_verified) ||
          (verificationFilter === 'unverified' && !agent.is_verified);
        
        return matchesSearch && matchesVerification;
      })
    : pendingManagers.filter(({ manager, user }) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          manager.manager_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          manager.servicing_city.toLowerCase().includes(searchLower) ||
          manager.servicing_state.toLowerCase().includes(searchLower);
        
        const matchesVerification = 
          verificationFilter === 'all' ||
          (verificationFilter === 'verified' && manager.is_verified) ||
          (verificationFilter === 'unverified' && !manager.is_verified);
        
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
                onChange={(e) => setVerificationFilter(e.target.value as "all" | "verified" | "unverified")}
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
                  activeTab === 'agents'
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('agents')}
              >
                <User className="w-5 h-5" />
                Agents ({pendingAgents.length})
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'managers'
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('managers')}
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
                  const isAgent = activeTab === 'agents';
                  const data = isAgent ? (item as PendingAgent).agent : (item as PendingManager).manager;
                  const user = item.user;
                  const id = isAgent ? data.agent_id : data.manager_id;
                  
                  return (
                    <motion.div
                      key={`${activeTab}-${id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        expandedId === id
                          ? 'border-indigo-300 shadow-md bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-200 bg-white hover:shadow-md'
                      }`}
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => {
                          console.log("Expand clicked, state is:", data.servicing_state); // ✅
                          toggleExpand(id, activeTab, data.servicing_state);
                        }}                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                expandedId === id
                                  ? 'bg-indigo-200 text-indigo-700'
                                  : 'bg-indigo-100 text-indigo-600'
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
                                {isAgent ? data.agent_name : data.manager_name}
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
                                      {isAgent ? 'Agent Details' : 'Manager Details'}
                                    </h4>
                                    <div className="space-y-3">
                                      {isAgent && (
                                        <div className="flex items-center gap-3">
                                          <Truck className="w-5 h-5 text-indigo-400" />
                                          <div>
                                            <p className="text-xs text-slate-500">Delivery Type</p>
                                            <p className="text-slate-700 font-medium">
                                              {(data as Agent).delivery_type || "Not specified"}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">
                                            {isAgent ? 'Current Address' : 'Permanent Address'}
                                          </p>
                                          <p className="text-slate-700 font-medium">
                                            {isAgent
                                              ? (data as Agent).current_address
                                              : (data as Manager).permanent_address}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">Gender</p>
                                          <p className="text-slate-700 font-medium">{data.gender}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">Date of Birth</p>
                                          <p className="text-slate-700 font-medium">{data.dob}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                      <Users className="w-4 h-4 text-indigo-500" />
                                      User Details
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">User Name</p>
                                          <p className="text-slate-700 font-medium">{user.auditly_user_name}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">Email</p>
                                          <p className="text-slate-700 font-medium">{user.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                        <div>
                                          <p className="text-xs text-slate-500">User ID</p>
                                          <p className="text-slate-700 font-medium">{user.auditly_user_id}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

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
                                          <p className="text-xs text-slate-500">Last Updated</p>
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
                                    Assign Manager
                                  </label>

                                  {(managerOptions[id]?.length ?? 0) > 0 ? (
                                    <select
                                      onClick={() => fetchManagersForAgent(id, (data as Agent).servicing_state)}
                                      value={selectedManagerId}
                                      onChange={(e) => setSelectedManagerId(e.target.value)}
                                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="">Select a manager</option>
                                      {managerOptions[id].map((manager) => (
                                        <option
                                          key={manager.manager_id}
                                          value={manager.manager_id.toString()}
                                        >
                                          {manager.manager_name || `Manager #${manager.manager_id}`} ({manager.servicing_city}, {manager.servicing_state})
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
                                      No managers available in {data.servicing_state}.
                                    </div>
                                  )}
                                </div>
                              )}


                              <div className="mt-8 flex justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(id, isAgent ? 'agent' : 'manager')}
                                  disabled={isProcessing && expandedId === id}
                                  className={`px-8 py-3 rounded-xl flex items-center gap-2 font-medium ${
                                    isProcessing && expandedId === id
                                      ? 'bg-indigo-200 text-indigo-700'
                                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                  } shadow-sm`}
                                >
                                  {isProcessing && expandedId === id ? (
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
                                      {isAgent ? (
                                        <UserCheck className="w-5 h-5" />
                                      ) : (
                                        <UserCog className="w-5 h-5" />
                                      )}
                                      Approve {isAgent ? 'Agent' : 'Manager'}
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