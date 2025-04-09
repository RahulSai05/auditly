
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
import { motion } from "framer-motion";
import {
  Key,
  Clipboard,
  Check,
  AlertCircle,
  X,
  Database,
  Upload,
  Loader2,
  ChevronRight,
  Mail,
  User,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  sampleRequest: object;
  sampleResponse: object;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "update1",
    name: "Update Item Data",
    path: "https://autidlyai.com/api/update-database-json-item",
    method: "POST",
    description: "Update or add item data to the database using JSON",
    sampleRequest: {
      "item_number": "ABC123",
      "brand": "Example Brand",
      "description": "Sample product description",
      "category": "Electronics",
      "price": 99.99,
      "weight": 0.5
    },
    sampleResponse: {
      "status": "success",
      "message": "Item data updated successfully",
      "data": {
        "item_number": "ABC123",
        "brand": "Example Brand",
        "updated_at": "2023-10-15T12:34:56Z"
      }
    }
  },
  {
    id: "update2",
    name: "Update Customer Serials",
    path: "https://autidlyai.com/api/update-database-json-customer-serials",
    method: "POST",
    description: "Update customer serial numbers in the database",
    sampleRequest: {
      "customer_id": "CUST001",
      "serials": [
        {
          "serial_number": "SN123456",
          "item_number": "ABC123",
          "purchase_date": "2023-10-01"
        },
        {
          "serial_number": "SN789012",
          "item_number": "XYZ456",
          "purchase_date": "2023-09-15"
        }
      ]
    },
    sampleResponse: {
      "status": "success",
      "message": "Customer serials updated successfully",
      "data": {
        "customer_id": "CUST001",
        "updated_serials": 2,
        "updated_at": "2023-10-15T12:34:56Z"
      }
    }
  },
  {
    id: "update3",
    name: "Update Returns Data",
    path: "https://autidlyai.com/api/update-database-json-returns",
    method: "POST",
    description: "Update customer returns information in the database",
    sampleRequest: {
      "return_id": "RET001",
      "customer_id": "CUST001",
      "items": [
        {
          "item_number": "ABC123",
          "serial_number": "SN123456",
          "return_reason": "Defective",
          "return_date": "2023-10-10"
        }
      ],
      "resolution": "Replacement issued"
    },
    sampleResponse: {
      "status": "success",
      "message": "Returns data updated successfully",
      "data": {
        "return_id": "RET001",
        "updated_items": 1,
        "updated_at": "2023-10-15T12:34:56Z"
      }
    }
  }
];

function ApiConfigurations() {
  const [onboardData, setOnboardData] = useState({
    onboard_name: "",
    onboard_email: ""
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - in real app you would call your actual API
      const mockResponse = {
        message: "Onboarded Successfully.",
        data: {
          "Customer User Id": `CUST${Math.floor(1000 + Math.random() * 9000)}`,
          "Customer Token": `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
        }
      };

      setTokenData({
        customer_user_id: mockResponse.data["Customer User Id"],
        token: mockResponse.data["Customer Token"]
      });

      setNotification({
        type: "success",
        message: "Token generated successfully! Check your email for details."
      });
    } catch (err) {
      setError("Failed to generate token. Please try again.");
      setNotification({
        type: "error",
        message: "Failed to generate token"
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ type: "", message: "" }), 3000);
    }
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: "success", message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  const toggleEndpoint = (id: string) => {
    setExpandedEndpoint(expandedEndpoint === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            API Integration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Generate your API token and explore available endpoints
          </motion.p>
        </motion.div>

        {/* Notification */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token Generation Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Generate API Token
              </h2>

              {!tokenData ? (
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 ${
                      loading
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        Generate Token
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Token Generated Successfully</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 bg-white rounded-md text-sm flex-1 overflow-x-auto">
                          {tokenData.customer_user_id}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(
                              tokenData.customer_user_id,
                              "Customer ID copied!"
                            )
                          }
                          className="p-1 hover:bg-blue-100 rounded-md"
                        >
                          <Clipboard className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Token</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 bg-white rounded-md text-sm flex-1 overflow-x-auto">
                          {tokenData.token}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(tokenData.token, "Token copied!")
                          }
                          className="p-1 hover:bg-blue-100 rounded-md"
                        >
                          <Clipboard className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-blue-200">
                    <p className="text-sm text-gray-600">
                      This token has been sent to your email address. Keep it secure and don't share it publicly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API Endpoints Section */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {tokenData ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Available API Endpoints
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Use your generated token in the Authorization header when calling these APIs.
                    <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
                      Authorization: Bearer {tokenData.token}
                    </code>
                  </p>

                  {apiEndpoints.map((endpoint) => (
                    <motion.div
                      key={endpoint.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleEndpoint(endpoint.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {endpoint.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {endpoint.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <code className="px-2 py-1 text-sm font-mono bg-gray-50 rounded-md">
                                {endpoint.path}
                              </code>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  endpoint.method === "GET"
                                    ? "bg-green-100 text-green-800"
                                    : endpoint.method === "POST"
                                    ? "bg-blue-100 text-blue-800"
                                    : endpoint.method === "PUT"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedEndpoint === endpoint.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {expandedEndpoint === endpoint.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 border-t border-gray-100"
                        >
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                Sample Request
                              </h4>
                              <div className="relative">
                                <pre className="p-3 bg-gray-50 rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.sampleRequest, null, 2)}
                                </pre>
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      JSON.stringify(endpoint.sampleRequest, null, 2),
                                      "Request copied!"
                                    )
                                  }
                                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                                >
                                  <Clipboard className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                Sample Response
                              </h4>
                              <div className="relative">
                                <pre className="p-3 bg-gray-50 rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.sampleResponse, null, 2)}
                                </pre>
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      JSON.stringify(endpoint.sampleResponse, null, 2),
                                      "Response copied!"
                                    )
                                  }
                                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                                >
                                  <Clipboard className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generate API Token First
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You need to generate an API token before you can access the available endpoints.
                  </p>
                  <button
                    onClick={() => document.getElementById("onboard_name")?.focus()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Generate Token
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiConfigurations;
