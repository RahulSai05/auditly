import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Clipboard,
  Check,
  AlertCircle,
  X,
  Users,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";

interface OnboardUser {
  onboard_name: string;
  onboard_email: string;
  token: string;
  customer_user_id: string;
}

interface OnboardResponse {
  message: string;
  data: {
    "Customer User Id": string;
    "Customer Token": string;
  };
}

function ApiConfigurations() {
  const [onboardData, setOnboardData] = useState({
    onboard_name: "",
    onboard_email: "",
  });
  const [users, setUsers] = useState<OnboardUser[]>([]);
  const [loading, setLoading] = useState({
    generate: false,
    fetchUsers: false,
    delete: false,
  });
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [newUser, setNewUser] = useState<{
    token: string;
    customerId: string;
    isExisting: boolean;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, fetchUsers: true }));
      const response = await fetch("/api/onboard-users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, fetchUsers: false }));
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOnboardData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setNewUser(null);
  };

  const handleGenerateToken = async () => {
    if (!onboardData.onboard_name || !onboardData.onboard_email) {
      setError("Please fill all fields");
      return;
    }

    setLoading(prev => ({ ...prev, generate: true }));
    setError("");
    setNewUser(null);

    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate token");
      }

      const data: OnboardResponse = await response.json();
      
      const isExisting = data.message.includes("already");
      setNewUser({
        token: data.data["Customer Token"],
        customerId: data.data["Customer User Id"],
        isExisting
      });
      
      setOnboardData({ onboard_name: "", onboard_email: "" });
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate token";
      setError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
    }
  };

  const handleDeleteUser = async (customerId: string) => {
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      const response = await fetch(`/api/users/delete-by-customer-id/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showNotification("success", "User deleted successfully");
      setNewUser(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      showNotification("error", errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // No notification for copy anymore
    } catch (err) {
      console.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Notification - Only shown for delete actions */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {notification.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification({ type: "", message: "" })}
                className="ml-2 hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
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
            <Key className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
            API Token Management
          </h1>
          <p className="text-xl text-gray-600">
            Generate and manage API tokens for authentication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generate Token Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Plus className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Generate New Token</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="onboard_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="onboard_name"
                  name="onboard_name"
                  value={onboardData.onboard_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="onboard_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="onboard_email"
                  name="onboard_email"
                  value={onboardData.onboard_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateToken}
                disabled={loading.generate}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading.generate
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading.generate ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Generate Token
                  </>
                )}
              </motion.button>

              {/* Display New User Information */}
              {newUser && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 p-4 rounded-xl ${
                    newUser.isExisting ? "bg-blue-50" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {newUser.isExisting ? (
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    <span className="font-medium text-sm">
                      {newUser.isExisting
                        ? "Existing User Retrieved"
                        : "New User Created"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-white/50 p-2 rounded">
                      <span className="text-gray-700">Customer ID:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-gray-600">{newUser.customerId}</code>
                        <button
                          onClick={() => handleCopy(newUser.customerId, "Customer ID copied!")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white/50 p-2 rounded">
                      <span className="text-gray-700">Token:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-gray-600">{newUser.token}</code>
                        <button
                          onClick={() => handleCopy(newUser.token, "Token copied!")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Users List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Users className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Onboarded Users</h2>
            </div>

            {loading.fetchUsers && users.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found. Generate a token to get started.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {users.map((user) => (
                  <motion.div
                    key={user.customer_user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-blue-50 rounded-xl p-4 hover:border-blue-100 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.onboard_name}</h3>
                        <p className="text-sm text-gray-600">{user.onboard_email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.customer_user_id)}
                        disabled={loading.delete}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-blue-600">Customer ID</span>
                          <button
                            onClick={() => handleCopy(user.customer_user_id, "Customer ID copied!")}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Clipboard className="w-3 h-3" />
                          </button>
                        </div>
                        <code className="text-sm block mt-1 truncate text-gray-600">{user.customer_user_id}</code>
                      </div>
                      
                      <div className="bg-blue-50/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-blue-600">Token</span>
                          <button
                            onClick={() => handleCopy(user.token, "Token copied!")}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Clipboard className="w-3 h-3" />
                          </button>
                        </div>
                        <code className="text-sm block mt-1 truncate text-gray-600">{user.token}</code>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ApiConfigurations;
