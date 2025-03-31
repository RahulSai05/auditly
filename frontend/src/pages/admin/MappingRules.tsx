// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Table, Upload, Save, Edit, Loader2, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";

// interface TableData {
//   name: string;
// }

// interface ColumnData {
//   table_name: string;
//   columns: string[];
// }

// interface MappingData {
//   id: string;
//   source: string;
//   destination: string;
// }

// interface PowerBIDataForm {
//   workspace_id: string;
//   dataset_id: string;
//   table_name: string;
// }

// const MappingRules: React.FC = () => {
//   const [tables, setTables] = useState<TableData[]>([
//     { name: "item" },
//     { name: "customer_item_data" }
//   ]);
//   const [selectedTable, setSelectedTable] = useState<string>("");
//   const [columns, setColumns] = useState<string[]>([]);
//   const [mappingRows, setMappingRows] = useState<MappingData[]>([]);
//   const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
//   const [isLoading, setIsLoading] = useState({
//     tables: false,
//     columns: false,
//     saving: false,
//     fetchingPowerBI: false
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [showPowerBIForm, setShowPowerBIForm] = useState(false);
//   const [powerBIData, setPowerBIData] = useState<PowerBIDataForm>({
//     workspace_id: "",
//     dataset_id: "",
//     table_name: "",
//   });

//   // Get user ID from localStorage on component mount
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId));
//     } else {
//       setNotification({ type: 'error', message: "User not authenticated. Please login again." });
//     }
//   }, []);

//   // Fetch columns when a table is selected
//   useEffect(() => {
//     if (!selectedTable) return;
    
//     const fetchColumns = async () => {
//       setIsLoading(prev => ({...prev, columns: true}));
//       setNotification({ type: '', message: '' });
//       try {
//         const response = await axios.get(`https://auditlyai.com/api/columns/${selectedTable}`);
//         const data: ColumnData = response.data;
//         setColumns(data.columns);
        
//         setMappingRows(data.columns.map((col, index) => ({
//           id: `row-${index}`,
//           source: col,
//           destination: ""
//         })));
//       } catch (error) {
//         setNotification({ type: 'error', message: "Failed to fetch columns for the selected table." });
//       } finally {
//         setIsLoading(prev => ({...prev, columns: false}));
//       }
//     };
    
//     fetchColumns();
//   }, [selectedTable]);

//   const handleDestinationChange = (index: number, value: string) => {
//     const newRows = [...mappingRows];
//     newRows[index].destination = value;
//     setMappingRows(newRows);
//   };

//   const handleSaveMapping = async () => {
//     if (!selectedTable) {
//       setNotification({ type: 'error', message: "Please select a table first." });
//       return;
//     }

//     if (!userId) {
//       setNotification({ type: 'error', message: "User not authenticated. Please login again." });
//       return;
//     }

//     setIsLoading(prev => ({...prev, saving: true}));
//     setNotification({ type: '', message: '' });

//     try {
//       // Convert mappingRows to the required format {"source": "destination"}
//       const mappingObject = mappingRows.reduce((acc, row) => {
//         if (row.destination) {
//           acc[row.source] = row.destination;
//         }
//         return acc;
//       }, {} as Record<string, string>);

//       // Call your API endpoint with the required data
//       await axios.post("https://auditlyai.com/api/power-bi-sql-mapping/", {
//         table_name: selectedTable,
//         mapping: mappingObject,
//         user_id: userId
//       });

//       setNotification({ type: 'success', message: "Mapping saved successfully!" });
//       setEditMode(false);
      
//       setTimeout(() => {
//         setNotification({ type: '', message: '' });
//       }, 3000);
//     } catch (error) {
//       setNotification({ type: 'error', message: "Failed to save mapping. Please try again." });
//     } finally {
//       setIsLoading(prev => ({...prev, saving: false}));
//     }
//   };

//   const handleEdit = () => {
//     if (!selectedTable) {
//       setNotification({ type: 'error', message: "Please select a table first." });
//       return;
//     }
//     setEditMode(true);
//   };

//   const handlePowerBIInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPowerBIData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFetchPowerBIData = async () => {
//     if (!userId) {
//       setNotification({ type: 'error', message: "User not authenticated. Please login again." });
//       return;
//     }

//     if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name) {
//       setNotification({ type: 'error', message: "Please fill all required fields." });
//       return;
//     }

//     setIsLoading(prev => ({...prev, fetchingPowerBI: true}));
//     setNotification({ type: '', message: '' });

//     try {
//       const response = await axios.post("https://auditlyai.com/api/powerbi/get-table-data", {
//         ...powerBIData,
//         user_id: userId
//       });

