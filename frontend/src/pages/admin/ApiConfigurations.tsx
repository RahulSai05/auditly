import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Clipboard,
  Check,
  AlertCircle,
  X,
  Database,
  ChevronDown,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  sampleRequest: object;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "update1",
    name: "Update Item Data",
    path: "https://autidlyai.com/api/update-database-json-item",
    method: "POST",
    description: "Update or add item data to the database using JSON",
    sampleRequest: {
      auditly_user_id: "",
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          item_number: 123456,
          item_description: "High-quality memor mattress",
          brand_id: 1,
          category: "Bedding",
          configuration: "King"
        }
      ]
    }
  }
];

interface OnboardResponse {
  message: string;
  data: {
    "Customer User Id": string;
    "Customer Token": string;
  };
}

function ApiConfigurations() {
  const [showTokenForm, setShowTokenForm] = useState(true);
  const [onboardData, setOnboardData] = useState({
    onboard_name: "",
    onboard_email: "",
    existing_token: ""
  });
  const [tokenData, setTokenData] = useState<{
    customer_user_id: string;
    token: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOnboardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateToken = async () => {
    if (!onboardData.onboard_name || !onboardData.onboard_email) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onboard_name: onboardData.onboard_name,
          onboard_email: onboardData.onboard_email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate token");
      }

      const data: OnboardResponse = await response.json();
      
      setTokenData({
        customer_user_id: data.data["Customer User Id"],
        token: data.data["Customer Token"]
      });
      setShowTokenForm(false);

      setNotification({
        type: "success",
        message: "Token generated successfully! Check your email for details."
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token. Please try again.");
      setNotification({
        type: "error",
        message: "Failed to generate token"
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ type: "", message: "" }), 3000);
    }
  };

  const handleExistingToken = () => {
    if (!onboardData.existing_token) {
      setError("Please enter your token");
      return;
    }
    setTokenData({
      customer_user_id: "EXISTING_USER",
      token: onboardData.existing_token
    });
    setShowTokenForm(false);
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: "success", message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Key className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Integration
          </h1>
          <p className="text-xl text-gray-600">
            Access our powerful APIs with your authentication token
          </p>
        </motion.div>

        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
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
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ type: "", message: "" })}
                className="ml-2 hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showTokenForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Generate New Token
                    </h2>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      {error && (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </div>
                      )}
                      <button
                        onClick={handleGenerateToken}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } transition-colors duration-200`}
                      >
                        {loading ? "Generating..." : "Generate Token"}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Already Have a Token?
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="existing_token" className="block text-sm font-medium text-gray-700 mb-1">
                          Enter Your Token
                        </label>
                        <input
                          type="text"
                          id="existing_token"
                          name="existing_token"
                          value={onboardData.existing_token}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your existing token"
                        />
                      </div>
                      <button
                        onClick={handleExistingToken}
                        className="w-full py-2 px-4 rounded-md font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                      >
                        Continue with Existing Token
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your API Credentials</h2>
                    <p className="text-gray-600 mt-1">Use these credentials to authenticate your API requests</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTokenForm(true);
                      setTokenData(null);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Change Token
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Customer User ID</label>
                        <code className="block mt-1 text-sm">{tokenData?.customer_user_id}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(tokenData?.customer_user_id || "", "Customer User ID copied!")}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Clipboard className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">API Token</label>
                        <code className="block mt-1 text-sm">{tokenData?.token}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(tokenData?.token || "", "Token copied!")}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Clipboard className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Database className="w-6 h-6 text-blue-600" />
                    Available Endpoints
                  </h2>
                </div>

                {apiEndpoints.map((endpoint) => (
                  <motion.div
                    key={endpoint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
                          <p className="text-gray-600 mt-1">{endpoint.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              endpoint.method === "POST"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm text-gray-600">{endpoint.path}</code>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(JSON.stringify(endpoint.sampleRequest, null, 2), "Request copied!");
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            <Clipboard className="w-4 h-4 text-gray-600" />
                          </button>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                              expandedEndpoint === endpoint.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedEndpoint === endpoint.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-6">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">Sample Request</h4>
                                <button
                                  onClick={() => handleCopy(JSON.stringify(endpoint.sampleRequest, null, 2), "Request copied!")}
                                  className="p-1 hover:bg-gray-100 rounded text-sm text-gray-600 flex items-center gap-1"
                                >
                                  <Clipboard className="w-4 h-4" />
                                  Copy
                                </button>
                              </div>
                              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                                {JSON.stringify(endpoint.sampleRequest, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ApiConfigurations;
