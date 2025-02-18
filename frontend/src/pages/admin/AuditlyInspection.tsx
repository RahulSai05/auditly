import { useState } from "react";
import axios from "axios";
import { Search, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AuditlyInspection = () => {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!receiptNumber.trim()) {
      setError("Please enter a receipt number");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Simulate an API call with dummy data
      const response = await axios.post("http://54.210.159.220:8000/get-receipt-data", {
        receipt_number: receiptNumber,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
      setError("Failed to fetch details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReceiptNumber("");
    setData(null);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Auditly Inspection</h2>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter receipt number..."
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
            disabled={loading}
          />
          {receiptNumber && (
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
          onClick={handleSearch}
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

      {data && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Receipt Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">Item Details</h4>
              <p className="text-gray-900">{data.item_description}</p>
              <p className="text-gray-600">{data.brand_name}</p>
              <p className="text-gray-600">{data.overall_condition}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">Order Info</h4>
              <p className="text-gray-900">{data.return_order_number}</p>
              <p className="text-gray-600">{data.original_sales_order_number}</p>
              <p className="text-gray-600">{data.return_qty}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
              <p className="text-gray-900">{data.shipping_info.shipped_to_person}</p>
              <p className="text-gray-600">{data.shipping_info.address}</p>
              <p className="text-gray-600">
                {data.shipping_info.city}, {data.shipping_info.state}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">Inspection Status</h4>
              <p className="text-gray-900">{data.receipt_number}</p>
              <p className="text-blue-600 font-medium">Inspection Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditlyInspection;
