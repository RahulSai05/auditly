import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X, Image as ImageIcon, ClipboardList } from "lucide-react";

interface ItemData {
  item_id: number;
  item_number: number;
  item_description: string;
  brand_id: number;
  category: string;
  configuration: string;
  front_image_path: string;
  back_image_path: string;
}

const ItemImages: React.FC = () => {
  const [itemNumber, setItemNumber] = useState<string>("");
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = "http://54.210.159.220:8000";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const fetchItemData = async () => {
    if (!itemNumber) {
      setError("Please enter an item number.");
      return;
    }

    setLoading(true);
    setError(null);
    setItemData(null);

    try {
      const response = await axios.get(`${backendUrl}/images/${itemNumber}`);
      const data = response.data;
      data.front_image_path = `${backendUrl}${data.front_image_path}`;
      data.back_image_path = `${backendUrl}${data.back_image_path}`;
      setItemData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An unexpected error occurred while fetching the item data.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setItemNumber("");
    setItemData(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      fetchItemData();
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
            <ClipboardList className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Item Image Viewer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            View and verify item images with real-time updates
          </motion.p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50">
            <div className="p-8">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter item number..."
                    value={itemNumber}
                    onChange={(e) => setItemNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
                    disabled={loading}
                  />
                  {itemNumber && (
                    <motion.button
                      onClick={handleClear}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-blue-400" />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  onClick={fetchItemData}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2"
                  >
                    <X className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {itemData && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-t border-blue-50 p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium text-gray-700">Item Number:</span> {itemData.item_number}</p>
                        <p><span className="font-medium text-gray-700">Description:</span> {itemData.item_description}</p>
                        <p><span className="font-medium text-gray-700">Brand ID:</span> {itemData.brand_id}</p>
                        <p><span className="font-medium text-gray-700">Category:</span> {itemData.category}</p>
                        <p><span className="font-medium text-gray-700">Configuration:</span> {itemData.configuration}</p>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Images</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <p className="font-medium text-gray-700">Front Image</p>
                            <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                              {itemData.front_image_path ? (
                                <img
                                  src={itemData.front_image_path}
                                  alt="Front"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-700">Back Image</p>
                            <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                              {itemData.back_image_path ? (
                                <img
                                  src={itemData.back_image_path}
                                  alt="Back"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemImages;
