// import React, { useState } from "react";
// import axios from "axios";

// const ItemUpload: React.FC = () => {
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notification, setNotification] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState<any[]>([]);

//   const handleFileUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!csvFile) {
//       setNotification("Please select a CSV file to upload.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", csvFile);
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "http://54.210.159.220:8000/upload-items-csv",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setNotification(response.data.message);
//     } catch (error) {
//       console.error("Error uploading CSV:", error);
//       setNotification("An error occurred while uploading the CSV.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setNotification("Please enter a search query.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         "http://54.210.159.220:8000/search-items",
//         {
//           params: { query: searchQuery },
//         }
//       );
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error("Error searching items:", error);
//       setNotification("An error occurred while searching for items.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setSearchResults([]);
//     setNotification("");
//   };

//   return (
//     <div className="h-[75vh] flex justify-center items-start  p-6">
//       <div className="w-full max-w-2xl space-y-4">
//         {/* Title */}
//         <h1 className="text-2xl font-bold text-center">
//           Customer Item Data Upload
//         </h1>
//         <p className="text-gray-500 text-center">
//           Upload a CSV file or search the database for customer item data
//         </p>

//         {/* CSV Upload Section */}
//         <div className="bg-white p-4 rounded-lg shadow-md w-full">
//           <h2 className="text-lg font-semibold mb-2">Select CSV file</h2>
//           <form onSubmit={handleFileUpload} className="space-y-2">
//             <input
//               type="file"
//               accept=".csv"
//               onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
//               className="border border-gray-300 rounded p-2 w-full"
//               disabled={isLoading}
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? "Uploading..." : "Upload"}
//             </button>
//           </form>
//         </div>

//         {/* Search Section */}
//         <div className="bg-white p-4 rounded-lg shadow-md w-full">
//           <h2 className="text-lg font-semibold mb-2">Search Database</h2>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Enter Query (ex: Serial)..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="border border-gray-300 rounded p-2 w-full"
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               disabled={isLoading}
//             >
//               {isLoading ? "Searching..." : "Search"}
//             </button>
//             <button
//               onClick={handleClearSearch}
//               className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
//               disabled={isLoading || !searchQuery}
//             >
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Search Results Table */}
//         {searchResults.length > 0 && (
//           <div className="bg-white p-4 rounded-lg shadow-md w-full">
//             <h2 className="text-lg font-semibold mb-2">Search Results</h2>
//             <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border border-gray-300 p-2">Product</th>
//                     <th className="border border-gray-300 p-2">Order Number</th>
//                     <th className="border border-gray-300 p-2">Return Term</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {searchResults.map((item, index) => (
//                     <tr key={index} className="text-center">
//                       <td className="border border-gray-300 p-2">
//                         {item.item_description}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         #{item.item_number}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         {item.return_term || "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItemUpload;


import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Search, FileText, X, AlertCircle, CheckCircle2, Loader2, Table } from "lucide-react";

const ItemUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
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
        "http://54.210.159.220:8000/upload-items-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification({ type: 'success', message: response.data.message });
      setCsvFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setNotification({ type: 'error', message: "An error occurred while uploading the CSV." });
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
        "http://54.210.159.220:8000/search-items",
        {
          params: { query: searchQuery },
        }
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setNotification({ type: 'error', message: "No results found." });
      }
    } catch (error) {
      console.error("Error searching items:", error);
      setNotification({ type: 'error', message: "An error occurred while searching for items." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setNotification({ type: '', message: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setFileName(file.name);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
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
      <motion.div 
        variants={itemVariants}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Item Data Upload</h1>
          <p className="text-gray-600">
            Upload a CSV file or search the database for customer item data
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
              <h2 className="text-lg font-semibold text-gray-800">CSV Upload</h2>
            </div>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="relative">
                <div className={`
                  border-2 border-dashed rounded-lg p-4 transition-all duration-200
                  ${fileName ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                `}>
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
                    <label className="flex flex-col items-center justify-center h-24 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload CSV file</span>
                      <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                    </label>
                  )}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`
                  w-full px-4 py-2 rounded-lg font-medium
                  transition-all duration-200 flex items-center justify-center gap-2
                  ${isLoading || !csvFile
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
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
              <h2 className="text-lg font-semibold text-gray-800">Search Database</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Query (ex: Serial)..."
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
                    ${isLoading || !searchQuery
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
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
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
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
                                <td className="px-4 py-2 text-sm text-gray-900">{item.item_description}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">#{item.item_number}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.return_term || "N/A"}</td>
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
      </motion.div>
    </motion.div>
  );
};

export default ItemUpload;
