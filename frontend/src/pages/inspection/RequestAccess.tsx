// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   User, 
//   Users, 
//   MapPin, 
//   Calendar, 
//   Building,
//   CheckCircle,
//   Truck,
//   Navigation,
//   ClipboardList
// } from "lucide-react";

// // FormField component
// interface FormFieldProps {
//   label: string;
//   name: string;
//   type?: "text" | "date" | "number" | "select" | "textarea" | "checkbox";
//   value: any;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
//   required?: boolean;
//   options?: { value: string; label: string }[];
//   placeholder?: string;
//   colSpan?: boolean;
//   rows?: number;
//   icon?: React.ReactNode;
// }

// const FormField: React.FC<FormFieldProps> = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   required = false,
//   options = [],
//   placeholder = "",
//   colSpan = false,
//   rows = 3,
//   icon
// }) => {
//   if (type === "checkbox") {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center space-x-3"
//       >
//         <div className="flex items-center h-5">
//           <input
//             type="checkbox"
//             id={name}
//             name={name}
//             checked={value}
//             onChange={onChange}
//             className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           {icon && <span className="text-blue-500">{icon}</span>}
//           <label htmlFor={name} className="text-gray-700 font-medium">
//             {label}
//           </label>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={colSpan ? "col-span-2" : ""}
//     >
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
      
//       <div className="relative">
//         {icon && (
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
//             {icon}
//           </div>
//         )}
        
//         {type === "select" ? (
//           <select
//             id={name}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
//           >
//             {options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         ) : type === "textarea" ? (
//           <textarea
//             id={name}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             rows={rows}
//             placeholder={placeholder}
//             className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
//           />
//         ) : (
//           <input
//             type={type}
//             id={name}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             placeholder={placeholder}
//             className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
//           />
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // FormSection component
// interface FormSectionProps {
//   title: string;
//   children: React.ReactNode;
//   icon?: React.ReactNode;
// }

// const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ type: "spring", stiffness: 100, damping: 15 }}
//       className="space-y-4"
//     >
//       <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
//         {icon}
//         <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
//         {children}
//       </div>
//     </motion.div>
//   );
// };

// // Main AgentCreationForm component
// const RequestAccess: React.FC = () => {
//   const [form, setForm] = useState({
//     agent_name: "",
//     manager_id: "",
//     current_address: "",
//     delivery_type: "Delivery",
//     pickup_routing_mode: false,
//     delivery_routing_mode: false,
//     servicing_state: "",
//     servicing_city: "",
//     servicing_zip: "",
//     permanent_adress: "",
//     permanent_address_state: "",
//     permanent_address_city: "",
//     permanent_address_zip: "",
//     is_verified: false,
//     gender: "Male",
//     dob: "",
//     work_schedule: "",
//     company_id: "",
//     agent_to_user_mapping_id: "",
//     additional_info_1: "",
//     additional_info_2: "",
//     additional_info_3: ""
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;
    
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Convert some fields to appropriate types before sending
//       const payload = {
//         ...form,
//         manager_id: form.manager_id ? JSON.parse(form.manager_id) : null,
//         work_schedule: form.work_schedule ? JSON.parse(form.work_schedule) : null,
//         company_id: form.company_id ? parseInt(form.company_id) : null,
//         agent_to_user_mapping_id: form.agent_to_user_mapping_id ? parseInt(form.agent_to_user_mapping_id) : null,
//         pickup_routing_mode: Boolean(form.pickup_routing_mode),
//         delivery_routing_mode: Boolean(form.delivery_routing_mode),
//         is_verified: Boolean(form.is_verified)
//       };

//       // Simulate API call - replace with actual API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       // const response = await fetch("https://auditlyai.com/api/create-agent/", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify(payload),
//       // });

//       // if (!response.ok) {
//       //   throw new Error('Failed to create agent');
//       // }

