import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Save, Edit, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const MappingRules: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99],
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
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { 
      scale: 0.97,
      transition: { duration: 0.1 } 
    },
    disabled: {
      scale: 1,
      opacity: 0.7,
    }
  };

  const [sourceColumns, setSourceColumns] = useState<{ [key: string]: string }>({});
  const [sourceType, setSourceType] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState<{ [key: string]: boolean }>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<{ [key: string]: boolean }>({});

  const [itemRows, setItemRows] = useState([
    { id: "1", column: "Column 1", destination: "item_number", source: "" },
    { id: "2", column: "Column 2", destination: "item_description", source: "" },
    { id: "3", column: "Column 3", destination: "brand_id", source: "" },
    { id: "4", column: "Column 4", destination: "category", source: "" },
    { id: "5", column: "Column 5", destination: "configuration", source: "" },
  ]);

  const [customerSerialRows, setCustomerSerialRows] = useState([
    { id: "1", column: "Column 1", destination: "original_sales_order_number", source: "" },
    { id: "2", column: "Column 2", destination: "original_sales_order_line", source: "" },
    { id: "3", column: "Column 3", destination: "account_number", source: "" },
    { id: "4", column: "Column 4", destination: "date_purchased", source: "" },
    { id: "5", column: "Column 5", destination: "date_delivered", source: "" },
    { id: "6", column: "Column 6", destination: "serial_number", source: "" },
    { id: "7", column: "Column 7", destination: "shipped_to_address", source: "" },
  ]);

  const [returnsRows, setReturnsRows] = useState([
    { id: "1", column: "Column 1", destination: "original_sales_order_number", source: "" },
    { id: "2", column: "Column 2", destination: "original_sales_order_line", source: "" },
    { id: "3", column: "Column 3", destination: "account_number", source: "" },
    { id: "4", column: "Column 4", destination: "date_purchased", source: "" },
    { id: "5", column: "Column 5", destination: "date_delivered", source: "" },
    { id: "6", column: "Column 6", destination: "serial_number", source: "" },
    { id: "7", column: "Column 7", destination: "shipped_to_address", source: "" },
    { id: "8", column: "Column 8", destination: "Status", source: "" },
  ]);

  const handleSourceColumnChange = (index: number, value: string, tableName: string, rows: any[], setRows: any) => {
    const newRows = [...rows];
    newRows[index].source = value;
    setRows(newRows);
    setHasChanges((prev) => ({ ...prev, [tableName]: true }));
  };

  const handleSourceTypeChange = (tableName: string, value: string) => {
    setSourceType((prev) => ({ ...prev, [tableName]: value }));
    setError((prev) => ({ ...prev, [tableName]: "" }));
  };

  const handleSaveMapping = async (tableName: string) => {
    if (!sourceType[tableName]) {
      setError((prev) => ({ ...prev, [tableName]: "Please select a source type before saving." }));
      return;
    }

    if (!hasChanges[tableName]) {
      setError((prev) => ({ ...prev, [tableName]: "No changes to save." }));
      return;
    }

    setLoading((prev) => ({ ...prev, [tableName]: true }));
    setError((prev) => ({ ...prev, [tableName]: "" }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Saved mapping for ${tableName}:`, sourceColumns);
      setShowSuccess((prev) => ({ ...prev, [tableName]: true }));
      setEditMode((prev) => ({ ...prev, [tableName]: false }));
      setHasChanges((prev) => ({ ...prev, [tableName]: false }));
      
      setTimeout(() => {
        setShowSuccess((prev) => ({ ...prev, [tableName]: false }));
      }, 3000);
    } catch (error) {
      setError((prev) => ({ ...prev, [tableName]: "Failed to save mapping rule. Please try again." }));
    } finally {
      setLoading((prev) => ({ ...prev, [tableName]: false }));
    }
  };

  const handleEdit = (tableName: string) => {
    if (!sourceType[tableName]) {
      setError((prev) => ({ ...prev, [tableName]: "Please select a source type before editing." }));
      return;
    }
    setEditMode((prev) => ({ ...prev, [tableName]: true }));
    setError((prev) => ({ ...prev, [tableName]: "" }));
  };

  const swapRows = (rows: any[], setRows: any, index1: number, index2: number) => {
    const newRows = [...rows];
    const temp = newRows[index1].destination;
    newRows[index1].destination = newRows[index2].destination;
    newRows[index2].destination = temp;

    const tempSource = newRows[index1].source;
    newRows[index1].source = newRows[index2].source;
    newRows[index2].source = tempSource;

    setRows(newRows);
  };

  const renderMappingTable = (
    tableName: string,
    rows: any[],
    setRows: any,
    gradientColors: string
  ) => (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
    >
      <div className={`h-2 bg-gradient-to-r ${gradientColors}`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover="hover"
            variants={iconVariants}
            className="p-2 rounded-lg bg-blue-50"
          >
            <Upload className="w-6 h-6 text-blue-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">{tableName}</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Source Type
          </label>
          <select
            value={sourceType[tableName] || ""}
            onChange={(e) => handleSourceTypeChange(tableName, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Source Type</option>
            <option value="csv">CSV Upload</option>
            <option value="powerbi">Power BI</option>
            <option value="d365">D365</option>
            <option value="azure">Azure</option>
          </select>
        </div>

        <AnimatePresence mode="wait">
          {error[tableName] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error[tableName]}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50/50">
                <th className="p-3 text-left text-gray-700">Columns</th>
                <th className="p-3 text-left text-gray-700">Source Table</th>
                <th className="p-3 text-left text-gray-700">Destination Table</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-blue-100 hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td className="p-3 text-gray-700">{row.column}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <motion.input
                        type="text"
                        value={row.source}
                        onChange={(e) => handleSourceColumnChange(index, e.target.value, tableName, rows, setRows)}
                        onFocus={() => setFocusedField(`source-${index}`)}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter source column"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={!editMode[tableName]}
                        animate={
                          focusedField === `source-${index}`
                            ? { scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }
                            : { scale: 1, boxShadow: "none" }
                        }
                        transition={{ duration: 0.2 }}
                      />
                      {editMode[tableName] && index > 0 && (
                        <button
                          onClick={() => swapRows(rows, setRows, index, index - 1)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        >
                          ↑
                        </button>
                      )}
                      {editMode[tableName] && index < rows.length - 1 && (
                        <button
                          onClick={() => swapRows(rows, setRows, index, index + 1)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-700 relative group">
                    <div className="flex items-center gap-2">
                      <span>{row.destination}</span>
                      {editMode[tableName] && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              onClick={() => swapRows(rows, setRows, index, index - 1)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            >
                              ↑
                            </button>
                          )}
                          {index < rows.length - 1 && (
                            <button
                              onClick={() => swapRows(rows, setRows, index, index + 1)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            >
                              ↓
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-end mt-4 gap-2">
            <motion.button
              onClick={() => handleEdit(tableName)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={loading[tableName]}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleSaveMapping(tableName)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={loading[tableName] || !editMode[tableName] || !hasChanges[tableName]}
            >
              {loading[tableName] ? (
                <motion.span 
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </motion.span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Mapping Rule
                </>
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showSuccess[tableName] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 bg-green-50 text-green-800 rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p>Mapping rule saved successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );

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
            Configure your data mapping rules for seamless integration
          </motion.p>
        </div>

        {renderMappingTable(
          "Item Upload",
          itemRows,
          setItemRows,
          "from-blue-500 to-purple-600"
        )}

        {renderMappingTable(
          "Customer Serial Upload",
          customerSerialRows,
          setCustomerSerialRows,
          "from-green-500 to-teal-600"
        )}

        {renderMappingTable(
          "Returns Upload",
          returnsRows,
          setReturnsRows,
          "from-amber-500 to-orange-600"
        )}
      </motion.div>
    </motion.div>
  );
};

export default MappingRules;