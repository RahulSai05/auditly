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
  RefreshCw,
  UserCog,
  UserCheck,
  Home,
  Briefcase
} from "lucide-react";

// Types
interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

interface AgentFormState {
  name: string;
  current_address: string;
  delivery_type: string;
  pickup_routing_mode: string;
  delivery_routing_mode: string;
  servicing_country: string; 
  servicing_state: string;
  servicing_city: string;
  servicing_zip: string;
  permanent_address: string;
  permanent_address_state: string;
  permanent_address_city: string;
  permanent_address_zip: string;
  gender: string;
  dob: string;
  work_schedule: { days: string };
  agent_to_user_mapping_id: string;
  additional_info_1: string;
  additional_info_2: string;
  additional_info_3: string;
}

interface ManagerFormState {
  name: string;
  servicing_country: string; 
  servicing_state: string;
  servicing_city: string;
  servicing_zip: string;
  permanent_address: string;
  permanent_address_state: string;
  permanent_address_city: string;
  permanent_address_zip: string;
  manager_grade: "c1" | "c2" | "c3" | "";
  address: string;
  dob: string;
  gender: string;
  work_schedule: { days: string };
  manager_user_mapping_id: string;
  delivery_type: string;
  pickup_routing_mode: string;
  delivery_routing_mode: string;
  additional_info_1: string;
  additional_info_2: string;
}

const organization = localStorage.getItem("organization");

