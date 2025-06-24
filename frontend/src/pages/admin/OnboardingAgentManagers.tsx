import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, UserCog, Mail, Briefcase, ChevronDown } from "lucide-react";

interface FormData {
  user_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  organization: string;
  requested_role: "Agent" | "Manager" | "";
}

const OnboardingAgentManagers: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    organization: "",
    requested_role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional validation for role selection
    if (!formData.requested_role) {
      setError("Please select a role");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/onboard/agent-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          requested_role: formData.requested_role as "Agent" | "Manager" // Type assertion since we've validated it's not empty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create user");
      }

      const data = await response.json();
      setSuccess(`User created successfully! ${data.message}`);
      // Reset form
      setFormData({
        user_name: "",
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        organization: "",
        requested_role: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRoleDropdown = () => {
    setShowRoleDropdown(!showRoleDropdown);
  };

  const selectRole = (role: "Agent" | "Manager") => {
    setFormData(prev => ({
      ...prev,
      requested_role: role
    }));
    setShowRoleDropdown(false);
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      formData.user_name &&
      formData.first_name &&
      formData.last_name &&
      formData.gender &&
      formData.email &&
      formData.organization &&
      formData.requested_role
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                {formData.requested_role === "Agent" ? (
                  <User className="w-8 h-8 text-blue-600" />
                ) : formData.requested_role === "Manager" ? (
                  <UserCog className="w-8 h-8 text-purple-600" />
                ) : (
                  <div className="w-8 h-8 text-gray-400 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formData.requested_role ? `Onboard New ${formData.requested_role}` : "Create New User"}
              </h1>
              <p className="text-gray-600">
                {formData.requested_role 
                  ? `Fill out the form below to create a new ${formData.requested_role.toLowerCase()} account`
                  : "Select a role and fill out the form to create a new account"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span className="font-medium">{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Role Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={toggleRoleDropdown}
                      className={`w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.requested_role ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {formData.requested_role === "Agent" ? (
                          <User className="w-5 h-5 text-blue-500" />
                        ) : formData.requested_role === "Manager" ? (
                          <UserCog className="w-5 h-5 text-purple-500" />
                        ) : (
                          <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <span className={!formData.requested_role ? "text-gray-400" : ""}>
                          {formData.requested_role || "Select Role"}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showRoleDropdown ? 'transform rotate-180' : ''}`} />
                    </button>
                    {showRoleDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200">
                        <button
                          type="button"
                          onClick={() => selectRole("Agent")}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2"
                        >
                          <User className="w-5 h-5 text-blue-500" />
                          <span>Agent</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => selectRole("Manager")}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2"
                        >
                          <UserCog className="w-5 h-5 text-purple-500" />
                          <span>Manager</span>
                        </button>
                      </div>
                    )}
                    {!formData.requested_role && (
                      <p className="mt-1 text-sm text-red-600">Please select a role</p>
                    )}
                  </div>
                </div>

                {/* Rest of the form fields remain the same */}
                {/* Username */}
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
                  className={`w-full px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                    isFormValid()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      {formData.requested_role 
                        ? `Create ${formData.requested_role} Account`
                        : "Create Account"}
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

export default OnboardingAgentManagers;