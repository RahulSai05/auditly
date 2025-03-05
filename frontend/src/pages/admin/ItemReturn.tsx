import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface SearchResult {
  shipped_to_person: string;
  return_order_number: string;
  original_sales_order_number: string;
}

const ItemReturn: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [fileName, setFileName] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      setNotification({
        type: "error",
        message: "Please select a CSV file to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    setIsLoading(true);

    try {
      const response = await axios.post<{ message: string }>(
        "http://54.210.159.220:8000/upload-customer-return-item-data",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification({ type: "success", message: response.data.message });
      setCsvFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setNotification({
        type: "error",
        message: "An error occurred while uploading the CSV.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a search query.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult[]>(
        "http://54.210.159.220:8000/customer-item-data", // Updated API endpoint
        {
          params: { query: searchQuery },
        }
      );

      // Filter results based on the search query
      const filteredResults = response.data.filter((item) => {
        return (
          item.shipped_to_person
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.return_order_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.original_sales_order_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });

      setSearchResults(filteredResults);
      setNotification({
        type: filteredResults.length > 0 ? "success" : "error",
        message:
          filteredResults.length > 0
            ? "Results found."
            : "No matching results found.",
      });
    } catch (error) {
      console.error("Error searching items:", error);
      setNotification({
        type: "error",
        message: "An error occurred while searching for items.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setNotification({ type: "", message: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setFileName(file.name);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim() && !isLoading) {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Return Item Data
          </h1>
          <p className="text-gray-600">
            Upload a CSV file or search the database for return item data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* CSV Upload Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                CSV Upload
              </h2>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="relative">
                <div
                  className={`
                  border-2 border-dashed rounded-lg p-4 transition-all duration-200
                  ${
                    fileName
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }
                `}
                >
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
                        id="csv-upload" // Add an ID to the file input
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="csv-upload" // Link the label to the file input
                        className="flex flex-col items-center justify-center h-24 cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Click to upload CSV file
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          or drag and drop
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`
                  w-full px-4 py-2 rounded-lg font-medium
                  transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    isLoading || !csvFile
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
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
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Search Database
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter serial number, order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className={`
                    px-4 py-2 rounded-lg font-medium flex items-center gap-2
                    transition-all duration-200
                    ${
                      isLoading || !searchQuery
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
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
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Customer Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Return Order Number
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Sales Order Number
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {searchResults.map((item, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.shipped_to_person}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.return_order_number}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.original_sales_order_number}
                                </td>
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
        </div>

        {/* Notification */}
        <AnimatePresence mode="wait">
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`
                rounded-lg p-4 flex items-center gap-3
                ${
                  notification.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              `}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ItemReturn;
