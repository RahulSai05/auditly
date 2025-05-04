import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Loader, 
  UserCheck,
  Calendar,
  Truck,
  MapPinned,
  Building,
  ClipboardCheck,
  AlertCircle
} from "lucide-react";
import FormSection from "./components/agent/FormSection";
import FormField from "./components/agent/FormField";
import { AgentForm } from "./types/agent";

function App() {
  const [form, setForm] = useState<AgentForm>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert some fields to appropriate types before sending
      const payload = {
        ...form,
        manager_id: form.manager_id ? JSON.parse(form.manager_id) : null,
        work_schedule: form.work_schedule ? JSON.parse(form.work_schedule) : null,
        company_id: form.company_id ? parseInt(form.company_id) : null,
        agent_to_user_mapping_id: form.agent_to_user_mapping_id ? parseInt(form.agent_to_user_mapping_id) : null,
        pickup_routing_mode: Boolean(form.pickup_routing_mode),
        delivery_routing_mode: Boolean(form.delivery_routing_mode),
        is_verified: Boolean(form.is_verified)
      };

      const response = await fetch("https://auditlyai.com/api/create-agent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.text();
        setError(`Failed to create agent: ${errorData}`);
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 p-8 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 text-center mb-4"
          >
            Agent Created Successfully
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-600 font-medium text-center mb-6"
          >
            The new agent has been successfully added to the system
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubmitted(false)}
            className="w-full px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-5 h-5" />
            Create Another Agent
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
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
            <User className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Create New Agent
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Fill in the details below to create a new agent account
          </motion.p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50 overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8">
              {/* Basic Information */}
              <FormSection title="Basic Information" icon={<User className="w-6 h-6 text-blue-600" />}>
                <FormField
                  label="Agent Name"
                  name="agent_name"
                  value={form.agent_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter agent's full name"
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
                />
                
                <FormField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
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
                />
              </FormSection>
              
              {/* Address Information */}
              <FormSection title="Address Information" icon={<MapPin className="w-6 h-6 text-blue-600" />}>
                <FormField
                  label="Current Address"
                  name="current_address"
                  value={form.current_address}
                  onChange={handleChange}
                  colSpan={true}
                  placeholder="Enter current address"
                />
                
                <FormField
                  label="Permanent Address"
                  name="permanent_adress"
                  value={form.permanent_adress}
                  onChange={handleChange}
                  colSpan={true}
                  placeholder="Enter permanent address"
                />
                
                <FormField
                  label="Servicing State"
                  name="servicing_state"
                  value={form.servicing_state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
                
                <FormField
                  label="Servicing City"
                  name="servicing_city"
                  value={form.servicing_city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
                
                <FormField
                  label="Servicing Zip"
                  name="servicing_zip"
                  value={form.servicing_zip}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                />
                
                <FormField
                  label="Permanent Address State"
                  name="permanent_address_state"
                  value={form.permanent_address_state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
                
                <FormField
                  label="Permanent Address City"
                  name="permanent_address_city"
                  value={form.permanent_address_city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
                
                <FormField
                  label="Permanent Address Zip"
                  name="permanent_address_zip"
                  value={form.permanent_address_zip}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                />
              </FormSection>
              
              {/* Work Information */}
              <FormSection title="Work Information" icon={<Briefcase className="w-6 h-6 text-blue-600" />}>
                <FormField
                  label="Manager ID (JSON)"
                  name="manager_id"
                  value={form.manager_id}
                  onChange={handleChange}
                  placeholder='{"id": 123, "name": "John Doe"}'
                />
                
                <FormField
                  label="Company ID"
                  name="company_id"
                  type="number"
                  value={form.company_id}
                  onChange={handleChange}
                  placeholder="Enter company ID"
                />
                
                <FormField
                  label="Agent to User Mapping ID"
                  name="agent_to_user_mapping_id"
                  type="number"
                  value={form.agent_to_user_mapping_id}
                  onChange={handleChange}
                  placeholder="Enter mapping ID"
                />
                
                <FormField
                  label="Work Schedule (JSON)"
                  name="work_schedule"
                  type="textarea"
                  value={form.work_schedule}
                  onChange={handleChange}
                  placeholder='{"monday": "9-5", "tuesday": "9-5"}'
                  colSpan={true}
                />
                
                <FormField
                  label="Pickup Routing Mode"
                  name="pickup_routing_mode"
                  type="checkbox"
                  value={form.pickup_routing_mode}
                  onChange={handleChange}
                />
                
                <FormField
                  label="Delivery Routing Mode"
                  name="delivery_routing_mode"
                  type="checkbox"
                  value={form.delivery_routing_mode}
                  onChange={handleChange}
                />
                
                <FormField
                  label="Is Verified"
                  name="is_verified"
                  type="checkbox"
                  value={form.is_verified}
                  onChange={handleChange}
                />
              </FormSection>
              
              {/* Additional Information */}
              <FormSection title="Additional Information" icon={<FileText className="w-6 h-6 text-blue-600" />}>
                <FormField
                  label="Additional Info 1"
                  name="additional_info_1"
                  value={form.additional_info_1}
                  onChange={handleChange}
                  placeholder="Enter additional information"
                />
                
                <FormField
                  label="Additional Info 2"
                  name="additional_info_2"
                  value={form.additional_info_2}
                  onChange={handleChange}
                  placeholder="Enter additional information"
                />
                
                <FormField
                  label="Additional Info 3"
                  name="additional_info_3"
                  value={form.additional_info_3}
                  onChange={handleChange}
                  placeholder="Enter additional information"
                />
              </FormSection>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-lg p-4 bg-red-50 text-red-700 flex items-center gap-3 mt-6"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Form Footer */}
            <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:shadow-blue-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Create Agent
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