//       if (response.data?.data === "Mapping Missmatch") {
//         setNotification({ type: 'error', message: "Mapping mismatch detected. Please check your Power BI field mappings." });
//       } else {
//         setNotification({ type: 'success', message: "Power BI data Synced successfully!" });
//       }
//     } catch (error) {
//       setNotification({ type: 'error', message: "Failed to fetch Sync BI data. Please try again." });
//     } finally {
//       setIsLoading(prev => ({...prev, fetchingPowerBI: false}));
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
//             <Table className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             Data Mapping Rules
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Map your database columns to Power BI fields
//           </motion.p>
//         </motion.div>

//         {/* Power BI Data Fetch Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Sync Power BI Data</h2>
//             <button
//               onClick={() => setShowPowerBIForm(!showPowerBIForm)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
//             >
//               {showPowerBIForm ? "Hide Form" : "Show Form"}
//             </button>
//           </div>

//           {showPowerBIForm && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="space-y-4"
//             >
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Workspace ID *
//                 </label>
//                 <input
//                   type="text"
//                   name="workspace_id"
//                   value={powerBIData.workspace_id}
//                   onChange={handlePowerBIInputChange}
//                   className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                   placeholder="Enter Power BI Workspace ID"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Dataset ID *
//                 </label>
//                 <input
//                   type="text"
//                   name="dataset_id"
//                   value={powerBIData.dataset_id}
//                   onChange={handlePowerBIInputChange}
//                   className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                   placeholder="Enter Power BI Dataset ID"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Table Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="table_name"
//                   value={powerBIData.table_name}
//                   onChange={handlePowerBIInputChange}
//                   className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                   placeholder="Enter Power BI Table Name"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleFetchPowerBIData}
//                   disabled={isLoading.fetchingPowerBI}
//                   className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                     isLoading.fetchingPowerBI
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   {isLoading.fetchingPowerBI ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <Save className="w-5 h-5" />
//                   )}
//                   Sync Power BI Data
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Table Mapping Section */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
//         >
//           <div className="flex items-center gap-3 mb-6">
//             <motion.div
//               whileHover={{ scale: 1.1, rotate: 10 }}
//               className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//             >
//               <Upload className="w-6 h-6 text-blue-600" />
//             </motion.div>
//             <h2 className="text-xl font-bold text-gray-800">Table Mapping</h2>
//           </div>

//           <div className="space-y-6">
//             {/* Table Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Database Table
//               </label>
//               <div className="relative">
//                 <select
//                   value={selectedTable}
//                   onChange={(e) => {
//                     setSelectedTable(e.target.value);
//                     setEditMode(false);
//                   }}
//                   className="w-full p-3 pr-10 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 appearance-none bg-white"
//                   disabled={isLoading.tables || isLoading.columns}
//                 >
//                   <option value="">Select a Table</option>
//                   {tables.map((table) => (
//                     <option key={table.name} value={table.name}>
//                       {table.name}
//                     </option>
//                   ))}
//                 </select>
//                 <ArrowRight className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transform rotate-90" />
//               </div>
//             </div>

//             {/* Loading State */}
//             {isLoading.columns && (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//               </div>
//             )}

//             {/* Mapping Table */}
//             {columns.length > 0 && !isLoading.columns && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="border border-blue-100 rounded-xl overflow-hidden">
//                   <div className="max-h-96 overflow-y-auto">
//                     <table className="w-full">
//                       <thead className="bg-blue-50/50 sticky top-0">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Database Column</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Power BI Field</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-blue-50">
//                         {mappingRows.map((row, index) => (
//                           <motion.tr
//                             key={row.id}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.2, delay: index * 0.05 }}
//                             className="hover:bg-blue-50/50 transition-colors duration-200"
//                           >
//                             <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.source}</td>
//                             <td className="px-4 py-3 text-sm">
//                               <div className="relative">
//                                 <input
//                                   type="text"
//                                   value={row.destination}
//                                   onChange={(e) => handleDestinationChange(index, e.target.value)}
//                                   placeholder={editMode ? "Enter Power BI field" : "Not mapped"}
//                                   className={`w-full p-2 rounded-lg transition-all duration-200 ${
//                                     editMode 
//                                       ? 'border-2 border-blue-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300' 
//                                       : 'border border-transparent bg-transparent'
//                                   }`}
//                                   disabled={!editMode}
//                                 />
//                                 {row.destination && editMode && (
//                                   <button
//                                     onClick={() => handleDestinationChange(index, '')}
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-full"
//                                   >
//                                     <X className="w-4 h-4 text-gray-400" />
//                                   </button>
//                                 )}
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-4 gap-2">
//                   {!editMode ? (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleEdit}
//                       className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                         isLoading.saving || !selectedTable || !userId
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-blue-600 text-white hover:bg-blue-700'
//                       }`}
//                       disabled={isLoading.saving || !selectedTable || !userId}
//                     >
//                       <Edit className="w-5 h-5" />
//                       Edit Mappings
//                     </motion.button>
//                   ) : (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleSaveMapping}
//                       className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                         isLoading.saving
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-green-600 text-white hover:bg-green-700'
//                       }`}
//                       disabled={isLoading.saving}
//                     >
//                       {isLoading.saving ? (
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                       ) : (
//                         <Save className="w-5 h-5" />
//                       )}
//                       Save Mappings
//                     </motion.button>
//                   )}
//                 </div>
//               </motion.div>
//             )}

//             {/* Empty State */}
//             {!isLoading.columns && !columns.length && selectedTable && (
//               <div className="text-center py-8 text-gray-500">
//                 No columns found for the selected table.
//               </div>
//             )}

//             {/* Initial State */}
//             {!selectedTable && !isLoading.columns && (
//               <div className="text-center py-8 text-gray-500">
//                 Please select a table to view its columns and configure mappings.
//               </div>
//             )}
//           </div>
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

// export default MappingRules;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Table, Upload, Save, Edit, Loader2, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";

interface TableData {
  name: string;
}

interface ColumnData {
  table_name: string;
  columns: string[];
}

interface MappingData {
  id: string;
  source: string;
  destination: string;
}

interface PowerBIDataForm {
  workspace_id: string;
  dataset_id: string;
  table_name: string;
}

const MappingRules: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([
    { name: "item" },
    { name: "customer_item_data" }
  ]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [mappingRows, setMappingRows] = useState<MappingData[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState({
    tables: false,
    columns: false,
    saving: false,
    fetchingPowerBI: false
  });
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [showPowerBIForm, setShowPowerBIForm] = useState(false);
  const [powerBIData, setPowerBIData] = useState<PowerBIDataForm>({
    workspace_id: "",
    dataset_id: "",
    table_name: ""
  });

  // Get user ID from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      setNotification({ type: 'error', message: "User not authenticated. Please login again." });
    }
  }, []);

  // Fetch columns when a table is selected
  useEffect(() => {
    if (!selectedTable) return;
    
    const fetchColumns = async () => {
      setIsLoading(prev => ({...prev, columns: true}));
      setNotification({ type: '', message: '' });
      try {
        const response = await axios.get(`https://auditlyai.com/api/columns/${selectedTable}`);
        const data: ColumnData = response.data;
        setColumns(data.columns);
        
        setMappingRows(data.columns.map((col, index) => ({
          id: `row-${index}`,
          source: col,
          destination: ""
        })));
      } catch (error) {
        setNotification({ type: 'error', message: "Failed to fetch columns for the selected table." });
      } finally {
        setIsLoading(prev => ({...prev, columns: false}));
      }
    };
    
    fetchColumns();
  }, [selectedTable]);

  const handleDestinationChange = (index: number, value: string) => {
    const newRows = [...mappingRows];
    newRows[index].destination = value;
    setMappingRows(newRows);
  };

  const handleSaveMapping = async () => {
    if (!selectedTable) {
      setNotification({ type: 'error', message: "Please select a table first." });
      return;
    }

    if (!userId) {
      setNotification({ type: 'error', message: "User not authenticated. Please login again." });
      return;
    }

    setIsLoading(prev => ({...prev, saving: true}));
    setNotification({ type: '', message: '' });

    try {
      // Convert mappingRows to the required format {"source": "destination"}
      const mappingObject = mappingRows.reduce((acc, row) => {
        if (row.destination) {
          acc[row.source] = row.destination;
        }
        return acc;
      }, {} as Record<string, string>);

      // Call your API endpoint with the required data
      await axios.post("https://auditlyai.com/api/power-bi-sql-mapping/", {
        table_name: selectedTable,
        mapping: mappingObject,
        user_id: userId
      });

      setNotification({ type: 'success', message: "Mapping saved successfully!" });
      setEditMode(false);
      
      setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      setNotification({ type: 'error', message: "Failed to save mapping. Please try again." });
    } finally {
      setIsLoading(prev => ({...prev, saving: false}));
    }
  };

  const handleEdit = () => {
    if (!selectedTable) {
      setNotification({ type: 'error', message: "Please select a table first." });
      return;
    }
    setEditMode(true);
  };

  const handlePowerBIInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPowerBIData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFetchPowerBIData = async () => {
    if (!userId) {
      setNotification({ type: 'error', message: "User not authenticated. Please login again." });
      return;
    }

    if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name) {
      setNotification({ type: 'error', message: "Please fill all required fields." });
      return;
    }

    setIsLoading(prev => ({...prev, fetchingPowerBI: true}));
    setNotification({ type: '', message: '' });

    try {
      const response = await axios.post("https://auditlyai.com/api/powerbi/get-table-data", {
        ...powerBIData,
        user_id: userId,
        access_token: "" // Always sending empty string for access token
      });

      if (response.data?.data === "Mapping Missmatch") {
        setNotification({ type: 'error', message: "Mapping mismatch detected. Please check your Power BI field mappings." });
      } else {
        setNotification({ type: 'success', message: "Power BI data Synced successfully!" });
      }
    } catch (error) {
      setNotification({ type: 'error', message: "Failed to Sync Power BI data. Please try again." });
    } finally {
      setIsLoading(prev => ({...prev, fetchingPowerBI: false}));
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
            <Table className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Data Mapping Rules
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Map your database columns to Power BI fields
          </motion.p>
        </motion.div>

        {/* Table Mapping Section (Moved to top) */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
            >
              <Upload className="w-6 h-6 text-blue-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-800">Table Mapping</h2>
          </div>

          <div className="space-y-6">
            {/* Table Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Database Table
              </label>
              <div className="relative">
                <select
                  value={selectedTable}
                  onChange={(e) => {
                    setSelectedTable(e.target.value);
                    setEditMode(false);
                  }}
                  className="w-full p-3 pr-10 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 appearance-none bg-white"
                  disabled={isLoading.tables || isLoading.columns}
                >
                  <option value="">Select a Table</option>
                  {tables.map((table) => (
                    <option key={table.name} value={table.name}>
                      {table.name}
                    </option>
                  ))}
                </select>
                <ArrowRight className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transform rotate-90" />
              </div>
            </div>

            {/* Loading State */}
            {isLoading.columns && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            )}

            {/* Mapping Table */}
            {columns.length > 0 && !isLoading.columns && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border border-blue-100 rounded-xl overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Database Column</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Power BI Field</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {mappingRows.map((row, index) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="hover:bg-blue-50/50 transition-colors duration-200"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.source}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={row.destination}
                                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                                  placeholder={editMode ? "Enter Power BI field" : "Not mapped"}
                                  className={`w-full p-2 rounded-lg transition-all duration-200 ${
                                    editMode 
                                      ? 'border-2 border-blue-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300' 
                                      : 'border border-transparent bg-transparent'
                                  }`}
                                  disabled={!editMode}
                                />
                                {row.destination && editMode && (
                                  <button
                                    onClick={() => handleDestinationChange(index, '')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-full"
                                  >
                                    <X className="w-4 h-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                  {!editMode ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                        isLoading.saving || !selectedTable || !userId
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={isLoading.saving || !selectedTable || !userId}
                    >
                      <Edit className="w-5 h-5" />
                      Edit Mappings
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveMapping}
                      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                        isLoading.saving
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      disabled={isLoading.saving}
                    >
                      {isLoading.saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      Save Mappings
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading.columns && !columns.length && selectedTable && (
              <div className="text-center py-8 text-gray-500">
                No columns found for the selected table.
              </div>
            )}

            {/* Initial State */}
            {!selectedTable && !isLoading.columns && (
              <div className="text-center py-8 text-gray-500">
                Please select a table to view its columns and configure mappings.
              </div>
            )}
          </div>
        </motion.div>

        {/* Power BI Data Fetch Section (Moved below) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Sync Power BI Data</h2>
            <button
              onClick={() => setShowPowerBIForm(!showPowerBIForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {showPowerBIForm ? "Hide Form" : "Show Form"}
            </button>
          </div>

          {showPowerBIForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace ID *
                </label>
                <input
                  type="text"
                  name="workspace_id"
                  value={powerBIData.workspace_id}
                  onChange={handlePowerBIInputChange}
                  className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  placeholder="Enter Power BI Workspace ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset ID *
                </label>
                <input
                  type="text"
                  name="dataset_id"
                  value={powerBIData.dataset_id}
                  onChange={handlePowerBIInputChange}
                  className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  placeholder="Enter Power BI Dataset ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name *
                </label>
                <input
                  type="text"
                  name="table_name"
                  value={powerBIData.table_name}
                  onChange={handlePowerBIInputChange}
                  className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  placeholder="Enter Power BI Table Name"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetchPowerBIData}
                  disabled={isLoading.fetchingPowerBI}
                  className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                    isLoading.fetchingPowerBI
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isLoading.fetchingPowerBI ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Sync Power BI Data
                </motion.button>
              </div>
            </motion.div>
          )}
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

export default MappingRules;
