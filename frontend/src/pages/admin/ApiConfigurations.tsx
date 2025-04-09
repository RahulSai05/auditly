
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Network,
//   Search,
//   Image,
//   Package,
//   Users,
//   Settings,
//   Lock,
//   Eye,
//   Copy,
//   ChevronRight,
//   Upload,
//   FileText,
//   Database,
//   FileInput,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   X,
// } from "lucide-react";

// interface ApiEndpoint {
//   id: string;
//   name: string;
//   path: string;
//   method: "GET" | "POST" | "PUT" | "DELETE";
//   description: string;
//   category: string;
//   icon: React.ElementType;
// }

// const apiEndpoints: ApiEndpoint[] = [
//   // CSV Upload APIs
//   {
//     id: "csv1",
//     name: "Upload Customer Return Items",
//     path: "/api/upload-customer-return-item-data",
//     method: "POST",
//     description: "Upload CSV with customer return item data",
//     category: "CSV Upload",
//     icon: FileInput,
//   },
//   {
//     id: "csv2",
//     name: "Upload Items CSV",
//     path: "/api/upload-items-csv",
//     method: "POST",
//     description: "Upload CSV to add or update items in database",
//     category: "CSV Upload",
//     icon: Database,
//   },
//   {
//     id: "csv3",
//     name: "Upload Customer Serials",
//     path: "/api/customer-serial-upload",
//     method: "POST",
//     description: "Upload CSV with customer serial data",
//     category: "CSV Upload",
//     icon: FileText,
//   },
//   // Items APIs
//   {
//     id: "items1",
//     name: "Search Items",
//     path: "/api/search-items",
//     method: "GET",
//     description: "Search items by number, description or brand",
//     category: "Items",
//     icon: Search,
//   },
//   {
//     id: "items2",
//     name: "Get All Items",
//     path: "/api/items",
//     method: "GET",
//     description: "Retrieve all items with brand information",
//     category: "Items",
//     icon: Package,
//   },
//   {
//     id: "items3",
//     name: "Get Item Details",
//     path: "/api/item-details/{return_order_number}",
//     method: "GET",
//     description: "Get details for a specific item by return order number",
//     category: "Items",
//     icon: Package,
//   },
//   // Customer Data APIs
//   {
//     id: "customer1",
//     name: "Search Customer Returns",
//     path: "/api/search-customer-return-item-data",
//     method: "GET",
//     description: "Search customer return items by various fields",
//     category: "Customer Data",
//     icon: Users,
//   },
//   {
//     id: "customer2",
//     name: "Get Customer Item Data",
//     path: "/api/customer-item-data",
//     method: "GET",
//     description: "Retrieve all customer item data with details",
//     category: "Customer Data",
//     icon: Users,
//   },
//   // Image APIs
//   {
//     id: "image1",
//     name: "Upload Customer Images",
//     path: "/api/upload-customer-images",
//     method: "POST",
//     description: "Upload front and back images for customer items",
//     category: "Images",
//     icon: Image,
//   },
//   {
//     id: "image2",
//     name: "Upload Base Images",
//     path: "/api/upload-base-images",
//     method: "POST",
//     description: "Upload base images mapped to an item number",
//     category: "Images",
//     icon: Image,
//   },
//   {
//     id: "image3",
//     name: "Compare Images",
//     path: "/api/compare-images",
//     method: "POST",
//     description: "Compare base and customer images for similarity",
//     category: "Images",
//     icon: Eye,
//   },
//   // Authentication APIs
//   {
//     id: "auth1",
//     name: "User Registration",
//     path: "/api/register",
//     method: "POST",
//     description: "Register new users with email and password",
//     category: "Authentication",
//     icon: Lock,
//   },
//   {
//     id: "auth2",
//     name: "User Login",
//     path: "/api/login",
//     method: "POST",
//     description: "Authenticate users with credentials",
//     category: "Authentication",
//     icon: Lock,
//   },
//   {
//     id: "auth3",
//     name: "Verify Login OTP",
//     path: "/api/verify-login-otp",
//     method: "POST",
//     description: "Verify OTP for login authentication",
//     category: "Authentication",
//     icon: Lock,
//   },
// ];

