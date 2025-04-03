// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Table, Upload, Save, Edit, Loader2, CheckCircle2, AlertCircle, ArrowRight, X, RefreshCw } from "lucide-react";

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
//   date_filter_column: string;
//   date_filter_value: string;
// }

// interface DatasetOption {
//   id: string;
//   name: string;
// }

// interface PowerBIColumnMapping {
//   [key: string]: string;
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
//     fetchingPowerBI: false,
//     fetchingDatasets: false,
//     fetchingPowerBIColumns: false
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [showPowerBIForm, setShowPowerBIForm] = useState(false);
//   const [powerBIData, setPowerBIData] = useState<PowerBIDataForm>({
//     workspace_id: "",
//     dataset_id: "",
//     table_name: "",
//     date_filter_column: "",
//     date_filter_value: ""
//   });
//   const [datasets, setDatasets] = useState<DatasetOption[]>([]);
//   const [powerBIColumns, setPowerBIColumns] = useState<string[]>([]);
//   const [powerBIColumnMappings, setPowerBIColumnMappings] = useState<PowerBIColumnMapping>({});
//   const [isSyncing, setIsSyncing] = useState(false);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId));
//     } else {
//       setNotification({ type: 'error', message: "User not authenticated. Please login again." });
//     }
//   }, []);

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

//     if (!powerBIData.date_filter_column || !powerBIData.date_filter_value) {
//       setNotification({ type: 'error', message: "Please select a date filter column and value." });
//       return;
//     }

//     setIsLoading(prev => ({...prev, saving: true}));
//     setNotification({ type: '', message: '' });

//     try {
//       const mappingObject = mappingRows.reduce((acc, row) => {
//         if (row.destination) {
//           acc[row.source] = row.destination;
//         }
//         return acc;
//       }, {} as Record<string, string>);

//       await axios.post("https://auditlyai.com/api/power-bi-sql-mapping/", {
//         sql_table_name: selectedTable,
//         bi_table_name: powerBIData.table_name,
//         date_filter_column_name: powerBIData.date_filter_column,
//         mapping: mappingObject,
//         user_id: userId,
//         date_filter_value: powerBIData.date_filter_value
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

//   const handlePowerBIInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setPowerBIData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFetchDatasets = async () => {
//     if (!powerBIData.workspace_id) {
//       setNotification({ type: 'error', message: "Please enter a workspace ID." });
//       return;
//     }

//     setIsLoading(prev => ({...prev, fetchingDatasets: true}));
//     setNotification({ type: '', message: '' });

//     try {
//       const response = await axios.get(`https://auditlyai.com/api/get-powerbi-dataset-ids?workspace_id=${powerBIData.workspace_id}`);
//       setDatasets(response.data.dataset_ids.map((id: string) => ({ id, name: id })));
//       setNotification({ type: 'success', message: "Datasets fetched successfully!" });
//     } catch (error) {
//       setNotification({ type: 'error', message: "Failed to fetch datasets. Please check the workspace ID." });
//     } finally {
//       setIsLoading(prev => ({...prev, fetchingDatasets: false}));
//     }
//   };

//   const handleFetchPowerBIColumns = async () => {
//     if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name) {
//       setNotification({ type: 'error', message: "Please fill all required fields." });
//       return;
//     }

//     setIsLoading(prev => ({...prev, fetchingPowerBIColumns: true}));
//     setNotification({ type: '', message: '' });

//     try {
//       const response = await axios.post("https://auditlyai.com/api/powerbi/get-powerbi-table-columns", {
//         workspace_id: powerBIData.workspace_id,
//         dataset_id: powerBIData.dataset_id,
//         power_bi_table_name: powerBIData.table_name
//       });

//       const columnMappings = response.data;
//       setPowerBIColumnMappings(columnMappings);
      
//       const actualColumnNames = Object.values(columnMappings);
//       setPowerBIColumns(actualColumnNames);
      
//       const autoMappedRows = mappingRows.map(row => {
//         const matchingEntry = Object.entries(columnMappings).find(([_, actualName]) => 
//           actualName.toLowerCase() === row.source.toLowerCase()
//         );
        
//         return {
//           ...row,
//           destination: matchingEntry ? columnMappings[matchingEntry[0]] : ""
//         };
//       });
      
//       setMappingRows(autoMappedRows);
      