//       setSubmitted(true);
//     } catch (error) {
//       console.error("Failed to submit request:", error);
//       setError(error instanceof Error ? error.message : 'Failed to create agent');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="max-w-4xl mx-auto mt-10 p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <motion.div
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 20,
//             }}
//             className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
//           >
//             <CheckCircle className="w-10 h-10 text-green-600" />
//           </motion.div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-700">
//             Agent Created Successfully!
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             The new agent has been successfully registered in the system.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSubmitted(false)}
//             className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
//           >
//             Create Another Agent
//           </motion.button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-12"
//       >
//         <motion.div
//           initial={{ scale: 0.8, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{
//             type: "spring",
//             stiffness: 200,
//             damping: 20,
//           }}
//           className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
//         >
//           <Users className="w-10 h-10 text-blue-600" />
//         </motion.div>
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//         >
//           Create New Agent
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="text-xl text-gray-600 max-w-2xl mx-auto"
//         >
//           Register a new delivery agent to your system
//         </motion.p>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//         className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50 overflow-hidden"
//       >
//         <div className="p-8">
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
//               >
//                 {error}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information Section */}
//             <FormSection 
//               title="Basic Information" 
//               icon={<User className="w-5 h-5 text-blue-600" />}
//             >
//               <FormField
//                 label="Agent Name"
//                 name="agent_name"
//                 type="text"
//                 value={form.agent_name}
//                 onChange={handleChange}
//                 required
//                 icon={<User className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Gender"
//                 name="gender"
//                 type="select"
//                 value={form.gender}
//                 onChange={handleChange}
//                 required
//                 options={[
//                   { value: "Male", label: "Male" },
//                   { value: "Female", label: "Female" },
//                   { value: "Other", label: "Other" },
//                   { value: "Prefer not to say", label: "Prefer not to say" }
//                 ]}
//                 icon={<Users className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Date of Birth"
//                 name="dob"
//                 type="date"
//                 value={form.dob}
//                 onChange={handleChange}
//                 icon={<Calendar className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Delivery Type"
//                 name="delivery_type"
//                 type="select"
//                 value={form.delivery_type}
//                 onChange={handleChange}
//                 required
//                 options={[
//                   { value: "Delivery", label: "Delivery" },
//                   { value: "Return", label: "Return" },
//                   { value: "Both", label: "Both" }
//                 ]}
//                 icon={<Truck className="w-4 h-4" />}
//               />
//             </FormSection>

//             {/* Address Information Section */}
//             <FormSection 
//               title="Address Information" 
//               icon={<MapPin className="w-5 h-5 text-blue-600" />}
//             >
//               <FormField
//                 label="Current Address"
//                 name="current_address"
//                 type="text"
//                 value={form.current_address}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Permanent Address"
//                 name="permanent_adress"
//                 type="text"
//                 value={form.permanent_adress}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Servicing State"
//                 name="servicing_state"
//                 type="text"
//                 value={form.servicing_state}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Servicing City"
//                 name="servicing_city"
//                 type="text"
//                 value={form.servicing_city}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Servicing Zip Code"
//                 name="servicing_zip"
//                 type="text"
//                 value={form.servicing_zip}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Permanent Address State"
//                 name="permanent_address_state"
//                 type="text"
//                 value={form.permanent_address_state}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Permanent Address City"
//                 name="permanent_address_city"
//                 type="text"
//                 value={form.permanent_address_city}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Permanent Address Zip Code"
//                 name="permanent_address_zip"
//                 type="text"
//                 value={form.permanent_address_zip}
//                 onChange={handleChange}
//                 icon={<MapPin className="w-4 h-4" />}
//               />
//             </FormSection>

//             {/* Work Information Section */}
//             <FormSection 
//               title="Work Information" 
//               icon={<Building className="w-5 h-5 text-blue-600" />}
//             >
//               <FormField
//                 label="Manager ID (JSON)"
//                 name="manager_id"
//                 type="textarea"
//                 value={form.manager_id}
//                 onChange={handleChange}
//                 placeholder='{"id": 123, "name": "John Doe"}'
//                 rows={2}
//                 icon={<Users className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Company ID"
//                 name="company_id"
//                 type="number"
//                 value={form.company_id}
//                 onChange={handleChange}
//                 icon={<Building className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Agent to User Mapping ID"
//                 name="agent_to_user_mapping_id"
//                 type="number"
//                 value={form.agent_to_user_mapping_id}
//                 onChange={handleChange}
//                 icon={<ClipboardList className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Pickup Routing Mode"
//                 name="pickup_routing_mode"
//                 type="checkbox"
//                 value={form.pickup_routing_mode}
//                 onChange={handleChange}
//                 icon={<Navigation className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Delivery Routing Mode"
//                 name="delivery_routing_mode"
//                 type="checkbox"
//                 value={form.delivery_routing_mode}
//                 onChange={handleChange}
//                 icon={<Truck className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Is Verified"
//                 name="is_verified"
//                 type="checkbox"
//                 value={form.is_verified}
//                 onChange={handleChange}
//                 icon={<CheckCircle className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Work Schedule (JSON)"
//                 name="work_schedule"
//                 type="textarea"
//                 value={form.work_schedule}
//                 onChange={handleChange}
//                 placeholder='{"monday": "9-5", "tuesday": "9-5"}'
//                 rows={3}
//                 colSpan
//                 icon={<Calendar className="w-4 h-4" />}
//               />
//             </FormSection>

