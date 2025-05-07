import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  Users as UsersIcon, 
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon, 
  Truck as TruckIcon,
  CheckCircle as CheckCircleIcon,
  ClipboardList as ClipboardListIcon,
  Route as RouteIcon,
  Settings as SettingsIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Navigation as NavigationIcon
} from "lucide-react";

// FormField component (same as before)
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
            readOnly={readOnly}
            className={`w-full border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm ${readOnly ? 'bg-gray-100' : ''}`}
          />
        )}
      </div>
    </motion.div>
  );
};

// FormSection component (same as before)
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

interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

// Main RequestAccess component
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
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  const [form, setForm] = useState({
    agent_name: "",
    current_address: "",
    delivery_type: "Delivery",
    pickup_routing_mode: "auto", // auto or manual
    delivery_routing_mode: "auto", // auto or manual
    servicing_state: "",
    servicing_city: "",
    servicing_zip: "",
    permanent_adress: "",
    permanent_address_state: "",
    permanent_address_city: "",
    permanent_address_zip: "",
    gender: "Male",
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
  const [successData, setSuccessData] = useState<{agent_id: number} | null>(null);

  useEffect(() => {
    // Get user ID from local storage and set it to agent_to_user_mapping_id
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
    
    // Update work_schedule in form
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
      // Prepare the payload according to the API model
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
                current_address: "",
                delivery_type: "Delivery",
                pickup_routing_mode: "auto",
                delivery_routing_mode: "auto",
                servicing_state: "",
                servicing_city: "",
                servicing_zip: "",
                permanent_adress: "",
                permanent_address_state: "",
                permanent_address_city: "",
                permanent_address_zip: "",
                gender: "Male",
                dob: "",
                work_schedule: "",
                agent_to_user_mapping_id: localStorage.getItem("userId") || "",
                additional_info_1: "",
                additional_info_2: "",
                additional_info_3: ""
              });
              setDays(days.map(day => ({ ...day, selected: false })));
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
          <UsersIcon className="w-10 h-10 text-blue-600" />
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
                icon={<UsersIcon className="w-4 h-4" />}
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

            {/* Delivery Type Section */}
            <FormSection 
              title="Delivery Type" 
              icon={<Truck className="w-5 h-5 text-blue-600" />}
            >
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

            {/* Routing Mode Section */}
            <FormSection 
              title="Routing Mode" 
              icon={<Route className="w-5 h-5 text-blue-600" />}
            >
              <FormField
                label="Pickup Routing Mode"
                name="pickup_routing_mode"
                type="select"
                value={form.pickup_routing_mode}
                onChange={handleChange}
                required
                options={[
                  { value: "auto", label: "Automatic" },
                  { value: "manual", label: "Manual" }
                ]}
                icon={<Navigation className="w-4 h-4" />}
              />
              <FormField
                label="Delivery Routing Mode"
                name="delivery_routing_mode"
                type="select"
                value={form.delivery_routing_mode}
                onChange={handleChange}
                required
                options={[
                  { value: "auto", label: "Automatic" },
                  { value: "manual", label: "Manual" }
                ]}
                icon={<Truck className="w-4 h-4" />}
              />
            </FormSection>

            {/* Work Schedule Section */}
            <FormSection 
              title="Work Schedule" 
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
            >
              <div className="col-span-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg mb-4"
                >
                  <span className="font-medium text-gray-800">
                    Select Working Days
                  </span>
                  {isScheduleExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isScheduleExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Selected Days:
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
                      <span className="text-gray-500">No days selected</span>
                    )}
                  </div>
                </div>
              </div>
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
                    <UsersIcon className="w-5 h-5" />
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
