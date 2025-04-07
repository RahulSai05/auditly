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
//   {
//     id: "1",
//     name: "Search Items",
//     path: "/search-items",
//     method: "GET",
//     description: "Search and filter items based on various criteria",
//     category: "Items",
//     icon: Search,
//   },
//   {
//     id: "2",
//     name: "Upload Customer Images",
//     path: "/upload-customer-images",
//     method: "POST",
//     description: "Upload and process customer-submitted images",
//     category: "Images",
//     icon: Image,
//   },
//   {
//     id: "3",
//     name: "Get Item Details",
//     path: "/item-details/{return_order_number}",
//     method: "GET",
//     description: "Retrieve detailed information about specific items",
//     category: "Items",
//     icon: Package,
//   },
//   {
//     id: "4",
//     name: "User Authentication",
//     path: "/login",
//     method: "POST",
//     description: "Authenticate users and generate access tokens",
//     category: "Auth",
//     icon: Lock,
//   },
//   {
//     id: "5",
//     name: "Get Users",
//     path: "/users",
//     method: "GET",
//     description: "Retrieve list of system users with their details",
//     category: "Users",
//     icon: Users,
//   },
//   {
//     id: "6",
//     name: "Compare Images",
//     path: "/compare-images",
//     method: "POST",
//     description: "Compare and analyze multiple images for similarity",
//     category: "Images",
//     icon: Eye,
//   },
// ];

// function ApiConfigurations() {
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");

//   const categories = [
//     "all",
//     ...new Set(apiEndpoints.map((api) => api.category)),
//   ];

//   const filteredEndpoints =
//     selectedCategory === "all"
//       ? apiEndpoints
//       : apiEndpoints.filter((api) => api.category === selectedCategory);

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
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header Section */}
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
//           //  className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
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

//         {/* Category Filter */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8 flex justify-center gap-2 flex-wrap"
//         >
//           {categories.map((category) => (
//             <motion.button
//               key={category}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                 selectedCategory === category
//                   ? "bg-blue-600 text-white shadow-lg"
//                   : "bg-white text-gray-600 hover:bg-blue-50"
//               }`}
//             >
//               {category.charAt(0).toUpperCase() + category.slice(1)}
//             </motion.button>
//           ))}
//         </motion.div>

//         {/* API Endpoints Grid */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {filteredEndpoints.map((endpoint) => (
//             <motion.div
//               key={endpoint.id}
//               variants={itemVariants}
//               whileHover={{ scale: 1.02 }}
//               className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
//             >
//               <div className="p-6">
//                 <div className="flex items-start gap-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 10 }}
//                     className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                   >
//                     <endpoint.icon className="w-6 h-6 text-blue-600" />
//                   </motion.div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {endpoint.name}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {endpoint.description}
//                         </p>
//                       </div>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           endpoint.method === "GET"
//                             ? "bg-green-100 text-green-800"
//                             : endpoint.method === "POST"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {endpoint.method}
//                       </span>
//                     </div>
//                     <div className="mt-4 flex items-center gap-2 text-gray-900">
//                       <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
//                         {endpoint.path}
//                       </code>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleCopyPath(endpoint.path)}
//                         className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600" />
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
//                   >
//                     View Details
//                     <ChevronRight className="w-4 h-4" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="mt-12 flex justify-center gap-4"
//         >
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//           >
//             <Settings className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">API Settings</span>
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//           >
//             <Lock className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">Authentication</span>
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default ApiConfigurations;


import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Network,
  Search,
  Image,
  Package,
  Users,
  Settings,
  Lock,
  Eye,
  Copy,
  ChevronRight,
  Upload,
  FileText,
  Database,
  FileInput,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  category: string;
  icon: React.ElementType;
}