//             {/* Additional Information Section */}
//             <FormSection 
//               title="Additional Information"
//               icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
//             >
//               <FormField
//                 label="Additional Info 1"
//                 name="additional_info_1"
//                 type="text"
//                 value={form.additional_info_1}
//                 onChange={handleChange}
//                 icon={<ClipboardList className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Additional Info 2"
//                 name="additional_info_2"
//                 type="text"
//                 value={form.additional_info_2}
//                 onChange={handleChange}
//                 icon={<ClipboardList className="w-4 h-4" />}
//               />
//               <FormField
//                 label="Additional Info 3"
//                 name="additional_info_3"
//                 type="text"
//                 value={form.additional_info_3}
//                 onChange={handleChange}
//                 icon={<ClipboardList className="w-4 h-4" />}
//               />
//             </FormSection>

//             <div className="pt-6">
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 disabled={loading}
//                 className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                     <span>Creating Agent...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Users className="w-5 h-5" />
//                     <span>Create Agent</span>
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RequestAccess;


import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Users, 
  MapPin, 
  Calendar, 
  Building,
  CheckCircle,
  Truck,
  Navigation,
  ClipboardList
} from "lucide-react";

// FormField component
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
}

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
  icon
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
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
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
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
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
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm`}
          />
        )}
      </div>
    </motion.div>
  );
};

// FormSection component
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
        {children}
      </div>
    </motion.div>
  );
};

// Main RequestAccess component
const RequestAccess: React.FC = () => {
  const [form, setForm] = useState({
    agent_name: "",
    manager_id: "",
    current_address: "",
    delivery_type: "Delivery",
    pickup_routing_mode: false,
    delivery_routing_mode: false,
    servicing_state: "",
    servicing_city: "",
    servicing_zip: "",
    permanent_adress: "",
    permanent_address_state: "",
    permanent_address_city: "",
    permanent_address_zip: "",
    is_verified: false,
    gender: "Male",
    dob: "",
    work_schedule: "",
    company_id: "",
    agent_to_user_mapping_id: "",
    additional_info_1: "",
    additional_info_2: "",
    additional_info_3: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{agent_id: number} | null>(null);

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
      // Prepare the payload according to the API model
      const payload = {
        agent_name: form.agent_name,
        manager_id: form.manager_id ? JSON.parse(form.manager_id) : null,
        current_address: form.current_address || null,
        delivery_type: form.delivery_type,
        pickup_routing_mode: form.pickup_routing_mode || false,
        delivery_routing_mode: form.delivery_routing_mode || false,
        servicing_state: form.servicing_state || null,
        servicing_city: form.servicing_city || null,
        servicing_zip: form.servicing_zip || null,
        permanent_adress: form.permanent_adress || null,
        permanent_address_state: form.permanent_address_state || null,
        permanent_address_city: form.permanent_address_city || null,
        permanent_address_zip: form.permanent_address_zip || null,
        is_verified: form.is_verified || false,
        gender: form.gender,
        dob: form.dob || null,
        work_schedule: form.work_schedule ? JSON.parse(form.work_schedule) : null,
        company_id: form.company_id ? parseInt(form.company_id) : null,
        agent_to_user_mapping_id: form.agent_to_user_mapping_id ? parseInt(form.agent_to_user_mapping_id) : null,
        additional_info_1: form.additional_info_1 || null,
        additional_info_2: form.additional_info_2 || null,
        additional_info_3: form.additional_info_3 || null
      };

      const response = await fetch("/api/create-agent/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${yourAuthToken}`
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
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
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
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-700">
            Agent Created Successfully!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            The new agent has been successfully registered in the system.
          </p>
          {successData && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <p className="text-blue-700 font-medium">Agent ID: {successData.agent_id}</p>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSubmitted(false);
              setSuccessData(null);
              // Reset form if needed
              setForm({
                agent_name: "",
                manager_id: "",
                current_address: "",
                delivery_type: "Delivery",
                pickup_routing_mode: false,
                delivery_routing_mode: false,
                servicing_state: "",
                servicing_city: "",
                servicing_zip: "",
                permanent_adress: "",
                permanent_address_state: "",
                permanent_address_city: "",
                permanent_address_zip: "",
                is_verified: false,
                gender: "Male",
                dob: "",
                work_schedule: "",
                company_id: "",
                agent_to_user_mapping_id: "",
                additional_info_1: "",
                additional_info_2: "",
                additional_info_3: ""
              });
            }}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Create Another Agent
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
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
          <Users className="w-10 h-10 text-blue-600" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
        >
          Create New Agent
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Register a new delivery agent to your system
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50 overflow-hidden"
      >
        <div className="p-8">
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <FormSection 
              title="Basic Information" 
              icon={<User className="w-5 h-5 text-blue-600" />}
            >
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
              <FormField
                label="Delivery Type"
                name="delivery_type"
                type="select"
                value={form.delivery_type}
                onChange={handleChange}
                required
                options={[
                  { value: "Delivery", label: "Delivery" },
                  { value: "Return", label: "Return" },
                  { value: "Both", label: "Both" }
                ]}
                icon={<Truck className="w-4 h-4" />}
              />
            </FormSection>

            {/* Address Information Section */}
            <FormSection 
              title="Address Information" 
              icon={<MapPin className="w-5 h-5 text-blue-600" />}
            >
              <FormField
                label="Current Address"
                name="current_address"
                type="text"
                value={form.current_address}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Permanent Address"
                name="permanent_adress"
                type="text"
                value={form.permanent_adress}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Servicing State"
                name="servicing_state"
                type="text"
                value={form.servicing_state}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Servicing City"
                name="servicing_city"
                type="text"
                value={form.servicing_city}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Servicing Zip Code"
                name="servicing_zip"
                type="text"
                value={form.servicing_zip}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Permanent Address State"
                name="permanent_address_state"
                type="text"
                value={form.permanent_address_state}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Permanent Address City"
                name="permanent_address_city"
                type="text"
                value={form.permanent_address_city}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
              <FormField
                label="Permanent Address Zip Code"
                name="permanent_address_zip"
                type="text"
                value={form.permanent_address_zip}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4" />}
              />
            </FormSection>

            {/* Work Information Section */}
            <FormSection 
              title="Work Information" 
              icon={<Building className="w-5 h-5 text-blue-600" />}
            >
              <FormField
                label="Manager ID (JSON)"
                name="manager_id"
                type="textarea"
                value={form.manager_id}
                onChange={handleChange}
                placeholder='{"id": 123, "name": "John Doe"}'
                rows={2}
                icon={<Users className="w-4 h-4" />}
              />
              <FormField
                label="Company ID"
                name="company_id"
                type="number"
                value={form.company_id}
                onChange={handleChange}
                icon={<Building className="w-4 h-4" />}
              />
              <FormField
                label="Agent to User Mapping ID"
                name="agent_to_user_mapping_id"
                type="number"
                value={form.agent_to_user_mapping_id}
                onChange={handleChange}
                icon={<ClipboardList className="w-4 h-4" />}
              />
              <FormField
                label="Pickup Routing Mode"
                name="pickup_routing_mode"
                type="checkbox"
                value={form.pickup_routing_mode}
                onChange={handleChange}
                icon={<Navigation className="w-4 h-4" />}
              />
              <FormField
                label="Delivery Routing Mode"
                name="delivery_routing_mode"
                type="checkbox"
                value={form.delivery_routing_mode}
                onChange={handleChange}
                icon={<Truck className="w-4 h-4" />}
              />
              <FormField
                label="Is Verified"
                name="is_verified"
                type="checkbox"
                value={form.is_verified}
                onChange={handleChange}
                icon={<CheckCircle className="w-4 h-4" />}
              />
              <FormField
                label="Work Schedule (JSON)"
                name="work_schedule"
                type="textarea"
                value={form.work_schedule}
                onChange={handleChange}
                placeholder='{"monday": "9-5", "tuesday": "9-5"}'
                rows={3}
                colSpan
                icon={<Calendar className="w-4 h-4" />}
              />
            </FormSection>

            {/* Additional Information Section */}
            <FormSection 
              title="Additional Information"
              icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
            >
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
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
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
  );
};

export default RequestAccess;
