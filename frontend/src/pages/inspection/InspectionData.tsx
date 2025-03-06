import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const InspectionData: React.FC = () => {
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

    // Validate input
    if (!searchUserId) {
      setError("User ID is required.");
      setIsLoading(false);
      return;
    }

    // Ensure only one of the options is provided
    if (token && receiptNumber) {
      setError("Please provide either Token or Receipt Number, not both.");
      setIsLoading(false);
      return;
    }

    try {
      const payload: any = { search_user_id: searchUserId };

      // Add token or receipt_number to the payload if provided
      if (token) {
        payload.token = token;
      } else if (receiptNumber) {
        payload.receipt_number = receiptNumber;
      }

      const response = await axios.post(
        "http://54.210.159.220:8000/get-receipt-data",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Receipt Data
          </h1>
          <p className="text-gray-600">
            Enter your details to fetch receipt data.
          </p>
        </motion.div>

        {/* Receipt Data Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Input */}
            <div>
              <label
                htmlFor="searchUserId"
                className="block text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                type="text"
                id="searchUserId"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Token Input */}
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700"
              >
                Token (Optional)
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Receipt Number Input */}
            <div>
              <label
                htmlFor="receiptNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Receipt Number (Optional)
              </label>
              <input
                type="text"
                id="receiptNumber"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  "Get Receipt Data"
                )}
              </button>
            </div>
          </form>

          {/* Display API Response */}
          {receiptData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Receipt Data
              </h3>
              {receiptData.map((receipt, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Receipt Number:</span>{" "}
                    {receipt.receipt_number}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Overall Condition:</span>{" "}
                    {receipt.overall_condition}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Item Description:</span>{" "}
                    {receipt.item_description}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Brand Name:</span>{" "}
                    {receipt.brand_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Original Sales Order:</span>{" "}
                    {receipt.original_sales_order_number}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Return Order Number:</span>{" "}
                    {receipt.return_order_number}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Return Quantity:</span>{" "}
                    {receipt.return_qty}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Shipping Info:
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Shipped To:</span>{" "}
                      {receipt.shipping_info.shipped_to_person}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {receipt.shipping_info.address}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">City:</span>{" "}
                      {receipt.shipping_info.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">State:</span>{" "}
                      {receipt.shipping_info.state}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Country:</span>{" "}
                      {receipt.shipping_info.country}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Display Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InspectionData;