const apiEndpoints: ApiEndpoint[] = [
  // CSV Upload APIs
  {
    id: "csv1",
    name: "Upload Customer Return Items",
    path: "/api/upload-customer-return-item-data",
    method: "POST",
    description: "Upload CSV with customer return item data",
    category: "CSV Upload",
    icon: FileInput,
  },
  {
    id: "csv2",
    name: "Upload Items CSV",
    path: "/api/upload-items-csv",
    method: "POST",
    description: "Upload CSV to add or update items in database",
    category: "CSV Upload",
    icon: Database,
  },
  {
    id: "csv3",
    name: "Upload Customer Serials",
    path: "/api/customer-serial-upload",
    method: "POST",
    description: "Upload CSV with customer serial data",
    category: "CSV Upload",
    icon: FileText,
  },
  // Items APIs
  {
    id: "items1",
    name: "Search Items",
    path: "/api/search-items",
    method: "GET",
    description: "Search items by number, description or brand",
    category: "Items",
    icon: Search,
  },
  {
    id: "items2",
    name: "Get All Items",
    path: "/api/items",
    method: "GET",
    description: "Retrieve all items with brand information",
    category: "Items",
    icon: Package,
  },
  {
    id: "items3",
    name: "Get Item Details",
    path: "/api/item-details/{return_order_number}",
    method: "GET",
    description: "Get details for a specific item by return order number",
    category: "Items",
    icon: Package,
  },
  // Customer Data APIs
  {
    id: "customer1",
    name: "Search Customer Returns",
    path: "/api/search-customer-return-item-data",
    method: "GET",
    description: "Search customer return items by various fields",
    category: "Customer Data",
    icon: Users,
  },
  {
    id: "customer2",
    name: "Get Customer Item Data",
    path: "/api/customer-item-data",
    method: "GET",
    description: "Retrieve all customer item data with details",
    category: "Customer Data",
    icon: Users,
  },
  // Image APIs
  {
    id: "image1",
    name: "Upload Customer Images",
    path: "/api/upload-customer-images",
    method: "POST",
    description: "Upload front and back images for customer items",
    category: "Images",
    icon: Image,
  },
  {
    id: "image2",
    name: "Upload Base Images",
    path: "/api/upload-base-images",
    method: "POST",
    description: "Upload base images mapped to an item number",
    category: "Images",
    icon: Image,
  },
  {
    id: "image3",
    name: "Compare Images",
    path: "/api/compare-images",
    method: "POST",
    description: "Compare base and customer images for similarity",
    category: "Images",
    icon: Eye,
  },
  // Authentication APIs
  {
    id: "auth1",
    name: "User Registration",
    path: "/api/register",
    method: "POST",
    description: "Register new users with email and password",
    category: "Authentication",
    icon: Lock,
  },
  {
    id: "auth2",
    name: "User Login",
    path: "/api/login",
    method: "POST",
    description: "Authenticate users with credentials",
    category: "Authentication",
    icon: Lock,
  },
  {
    id: "auth3",
    name: "Verify Login OTP",
    path: "/api/verify-login-otp",
    method: "POST",
    description: "Verify OTP for login authentication",
    category: "Authentication",
    icon: Lock,
  },
  // Additional APIs can be added here...
];

function ApiConfigurations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("CSV Upload");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const categories = [
    ...new Set(apiEndpoints.map((api) => api.category)),
  ];

  const filteredEndpoints = apiEndpoints.filter((api) => 
    selectedCategory === "all" ? true : api.category === selectedCategory
  );

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

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedEndpoint) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // In a real app, you would use fetch or axios to upload to your API
      // const response = await fetch(selectedEndpoint.path, {
      //   method: selectedEndpoint.method,
      //   body: formData,
      //   // Add headers if needed
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus("success");
      
      // Reset after success
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
        setFile(null);
      }, 3000);
    } catch (error) {
      setUploadStatus("error");
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
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
            <Network className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            API Configuration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore and manage your API endpoints with detailed configuration
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedEndpoint(null);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* CSV Upload Section - shown when CSV Upload category is selected */}
            {selectedCategory === "CSV Upload" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                  CSV Upload APIs
                </h2>
                
                <div className="space-y-6">
                  {filteredEndpoints.map((endpoint) => (
                    <motion.div
                      key={endpoint.id}
                      variants={itemVariants}
                      className={`border rounded-xl p-5 transition-all ${
                        selectedEndpoint?.id === endpoint.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <endpoint.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {endpoint.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                endpoint.method === "GET"
                                  ? "bg-green-100 text-green-800"
                                  : endpoint.method === "POST"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {endpoint.method}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {endpoint.description}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-gray-900">
                            <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPath(endpoint.path);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* File upload area - shown when an endpoint is selected */}
                {selectedEndpoint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Upload CSV File to {selectedEndpoint.name}
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {!file ? (
                        <>
                          <Upload className="w-10 h-10 mx-auto text-gray-400" />
                          <div className="mt-4 flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".csv"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            CSV files up to 10MB
                          </p>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          
                          {uploadStatus === "idle" && (
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleUpload}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                              >
                                Upload File
                              </button>
                            </div>
                          )}
                          
                          {uploadStatus === "uploading" && (
                            <div className="space-y-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-500">
                                Uploading... {uploadProgress}%
                              </p>
                            </div>
                          )}
                          
                          {uploadStatus === "success" && (
                            <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                              <p className="text-sm font-medium">
                                File uploaded successfully!
                              </p>
                            </div>
                          )}
                          
                          {uploadStatus === "error" && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                              <p className="text-sm font-medium">
                                Upload failed. Please try again.
                              </p>
                              <button
                                onClick={() => setUploadStatus("idle")}
                                className="mt-2 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      <p>CSV should be formatted according to the API requirements.</p>
                      <p>Sample CSV files available for download.</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Other API Categories */}
            {selectedCategory !== "CSV Upload" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredEndpoints.map((endpoint) => (
                  <motion.div
                    key={endpoint.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                        >
                          <endpoint.icon className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {endpoint.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {endpoint.description}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                endpoint.method === "GET"
                                  ? "bg-green-100 text-green-800"
                                  : endpoint.method === "POST"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {endpoint.method}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-gray-900">
                            <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopyPath(endpoint.path)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">API Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Authentication</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default ApiConfigurations;
