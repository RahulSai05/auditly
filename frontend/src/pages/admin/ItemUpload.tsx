
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, X, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

function ItemUpload() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setFileName(file.name);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    setUploadProgress(0);

    try {
      await axios.post(
        "https://auditlyai.com/api/upload-items-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );
      
      setCsvFile(null);
      setFileName("");
      setUploadProgress(0);
      setNotification({ type: 'success', message: 'File uploaded successfully!' });
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while uploading the CSV.";
      setNotification({ type: 'error', message: errorMessage });
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
        "https://auditlyai.com/api/search-items",
        {
          params: { query: searchQuery },
        }
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setNotification({ type: 'error', message: "No results found." });
      } else {
        setNotification({ type: '', message: '' });
      }
    } catch (error: any) {
      console.error("Error searching items:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while searching for items.";
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setNotification({ type: '', message: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
      handleSearch();
    }
  };

  const downloadTemplateCSV = () => {
    const csvContent = "item_number,item_description,brand_id,category,configuration";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'items_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ type: 'success', message: "CSV template downloaded successfully. Add your data to the file and upload it." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
            Item Data Upload
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload CSV files to manage your item database
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* CSV Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                    fileName ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {fileName ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCsvFile(null);
                            setFileName("");
                            setUploadProgress(0);
                          }}
                          className="p-1 hover:bg-blue-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-blue-100 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
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

              <div className="bg-blue-50/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  CSV Format Requirements:
                </h3>
                <div className="pl-4 border-l-2 border-blue-100">
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li><strong>Required columns:</strong> item_number, item_description, brand_id, category, configuration</li>
                    <li><strong>Data types:</strong> item_number and brand_id must be numeric values</li>
                    <li><strong>Constraints:</strong> No duplicate item_numbers allowed</li>
                    <li><strong>Foreign keys:</strong> Brand ID must exist in the database</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={downloadTemplateCSV}
                  className="flex-1 px-4 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Template
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
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
              </div>
            </form>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    placeholder="Enter item number, description, or category..."
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
                      <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Search Results</span>
                        <span className="text-xs text-blue-500">Found {searchResults.length} items</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-blue-50/50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Item Description</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Item #</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Brand ID</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-50">
                            {searchResults.map((item, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-blue-50/50 transition-colors duration-200"
                              >
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.item_description}</td>
                                <td className="px-4 py-3 text-sm text-blue-700">#{item.item_number}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{item.brand_id}</td>
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
                rounded-xl p-4 shadow-md flex items-center gap-3 max-w-2xl mx-auto
                ${notification.type === 'success' 
                  ? 'bg-green-50 border border-green-100 text-green-800' 
                  : 'bg-red-50 border border-red-100 text-red-800'}
              `}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ItemUpload;
