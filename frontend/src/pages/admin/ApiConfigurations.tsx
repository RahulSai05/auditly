
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
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
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
];

function ApiConfigurations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("CSV Upload");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [notification, setNotification] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

  const categories = [...new Set(apiEndpoints.map((api) => api.category))];

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
    setNotification({ type: "success", message: "API path copied to clipboard!" });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
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
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulated upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch(selectedEndpoint.path, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setNotification({ type: "success", message: "File uploaded successfully!" });
      
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
        setFile(null);
        setNotification({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setUploadProgress(0);
      setNotification({ type: "error", message: "Failed to upload file" });
    }
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
              <CheckCircle className="w-5 h-5" />
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                API Categories
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <motion.li
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredEndpoints.map((endpoint) => (
                <motion.div
                  key={endpoint.id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-300 ${
                    selectedEndpoint?.id === endpoint.id
                      ? "border-blue-200"
                      : "border-transparent hover:border-blue-100"
                  }`}
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <endpoint.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {endpoint.name}
                        </h3>
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
                      <p className="mt-1 text-sm text-gray-500">{endpoint.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <code className="px-2 py-1 text-sm font-mono bg-gray-50 rounded-md">
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

                  {selectedEndpoint?.id === endpoint.id && endpoint.category === "CSV Upload" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-100"
                    >
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv"
                          />
                          <label
                            htmlFor="file-upload"
                            className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                              file
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-300 hover:border-blue-300"
                            }`}
                          >
                            {file ? (
                              <div className="flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-blue-600 font-medium">
                                  {file.name}
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                <div className="text-sm text-gray-600">
                                  <span className="text-blue-600 font-medium">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </div>
                                <p className="text-xs text-gray-500">
                                  CSV files up to 10MB
                                </p>
                              </div>
                            )}
                          </label>
                        </div>

                        {file && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <button
                              onClick={handleUpload}
                              disabled={uploadStatus === "uploading"}
                              className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                                uploadStatus === "uploading"
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {uploadStatus === "uploading" ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-5 h-5" />
                                  Upload File
                                </>
                              )}
                            </button>

                            {uploadStatus !== "idle" && (
                              <div className="mt-4 space-y-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                  {uploadStatus === "uploading" && "Uploading..."}
                                  {uploadStatus === "success" && "Upload complete!"}
                                  {uploadStatus === "error" && errorMessage}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiConfigurations;
