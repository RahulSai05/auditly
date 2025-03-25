// import React, { useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Loader2, X, Image as ImageIcon, ClipboardList } from "lucide-react";

// interface ItemData {
//   item_id: number;
//   item_number: number;
//   item_description: string;
//   brand_id: number;
//   category: string;
//   configuration: string;
//   front_image_path: string;
//   back_image_path: string;
// }

// const ItemImages: React.FC = () => {
//   const [itemNumber, setItemNumber] = useState<string>("");
//   const [itemData, setItemData] = useState<ItemData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const backendUrl = "https://auditlyai.com/api"; // API endpoint
//   const staticUrl = "https://auditlyai.com"; // Root domain for static files

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   const fetchItemData = async () => {
//     if (!itemNumber) {
//       setError("Please enter an item number.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setItemData(null);

//     try {
//       const response = await axios.get(`${backendUrl}/images/${itemNumber}`);
//       const data = response.data;
//       // Prepend the static URL to the image paths
//       data.front_image_path = `${staticUrl}${data.front_image_path}`;
//       data.back_image_path = `${staticUrl}${data.back_image_path}`;
//       setItemData(data);
//     } catch (err: any) {
//       setError(err.response?.data?.detail || "An unexpected error occurred while fetching the item data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setItemNumber("");
//     setItemData(null);
//     setError(null);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !loading) {
//       fetchItemData();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16"
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
//             <ClipboardList className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             Item Image Viewer
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             View and verify item images with real-time updates
//           </motion.p>
//         </motion.div>

//         {/* Search Section */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.4 }}
//           className="max-w-6xl mx-auto"
//         >
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50">
//             <div className="p-8">
//               <div className="flex gap-4 max-w-3xl mx-auto">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     placeholder="Enter item number..."
//                     value={itemNumber}
//                     onChange={(e) => setItemNumber(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
//                     disabled={loading}
//                   />
//                   {itemNumber && (
//                     <motion.button
//                       onClick={handleClear}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors"
//                       whileHover={{ scale: 1.1, rotate: 90 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <X className="w-5 h-5 text-blue-400" />
//                     </motion.button>
//                   )}
//                 </div>
//                 <motion.button
//                   onClick={fetchItemData}
//                   disabled={loading}
//                   className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {loading ? (
//                     <Loader2 className="w-6 h-6 animate-spin" />
//                   ) : (
//                     <Search className="w-6 h-6" />
//                   )}
//                 </motion.button>
//               </div>

//               <AnimatePresence mode="wait">
//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2 max-w-3xl mx-auto"
//                   >
//                     <X className="w-5 h-5 flex-shrink-0" />
//                     <p>{error}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <AnimatePresence mode="wait">
//               {itemData && (
//                 <motion.div
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className="border-t border-blue-50"
//                 >
//                   <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Item Details */}
//                     <motion.div 
//                       variants={itemVariants}
//                       className="lg:col-span-1 bg-blue-50/50 rounded-2xl p-6"
//                     >
//                       <h3 className="text-xl font-semibold text-gray-900 mb-6">Item Details</h3>
//                       <div className="space-y-4">
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                           <p className="text-sm text-gray-500">Item Number</p>
//                           <p className="text-lg font-medium text-gray-900">{itemData.item_number}</p>
//                         </div>
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                           <p className="text-sm text-gray-500">Description</p>
//                           <p className="text-lg font-medium text-gray-900">{itemData.item_description}</p>
//                         </div>
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                           <p className="text-sm text-gray-500">Brand ID</p>
//                           <p className="text-lg font-medium text-gray-900">{itemData.brand_id}</p>
//                         </div>
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                           <p className="text-sm text-gray-500">Category</p>
//                           <p className="text-lg font-medium text-gray-900">{itemData.category}</p>
//                         </div>
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                           <p className="text-sm text-gray-500">Configuration</p>
//                           <p className="text-lg font-medium text-gray-900">{itemData.configuration}</p>
//                         </div>
//                       </div>
//                     </motion.div>

//                     {/* Images Section */}
//                     <motion.div 
//                       variants={itemVariants}
//                       className="lg:col-span-2 grid grid-cols-2 gap-8"
//                     >
//                       {/* Front Image */}
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <h3 className="text-xl font-semibold text-gray-900">Front View</h3>
//                           <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                             Primary
//                           </span>
//                         </div>
//                         <motion.div 
//                           className="aspect-square rounded-2xl border-2 border-blue-100 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
//                           whileHover={{ scale: 1.02 }}
//                           transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                         >
//                           {itemData.front_image_path ? (
//                             <img
//                               src={itemData.front_image_path}
//                               alt="Front View"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
//                               <ImageIcon className="w-16 h-16 mb-2" />
//                               <p className="text-sm">No front image available</p>
//                             </div>
//                           )}
//                         </motion.div>
//                       </div>

//                       {/* Back Image */}
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <h3 className="text-xl font-semibold text-gray-900">Back View</h3>
//                           <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
//                             Secondary
//                           </span>
//                         </div>
//                         <motion.div 
//                           className="aspect-square rounded-2xl border-2 border-gray-100 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
//                           whileHover={{ scale: 1.02 }}
//                           transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                         >
//                           {itemData.back_image_path ? (
//                             <img
//                               src={itemData.back_image_path}
//                               alt="Back View"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
//                               <ImageIcon className="w-16 h-16 mb-2" />
//                               <p className="text-sm">No back image available</p>
//                             </div>
//                           )}
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ItemImages;


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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<"number" | "description">("number");
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = "https://auditlyai.com/api"; // API endpoint
  const staticUrl = "https://auditlyai.com"; // Root domain for static files

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
  if (!searchTerm) {
    setError(`Please enter an item ${searchType === "number" ? "number" : "description"}.`);
    return;
  }

  setLoading(true);
  setError(null);
  setItemData(null);

  try {
    // Construct the correct URL based on search type
    let url;
    if (searchType === "number") {
      url = `${backendUrl}/images/search?item_number=${encodeURIComponent(searchTerm)}`;
    } else {
      url = `${backendUrl}/images/search?item_description=${encodeURIComponent(searchTerm)}`;
    }

    console.log("Making request to:", url); // For debugging

    const response = await axios.get(url);
    const data = response.data;
    data.front_image_path = `${staticUrl}${data.front_image_path}`;
    data.back_image_path = `${staticUrl}${data.back_image_path}`;
    setItemData(data);
  } catch (err: any) {
    console.error("API Error:", err); // For debugging
    setError(err.response?.data?.detail || "An unexpected error occurred while fetching the item data.");
  } finally {
    setLoading(false);
  }
};
  const handleClear = () => {
    setSearchTerm("");
    setItemData(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      fetchItemData();
    }
  };

  const toggleSearchType = () => {
    setSearchType(prev => prev === "number" ? "description" : "number");
    setSearchTerm("");
    setItemData(null);
    setError(null);
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
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
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
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50">
            <div className="p-8">
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {/* Search Type Toggle */}
                <div className="flex items-center justify-center gap-4">
                  <span className="text-sm font-medium text-gray-500">Search by:</span>
                  <button
                    onClick={toggleSearchType}
                    className="relative inline-flex items-center h-10 rounded-full bg-blue-50 px-4 transition-colors hover:bg-blue-100"
                  >
                    <span className="text-sm font-medium text-blue-600">
                      {searchType === "number" ? "Item Number" : "Description"}
                    </span>
                    <motion.span
                      className="absolute -right-1 -top-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      animate={{ rotate: searchType === "number" ? 0 : 180 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      {searchType === "number" ? "#" : "A"}
                    </motion.span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type={searchType === "number" ? "number" : "text"}
                      placeholder={`Enter item ${searchType === "number" ? "number" : "description"}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
                      disabled={loading}
                    />
                    {searchTerm && (
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
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2 max-w-3xl mx-auto"
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
                  className="border-t border-blue-50"
                >
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Item Details */}
                    <motion.div 
                      variants={itemVariants}
                      className="lg:col-span-1 bg-blue-50/50 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Item Details</h3>
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Item Number</p>
                          <p className="text-lg font-medium text-gray-900">{itemData.item_number}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-lg font-medium text-gray-900">{itemData.item_description}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Brand ID</p>
                          <p className="text-lg font-medium text-gray-900">{itemData.brand_id}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="text-lg font-medium text-gray-900">{itemData.category}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Configuration</p>
                          <p className="text-lg font-medium text-gray-900">{itemData.configuration}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Images Section */}
                    <motion.div 
                      variants={itemVariants}
                      className="lg:col-span-2 grid grid-cols-2 gap-8"
                    >
                      {/* Front Image */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">Front View</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Primary
                          </span>
                        </div>
                        <motion.div 
                          className="aspect-square rounded-2xl border-2 border-blue-100 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {itemData.front_image_path ? (
                            <img
                              src={itemData.front_image_path}
                              alt="Front View"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                              <ImageIcon className="w-16 h-16 mb-2" />
                              <p className="text-sm">No front image available</p>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Back Image */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">Back View</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            Secondary
                          </span>
                        </div>
                        <motion.div 
                          className="aspect-square rounded-2xl border-2 border-gray-100 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {itemData.back_image_path ? (
                            <img
                              src={itemData.back_image_path}
                              alt="Back View"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                              <ImageIcon className="w-16 h-16 mb-2" />
                              <p className="text-sm">No back image available</p>
                            </div>
                          )}
                        </motion.div>
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