//       setNotification({ type: 'success', message: "Power BI columns fetched successfully!" });
//     } catch (error) {
//       setNotification({ type: 'error', message: "Failed to fetch Power BI columns. Please try again." });
//     } finally {
//       setIsLoading(prev => ({...prev, fetchingPowerBIColumns: false}));
//     }
//   };

//   const handleSyncToPowerBI = async () => {
//     if (!userId) {
//       setNotification({ type: 'error', message: "User not authenticated. Please login again." });
//       return;
//     }

//     if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable) {
//       setNotification({ type: 'error', message: "Please complete all Power BI configuration steps first." });
//       return;
//     }

//     setIsSyncing(true);
//     setNotification({ type: '', message: '' });

//     try {
//       const response = await axios.post("https://auditlyai.com/api/powerbi/get-table-data", {
//         workspace_id: powerBIData.workspace_id,
//         dataset_id: powerBIData.dataset_id,
//         sql_table_name: selectedTable,
//         user_id: userId,
//         power_bi_table_name: powerBIData.table_name
//       });

//       setNotification({ type: 'success', message: "Data synced to Power BI successfully!" });
//     } catch (error) {
//       setNotification({ type: 'error', message: "Failed to sync data to Power BI. Please try again." });
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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

//         <motion.div
//           initial="hidden"
//           animate="visible"
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 10 }}
//                 className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//               >
//                 <Upload className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <h2 className="text-xl font-bold text-gray-800">Table Mapping</h2>
//             </div>
//             <button
//               onClick={handleSyncToPowerBI}
//               disabled={isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable}
//               className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                 isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-purple-600 text-white hover:bg-purple-700'
//               }`}
//             >
//               {isSyncing ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-5 h-5" />
//               )}
//               Sync Data to Power BI
//             </button>
//           </div>

//           <div className="space-y-6">
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

//             {isLoading.columns && (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//               </div>
//             )}

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
//                                 <select
//                                   value={row.destination}
//                                   onChange={(e) => handleDestinationChange(index, e.target.value)}
//                                   className={`w-full p-2 rounded-lg transition-all duration-200 ${
//                                     editMode 
//                                       ? 'border-2 border-blue-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300' 
//                                       : 'border border-transparent bg-transparent'
//                                   }`}
//                                   disabled={!editMode}
//                                 >
//                                   <option value="">Select Power BI Field</option>
//                                   {powerBIColumns.map((column) => (
//                                     <option key={column} value={column}>
//                                       {column}
//                                     </option>
//                                   ))}
//                                 </select>
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

//                 {powerBIColumns.length > 0 && (
//                   <div className="mt-6 space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Date Filter Column
//                       </label>
//                       <select
//                         name="date_filter_column"
//                         value={powerBIData.date_filter_column}
//                         onChange={handlePowerBIInputChange}
//                         className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                       >
//                         <option value="">Select a column for date filtering</option>
//                         {powerBIColumns.map((column) => (
//                           <option key={column} value={column}>
//                             {column}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Date Filter Value (dd-mm-yyyy)
//                       </label>
//                       <input
//                         type="text"
//                         name="date_filter_value"
//                         value={powerBIData.date_filter_value}
//                         onChange={handlePowerBIInputChange}
//                         placeholder="Enter date in dd-mm-yyyy format"
//                         className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                 )}

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

//             {!isLoading.columns && !columns.length && selectedTable && (
//               <div className="text-center py-8 text-gray-500">
//                 No columns found for the selected table.
//               </div>
//             )}

