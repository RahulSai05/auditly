
// import React, { useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Upload, Search, FileText, X, AlertCircle, CheckCircle2, Loader2, Users2 } from "lucide-react";

// // /**
// //  * @typedef {Object} NotificationType
// //  * @property {'success' | 'error' | ''} type
// //  * @property {string} message
// //  */

// const CustomerSerialUpload = () => {
//   const [csvFile, setCsvFile] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notification, setNotification] = useState({ type: '', message: '' });
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [fileName, setFileName] = useState("");

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//   };

//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     if (!csvFile) {
//       setNotification({ type: 'error', message: "Please select a CSV file to upload." });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", csvFile);
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         "https://auditlyai.com/api/customer-serial-upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setNotification({ type: 'success', message: "CSV uploaded successfully." });
//       setCsvFile(null);
//       setFileName("");
//     } catch (error) {
//       console.error("Error uploading CSV:", error);
//       setNotification({ type: 'error', message: "Failed to upload the CSV." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setNotification({ type: 'error', message: "Please enter a search query." });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         "https://auditlyai.com/api/customer-item-data",
//         { params: { query: searchQuery } }
//       );

//       const filteredResults = response.data.filter((item) => {
//         return (
//           item.shipped_to_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.account_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.original_sales_order_number?.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       });

//       setSearchResults(filteredResults);
//       setNotification({
//         type: filteredResults.length > 0 ? 'success' : 'error',
//         message: filteredResults.length > 0 ? "Results found." : "No results found."
//       });
//     } catch (error) {
//       console.error("Error searching customer item data:", error);
//       setNotification({ type: 'error', message: "Failed to perform the search." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setSearchResults([]);
//     setNotification({ type: '', message: '' });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCsvFile(file);
//       setFileName(file.name);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <motion.div
//             initial={{ scale: 0.8, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 20,
//             }}
//             className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
//           >
//             <Users2 className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             Customer Serial Upload
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Upload CSV files and search customer serial data
//           </motion.p>
//         </motion.div>

//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid gap-6 md:grid-cols-2 mb-8"
//         >
//           {/* CSV Upload Section */}
//           <motion.div
//             variants={itemVariants}
//             className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 10 }}
//                 className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//               >
//                 <Upload className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <h2 className="text-xl font-bold text-gray-800">CSV Upload</h2>
//             </div>

//             <form onSubmit={handleFileUpload} className="space-y-4">
//               <div className="relative">
//                 <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${fileName ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
//                   {fileName ? (
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-blue-600">{fileName}</span>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setCsvFile(null);
//                           setFileName("");
//                         }}
//                         className="p-1 hover:bg-blue-100 rounded-full"
//                       >
//                         <X className="w-4 h-4 text-blue-600" />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <input
//                         type="file"
//                         id="csv-upload"
//                         accept=".csv"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         disabled={isLoading}
//                       />
//                       <label
//                         htmlFor="csv-upload"
//                         className="flex flex-col items-center justify-center h-24 cursor-pointer"
//                       >
//                         <Upload className="w-8 h-8 text-blue-400 mb-2" />
//                         <span className="text-sm text-gray-500">Click to upload CSV file</span>
//                         <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
//                       </label>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
//                   isLoading || !csvFile
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//                 disabled={isLoading || !csvFile}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5" />
//                     Upload CSV
//                   </>
//                 )}
//               </motion.button>
//             </form>
//           </motion.div>

//           {/* Search Section */}
//           <motion.div
//             variants={itemVariants}
//             className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 10 }}
//                 className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//               >
//                 <Search className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <h2 className="text-xl font-bold text-gray-800">Search Database</h2>
//             </div>

//             <div className="space-y-4">
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     placeholder="Enter search query..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="w-full px-4 py-3 pr-10 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                     disabled={isLoading}
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={handleClearSearch}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
//                     >
//                       <X className="w-4 h-4 text-gray-400" />
//                     </button>
//                   )}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleSearch}
//                   className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                     isLoading || !searchQuery
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                   disabled={isLoading || !searchQuery}
//                 >
//                   {isLoading ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <Search className="w-5 h-5" />
//                   )}
//                 </motion.button>
//               </div>