interface SuccessData {
  id: number;
  type: 'agent' | 'manager';
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
  disabled?: boolean;
  isAgent?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

const allowCommaKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === ",") {
    e.stopPropagation(); // stop others from interfering
    return; // allow it to proceed
  }
};

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
  readOnly = false,
  disabled = false,
  onKeyDown
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
            disabled={disabled}
            className={`h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          <label htmlFor={name} className={`text-gray-700 font-medium ${disabled ? 'opacity-50' : ''}`}>
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
      <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${disabled ? 'opacity-50' : ''}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${disabled ? 'text-blue-200' : 'text-blue-400'}`}>
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
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
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
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 ${disabled || readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
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

  const [role, setRole] = useState<'agent' | 'manager' | null>(null);
  const [agentForm, setAgentForm] = useState<AgentFormState>({
    name: "",
    current_address: "",
    delivery_type: "",
    pickup_routing_mode: "",
    delivery_routing_mode: "",
    servicing_country: "",
    servicing_state: "",
    servicing_city: "",
    servicing_zip: [],
    permanent_address: "",
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

  const [managerForm, setManagerForm] = useState<ManagerFormState>({
  name: "",
  servicing_country: "",
  servicing_state: "",
  servicing_city: "",
  servicing_zip: [],
  permanent_address: "",
  permanent_address_state: "",
  permanent_address_city: "",
  permanent_address_zip: "",
  address: "",
  dob: "",
  gender: "",
  manager_grade: "", 
  work_schedule: "",
  manager_user_mapping_id: localStorage.getItem("userId") || "",
  delivery_type: "",
  pickup_routing_mode: "",
  delivery_routing_mode: "",
  additional_info_1: "",
  additional_info_2: ""
});


  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [accessStatus, setAccessStatus] = useState<{
    is_agent: boolean;
    is_manager: boolean;
    pending_agent: boolean;
    pending_manager: boolean;
  } | null>(null);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
  
    if (userId) {
      setAgentForm(prev => ({ ...prev, agent_to_user_mapping_id: userId }));
      setManagerForm(prev => ({ ...prev, manager_user_mapping_id: userId }));
  
      fetch(`/api/users/access-status/${userId}`)
        .then(res => res.json())
        .then(data => {
          const d = data.data;
  
          setAccessStatus({
            is_agent: d.is_agent,
            is_manager: d.is_manager,
            pending_agent: d.pending_agent,
            pending_manager: d.pending_manager,
          });
        })
        .catch(err => {
          console.error("Error fetching access status:", err);
        });
    }
  }, []);
  
  const toggleDaySelection = (dayId: number) => {
    if (role === 'agent' && (accessStatus?.is_agent || accessStatus?.pending_agent)) return;
    if (role === 'manager' && (accessStatus?.is_manager || accessStatus?.pending_manager)) return;
    
    const updatedDays = days.map(day => 
      day.id === dayId ? { ...day, selected: !day.selected } : day
    );
    setDays(updatedDays);
    
    const selectedDayIds = updatedDays
      .filter(day => day.selected)
      .map(day => day.id)
      .join(",");

    const newWorkSchedule = { days: selectedDayIds };

    if (role === 'agent') {
      setAgentForm(prev => ({
        ...prev,
        work_schedule: newWorkSchedule
      }));
    } else {
      setManagerForm(prev => ({
        ...prev,
        work_schedule: newWorkSchedule
      }));
    }
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (accessStatus?.is_agent || accessStatus?.pending_agent) return;
    const { name, value } = e.target;
  
    setAgentForm(prev => {
      const updatedForm = { ...prev, [name]: value };
  
      if (name === "delivery_type") {
        if (value === "Delivery") {
          updatedForm.pickup_routing_mode = "";
        } else if (value === "Return") {
          updatedForm.delivery_routing_mode = "";
        } else {
          updatedForm.pickup_routing_mode = "";
          updatedForm.delivery_routing_mode = "";
        }
      }
  
      return updatedForm;
    });
  };
  
  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (accessStatus?.is_manager || accessStatus?.pending_manager) return;
  
    const { name, value } = e.target;
  
    setManagerForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
  
      if (name === "delivery_type") {
        if (value === "Delivery") {
          updatedForm.pickup_routing_mode = "";
        } else if (value === "Return") {
          updatedForm.delivery_routing_mode = "";
        } else if (value === "") {
          updatedForm.pickup_routing_mode = "";
          updatedForm.delivery_routing_mode = "";
        }
      }
  
      return updatedForm;
    });
  };
  
  

  const handleSubmitAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessStatus?.is_agent || accessStatus?.pending_agent) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        agent_name: agentForm.name,
        current_address: agentForm.current_address || null,
        delivery_type: agentForm.delivery_type,
        pickup_routing_mode:
        agentForm.delivery_type === "Return" || agentForm.delivery_type === "Both"
          ? agentForm.pickup_routing_mode === "manual"
          : null,
      
      delivery_routing_mode:
        agentForm.delivery_type === "Delivery" || agentForm.delivery_type === "Both"
          ? agentForm.delivery_routing_mode === "manual"
          : null,
            
        servicing_country: agentForm.servicing_country || null,
        servicing_state: agentForm.servicing_state || null,
        servicing_city: agentForm.servicing_city || null,
        servicing_zip: agentForm.servicing_zip.split(",").map(zip => zip.trim()).filter(zip => zip),
        permanent_address_state: agentForm.permanent_address_state || null,
        permanent_address_city: agentForm.permanent_address_city || null,
        permanent_address_zip: agentForm.permanent_address_zip || null,
        gender: agentForm.gender,
        dob: agentForm.dob || null,
        work_schedule: agentForm.work_schedule || { days: "" },
        agent_to_user_mapping_id: agentForm.agent_to_user_mapping_id ? parseInt(agentForm.agent_to_user_mapping_id) : null,
        additional_info_1: agentForm.additional_info_1 || null,
        additional_info_2: agentForm.additional_info_2 || null,
        additional_info_3: agentForm.additional_info_3 || null,
        organization: localStorage.getItem("organization"),
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
      setSuccessData({ id: data.agent_id, type: 'agent' });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
      setError(error instanceof Error ? error.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        manager_name: managerForm.name,
        servicing_country: managerForm.servicing_country || null,
        servicing_state: managerForm.servicing_state || null,
        servicing_city: managerForm.servicing_city || null,
        servicing_zip: managerForm.servicing_zip.split(",").map(zip => zip.trim()).filter(zip => zip),
        permanent_address_state: managerForm.permanent_address_state || null,
        permanent_address_city: managerForm.permanent_address_city || null,
        permanent_address_zip: managerForm.permanent_address_zip || null,
        address: managerForm.address || null,
        dob: managerForm.dob || null,
        manager_grade: managerForm.manager_grade, 
        gender: managerForm.gender || null,
        work_schedule: managerForm.work_schedule || { days: "" },
        manager_user_mapping_id: managerForm.manager_user_mapping_id ? parseInt(managerForm.manager_user_mapping_id) : null,
        delivery_type: managerForm.delivery_type,
        pickup_routing_mode:
        managerForm.delivery_type === "Return" || managerForm.delivery_type === "Both"
          ? managerForm.pickup_routing_mode === "manual"
          : null,
      
      delivery_routing_mode:
        managerForm.delivery_type === "Delivery" || managerForm.delivery_type === "Both"
          ? managerForm.delivery_routing_mode === "manual"
          : null,
      
        additional_info_1: managerForm.additional_info_1 || null,
        additional_info_2: managerForm.additional_info_2 || null,
        organization: localStorage.getItem("organization"),
      };      

      const response = await fetch("/api/create-manager/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create manager');
      }

      const data = await response.json();
      setSuccessData({ id: data.manager_id, type: 'manager' });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
      setError(error instanceof Error ? error.message : 'Failed to create manager');
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
        setRole(accessStatus?.is_agent || accessStatus?.pending_agent ? 'manager' : null);
        setAgentForm({
          name: "",
          current_address: "",
          delivery_type: "",
          pickup_routing_mode: "",
          delivery_routing_mode: "",
          servicing_state: "",
          servicing_city: "",
          servicing_zip: [],
          permanent_address: "",
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
        setManagerForm({
          name: "",
          servicing_state: "",
          servicing_city: "",
          servicing_zip: [],
          permanent_address: "",
          permanent_address_state: "",
          permanent_address_city: "",
          permanent_address_zip: "",
          address: "",
          dob: "",
          gender: "",
          work_schedule: "",
          manager_user_mapping_id: localStorage.getItem("userId") || "",
          additional_info_1: "",
          additional_info_2: ""
        });
        setDays(days.map(day => ({ ...day, selected: false })));
      }}
    />;
  }

  if (accessStatus === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-6 h-6 text-blue-500" />
        </motion.div>
        <span className="ml-3 text-gray-600 text-lg">Checking access...</span>
      </div>
    );
  }  

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <UserCheck className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Request Access
            </h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              {accessStatus?.pending_agent && (
                <p className="text-yellow-700">
                  Your request for agent access is pending approval.
                </p>
              )}
              {accessStatus?.pending_manager && (
                <p className="text-yellow-700">
                  Your request for manager access is pending approval.
                </p>
              )}
              {accessStatus?.is_agent && !accessStatus?.is_manager && !accessStatus?.pending_manager && (
                <p className="text-blue-700">
                  You are already registered as an agent. You may request manager access below.
                </p>
              )}
              {accessStatus?.is_manager && !accessStatus?.is_agent && !accessStatus?.pending_agent && (
                <p className="text-blue-700">
                  You are already registered as a manager. You may request agent access below.
                </p>
              )}
              {accessStatus?.is_agent && accessStatus?.is_manager && (
                <p className="text-blue-700">
                  You are already registered as both an agent and a manager. No further access requests are needed.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(!accessStatus?.is_agent && !accessStatus?.pending_agent) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole('agent')}
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Agent</h3>
                  <p className="text-gray-600 text-sm">
                    Deliver packages and manage deliveries
                  </p>
                </motion.button>
              )}

              {(!accessStatus?.is_manager && !accessStatus?.pending_manager) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole('manager')}
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <UserCog className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Manager</h3>
                  <p className="text-gray-600 text-sm">
                    Oversee agents and manage operations
                  </p>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
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
                  {role === 'agent' ? (
                    <User className="w-6 h-6 text-blue-600" />
                  ) : (
                    <UserCog className="w-6 h-6 text-blue-600" />
                  )}
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {role === 'agent' ? 'Request Agent Access' : 'Request Manager Access'}
                </h1>
              </div>
              <button
                onClick={() => setRole(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Change role
              </button>
            </div>

            {role === 'agent' && (accessStatus?.is_agent || accessStatus?.pending_agent) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700">
                  You are already registered as an agent. Please use the manager form below
                  to request manager access.
                </p>
              </div>
            )}

            {role === 'manager' && (accessStatus?.is_manager || accessStatus?.pending_manager) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700">
                  You are already registered as a manager. Please use the agent form
                  to request agent access.
                </p>
              </div>
            )}

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

            {role === 'agent' ? (
              <form onSubmit={handleSubmitAgent} className="space-y-6">
                <BasicInfoSection 
                  form={agentForm} 
                  handleChange={handleAgentChange} 
                  icon={<User className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />
                
                <DeliveryTypeSection 
                  form={agentForm} 
                  handleChange={handleAgentChange} 
                  icon={<Truck className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />
                
                <RoutingModeSection 
                  form={agentForm} 
                  handleChange={handleAgentChange} 
                  icon={<Route className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />
                
                <FormSection title="Work Schedule" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
                  <div className="col-span-2 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {days.map((day) => (
                        <motion.div
                          key={day.id}
                          whileHover={{ scale: !(accessStatus?.is_agent || accessStatus?.pending_agent) ? 1.02 : 1 }}
                          whileTap={{ scale: !(accessStatus?.is_agent || accessStatus?.pending_agent) ? 0.98 : 1 }}
                          onClick={() => !(accessStatus?.is_agent || accessStatus?.pending_agent) && toggleDaySelection(day.id)}
                          className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                            day.selected
                              ? "bg-blue-600 text-white"
                              : (accessStatus?.is_agent || accessStatus?.pending_agent)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {day.name}
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Selected days: {days.filter(d => d.selected).map(d => d.name).join(", ") || "None"}
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Current Address" icon={<Briefcase className="w-5 h-5 text-blue-500" />}>
                <FormField
                  label="Current Address"
                  name="current_address"
                  type="text"
                  value={agentForm.current_address}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 123 Main St, Apt 4B"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Servicing State"
                  name="servicing_state"
                  type="text"
                  value={agentForm.servicing_state}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. TX, CA, NY"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Servicing City"
                  name="servicing_city"
                  type="text"
                  value={agentForm.servicing_city}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. Dallas, Austin, Houston"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Servicing Country"
                  name="servicing_country"
                  type="text"
                  value={agentForm.servicing_country}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. USA, India"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Servicing Zip Codes (comma-separated)"
                  name="servicing_zip"
                  type="text"
                  value={Array.isArray(agentForm.servicing_zip) 
                    ? agentForm.servicing_zip.join(", ") 
                    : agentForm.servicing_zip}
                  onChange={handleAgentChange}
                  onKeyDown={allowCommaKey}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 75001, 75002, 75003"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                </FormSection>

                <FormSection title="Permanent Address" icon={<Home className="w-5 h-5 text-blue-500" />}>
                  
                <FormField
                  label="Permanent Address"
                  name="permanent_address"
                  type="text"
                  value={agentForm.permanent_address}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 456 Oak Ave, Suite 200"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label=" Address State"
                  name="permanent_address_state"
                  type="text"
                  value={agentForm.permanent_address_state}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. TX, CA, NY"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Permanent Address City"
                  name="permanent_address_city"
                  type="text"
                  value={agentForm.permanent_address_city}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. Dallas, Austin, Houston"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />

                <FormField
                  label="Permanent Address Zip Code"
                  name="permanent_address_zip"
                  type="text"
                  value={agentForm.permanent_address_zip}
                  onChange={handleAgentChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 75001"
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                />
                </FormSection>
                
                <AdditionalInfoSection 
                  form={agentForm} 
                  handleChange={handleAgentChange} 
                  icon={<ClipboardList className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_agent || accessStatus?.pending_agent}
                  isAgent={true}
                />

                <div className="pt-6">
                  {accessStatus?.is_agent || accessStatus?.pending_agent ? (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-gray-400 text-white px-8 py-4 rounded-xl cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      <span>You are already an agent</span>
                    </button>
                  ) : (
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
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <User className="w-5 h-5" />
                          <span>Submit Request</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitManager} className="space-y-6">
                <BasicInfoSection 
                  form={managerForm} 
                  handleChange={handleManagerChange} 
                  icon={<User className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />
                <DeliveryTypeSection 
                  form={managerForm} 
                  handleChange={handleManagerChange} 
                  icon={<Truck className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <RoutingModeSection 
                  form={managerForm} 
                  handleChange={handleManagerChange} 
                  icon={<Route className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />
                  <FormSection title="Manager Details" icon={<Briefcase className="w-5 h-5 text-blue-500" />}>
                  <FormField
                    label="Manager Grade"
                    name="manager_grade"
                    type="select"
                    value={managerForm.manager_grade}
                    onChange={handleManagerChange}
                    required
                    options={[
                      { value: "", label: "Select Grade" },
                      { value: "c1", label: "C1 - Manager for a city" },
                      { value: "c2", label: "C2 - Manager for a state" },
                      { value: "c3", label: "C3 - Manager for a country" }
                    ]}
                    icon={<Briefcase className="w-4 h-4" />}
                    disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                  />
                  </FormSection>
                
                  <FormSection title="Work Schedule" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
                  <div className="col-span-2 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {days.map((day) => (
                        <motion.div
                          key={day.id}
                          whileHover={{ scale: !(accessStatus?.is_manager || accessStatus?.pending_manager) ? 1.02 : 1 }}
                          whileTap={{ scale: !(accessStatus?.is_manager || accessStatus?.pending_manager) ? 0.98 : 1 }}
                          onClick={() => !(accessStatus?.is_manager || accessStatus?.pending_manager) && toggleDaySelection(day.id)}
                          className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                            day.selected
                              ? "bg-blue-600 text-white"
                              : (accessStatus?.is_manager || accessStatus?.pending_manager)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {day.name}
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Selected days: {days.filter(d => d.selected).map(d => d.name).join(", ") || "None"}
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Current Address" icon={<Briefcase className="w-5 h-5 text-blue-500" />}>
                <FormField
                  label="Current Address"
                  name="address"
                  type="text"
                  value={managerForm.address}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 123 Main St, Apt 4B"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Servicing State"
                  name="servicing_state"
                  type="text"
                  value={managerForm.servicing_state}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. TX, CA, NY"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Servicing City"
                  name="servicing_city"
                  type="text"
                  value={managerForm.servicing_city}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. Dallas, Austin, Houston"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Servicing Country"
                  name="servicing_country"
                  type="text"
                  value={managerForm.servicing_country}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. USA, India"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Servicing Zip Codes (comma-separated)"
                  name="servicing_zip"
                  type="text"
                  value={Array.isArray(managerForm.servicing_zip) 
                    ? managerForm.servicing_zip.join(", ") 
                    : managerForm.servicing_zip}
                  onChange={handleManagerChange}
                  onKeyDown={allowCommaKey}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 75001, 75002, 75003"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                </FormSection>

                <FormSection title="Permanent Address" icon={<Home className="w-5 h-5 text-blue-500" />}>
                <FormField
                  label="Permanent Address"
                  name="permanent_address"
                  type="text"
                  value={managerForm.permanent_address}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 456 Oak Ave, Suite 200"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Permanent Address State"
                  name="permanent_address_state"
                  type="text"
                  value={managerForm.permanent_address_state}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. TX, CA, NY"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Permanent Address City"
                  name="permanent_address_city"
                  type="text"
                  value={managerForm.permanent_address_city}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. Dallas, Austin, Houston"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />

                <FormField
                  label="Permanent Address Zip Code"
                  name="permanent_address_zip"
                  type="text"
                  value={managerForm.permanent_address_zip}
                  onChange={handleManagerChange}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. 75001"
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                />
                </FormSection>

                <AdditionalInfoSection 
                  form={managerForm} 
                  handleChange={handleManagerChange} 
                  icon={<ClipboardList className="w-5 h-5 text-blue-500" />}
                  disabled={accessStatus?.is_manager || accessStatus?.pending_manager}
                  isAgent={false}
                />

                <div className="pt-6">
                  {accessStatus?.is_manager || accessStatus?.pending_manager ? (
                    <button
                      type="button"
                      className="w-full md:w-auto bg-gray-400 text-white px-8 py-4 rounded-xl cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                      <UserCog className="w-5 h-5" />
                      <span>You are already a manager</span>
                    </button>
                  ) : (
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
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <UserCog className="w-5 h-5" />
                          <span>Submit Request</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Section Components
const BasicInfoSection: React.FC<{form: any, handleChange: any, icon?: React.ReactNode, disabled?: boolean}> = ({ form, handleChange, icon, disabled = false }) => (
  <FormSection title="Basic Information" icon={icon}>
    <FormField
      label="Name"
      name="name"
      type="text"
      value={form.name}
      onChange={handleChange}
      required
      icon={<User className="w-4 h-4" />}
      disabled={disabled}
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
      disabled={disabled}
    />
    <FormField
      label="Date of Birth"
      name="dob"
      type="date"
      value={form.dob}
      onChange={handleChange}
      icon={<Calendar className="w-4 h-4" />}
      disabled={disabled}
    />
  </FormSection>
);

const DeliveryTypeSection: React.FC<{form: any, handleChange: any, icon?: React.ReactNode, disabled?: boolean}> = ({ form, handleChange, icon, disabled = false }) => (
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
        { value: "Return", label: "Pickup" },
        { value: "Both", label: "Both" }
      ]}
      icon={<Truck className="w-4 h-4" />}
      disabled={disabled}
    />
  </FormSection>
);

const RoutingModeSection: React.FC<{
  form: any,
  handleChange: any,
  icon?: React.ReactNode,
  disabled?: boolean
}> = ({ form, handleChange, icon, disabled = false }) => {
  const showPickup = form.delivery_type === "Return" || form.delivery_type === "Both";
  const showDelivery = form.delivery_type === "Delivery" || form.delivery_type === "Both";

  return (
    <FormSection title="Routing Mode" icon={icon}>
      {showPickup && (
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
          disabled={disabled}
        />
      )}

      {showDelivery && (
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
          disabled={disabled}
        />
      )}
    </FormSection>
  );
};


const AdditionalInfoSection: React.FC<{ 
  form: any, 
  handleChange: any, 
  icon?: React.ReactNode, 
  disabled?: boolean, 
  isAgent?: boolean 
}> = ({ form, handleChange, icon, disabled = false, isAgent = true }) => (
  <FormSection title="Additional Information" icon={icon}>
    <FormField
      label="Additional Info 1"
      name="additional_info_1"
      type="text"
      value={form.additional_info_1}
      onChange={handleChange}
      icon={<ClipboardList className="w-4 h-4" />}
      disabled={disabled}
    />
    <FormField
      label="Additional Info 2"
      name="additional_info_2"
      type="text"
      value={form.additional_info_2}
      onChange={handleChange}
      icon={<ClipboardList className="w-4 h-4" />}
      disabled={disabled}
    />
    {isAgent && (
      <FormField
        label="Additional Info 3"
        name="additional_info_3"
        type="text"
        value={form.additional_info_3}
        onChange={handleChange}
        icon={<ClipboardList className="w-4 h-4" />}
        disabled={disabled}
      />
    )}
  </FormSection>
);

interface SuccessViewProps {
  successData: SuccessData | null;
  resetForm: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ successData, resetForm }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your request for {successData?.type === 'agent' ? 'agent' : 'manager'} access has been submitted.
            Our team will review your application and get back to you soon.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {successData?.type === 'agent' ? (
                  <User className="w-6 h-6 text-blue-600" />
                ) : (
                  <UserCog className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <h3 className="font-bold text-gray-800">
                {successData?.type === 'agent' ? 'Agent' : 'Manager'} ID: {successData?.id}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Please keep this reference ID for future communication.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Submit Another Request
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:help@auditlyai.com"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestAccess;