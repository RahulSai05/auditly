import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Search, AlertCircle, FileSearch, KeyRound, Hash, Loader2, Calendar, Package, Truck, User } from "lucide-react";

const ReceiptDataPage: React.FC = () => {
  const [searchUserId, setSearchUserId] = useState("");
  const [token, setToken] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptData, setReceiptData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReceiptData(null);

    if (!searchUserId) {
      setError("User ID is required.");
      setIsLoading(false);
      return;
    }

    if (token && receiptNumber) {
      setError("Please provide either Token or Receipt Number, not both.");
      setIsLoading(false);
      return;
    }

    try {
      const payload: any = { search_user_id: searchUserId };
      if (token) {
        payload.token = token;
      } else if (receiptNumber) {
        payload.receipt_number = receiptNumber;
      }

      const response = await axios.post(
        "http://54.210.159.220:8000/get-inspection-data",
        payload
      );

      if (response.data.message === "Invalid User") {
        setError("Invalid User ID or Token.");
      } else {
        setReceiptData(response.data);
      }
    } catch (error) {
      setError("An error occurred while fetching receipt data. Please try again.");
      console.error("Error fetching receipt data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
            <Receipt className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Receipt Data
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            Enter your credentials to fetch receipt information
          </motion.p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="searchUserId"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <FileSearch className="w-4 h-4" />
                User ID
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="searchUserId"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Token (Optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="receiptNumber"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <Hash className="w-4 h-4" />
                Receipt Number (Optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="receiptNumber"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                  Fetching Data...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Get Receipt Data
                </>
              )}
            </motion.button>
          </form>

          {/* Results Section */}
          <AnimatePresence>
            {receiptData && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Receipt Information
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {receiptData.map((receipt, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Shipping Information */}
                          <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="font-semibold text-gray-900">Shipping Details</h4>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-500">Recipient:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.shipped_to_person}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">Order Number:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.original_sales_order_number}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">Item Number:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.item_number}</span>
                              </p>
                            </div>
                          </motion.div>

                          {/* Order Information */}
                          <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="font-semibold text-gray-900">Order Timeline</h4>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-500">Purchased:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.date_purchased}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">Shipped:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.date_shipped}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">Delivered:</span>{" "}
                                <span className="font-medium text-gray-900">{receipt.date_delivered}</span>
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        {/* Status Bar */}
                        <motion.div
                          variants={itemVariants}
                          className="mt-6 pt-4 border-t border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Truck className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">Return Status</p>
                              <p className="font-medium text-gray-900">
                                Return Order #{receipt.return_order_number}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {receipt.return_created_date ? "Return Initiated" : "Delivered"}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiptDataPage;
