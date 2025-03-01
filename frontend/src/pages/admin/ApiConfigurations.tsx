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
  {
    id: "1",
    name: "Search Items",
    path: "/search-items",
    method: "GET",
    description: "Search and filter items based on various criteria",
    category: "Items",
    icon: Search,
  },
  {
    id: "2",
    name: "Upload Customer Images",
    path: "/upload-customer-images",
    method: "POST",
    description: "Upload and process customer-submitted images",
    category: "Images",
    icon: Image,
  },
  {
    id: "3",
    name: "Get Item Details",
    path: "/item-details/{return_order_number}",
    method: "GET",
    description: "Retrieve detailed information about specific items",
    category: "Items",
    icon: Package,
  },
  {
    id: "4",
    name: "User Authentication",
    path: "/login",
    method: "POST",
    description: "Authenticate users and generate access tokens",
    category: "Auth",
    icon: Lock,
  },
  {
    id: "5",
    name: "Get Users",
    path: "/users",
    method: "GET",
    description: "Retrieve list of system users with their details",
    category: "Users",
    icon: Users,
  },
  {
    id: "6",
    name: "Compare Images",
    path: "/compare-images",
    method: "POST",
    description: "Compare and analyze multiple images for similarity",
    category: "Images",
    icon: Eye,
  },
];

function ApiConfigurations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...new Set(apiEndpoints.map((api) => api.category)),
  ];

  const filteredEndpoints =
    selectedCategory === "all"
      ? apiEndpoints
      : apiEndpoints.filter((api) => api.category === selectedCategory);

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
            //   className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
            className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
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

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center gap-2 flex-wrap"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* API Endpoints Grid */}
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
