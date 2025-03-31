
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Search, FileText, X, AlertCircle, CheckCircle2, Loader2, Users2 } from "lucide-react";

// /**
//  * @typedef {Object} NotificationType
//  * @property {'success' | 'error' | ''} type
//  * @property {string} message
//  */

const CustomerSerialUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [fileName, setFileName] = useState("");

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setNotification({ type: 'error', message: "Please select a CSV file to upload." });
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://auditlyai.com/api/customer-serial-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification({ type: 'success', message: "CSV uploaded successfully." });
      setCsvFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setNotification({ type: 'error', message: "Failed to upload the CSV." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setNotification({ type: 'error', message: "Please enter a search query." });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://auditlyai.com/api/customer-item-data",
        { params: { query: searchQuery } }
      );

      const filteredResults = response.data.filter((item) => {
        return (
          item.shipped_to_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.account_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.original_sales_order_number?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

      setSearchResults(filteredResults);
      setNotification({
        type: filteredResults.length > 0 ? 'success' : 'error',
        message: filteredResults.length > 0 ? "Results found." : "No results found."
      });
    } catch (error) {
      console.error("Error searching customer item data:", error);
      setNotification({ type: 'error', message: "Failed to perform the search." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setNotification({ type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setFileName(file.name);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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
            <Users2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Customer Serial Upload
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Upload CSV files and search customer serial data
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 mb-8"
        >
          {/* CSV Upload Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Upload className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">CSV Upload</h2>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="relative">
                <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${fileName ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                  {fileName ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCsvFile(null);
                          setFileName("");
                        }}
                        className="p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="csv-upload"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="csv-upload"
                        className="flex flex-col items-center justify-center h-24 cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload CSV file</span>
                        <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading || !csvFile
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={isLoading || !csvFile}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload CSV
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Search Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Search className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Search Database</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-10 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                    disabled={isLoading}
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                    isLoading || !searchQuery
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={isLoading || !searchQuery}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Search Results */}
              <AnimatePresence mode="wait">
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-blue-100 rounded-xl overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-blue-50/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Customer Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Account #</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Sales Order #</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-50">
                            {searchResults.map((item, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-blue-50/50 transition-colors duration-200"
                              >
                                <td className="px-4 py-3 text-sm text-gray-900">{item.shipped_to_person}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.account_number}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.original_sales_order_number}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Notification */}
        <AnimatePresence mode="wait">
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`
                rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto
                ${notification.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'}
              `}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerSerialUpload;
