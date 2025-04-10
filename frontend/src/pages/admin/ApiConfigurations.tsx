// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Key,
//   Clipboard,
//   Check,
//   AlertCircle,
//   X,
//   Database,
//   ChevronDown,
// } from "lucide-react";

// interface ApiEndpoint {
//   id: string;
//   name: string;
//   path: string;
//   method: "GET" | "POST" | "PUT" | "DELETE";
//   description: string;
//   sampleRequest: object;
// }

// const apiEndpoints: ApiEndpoint[] = [
//   {
//     id: "update1",
//     name: "Update Item Data",
//     path: "https://auditlyai.com/api/update-database-json-item",
//     method: "POST",
//     description: "Update or add item data to the database using JSON",
//     sampleRequest: {
//       onboard_token: "693891674636CUST354241874921",
//       onboard_user_id: "CUST354241",
//       json_data: [
//         {
//           item_number: 123456,
//           item_description: "High-quality memory foam mattress",
//           brand_id: 1,
//           category: "Bedding",
//           configuration: "King"
//         }
//       ]
//     }
//   }
// ];

// interface OnboardResponse {
//   message: string;
//   data: {
//     "Customer User Id": string;
//     "Customer Token": string;
//   };
// }

// function ApiConfigurations() {
//   const [showTokenForm, setShowTokenForm] = useState(true);
//   const [onboardData, setOnboardData] = useState({
//     onboard_name: "",
//     onboard_email: "",
//     existing_token: ""
//   });
//   const [tokenData, setTokenData] = useState<{
//     customer_user_id: string;
//     token: string;
//   } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [existingTokenError, setExistingTokenError] = useState("");
//   const [notification, setNotification] = useState<{
//     type: "success" | "error" | "";
//     message: string;
//   }>({ type: "", message: "" });
//   const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

//   const showNotification = (type: "success" | "error", message: string) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification({ type: "", message: "" }), 3000);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setOnboardData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (name === 'onboard_name' || name === 'onboard_email') {
//       setError("");
//     } else if (name === 'existing_token') {
//       setExistingTokenError("");
//     }
//   };

//   const handleGenerateToken = async () => {
//     if (!onboardData.onboard_name || !onboardData.onboard_email) {
//       setError("Please fill all fields");
//       showNotification("error", "Please fill all fields");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/onboard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           onboard_name: onboardData.onboard_name,
//           onboard_email: onboardData.onboard_email
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to generate token");
//       }

//       const data: OnboardResponse = await response.json();
      
//       setTokenData({
//         customer_user_id: data.data["Customer User Id"],
//         token: data.data["Customer Token"]
//       });
//       setShowTokenForm(false);
//       showNotification("success", "Token generated successfully! Check your email for details.");
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to generate token. Please try again.";
//       setError(errorMessage);
//       showNotification("error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExistingToken = () => {
//     if (!onboardData.existing_token) {
//       setExistingTokenError("Please enter your token");
//       showNotification("error", "Please enter your token");
//       return;
//     }
//     setTokenData({
//       customer_user_id: "EXISTING_USER",
//       token: onboardData.existing_token
//     });
//     setShowTokenForm(false);
//     showNotification("success", "Token validated successfully!");
//   };

