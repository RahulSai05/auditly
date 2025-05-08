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



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Users, 
  MapPin, 
  Calendar, 
  Truck,
  CheckCircle2,
  ClipboardList,
  Route,
  ChevronDown,
  ChevronUp,
  Navigation2,
  Loader2,
  AlertCircle,
  XCircle,
  Mail,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

// Types
interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

interface FormState {
  agent_name: string;
  current_address: string;
  delivery_type: string;
  pickup_routing_mode: string;
  delivery_routing_mode: string;
  servicing_state: string;
  servicing_city: string;
  servicing_zip: string;
  permanent_adress: string;
  permanent_address_state: string;
  permanent_address_city: string;
  permanent_address_zip: string;
  gender: string;
  dob: string;
  work_schedule: string;
  agent_to_user_mapping_id: string;
  additional_info_1: string;
  additional_info_2: string;
  additional_info_3: string;
}

interface SuccessData {
  agent_id: number;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "date" | "number" | "select" | "textarea" | "checkbox";
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  colSpan?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  readOnly?: boolean;
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

// FormField Component
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  options = [],
  placeholder = "",
  colSpan = false,
  rows = 3,
  icon,
  readOnly = false
}) => {
  if (type === "checkbox") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={onChange}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          <label htmlFor={name} className="text-gray-700 font-medium">
            {label}
          </label>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={colSpan ? "col-span-2" : ""}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
            {icon}
          </div>
        )}
        
        {type === "select" ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white ${readOnly ? 'bg-gray-100' : ''}`}
          />
        )}
      </div>
    </motion.div>
  );
};

// FormSection Component
const FormSection: React.FC<FormSectionProps> = ({ title, children, icon, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="space-y-4 bg-gray-50 rounded-xl p-4"
    >
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Component
const RequestAccess: React.FC = () => {
  const [days, setDays] = useState<DayOption[]>([
    { id: 1, name: "Monday", selected: false },
    { id: 2, name: "Tuesday", selected: false },
    { id: 3, name: "Wednesday", selected: false },
    { id: 4, name: "Thursday", selected: false },
    { id: 5, name: "Friday", selected: false },
    { id: 6, name: "Saturday", selected: false },
    { id: 7, name: "Sunday", selected: false },
  ]);

  const [form, setForm] = useState<FormState>({
    agent_name: "",
    current_address: "",
    delivery_type: "",
    pickup_routing_mode: "",
    delivery_routing_mode: "",
    servicing_state: "",
    servicing_city: "",
    servicing_zip: "",
    permanent_adress: "",
    permanent_address_state: "",
    permanent_address_city: "",
    permanent_address_zip: "",
    gender: "",
    dob: "",
    work_schedule: "",
    agent_to_user_mapping_id: "",
    additional_info_1: "",
    additional_info_2: "",
    additional_info_3: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setForm(prev => ({
        ...prev,
        agent_to_user_mapping_id: userId
      }));
    }
  }, []);

  const toggleDaySelection = (dayId: number) => {
    const updatedDays = days.map(day => 
      day.id === dayId ? { ...day, selected: !day.selected } : day
    );
    setDays(updatedDays);
    
    const selectedDays = updatedDays
      .filter(day => day.selected)
      .map(day => day.id)
      .sort((a, b) => a - b)
      .join(",");
    
    setForm(prev => ({
      ...prev,
      work_schedule: JSON.stringify({ days: selectedDays })
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        agent_name: form.agent_name,
        current_address: form.current_address || null,
        delivery_type: form.delivery_type,
        pickup_routing_mode: form.pickup_routing_mode === "manual" ? 1 : 0,
        delivery_routing_mode: form.delivery_routing_mode === "manual" ? 1 : 0,
        servicing_state: form.servicing_state || null,
        servicing_city: form.servicing_city || null,
        servicing_zip: form.servicing_zip || null,
        permanent_adress: form.permanent_adress || null,
        permanent_address_state: form.permanent_address_state || null,
        permanent_address_city: form.permanent_address_city || null,
        permanent_address_zip: form.permanent_address_zip || null,
        gender: form.gender,
        dob: form.dob || null,
        work_schedule: form.work_schedule ? JSON.parse(form.work_schedule) : null,
        agent_to_user_mapping_id: form.agent_to_user_mapping_id ? parseInt(form.agent_to_user_mapping_id) : null,
        additional_info_1: form.additional_info_1 || null,
        additional_info_2: form.additional_info_2 || null,
        additional_info_3: form.additional_info_3 || null
      };

      const response = await fetch("/api/create-agent/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create agent');
      }

      const data = await response.json();
      setSuccessData(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
      setError(error instanceof Error ? error.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <SuccessView 
      successData={successData} 
      resetForm={() => {
        setSubmitted(false);
        setSuccessData(null);
        setForm({
          agent_name: "",
          current_address: "",
          delivery_type: "",
          pickup_routing_mode: "",
          delivery_routing_mode: "",
          servicing_state: "",
          servicing_city: "",
          servicing_zip: "",
          permanent_adress: "",
          permanent_address_state: "",
          permanent_address_city: "",
          permanent_address_zip: "",
          gender: "",
          dob: "",
          work_schedule: "",
          agent_to_user_mapping_id: localStorage.getItem("userId") || "",
          additional_info_1: "",
          additional_info_2: "",
          additional_info_3: ""
        });
        setDays(days.map(day => ({ ...day, selected: false }));
      }}
    />;
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
                  <Users className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Create New Agent
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
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoSection form={form} handleChange={handleChange} icon={<User className="w-5 h-5 text-blue-500" />} />
              <DeliveryTypeSection form={form} handleChange={handleChange} icon={<Truck className="w-5 h-5 text-blue-500" />} />
              <RoutingModeSection form={form} handleChange={handleChange} icon={<Route className="w-5 h-5 text-blue-500" />} />
              
              <FormSection title="Work Schedule" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {days.map((day) => (
                      <motion.div
                        key={day.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDaySelection(day.id)}
                        className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                          day.selected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {day.name}
                      </motion.div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Selected Work Days:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {days.filter(day => day.selected).length > 0 ? (
                        days
                          .filter(day => day.selected)
                          .map(day => (
                            <motion.span
                              key={day.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {day.name}
                            </motion.span>
                          ))
                      ) : (
                        <span className="text-gray-500">No days selected yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </FormSection>

              <AddressInfoSection form={form} handleChange={handleChange} icon={<MapPin className="w-5 h-5 text-blue-500" />} />
              <AdditionalInfoSection form={form} handleChange={handleChange} icon={<ClipboardList className="w-5 h-5 text-blue-500" />} />

              <div className="pt-6">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                      <span>Creating Agent...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Create Agent</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface SuccessViewProps {
  successData: SuccessData | null;
  resetForm: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ successData, resetForm }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Agent Created Successfully!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            The new agent has been successfully registered in the system.
          </p>
          {successData && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-blue-700 font-medium">Agent ID: {successData.agent_id}</p>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <Users className="w-5 h-5" />
            Create Another Agent
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

interface SectionProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
}

const BasicInfoSection: React.FC<SectionProps> = ({ form, handleChange, icon }) => (
  <FormSection title="Basic Information" icon={icon}>
    <FormField
      label="Agent Name"
      name="agent_name"
      type="text"
      value={form.agent_name}
      onChange={handleChange}
      required
      icon={<User className="w-4 h-4" />}
    />
    <FormField
      label="Gender"
      name="gender"
      type="select"
      value={form.gender}
      onChange={handleChange}
      required
      options={[
        { value: "", label: "Please select gender" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
        { value: "Prefer not to say", label: "Prefer not to say" }
      ]}
      icon={<Users className="w-4 h-4" />}
    />
    <FormField
      label="Date of Birth"
      name="dob"
      type="date"
      value={form.dob}
      onChange={handleChange}
      icon={<Calendar className="w-4 h-4" />}
    />
  </FormSection>
);

const DeliveryTypeSection: React.FC<SectionProps> = ({ form, handleChange, icon }) => (
  <FormSection title="Delivery Type" icon={icon}>
    <FormField
      label="Delivery Type"
      name="delivery_type"
      type="select"
      value={form.delivery_type}
      onChange={handleChange}
      required
      options={[
        { value: "", label: "Please select delivery type" },
        { value: "Delivery", label: "Delivery" },
        { value: "Return", label: "Return" },
        { value: "Both", label: "Both" }
      ]}
      icon={<Truck className="w-4 h-4" />}
    />
  </FormSection>
);

const RoutingModeSection: React.FC<SectionProps> = ({ form, handleChange, icon }) => (
  <FormSection title="Routing Mode" icon={icon}>
    <FormField
      label="Pickup Routing Mode"
      name="pickup_routing_mode"
      type="select"
      value={form.pickup_routing_mode}
      onChange={handleChange}
      required
      options={[
        { value: "", label: "Please select routing mode" },
        { value: "auto", label: "Automatic" },
        { value: "manual", label: "Manual" }
      ]}
      icon={<Navigation2 className="w-4 h-4" />}
    />
    <FormField
      label="Delivery Routing Mode"
      name="delivery_routing_mode"
      type="select"
      value={form.delivery_routing_mode}
      onChange={handleChange}
      required
      options={[
        { value: "", label: "Please select routing mode" },
        { value: "auto", label: "Automatic" },
        { value: "manual", label: "Manual" }
      ]}
      icon={<Truck className="w-4 h-4" />}
    />
  </FormSection>
);

const AddressInfoSection: React.FC<SectionProps> = ({ form, handleChange, icon }) => (
  <FormSection title="Address Information" icon={icon}>
    <FormField
      label="Current Address"
      name="current_address"
      type="text"
      value={form.current_address}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Permanent Address"
      name="permanent_adress"
      type="text"
      value={form.permanent_adress}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Servicing State"
      name="servicing_state"
      type="text"
      value={form.servicing_state}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Servicing City"
      name="servicing_city"
      type="text"
      value={form.servicing_city}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Servicing Zip Code"
      name="servicing_zip"
      type="text"
      value={form.servicing_zip}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Permanent Address State"
      name="permanent_address_state"
      type="text"
      value={form.permanent_address_state}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Permanent Address City"
      name="permanent_address_city"
      type="text"
      value={form.permanent_address_city}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
    <FormField
      label="Permanent Address Zip Code"
      name="permanent_address_zip"
      type="text"
      value={form.permanent_address_zip}
      onChange={handleChange}
      required
      icon={<MapPin className="w-4 h-4" />}
    />
  </FormSection>
);

const AdditionalInfoSection: React.FC<SectionProps> = ({ form, handleChange, icon }) => (
  <FormSection title="Additional Information" icon={icon}>
    <FormField
      label="Additional Info 1"
      name="additional_info_1"
      type="text"
      value={form.additional_info_1}
      onChange={handleChange}
      icon={<ClipboardList className="w-4 h-4" />}
    />
    <FormField
      label="Additional Info 2"
      name="additional_info_2"
      type="text"
      value={form.additional_info_2}
      onChange={handleChange}
      icon={<ClipboardList className="w-4 h-4" />}
    />
    <FormField
      label="Additional Info 3"
      name="additional_info_3"
      type="text"
      value={form.additional_info_3}
      onChange={handleChange}
      icon={<ClipboardList className="w-4 h-4" />}
    />
  </FormSection>
);

export default RequestAccess;
