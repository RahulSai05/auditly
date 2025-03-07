import React from "react";
import { motion } from "framer-motion";
import { FileText, Database, Upload, ArrowRight } from "lucide-react";

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center"
          >
            <FileText className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-4"
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
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Item Upload</h2>
            </div>

            {/* Source 1 */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-700">Source 1 - CSV Upload</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-blue-600">Items</span></p>
                <ul className="space-y-2">
                  {["item_number", "Item_description", "brand_id", "category", "configuration"].map((item, index) => (
                    <motion.li
                      key={item}
                      variants={itemVariants}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span>Column {index + 1} ⟷ {item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Source 2 */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-700">Source 2 - Power BI to S3/Azure Blob</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-blue-600">Items</span></p>
                <ul className="space-y-2">
                  {["item_number", "Item_description", "brand_id", "category", "configuration"].map((item, index) => (
                    <motion.li
                      key={item}
                      variants={itemVariants}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span>Column {index + 1} ⟷ {item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Customer Serial Upload Section */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Customer Serial Upload</h2>
            </div>

            {/* Sources */}
            {["CSV Upload", "Power BI to S3/Azure Blob"].map((source, sourceIndex) => (
              <motion.div key={source} variants={itemVariants} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-700">Source {sourceIndex + 1} - {source}</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">Source table name: <span className="font-semibold text-blue-600">customer_item_data</span></p>
                  <ul className="space-y-2">
                    {[
                      "original_sales_order_number",
                      "original_sales_order_line",
                      "account_number",
                      "date_purchased",
                      "date_delivered",
                      "serial_number",
                      "shipped_to_address"
                    ].map((item, index) => (
                      <motion.li
                        key={item}
                        variants={itemVariants}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>Column {index + 1} ⟷ {item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Returns Upload Section */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Returns Upload</h2>
            </div>

            {/* Sources */}
            {[
              {
                name: "CSV Upload",
                columns: [
                  "original_sales_order_number",
                  "original_sales_order_line",
                  "account_number",
                  "date_purchased",
                  "date_delivered",
                  "serial_number",
                  "shipped_to_address",
                  "Status"
                ]
              },
              {
                name: "Power BI to S3/Azure Blob",
                columns: [
                  "SalesOrder",
                  "ReturnReasonCode",
                  "ReturnStatus",
                  "RMANumber",
                  "InvoiceAccount",
                  "OrderType",
                  "CustomerRequisition",
                  "Status"
                ]
              }
            ].map((source, sourceIndex) => (
              <motion.div key={source.name} variants={itemVariants} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-700">Source {sourceIndex + 1} - {source.name}</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {source.columns.map((item, index) => (
                      <motion.li
                        key={item}
                        variants={itemVariants}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>Column {index + 1} ⟷ {item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MappingRules;