//   const handleCopy = async (text: string, message: string, event?: React.MouseEvent) => {
//     if (event) {
//       event.stopPropagation();
//     }
//     try {
//       await navigator.clipboard.writeText(text);
//       showNotification("success", message);
//     } catch (err) {
//       showNotification("error", "Failed to copy to clipboard");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Notification Component */}
//         <AnimatePresence>
//           {notification.message && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg"
//               style={{
//                 backgroundColor: notification.type === "success" ? "rgba(220, 252, 231, 0.95)" : "rgba(254, 226, 226, 0.95)",
//                 color: notification.type === "success" ? "#065f46" : "#991b1b",
//               }}
//             >
//               {notification.type === "success" ? (
//                 <Check className="w-5 h-5" />
//               ) : (
//                 <AlertCircle className="w-5 h-5" />
//               )}
//               <span className="font-medium">{notification.message}</span>
//               <button
//                 onClick={() => setNotification({ type: "", message: "" })}
//                 className="ml-2 hover:bg-white/20 rounded-full p-1"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16"
//         >
//           <motion.div
//             initial={{ scale: 0.8, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 20,
//             }}
//             className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
//           >
//             <Key className="w-10 h-10 text-white" />
//           </motion.div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             API Integration
//           </h1>
//           <p className="text-xl text-gray-600">
//             Access our powerful APIs with your authentication token
//           </p>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {showTokenForm ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="max-w-md mx-auto"
//             >
//               <div className="bg-white rounded-xl shadow-lg p-8">
//                 <div className="space-y-6">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                       Generate New Token
//                     </h2>
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="onboard_name" className="block text-sm font-medium text-gray-700 mb-1">
//                           Your Name
//                         </label>
//                         <input
//                           type="text"
//                           id="onboard_name"
//                           name="onboard_name"
//                           value={onboardData.onboard_name}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="John Doe"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="onboard_email" className="block text-sm font-medium text-gray-700 mb-1">
//                           Your Email
//                         </label>
//                         <input
//                           type="email"
//                           id="onboard_email"
//                           name="onboard_email"
//                           value={onboardData.onboard_email}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="john@example.com"
//                         />
//                       </div>
//                       {error && (
//                         <div className="text-red-500 text-sm flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {error}
//                         </div>
//                       )}
//                       <button
//                         onClick={handleGenerateToken}
//                         disabled={loading}
//                         className={`w-full py-2 px-4 rounded-md font-medium text-white ${
//                           loading
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-blue-600 hover:bg-blue-700"
//                         } transition-colors duration-200`}
//                       >
//                         {loading ? "Generating..." : "Generate Token"}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or</span>
//                     </div>
//                   </div>

//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                       Already Have a Token?
//                     </h2>
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="existing_token" className="block text-sm font-medium text-gray-700 mb-1">
//                           Enter Your Token
//                         </label>
//                         <input
//                           type="text"
//                           id="existing_token"
//                           name="existing_token"
//                           value={onboardData.existing_token}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter your existing token"
//                         />
//                         {existingTokenError && (
//                           <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
//                             <AlertCircle className="w-4 h-4" />
//                             {existingTokenError}
//                           </div>
//                         )}
//                       </div>
//                       <button
//                         onClick={handleExistingToken}
//                         className="w-full py-2 px-4 rounded-md font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
//                       >
//                         Continue with Existing Token
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900">Your API Credentials</h2>
//                     <p className="text-gray-600 mt-1">Use these credentials to authenticate your API requests</p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowTokenForm(true);
//                       setTokenData(null);
//                     }}
//                     className="text-blue-600 hover:text-blue-700"
//                   >
//                     Change Token
//                   </button>
//                 </div>
//                 <div className="mt-4 space-y-4">
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <label className="text-sm font-medium text-gray-700">Customer User ID</label>
//                         <code className="block mt-1 text-sm">{tokenData?.customer_user_id}</code>
//                       </div>
//                       <button
//                         onClick={(e) => handleCopy(tokenData?.customer_user_id || "", "Customer User ID copied!", e)}
//                         className="p-1 hover:bg-gray-200 rounded"
//                       >
//                         <Clipboard className="w-4 h-4 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <label className="text-sm font-medium text-gray-700">API Token</label>
//                         <code className="block mt-1 text-sm">{tokenData?.token}</code>
//                       </div>
//                       <button
//                         onClick={(e) => handleCopy(tokenData?.token || "", "Token copied!", e)}
//                         className="p-1 hover:bg-gray-200 rounded"
//                       >
//                         <Clipboard className="w-4 h-4 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
//                     <Database className="w-6 h-6 text-blue-600" />
//                     Available Endpoints
//                   </h2>
//                 </div>

//                 {apiEndpoints.map((endpoint) => (
//                   <motion.div
//                     key={endpoint.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden"
//                   >
//                     <div
//                       className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//                       onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
//                           <p className="text-gray-600 mt-1">{endpoint.description}</p>
//                           <div className="flex items-center gap-2 mt-2">
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                               endpoint.method === "POST"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-green-100 text-green-800"
//                             }`}>
//                               {endpoint.method}
//                             </span>
//                             <code className="text-sm text-gray-600">{endpoint.path}</code>
//                             <button
//                               onClick={(e) => handleCopy(endpoint.path, "API URL copied!", e)}
//                               className="p-1 hover:bg-gray-200 rounded-full"
//                             >
//                               <Clipboard className="w-4 h-4 text-gray-600" />
//                             </button>
//                           </div>
//                         </div>
//                         <ChevronDown
//                           className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
//                             expandedEndpoint === endpoint.id ? "rotate-180" : ""
//                           }`}
//                         />
//                       </div>
//                     </div>

