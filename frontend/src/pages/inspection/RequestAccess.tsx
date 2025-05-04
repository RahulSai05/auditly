import React, { useState } from "react";
import { motion } from "framer-motion";

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
  rows = 3
}) => {
  if (type === "checkbox") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor={name} className="text-gray-700 font-medium">
          {label}
        </label>
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
      
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      )}
    </motion.div>
  );
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};

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
        console.error("Failed to create agent:", await response.text());
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-4">Agent Created Successfully!</h2>
          <p className="text-gray-600">The new agent has been successfully registered in the system.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Agent</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <FormSection title="Basic Information">
            <FormField
              label="Agent Name"
              name="agent_name"
              type="text"
              value={form.agent_name}
              onChange={handleChange}
              required
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

          {/* Address Information Section */}
          <FormSection title="Address Information">
            <FormField
              label="Current Address"
              name="current_address"
              type="text"
              value={form.current_address}
              onChange={handleChange}
            />
            <FormField
              label="Permanent Address"
              name="permanent_adress"
              type="text"
              value={form.permanent_adress}
              onChange={handleChange}
            />
            <FormField
              label="Servicing State"
              name="servicing_state"
              type="text"
              value={form.servicing_state}
              onChange={handleChange}
            />
            <FormField
              label="Servicing City"
              name="servicing_city"
              type="text"
              value={form.servicing_city}
              onChange={handleChange}
            />
            <FormField
              label="Servicing Zip Code"
              name="servicing_zip"
              type="text"
              value={form.servicing_zip}
              onChange={handleChange}
            />
            <FormField
              label="Permanent Address State"
              name="permanent_address_state"
              type="text"
              value={form.permanent_address_state}
              onChange={handleChange}
            />
            <FormField
              label="Permanent Address City"
              name="permanent_address_city"
              type="text"
              value={form.permanent_address_city}
              onChange={handleChange}
            />
            <FormField
              label="Permanent Address Zip Code"
              name="permanent_address_zip"
              type="text"
              value={form.permanent_address_zip}
              onChange={handleChange}
            />
          </FormSection>

          {/* Work Information Section */}
          <FormSection title="Work Information">
            <FormField
              label="Manager ID (JSON)"
              name="manager_id"
              type="textarea"
              value={form.manager_id}
              onChange={handleChange}
              placeholder='{"id": 123, "name": "John Doe"}'
              rows={2}
            />
            <FormField
              label="Company ID"
              name="company_id"
              type="number"
              value={form.company_id}
              onChange={handleChange}
            />
            <FormField
              label="Agent to User Mapping ID"
              name="agent_to_user_mapping_id"
              type="number"
              value={form.agent_to_user_mapping_id}
              onChange={handleChange}
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
            <FormField
              label="Work Schedule (JSON)"
              name="work_schedule"
              type="textarea"
              value={form.work_schedule}
              onChange={handleChange}
              placeholder='{"monday": "9-5", "tuesday": "9-5"}'
              rows={3}
              colSpan
            />
          </FormSection>

          {/* Additional Information Section */}
          <FormSection title="Additional Information">
            <FormField
              label="Additional Info 1"
              name="additional_info_1"
              type="text"
              value={form.additional_info_1}
              onChange={handleChange}
            />
            <FormField
              label="Additional Info 2"
              name="additional_info_2"
              type="text"
              value={form.additional_info_2}
              onChange={handleChange}
            />
            <FormField
              label="Additional Info 3"
              name="additional_info_3"
              type="text"
              value={form.additional_info_3}
              onChange={handleChange}
            />
          </FormSection>

          <div className="pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Create Agent
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AgentCreationForm;
