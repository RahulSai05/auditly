import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Search, AlertCircle, FileSearch, KeyRound, Hash, Loader2 } from "lucide-react";

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

        {/* Receipt Data Form */}
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
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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

          {/* Display API Response */}
          <AnimatePresence>
            {receiptData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="mt-8 space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Receipt Information</h3>
                {receiptData.map((receipt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Shipped To:</span>{" "}
                          {receipt.shipped_to_person}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Order Number:</span>{" "}
                          {receipt.original_sales_order_number}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Item Number:</span>{" "}
                          {receipt.item_number}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Description:</span>{" "}
                          {receipt.item_description}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Serial Number:</span>{" "}
                          {receipt.serial_number}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Return Order:</span>{" "}
                          {receipt.return_order_number}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Purchased:</span>{" "}
                          {receipt.date_purchased}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Shipped:</span>{" "}
                          {receipt.date_shipped}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Delivered:</span>{" "}
                          {receipt.date_delivered}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Return Created:</span>{" "}
                          {receipt.return_created_date}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">ACK Number:</span>{" "}
                          {receipt.ack_number}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Display Error */}
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