//                     <AnimatePresence>
//                       {expandedEndpoint === endpoint.id && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="border-t border-gray-100"
//                         >
//                           <div className="p-6">
//                             <div>
//                               <div className="flex items-center justify-between mb-2">
//                                 <h4 className="font-medium text-gray-900">Sample Request</h4>
//                                 <button
//                                   onClick={(e) => handleCopy(
//                                     JSON.stringify(endpoint.sampleRequest, null, 2),
//                                     "Sample request copied!",
//                                     e
//                                   )}
//                                   className="p-1 hover:bg-gray-100 rounded text-sm text-gray-600 flex items-center gap-1"
//                                 >
//                                   <Clipboard className="w-4 h-4" />
//                                   Copy
//                                 </button>
//                               </div>
//                               <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
//                                 {JSON.stringify(endpoint.sampleRequest, null, 2)}
//                               </pre>
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// export default ApiConfigurations;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Clipboard,
  Check,
  AlertCircle,
  X,
  Database,
  ChevronDown,
  Trash2,
  Users,
  Plus,
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
  const [showTokenForm, setShowTokenForm] = useState(true);
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
      showNotification("error", errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, fetchUsers: false }));
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOnboardData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'onboard_name' || name === 'onboard_email') {
      setError("");
    }
  };

  const handleGenerateToken = async () => {
    if (!onboardData.onboard_name || !onboardData.onboard_email) {
      setError("Please fill all fields");
      showNotification("error", "Please fill all fields");
      return;
    }

    setLoading(prev => ({ ...prev, generate: true }));
    setError("");

    try {
      const response = await fetch("/api/onboard", {
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
      
      showNotification("success", "Token generated successfully! Check your email for details.");
      setOnboardData({ onboard_name: "", onboard_email: "" });
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate token. Please try again.";
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
    }
  };

  const handleDeleteUser = async (customerId: string) => {
    if (loading.delete) return;
    
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      const response = await fetch(`/api/users/delete-by-customer-id/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showNotification("success", "User deleted successfully");
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
      showNotification("success", message);
    } catch (err) {
      showNotification("error", "Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Notification Component */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg"
              style={{
                backgroundColor: notification.type === "success" ? "rgba(220, 252, 231, 0.95)" : "rgba(254, 226, 226, 0.95)",
                color: notification.type === "success" ? "#065f46" : "#991b1b",
              }}
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
            className="bg-white rounded-xl shadow-lg p-6 h-fit"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Generate New Token
              </h2>
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
                disabled={loading.generate}
                className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                  loading.generate
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors duration-200 flex items-center justify-center gap-2`}
              >
                {loading.generate ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Generate Token
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Users List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Onboarded Users
              </h2>
              <button
                onClick={fetchUsers}
                disabled={loading.fetchUsers}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                {loading.fetchUsers ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                      <path d="M16 16h5v5"></path>
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>

            {loading.fetchUsers && users.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found. Generate a token to get started.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {users.map((user) => (
                  <div key={user.customer_user_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.onboard_name}</h3>
                        <p className="text-sm text-gray-600">{user.onboard_email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.customer_user_id)}
                        disabled={loading.delete}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        title="Delete user"
                      >
                        {loading.delete ? (
                          <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500">Customer ID</span>
                          <button
                            onClick={() => handleCopy(user.customer_user_id, "Customer ID copied!")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Clipboard className="w-3 h-3" />
                          </button>
                        </div>
                        <code className="text-sm block mt-1 truncate">{user.customer_user_id}</code>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500">Token</span>
                          <button
                            onClick={() => handleCopy(user.token, "Token copied!")}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Clipboard className="w-3 h-3" />
                          </button>
                        </div>
                        <code className="text-sm block mt-1 truncate">{user.token}</code>
                      </div>
                    </div>
                  </div>
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