//             {!selectedTable && !isLoading.columns && (
//               <div className="text-center py-8 text-gray-500">
//                 Please select a table to view its columns and configure mappings.
//               </div>
//             )}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Power BI Configuration</h2>
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
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     name="workspace_id"
//                     value={powerBIData.workspace_id}
//                     onChange={handlePowerBIInputChange}
//                     className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                     placeholder="Enter Power BI Workspace ID"
//                   />
//                   <button
//                     onClick={handleFetchDatasets}
//                     disabled={isLoading.fetchingDatasets}
//                     className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                       isLoading.fetchingDatasets
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {isLoading.fetchingDatasets ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       "Fetch Datasets"
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {datasets.length > 0 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Dataset *
//                   </label>
//                   <select
//                     name="dataset_id"
//                     value={powerBIData.dataset_id}
//                     onChange={handlePowerBIInputChange}
//                     className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                   >
//                     <option value="">Select a Dataset</option>
//                     {datasets.map((dataset) => (
//                       <option key={dataset.id} value={dataset.id}>
//                         {dataset.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Power BI Table Name *
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     name="table_name"
//                     value={powerBIData.table_name}
//                     onChange={handlePowerBIInputChange}
//                     className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                     placeholder="Enter Power BI Table Name"
//                   />
//                   <button
//                     onClick={handleFetchPowerBIColumns}
//                     disabled={isLoading.fetchingPowerBIColumns}
//                     className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                       isLoading.fetchingPowerBIColumns
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {isLoading.fetchingPowerBIColumns ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       "Fetch Columns"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>

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
import { 
  Table, 
  Upload, 
  Save, 
  Edit, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  X, 
  RefreshCw,
  Settings,
  Database,
  Link
} from "lucide-react";

interface PowerBIData {
  workspace_id: string;
  dataset_id: string;
  table_name: string;
  date_filter_column: string;
  date_filter_value: string;
}

interface MappingRow {
  id: string;
  source: string;
  destination: string;
}

interface LoadingState {
  tables: boolean;
  columns: boolean;
  fetchingDatasets: boolean;
  fetchingPowerBIColumns: boolean;
  saving: boolean;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface Table {
  name: string;
}

const MappingRules: React.FC = () => {
  const [powerBIData, setPowerBIData] = useState<PowerBIData>({
    workspace_id: '',
    dataset_id: '',
    table_name: '',
    date_filter_column: '',
    date_filter_value: ''
  });
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [powerBIColumns, setPowerBIColumns] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<Array<{ id: string; name: string }>>([]);
  const [mappingRows, setMappingRows] = useState<MappingRow[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    tables: false,
    columns: false,
    fetchingDatasets: false,
    fetchingPowerBIColumns: false,
    saving: false
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<Notification>({ type: 'success', message: '' });

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(prev => ({ ...prev, tables: true }));
      try {
        const response = await axios.get('/api/tables');
        // Ensure the response data is properly typed and formatted
        const tableData: Table[] = Array.isArray(response.data) 
          ? response.data 
          : response.data.tables || [];
        setTables(tableData);
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to fetch tables' });
        // Initialize with empty array on error
        setTables([]);
      }
      setIsLoading(prev => ({ ...prev, tables: false }));
    };

    fetchTables();
  }, []);

  const handlePowerBIInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPowerBIData(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchDatasets = async () => {
    setIsLoading(prev => ({ ...prev, fetchingDatasets: true }));
    try {
      const response = await axios.get(`/api/powerbi/datasets/${powerBIData.workspace_id}`);
      setDatasets(response.data);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch datasets' });
    }
    setIsLoading(prev => ({ ...prev, fetchingDatasets: false }));
  };

  const handleFetchPowerBIColumns = async () => {
    setIsLoading(prev => ({ ...prev, fetchingPowerBIColumns: true }));
    try {
      const response = await axios.get(`/api/powerbi/columns/${powerBIData.dataset_id}/${powerBIData.table_name}`);
      setPowerBIColumns(response.data);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch Power BI columns' });
    }
    setIsLoading(prev => ({ ...prev, fetchingPowerBIColumns: false }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newMappingRows = [...mappingRows];
    newMappingRows[index].destination = value;
    setMappingRows(newMappingRows);
  };

  const handleSaveMapping = async () => {
    setIsLoading(prev => ({ ...prev, saving: true }));
    try {
      await axios.post('/api/mapping/save', {
        table: selectedTable,
        mappings: mappingRows,
        powerBIConfig: powerBIData
      });
      setNotification({ type: 'success', message: 'Mappings saved successfully' });
      setEditMode(false);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save mappings' });
    }
    setIsLoading(prev => ({ ...prev, saving: false }));
  };

  const handleSyncToPowerBI = async () => {
    setIsSyncing(true);
    try {
      await axios.post('/api/powerbi/sync', {
        table: selectedTable,
        powerBIConfig: powerBIData
      });
      setNotification({ type: 'success', message: 'Data synced to Power BI successfully' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to sync data to Power BI' });
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    const fetchColumns = async () => {
      if (!selectedTable) return;
      
      setIsLoading(prev => ({ ...prev, columns: true }));
      try {
        const response = await axios.get(`/api/columns/${selectedTable}`);
        setColumns(response.data);
        setMappingRows(response.data.map((column: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          source: column,
          destination: ''
        })));
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to fetch columns' });
      }
      setIsLoading(prev => ({ ...prev, columns: false }));
    };

    fetchColumns();
  }, [selectedTable]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: 'success', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <Link className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Power BI Data Mapping
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Connect and synchronize your database with Power BI
          </motion.p>
        </motion.div>

        {/* Power BI Configuration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-purple-100 p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Power BI Configuration</h2>
              <p className="text-sm text-gray-500">Set up your Power BI workspace and dataset</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="workspace_id"
                    value={powerBIData.workspace_id}
                    onChange={handlePowerBIInputChange}
                    className="w-full p-3 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all duration-200"
                    placeholder="Enter Power BI Workspace ID"
                  />
                  <button
                    onClick={handleFetchDatasets}
                    disabled={isLoading.fetchingDatasets}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                      isLoading.fetchingDatasets
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isLoading.fetchingDatasets ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Fetch"
                    )}
                  </button>
                </div>
              </div>

              {datasets.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dataset *
                  </label>
                  <select
                    name="dataset_id"
                    value={powerBIData.dataset_id}
                    onChange={handlePowerBIInputChange}
                    className="w-full p-3 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all duration-200"
                  >
                    <option value="">Select a Dataset</option>
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power BI Table Name *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="table_name"
                    value={powerBIData.table_name}
                    onChange={handlePowerBIInputChange}
                    className="w-full p-3 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all duration-200"
                    placeholder="Enter Power BI Table Name"
                  />
                  <button
                    onClick={handleFetchPowerBIColumns}
                    disabled={isLoading.fetchingPowerBIColumns}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                      isLoading.fetchingPowerBIColumns
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isLoading.fetchingPowerBIColumns ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Fetch"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database Mapping Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Database Mapping</h2>
              <p className="text-sm text-gray-500">Map your database columns to Power BI fields</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-full max-w-xs">
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

              {selectedTable && !editMode && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Mappings
                </motion.button>
              )}
            </div>

            {isLoading.columns && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            )}

            {columns.length > 0 && !isLoading.columns && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="border border-blue-100 rounded-xl overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Database Column</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Power BI Field</th>
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
                                <select
                                  value={row.destination}
                                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                                  className={`w-full p-2 rounded-lg transition-all duration-200 ${
                                    editMode 
                                      ? 'border-2 border-purple-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300' 
                                      : 'border border-transparent bg-transparent'
                                  }`}
                                  disabled={!editMode}
                                >
                                  <option value="">Select Power BI Field</option>
                                  {powerBIColumns.map((column) => (
                                    <option key={column} value={column}>
                                      {column}
                                    </option>
                                  ))}
                                </select>
                                {row.destination && editMode && (
                                  <button
                                    onClick={() => handleDestinationChange(index, '')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-100 rounded-full"
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

                {powerBIColumns.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Filter Column
                      </label>
                      <select
                        name="date_filter_column"
                        value={powerBIData.date_filter_column}
                        onChange={handlePowerBIInputChange}
                        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                      >
                        <option value="">Select a column for date filtering</option>
                        {powerBIColumns.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Filter Value
                      </label>
                      <input
                        type="text"
                        name="date_filter_value"
                        value={powerBIData.date_filter_value}
                        onChange={handlePowerBIInputChange}
                        placeholder="Enter date in dd-mm-yyyy format"
                        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {editMode && (
                  <div className="flex justify-end mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveMapping}
                      className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
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
                  </div>
                )}
              </motion.div>
            )}

            {!isLoading.columns && !columns.length && selectedTable && (
              <div className="text-center py-8 text-gray-500">
                No columns found for the selected table.
              </div>
            )}

            {!selectedTable && !isLoading.columns && (
              <div className="text-center py-8 text-gray-500">
                Please select a table to view its columns and configure mappings.
              </div>
            )}
          </div>
        </motion.div>

        {/* Sync Button */}
        {selectedTable && powerBIData.workspace_id && powerBIData.dataset_id && powerBIData.table_name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleSyncToPowerBI}
              disabled={isSyncing}
              className={`px-8 py-3 rounded-xl font-medium flex items-center gap-3 text-lg transition-all duration-200 ${
                isSyncing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-200'
              }`}
            >
              {isSyncing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <RefreshCw className="w-6 h-6" />
              )}
              Sync Data to Power BI
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`
                fixed bottom-8 left-1/2 -translate-x-1/2 rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto shadow-lg
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