//               {/* Search Results */}
//               <AnimatePresence mode="wait">
//                 {searchResults.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="border border-blue-100 rounded-xl overflow-hidden">
//                       <div className="max-h-64 overflow-y-auto">
//                         <table className="w-full">
//                           <thead className="bg-blue-50/50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Customer Name</th>
//                               <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Account #</th>
//                               <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase">Sales Order #</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y divide-blue-50">
//                             {searchResults.map((item, index) => (
//                               <motion.tr
//                                 key={index}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 className="hover:bg-blue-50/50 transition-colors duration-200"
//                               >
//                                 <td className="px-4 py-3 text-sm text-gray-900">{item.shipped_to_person}</td>
//                                 <td className="px-4 py-3 text-sm text-gray-900">{item.account_number}</td>
//                                 <td className="px-4 py-3 text-sm text-gray-900">{item.original_sales_order_number}</td>
//                               </motion.tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Notification */}
//         <AnimatePresence mode="wait">
//           {notification.message && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               className={`
//                 rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto
//                 ${notification.type === 'success' 
//                   ? 'bg-green-100 text-green-800' 
//                   : 'bg-red-100 text-red-800'}
//               `}
//             >
//               {notification.type === 'success' ? (
//                 <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
//               ) : (
//                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
//               )}
//               <p>{notification.message}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CustomerSerialUpload;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, X, Download, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';

function CustomerSerialUpload() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setFileName(file.name);
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
    setUploadProgress(0);

    try {
      const response = await axios.post(
        "https://auditlyai.com/api/upload-sale-items-csv",
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
      setNotification({ 
        type: 'success', 
        message: `Success! ${response.data.items_added} items added. ${response.data.rows_skipped.length} rows skipped.` 
      });
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while uploading the CSV.";
      setNotification({ type: 'error', message: errorMessage });
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
        "https://auditlyai.com/api/sale-data",
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
      console.error("Error searching sale items:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while searching for sale items.";
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

  const downloadSampleCSV = () => {
    // Create CSV content with sample data matching the API requirements
    const csvContent = [
      "item_id,original_sales_order_number,original_sales_order_line,ordered_qty,serial_number,customer_email,account_number,sscc_number,tag_number,vendor_item_number,shipped_from_warehouse,shipped_to_person,shipped_to_billing_address,shipped_to_apt_number,shipped_to_street,shipped_to_city,shipped_to_zip,shipped_to_state,shipped_to_country,dimension_depth,dimension_length,dimension_breadth,dimension_weight,dimension_volume,dimension_size,date_purchased,date_shipped,date_delivered",
      "1001,SO-2023-001,1,2,SN12345678,customer@example.com,ACC12345,SSCC98765,TAG54321,VIN87654,Warehouse A,John Doe,123 Main St,Apt 4B,123 Main St,New York,10001,NY,USA,10.5,15.2,8.3,5.7,1200.5,Large,2023-01-15,2023-01-20,2023-01-25",
      "1002,SO-2023-001,2,1,SN87654321,customer@example.com,ACC12345,SSCC98766,TAG54322,VIN87655,Warehouse A,Jane Smith,123 Main St,Apt 4B,123 Main St,New York,10001,NY,USA,8.2,12.5,6.8,3.2,800.3,Medium,2023-01-15,2023-01-20,2023-01-25"
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sale_items_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ type: 'success', message: "Sample CSV template downloaded. Add your data to the file and upload it." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
            Sale Items Data Upload
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload CSV files to manage your sale items and serial numbers
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
                    <li><strong>Required columns:</strong> item_id, original_sales_order_number, original_sales_order_line, ordered_qty, serial_number, customer_email, account_number, and all shipping/dimension fields</li>
                    <li><strong>Data types:</strong> item_id, ordered_qty, and original_sales_order_line must be integers</li>
                    <li><strong>Constraints:</strong> No duplicate combinations of order number, line, and serial</li>
                    <li><strong>Foreign keys:</strong> Item ID must exist in the database</li>
                    <li><strong>Dates:</strong> Must be in YYYY-MM-DD format</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={downloadSampleCSV}
                  className="flex-1 px-4 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Sample
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
              <h2 className="text-xl font-bold text-gray-800">Search Sale Items</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by order number, serial, customer name..."
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
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Order</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Customer</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Serial</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Shipped</th>
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
                                <td className="px-4 py-3 text-sm text-blue-700 font-medium">
                                  {item.sales_order}-{item.order_line}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {item.customer_name}
                                  <div className="text-xs text-gray-500">{item.account_number}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {item.item_description}
                                  <div className="text-xs text-gray-500">{item.brand} - {item.item_configuration}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                                  {item.serial_number}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {new Date(item.date_shipped).toLocaleDateString()}
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

export default CustomerSerialUpload;
