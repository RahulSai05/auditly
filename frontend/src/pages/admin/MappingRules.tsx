// import React from "react";
// import { motion } from "framer-motion";
// import { FileText, Database, Upload, ArrowRight, ChevronRight } from "lucide-react";

// const MappingRules: React.FC = () => {
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//     hover: {
//       scale: 1.02,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 10,
//       },
//     },
//   };

//   const iconVariants = {
//     hover: {
//       rotate: 360,
//       transition: { duration: 0.8, ease: "easeInOut" }
//     }
//   };

//   const arrowVariants = {
//     hover: {
//       x: [0, 5, 0],
//       transition: {
//         duration: 1,
//         repeat: Infinity,
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
//     >
//       <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <motion.div
//             initial={{ scale: 0, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             whileHover="hover"
//             variants={iconVariants}
//             className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg"
//           >
//             <FileText className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1 
//             variants={itemVariants}
//             className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
//           >
//             Data Mapping Rules
//           </motion.h1>
//           <motion.p 
//             variants={itemVariants}
//             className="text-gray-600"
//           >
//             Comprehensive guide for data integration and mapping
//           </motion.p>
//         </div>

//         {/* Item Upload Section */}
//         <motion.div
//           variants={cardVariants}
//           whileHover="hover"
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
//         >
//           <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
//           <div className="p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <motion.div
//                 whileHover="hover"
//                 variants={iconVariants}
//                 className="p-2 rounded-lg bg-blue-50"
//               >
//                 <Upload className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <h2 className="text-xl font-semibold text-gray-800">Item Upload</h2>
//             </div>

//             {/* Source 1 */}
//             <motion.div variants={itemVariants} className="mb-6">
//               <div className="flex items-center gap-2 mb-3">
//                 <motion.div whileHover="hover" variants={iconVariants}>
//                   <Database className="w-5 h-5 text-blue-600" />
//                 </motion.div>
//                 <h3 className="text-lg font-medium text-gray-700">Source 1 - CSV Upload</h3>
//               </div>
//               <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
//                 <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-blue-700">Items</span></p>
//                 <ul className="space-y-2">
//                   {["item_number", "Item_description", "brand_id", "category", "configuration"].map((item, index) => (
//                     <motion.li
//                       key={item}
//                       variants={itemVariants}
//                       whileHover={{ x: 5 }}
//                       className="flex items-center gap-2 text-gray-600 p-2 hover:bg-blue-100/50 rounded-lg transition-colors duration-200"
//                     >
//                       <motion.div variants={arrowVariants} whileHover="hover">
//                         <ChevronRight className="w-4 h-4 text-blue-500" />
//                       </motion.div>
//                       <span>Column {index + 1} ⟷ {item}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>

//             {/* Source 2 */}
//             <motion.div variants={itemVariants}>
//               <div className="flex items-center gap-2 mb-3">
//                 <motion.div whileHover="hover" variants={iconVariants}>
//                   <Database className="w-5 h-5 text-blue-600" />
//                 </motion.div>
//                 <h3 className="text-lg font-medium text-gray-700">Source 2 - Power BI to S3/Azure Blob</h3>
//               </div>
//               <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
//                 <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-blue-700">Items</span></p>
//                 <ul className="space-y-2">
//                   {["item_number", "Item_description", "brand_id", "category", "configuration"].map((item, index) => (
//                     <motion.li
//                       key={item}
//                       variants={itemVariants}
//                       whileHover={{ x: 5 }}
//                       className="flex items-center gap-2 text-gray-600 p-2 hover:bg-blue-100/50 rounded-lg transition-colors duration-200"
//                     >
//                       <motion.div variants={arrowVariants} whileHover="hover">
//                         <ChevronRight className="w-4 h-4 text-blue-500" />
//                       </motion.div>
//                       <span>Column {index + 1} ⟷ {item}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Customer Serial Upload Section */}
//         <motion.div
//           variants={cardVariants}
//           whileHover="hover"
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
//         >
//           <div className="h-2 bg-gradient-to-r from-green-500 to-teal-600" />
//           <div className="p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <motion.div
//                 whileHover="hover"
//                 variants={iconVariants}
//                 className="p-2 rounded-lg bg-green-50"
//               >
//                 <Upload className="w-6 h-6 text-green-600" />
//               </motion.div>
//               <h2 className="text-xl font-semibold text-gray-800">Customer Serial Upload</h2>
//             </div>