// function ApiConfigurations() {
//   const [selectedCategory, setSelectedCategory] = useState<string>("CSV Upload");
//   const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [notification, setNotification] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

//   const categories = [...new Set(apiEndpoints.map((api) => api.category))];

//   const filteredEndpoints = apiEndpoints.filter((api) => 
//     selectedCategory === "all" ? true : api.category === selectedCategory
//   );

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   const handleCopyPath = (path: string) => {
//     navigator.clipboard.writeText(path);
//     setNotification({ type: "success", message: "API path copied to clipboard!" });
//     setTimeout(() => setNotification({ type: "", message: "" }), 3000);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file || !selectedEndpoint) return;

//     setUploadStatus("uploading");
//     setUploadProgress(0);
//     setErrorMessage("");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Simulated upload progress
//       const interval = setInterval(() => {
//         setUploadProgress((prev) => {
//           if (prev >= 90) {
//             clearInterval(interval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 500);

//       const response = await fetch(selectedEndpoint.path, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       clearInterval(interval);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }

//       setUploadProgress(100);
//       setUploadStatus("success");
//       setNotification({ type: "success", message: "File uploaded successfully!" });
      
//       setTimeout(() => {
//         setUploadStatus("idle");
//         setUploadProgress(0);
//         setFile(null);
//         setNotification({ type: "", message: "" });
//       }, 3000);
//     } catch (error) {
//       setUploadStatus("error");
//       setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
//       setUploadProgress(0);
//       setNotification({ type: "error", message: "Failed to upload file" });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header */}
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
//             className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
//           >
//             <Network className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             API Configuration
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Explore and manage your API endpoints with detailed configuration
//           </motion.p>
//         </motion.div>

//         {/* Notification */}
//         {notification.message && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
//               notification.type === "success"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {notification.type === "success" ? (
//               <CheckCircle className="w-5 h-5" />
//             ) : (
//               <AlertCircle className="w-5 h-5" />
//             )}
//             <span>{notification.message}</span>
//             <button
//               onClick={() => setNotification({ type: "", message: "" })}
//               className="ml-2 hover:bg-white/20 rounded-full p-1"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </motion.div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <Settings className="w-5 h-5 text-blue-600" />
//                 API Categories
//               </h2>
//               <ul className="space-y-2">
//                 {categories.map((category) => (
//                   <motion.li
//                     key={category}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <button
//                       onClick={() => {
//                         setSelectedCategory(category);
//                         setSelectedEndpoint(null);
//                       }}
//                       className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                         selectedCategory === category
//                           ? "bg-blue-100 text-blue-700 font-medium"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       {category}
//                     </button>
//                   </motion.li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="space-y-6"
//             >
//               {filteredEndpoints.map((endpoint) => (
//                 <motion.div
//                   key={endpoint.id}
//                   variants={itemVariants}
//                   className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-300 ${
//                     selectedEndpoint?.id === endpoint.id
//                       ? "border-blue-200"
//                       : "border-transparent hover:border-blue-100"
//                   }`}
//                   onClick={() => setSelectedEndpoint(endpoint)}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                       <endpoint.icon className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-4">
//                         <h3 className="text-lg font-semibold text-gray-900 truncate">
//                           {endpoint.name}
//                         </h3>
//                         <span
//                           className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                             endpoint.method === "GET"
//                               ? "bg-green-100 text-green-800"
//                               : endpoint.method === "POST"
//                               ? "bg-blue-100 text-blue-800"
//                               : endpoint.method === "PUT"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {endpoint.method}
//                         </span>
//                       </div>
//                       <p className="mt-1 text-sm text-gray-500">{endpoint.description}</p>
//                       <div className="mt-3 flex items-center gap-2">
//                         <code className="px-2 py-1 text-sm font-mono bg-gray-50 rounded-md">
//                           {endpoint.path}
//                         </code>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCopyPath(endpoint.path);
//                           }}
//                           className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                           <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {selectedEndpoint?.id === endpoint.id && endpoint.category === "CSV Upload" && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-6 pt-6 border-t border-gray-100"
//                     >
//                       <div className="space-y-4">
//                         <div className="relative">
//                           <input
//                             type="file"
//                             id="file-upload"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             accept=".csv"
//                           />
//                           <label
//                             htmlFor="file-upload"
//                             className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
//                               file
//                                 ? "border-blue-300 bg-blue-50"
//                                 : "border-gray-300 hover:border-blue-300"
//                             }`}
//                           >
//                             {file ? (
//                               <div className="flex items-center justify-center gap-2">
//                                 <FileText className="w-5 h-5 text-blue-600" />
//                                 <span className="text-blue-600 font-medium">
//                                   {file.name}
//                                 </span>
//                               </div>
//                             ) : (
//                               <div className="space-y-2">
//                                 <Upload className="w-8 h-8 mx-auto text-gray-400" />
//                                 <div className="text-sm text-gray-600">
//                                   <span className="text-blue-600 font-medium">
//                                     Click to upload
//                                   </span>{" "}
//                                   or drag and drop
//                                 </div>
//                                 <p className="text-xs text-gray-500">
//                                   CSV files up to 10MB
//                                 </p>
//                               </div>
//                             )}
//                           </label>
//                         </div>

//                         {file && (
//                           <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                           >
//                             <button
//                               onClick={handleUpload}
//                               disabled={uploadStatus === "uploading"}
//                               className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
//                                 uploadStatus === "uploading"
//                                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                   : "bg-blue-600 text-white hover:bg-blue-700"
//                               }`}
//                             >
//                               {uploadStatus === "uploading" ? (
//                                 <>
//                                   <Loader2 className="w-5 h-5 animate-spin" />
//                                   Uploading...
//                                 </>
//                               ) : (
//                                 <>
//                                   <Upload className="w-5 h-5" />
//                                   Upload File
//                                 </>
//                               )}
//                             </button>

//                             {uploadStatus !== "idle" && (
//                               <div className="mt-4 space-y-2">
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                   <div
//                                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                     style={{ width: `${uploadProgress}%` }}
//                                   />
//                                 </div>
//                                 <p className="text-sm text-gray-600 text-center">
//                                   {uploadStatus === "uploading" && "Uploading..."}
//                                   {uploadStatus === "success" && "Upload complete!"}
//                                   {uploadStatus === "error" && errorMessage}
//                                 </p>
//                               </div>
//                             )}
//                           </motion.div>
//                         )}
//                       </div>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ApiConfigurations;


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
  },
  {
    id: "update2",
    name: "Update Customer Serials",
    path: "https://autidlyai.com/api/update-database-json-customer-serials",
    method: "POST",
    description: "Update customer serial numbers in the database",
    sampleRequest: {
      auditly_user_id: "",
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          serial_number: "SN123456",
          item_number: "ABC123",
          purchase_date: "2024-03-01"
        }
      ]
    }
  },
  {
    id: "update3",
    name: "Update Returns Data",
    path: "https://autidlyai.com/api/update-database-json-returns",
    method: "POST",
    description: "Update customer returns information in the database",
    sampleRequest: {
      auditly_user_id: "",
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          return_id: "RET001",
          item_number: "ABC123",
          serial_number: "SN123456",
          return_reason: "Defective",
          return_date: "2024-03-15"
        }
      ]
    }
  }
];

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        customer_user_id: `CUST${Math.floor(1000 + Math.random() * 9000)}`,
        token: `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
      };

      setTokenData(mockResponse);
      setShowTokenForm(false);

      setNotification({
        type: "success",
        message: "Token generated successfully!"
      });
    } catch (err) {
      setError("Failed to generate token. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
