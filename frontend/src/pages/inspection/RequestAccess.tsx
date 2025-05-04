import { useState } from "react";

export default function AgentCreation() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
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
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Agent Created Successfully</h2>
        <p className="text-green-600 font-medium">The new agent has been successfully created!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Create New Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium mb-2 border-b pb-1">Basic Information</h3>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Agent Name*</label>
            <input
              type="text"
              name="agent_name"
              value={form.agent_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Gender*</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Delivery Type*</label>
            <select
              name="delivery_type"
              value={form.delivery_type}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="Delivery">Delivery</option>
              <option value="Return">Return</option>
              <option value="Both">Both</option>
            </select>
          </div>
          
          {/* Address Information */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-medium mb-2 border-b pb-1">Address Information</h3>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Current Address</label>
            <input
              type="text"
              name="current_address"
              value={form.current_address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Permanent Address</label>
            <input
              type="text"
              name="permanent_adress"
              value={form.permanent_adress}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Servicing State</label>
            <input
              type="text"
              name="servicing_state"
              value={form.servicing_state}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Servicing City</label>
            <input
              type="text"
              name="servicing_city"
              value={form.servicing_city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Servicing Zip</label>
            <input
              type="text"
              name="servicing_zip"
              value={form.servicing_zip}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Permanent Address State</label>
            <input
              type="text"
              name="permanent_address_state"
              value={form.permanent_address_state}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Permanent Address City</label>
            <input
              type="text"
              name="permanent_address_city"
              value={form.permanent_address_city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Permanent Address Zip</label>
            <input
              type="text"
              name="permanent_address_zip"
              value={form.permanent_address_zip}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          {/* Work Information */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-medium mb-2 border-b pb-1">Work Information</h3>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Manager ID (JSON)</label>
            <input
              type="text"
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              placeholder='{"id": 123, "name": "John Doe"}'
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Company ID</label>
            <input
              type="number"
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Agent to User Mapping ID</label>
            <input
              type="number"
              name="agent_to_user_mapping_id"
              value={form.agent_to_user_mapping_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="pickup_routing_mode"
              checked={form.pickup_routing_mode}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-medium">Pickup Routing Mode</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="delivery_routing_mode"
              checked={form.delivery_routing_mode}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-medium">Delivery Routing Mode</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_verified"
              checked={form.is_verified}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-medium">Is Verified</label>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Work Schedule (JSON)</label>
            <textarea
              name="work_schedule"
              value={form.work_schedule}
              onChange={handleChange}
              placeholder='{"monday": "9-5", "tuesday": "9-5"}'
              rows={3}
              className="w-full border p-2 rounded"
            />
          </div>
          
          {/* Additional Information */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-medium mb-2 border-b pb-1">Additional Information</h3>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Additional Info 1</label>
            <input
              type="text"
              name="additional_info_1"
              value={form.additional_info_1}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Additional Info 2</label>
            <input
              type="text"
              name="additional_info_2"
              value={form.additional_info_2}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Additional Info 3</label>
            <input
              type="text"
              name="additional_info_3"
              value={form.additional_info_3}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
}