//             {/* Sources */}
//             {["CSV Upload", "Power BI to S3/Azure Blob"].map((source, sourceIndex) => (
//               <motion.div key={source} variants={itemVariants} className="mb-6 last:mb-0">
//                 <div className="flex items-center gap-2 mb-3">
//                   <motion.div whileHover="hover" variants={iconVariants}>
//                     <Database className="w-5 h-5 text-green-600" />
//                   </motion.div>
//                   <h3 className="text-lg font-medium text-gray-700">Source {sourceIndex + 1} - {source}</h3>
//                 </div>
//                 <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
//                   <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-green-700">customer_item_data</span></p>
//                   <ul className="space-y-2">
//                     {[
//                       "original_sales_order_number",
//                       "original_sales_order_line",
//                       "account_number",
//                       "date_purchased",
//                       "date_delivered",
//                       "serial_number",
//                       "shipped_to_address"
//                     ].map((item, index) => (
//                       <motion.li
//                         key={item}
//                         variants={itemVariants}
//                         whileHover={{ x: 5 }}
//                         className="flex items-center gap-2 text-gray-600 p-2 hover:bg-green-100/50 rounded-lg transition-colors duration-200"
//                       >
//                         <motion.div variants={arrowVariants} whileHover="hover">
//                           <ChevronRight className="w-4 h-4 text-green-500" />
//                         </motion.div>
//                         <span>Column {index + 1} ⟷ {item}</span>
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Returns Upload Section */}
//         <motion.div
//           variants={cardVariants}
//           whileHover="hover"
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
//           <div className="p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <motion.div
//                 whileHover="hover"
//                 variants={iconVariants}
//                 className="p-2 rounded-lg bg-amber-50"
//               >
//                 <Upload className="w-6 h-6 text-amber-600" />
//               </motion.div>
//               <h2 className="text-xl font-semibold text-gray-800">Returns Upload</h2>
//             </div>

//             {/* Sources */}
//             {[
//               {
//                 name: "CSV Upload",
//                 columns: [
//                   "original_sales_order_number",
//                   "original_sales_order_line",
//                   "account_number",
//                   "date_purchased",
//                   "date_delivered",
//                   "serial_number",
//                   "shipped_to_address",
//                   "Status"
//                 ]
//               },
//               {
//                 name: "Power BI to S3/Azure Blob",
//                 columns: [
//                   "SalesOrder",
//                   "ReturnReasonCode",
//                   "ReturnStatus",
//                   "RMANumber",
//                   "InvoiceAccount",
//                   "OrderType",
//                   "CustomerRequisition",
//                   "Status"
//                 ]
//               }
//             ].map((source, sourceIndex) => (
//               <motion.div key={source.name} variants={itemVariants} className="mb-6 last:mb-0">
//                 <div className="flex items-center gap-2 mb-3">
//                   <motion.div whileHover="hover" variants={iconVariants}>
//                     <Database className="w-5 h-5 text-amber-600" />
//                   </motion.div>
//                   <h3 className="text-lg font-medium text-gray-700">Source {sourceIndex + 1} - {source.name}</h3>
//                 </div>
//                 <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
//                   <ul className="space-y-2">
//                     {source.columns.map((item, index) => (
//                       <motion.li
//                         key={item}
//                         variants={itemVariants}
//                         whileHover={{ x: 5 }}
//                         className="flex items-center gap-2 text-gray-600 p-2 hover:bg-amber-100/50 rounded-lg transition-colors duration-200"
//                       >
//                         <motion.div variants={arrowVariants} whileHover="hover">
//                           <ChevronRight className="w-4 h-4 text-amber-500" />
//                         </motion.div>
//                         <span>Column {index + 1} ⟷ {item}</span>
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MappingRules;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Database, Upload, ChevronRight, Save } from "lucide-react";

