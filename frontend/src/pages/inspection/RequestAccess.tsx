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
import FormField from "./Form/FormField";
import FormSection from "./Form/FormSection";

const AgentCreationForm: React.FC = () => {
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

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch("https://auditlyai.com/api/create-agent/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create agent');
      // }

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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The new agent has been successfully registered in the system.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSubmitted(false)}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
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

export default AgentCreationForm;