const MappingRules: React.FC = () => {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
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

  const iconVariants = {
    hover: {
      rotate: 360,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const [sourceColumns, setSourceColumns] = useState<{ [key: string]: string }>({});

  const handleSourceColumnChange = (key: string, value: string) => {
    setSourceColumns((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveMapping = (tableName: string) => {
    console.log(`Saved mapping for ${tableName}:`, sourceColumns);
    // Add logic to save the mapping rules (e.g., API call)
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover="hover"
            variants={iconVariants}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg"
          >
            <FileText className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          >
            Data Mapping Rules
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600"
          >
            Comprehensive guide for data integration and mapping
          </motion.p>
        </div>

        {/* Item Upload Section */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover="hover"
                variants={iconVariants}
                className="p-2 rounded-lg bg-blue-50"
              >
                <Upload className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-800">Item Upload</h2>
            </div>

            <motion.div variants={itemVariants}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50/50">
                      <th className="p-3 text-left text-gray-700">Columns</th>
                      <th className="p-3 text-left text-gray-700">Destination Table</th>
                      <th className="p-3 text-left text-gray-700">Source Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { column: "Column 1", destination: "item_number" },
                      { column: "Column 2", destination: "item_description" },
                      { column: "Column 3", destination: "brand_id" },
                      { column: "Column 4", destination: "category" },
                      { column: "Column 5", destination: "configuration" },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-blue-100">
                        <td className="p-3 text-gray-700">{row.column}</td>
                        <td className="p-3 text-gray-700">{row.destination}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={sourceColumns[row.destination] || ""}
                            onChange={(e) => handleSourceColumnChange(row.destination, e.target.value)}
                            placeholder="Enter source column"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSaveMapping("Item Upload")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  Save Mapping Rule
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Customer Serial Upload Section */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="h-2 bg-gradient-to-r from-green-500 to-teal-600" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover="hover"
                variants={iconVariants}
                className="p-2 rounded-lg bg-green-50"
              >
                <Upload className="w-6 h-6 text-green-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-800">Customer Serial Upload</h2>
            </div>

            <motion.div variants={itemVariants}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-50/50">
                      <th className="p-3 text-left text-gray-700">Columns</th>
                      <th className="p-3 text-left text-gray-700">Destination Table</th>
                      <th className="p-3 text-left text-gray-700">Source Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { column: "Column 1", destination: "original_sales_order_number" },
                      { column: "Column 2", destination: "original_sales_order_line" },
                      { column: "Column 3", destination: "account_number" },
                      { column: "Column 4", destination: "date_purchased" },
                      { column: "Column 5", destination: "date_delivered" },
                      { column: "Column 6", destination: "serial_number" },
                      { column: "Column 7", destination: "shipped_to_address" },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-green-100">
                        <td className="p-3 text-gray-700">{row.column}</td>
                        <td className="p-3 text-gray-700">{row.destination}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={sourceColumns[row.destination] || ""}
                            onChange={(e) => handleSourceColumnChange(row.destination, e.target.value)}
                            placeholder="Enter source column"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSaveMapping("Customer Serial Upload")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save Mapping Rule
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Returns Upload Section */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover="hover"
                variants={iconVariants}
                className="p-2 rounded-lg bg-amber-50"
              >
                <Upload className="w-6 h-6 text-amber-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-800">Returns Upload</h2>
            </div>

            <motion.div variants={itemVariants}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50/50">
                      <th className="p-3 text-left text-gray-700">Columns</th>
                      <th className="p-3 text-left text-gray-700">Destination Table</th>
                      <th className="p-3 text-left text-gray-700">Source Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { column: "Column 1", destination: "original_sales_order_number" },
                      { column: "Column 2", destination: "original_sales_order_line" },
                      { column: "Column 3", destination: "account_number" },
                      { column: "Column 4", destination: "date_purchased" },
                      { column: "Column 5", destination: "date_delivered" },
                      { column: "Column 6", destination: "serial_number" },
                      { column: "Column 7", destination: "shipped_to_address" },
                      { column: "Column 8", destination: "Status" },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-amber-100">
                        <td className="p-3 text-gray-700">{row.column}</td>
                        <td className="p-3 text-gray-700">{row.destination}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={sourceColumns[row.destination] || ""}
                            onChange={(e) => handleSourceColumnChange(row.destination, e.target.value)}
                            placeholder="Enter source column"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSaveMapping("Returns Upload")}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  Save Mapping Rule
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MappingRules;