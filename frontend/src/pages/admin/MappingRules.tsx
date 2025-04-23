// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Table, 
//   Upload, 
//   Save, 
//   Edit, 
//   Loader2, 
//   CheckCircle2, 
//   AlertCircle, 
//   ArrowRight, 
//   X, 
//   RefreshCw,
//   Settings,
//   Database,
//   Clipboard
// } from "lucide-react";

// interface PowerBIData {
//   workspace_id: string;
//   dataset_id: string;
//   table_name: string;
//   date_filter_column: string;
//   date_filter_value: string;
// }

// interface Dataset {
//   id: string;
//   name: string;
// }

// interface Table {
//   name: string;
// }

// interface LoadingState {
//   fetchingDatasets: boolean;
//   fetchingPowerBIColumns: boolean;
//   tables: boolean;
//   columns: boolean;
//   saving: boolean;
// }

// interface Notification {
//   id: string;
//   type: 'success' | 'error';
//   message: string;
//   dismissable: boolean;
// }

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

// const NotificationToast: React.FC<{
//   notification: Notification;
//   onDismiss: (id: string) => void;
// }> = ({ notification, onDismiss }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 10 }}
//       className={`
//         rounded-xl p-4 flex items-start gap-3 max-w-2xl mx-auto relative mb-4
//         ${notification.type === 'success' 
//           ? 'bg-green-100 text-green-800' 
//           : 'bg-red-100 text-red-800'}
//       `}
//     >
//       {notification.type === 'success' ? (
//         <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
//       ) : (
//         <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//       )}
//       <div className="flex-1">
//         <p>{notification.message}</p>
//       </div>
//       {notification.dismissable && (
//         <button
//           onClick={() => onDismiss(notification.id)}
//           className="text-gray-500 hover:text-gray-700 ml-2"
//           aria-label="Dismiss notification"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       )}
//     </motion.div>
//   );
// };

// const MappingRules: React.FC = () => {
//   const [powerBIData, setPowerBIData] = useState<PowerBIData>({
//     workspace_id: '',
//     dataset_id: '',
//     table_name: '',
//     date_filter_column: '',
//     date_filter_value: ''
//   });
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   const [tables, setTables] = useState<TableData[]>([
//     { name: "item" },
//     { name: "customer_item_data" }
//   ]);
//   const [selectedTable, setSelectedTable] = useState<string>("");
//   const [columns, setColumns] = useState<string[]>([]);
//   const [mappingRows, setMappingRows] = useState<MappingData[]>([]);
//   const [powerBIColumns, setPowerBIColumns] = useState<string[]>([]);
//   const [editMode, setEditMode] = useState(false);
//   const [isLoading, setIsLoading] = useState<LoadingState>({
//     fetchingDatasets: false,
//     fetchingPowerBIColumns: false,
//     tables: false,
//     columns: false,
//     saving: false
//   });
//   const [notification, setNotification] = useState<Notification | null>(null);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [showPowerBIForm, setShowPowerBIForm] = useState(false);
//   const [powerBIColumnMappings, setPowerBIColumnMappings] = useState<PowerBIColumnMapping>({});
//   const [mappingName, setMappingName] = useState<string>("");
//   const [showMappingNameTooltip, setShowMappingNameTooltip] = useState(false);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId));
//     } else {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "User not authenticated. Please login again.",
//         dismissable: true
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (!selectedTable) return;
    
//     const fetchColumns = async () => {
//       setIsLoading(prev => ({...prev, columns: true}));
//       setNotification(null);
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
//         setNotification({
//           id: Date.now().toString(),
//           type: 'error',
//           message: "Failed to fetch columns for the selected table.",
//           dismissable: true
//         });
//       } finally {
//         setIsLoading(prev => ({...prev, columns: false}));
//       }
//     };
    
//     fetchColumns();
//   }, [selectedTable]);

//   useEffect(() => {
//     const fetchExistingMapping = async () => {
//       if (selectedTable && userId) {
//         try {
//           const response = await axios.get(`https://auditlyai.com/api/power-bi-sql-mapping/${userId}/${selectedTable}`);
//           if (response.data && response.data.mapping_name) {
//             setMappingName(response.data.mapping_name);
//           }
//         } catch (error) {
//           console.log("No existing mapping found");
//         }
//       }
//     };
    
//     fetchExistingMapping();
//   }, [selectedTable, userId]);

//   const handleDestinationChange = (index: number, value: string) => {
//     const newRows = [...mappingRows];
//     newRows[index].destination = value;
//     setMappingRows(newRows);
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
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please enter a workspace ID.",
//         dismissable: true
//       });
//       return;
//     }

//     setIsLoading(prev => ({...prev, fetchingDatasets: true}));
//     setNotification(null);

//     try {
//       const response = await axios.get(`https://auditlyai.com/api/get-powerbi-dataset-ids?workspace_id=${powerBIData.workspace_id}`);
//       setDatasets(response.data.dataset_ids.map((id: string) => ({ id, name: id })));
//       setNotification({
//         id: Date.now().toString(),
//         type: 'success',
//         message: "Datasets fetched successfully!",
//         dismissable: true
//       });
//     } catch (error) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Failed to fetch datasets. Please check the workspace ID.",
//         dismissable: true
//       });
//     } finally {
//       setIsLoading(prev => ({...prev, fetchingDatasets: false}));
//     }
//   };

//   const handleFetchPowerBIColumns = async () => {
//     if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please fill all required fields.",
//         dismissable: true
//       });
//       return;
//     }

//     setIsLoading(prev => ({...prev, fetchingPowerBIColumns: true}));
//     setNotification(null);

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
      
//       setNotification({
//         id: Date.now().toString(),
//         type: 'success',
//         message: "Power BI columns fetched successfully!",
//         dismissable: true
//       });
//     } catch (error) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Failed to fetch Power BI columns. Please try again.",
//         dismissable: true
//       });
//     } finally {
//       setIsLoading(prev => ({...prev, fetchingPowerBIColumns: false}));
//     }
//   };

//   const handleEdit = () => {
//     if (!selectedTable) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please select a table first.",
//         dismissable: true
//       });
//       return;
//     }
//     setEditMode(true);
//   };

//   const handleSaveMapping = async () => {
//     if (!selectedTable) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please select a table first.",
//         dismissable: true
//       });
//       return;
//     }

//     if (!userId) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "User not authenticated. Please login again.",
//         dismissable: true
//       });
//       return;
//     }

//     if (!powerBIData.date_filter_column || !powerBIData.date_filter_value) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please select a date filter column and value.",
//         dismissable: true
//       });
//       return;
//     }

//     setIsLoading(prev => ({...prev, saving: true}));
//     setNotification(null);

//     try {
//       const mappingObject = mappingRows.reduce((acc, row) => {
//         if (row.destination) {
//           acc[row.source] = row.destination;
//         }
//         return acc;
//       }, {} as Record<string, string>);

//       const response = await axios.post("https://auditlyai.com/api/power-bi-sql-mapping/", {
//         sql_table_name: selectedTable,
//         bi_table_name: powerBIData.table_name,
//         date_filter_column_name: powerBIData.date_filter_column,
//         mapping: mappingObject,
//         user_id: userId,
//         date_filter_value: powerBIData.date_filter_value
//       });

//       setMappingName(response.data.data.mapping_name);
//       setNotification({
//         id: Date.now().toString(),
//         type: 'success',
//         message: `Mapping saved successfully! Mapping name: ${response.data.data.mapping_name}`,
//         dismissable: true
//       });
//       setEditMode(false);
//     } catch (error) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Failed to save mapping. Please try again.",
//         dismissable: true
//       });
//     } finally {
//       setIsLoading(prev => ({...prev, saving: false}));
//     }
//   };

//   const handleSyncToPowerBI = async () => {
//     if (!userId) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "User not authenticated. Please login again.",
//         dismissable: true
//       });
//       return;
//     }

//     if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Please complete all Power BI configuration steps first.",
//         dismissable: true
//       });
//       return;
//     }

//     setIsSyncing(true);
//     setNotification(null);

//     try {
//       const response = await axios.post("https://auditlyai.com/api/powerbi/get-table-data", {
//         workspace_id: powerBIData.workspace_id,
//         dataset_id: powerBIData.dataset_id,
//         sql_table_name: selectedTable,
//         user_id: userId,
//         power_bi_table_name: powerBIData.table_name
//       });

//       setNotification({
//         id: Date.now().toString(),
//         type: 'success',
//         message: "Data synced to Power BI successfully!",
//         dismissable: true
//       });
//     } catch (error) {
//       setNotification({
//         id: Date.now().toString(),
//         type: 'error',
//         message: "Failed to sync data to Power BI. Please try again.",
//         dismissable: true
//       });
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(mappingName);
//     setShowMappingNameTooltip(true);
//     setTimeout(() => setShowMappingNameTooltip(false), 2000);
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
//             <Database className="w-10 h-10 text-blue-600" />
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
//             Configure Power BI integration and manage column mappings
//           </motion.p>
//         </motion.div>

//         {/* Notification Section */}
//         <AnimatePresence mode="wait">
//           {notification && (
//             <NotificationToast
//               notification={notification}
//               onDismiss={(id) => {
//                 if (notification.id === id) {
//                   setNotification(null);
//                 }
//               }}
//             />
//           )}
//         </AnimatePresence>

//         {/* Power BI Configuration Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 10 }}
//                 className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
//               >
//                 <Settings className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <h2 className="text-xl font-bold text-gray-800">Power BI Configuration</h2>
//             </div>
//             <button
//               onClick={() => setShowPowerBIForm(!showPowerBIForm)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               {showPowerBIForm ? (
//                 <>
//                   <X className="w-4 h-4" />
//                   Hide Form
//                 </>
//               ) : (
//                 <>
//                   <Settings className="w-4 h-4" />
//                   Configure
//                 </>
//               )}
//             </button>
//           </div>

//           <AnimatePresence>
//             {showPowerBIForm && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="space-y-4"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Workspace ID *
//                     </label>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         name="workspace_id"
//                         value={powerBIData.workspace_id}
//                         onChange={handlePowerBIInputChange}
//                         className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                         placeholder="Enter Power BI Workspace ID"
//                       />
//                       <button
//                         onClick={handleFetchDatasets}
//                         disabled={isLoading.fetchingDatasets}
//                         className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                           isLoading.fetchingDatasets
//                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             : 'bg-blue-600 text-white hover:bg-blue-700'
//                         }`}
//                       >
//                         {isLoading.fetchingDatasets ? (
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                         ) : (
//                           "Fetch Datasets"
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {datasets.length > 0 && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Dataset *
//                       </label>
//                       <select
//                         name="dataset_id"
//                         value={powerBIData.dataset_id}
//                         onChange={handlePowerBIInputChange}
//                         className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                       >
//                         <option value="">Select a Dataset</option>
//                         {datasets.map((dataset) => (
//                           <option key={dataset.id} value={dataset.id}>
//                             {dataset.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Power BI Table Name *
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       name="table_name"
//                       value={powerBIData.table_name}
//                       onChange={handlePowerBIInputChange}
//                       className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                       placeholder="Enter Power BI Table Name"
//                     />
//                     <button
//                       onClick={handleFetchPowerBIColumns}
//                       disabled={isLoading.fetchingPowerBIColumns}
//                       className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                         isLoading.fetchingPowerBIColumns
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-blue-600 text-white hover:bg-blue-700'
//                       }`}
//                     >
//                       {isLoading.fetchingPowerBIColumns ? (
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                       ) : (
//                         "Fetch Columns"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Table Selection and Mapping Section */}
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
//                 <Table className="w-6 h-6 text-blue-600" />
//               </motion.div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">Column Mappings</h2>
//                 {mappingName && (
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-sm text-gray-500">
//                       Current mapping: <span className="font-medium text-blue-600">{mappingName}</span>
//                     </p>
//                     <div className="relative">
//                       <button 
//                         onClick={copyToClipboard}
//                         className="text-gray-400 hover:text-blue-600 transition-colors"
//                         title="Copy mapping name"
//                       >
//                         <Clipboard className="w-4 h-4" />
//                       </button>
//                       {showMappingNameTooltip && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 5 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
//                         >
//                           Copied!
//                         </motion.div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {!editMode ? (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleEdit}
//                   className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                     isLoading.saving || !selectedTable || !userId
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                   disabled={isLoading.saving || !selectedTable || !userId}
//                 >
//                   <Edit className="w-5 h-5" />
//                   Edit Mappings
//                 </motion.button>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleSaveMapping}
//                   className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                     isLoading.saving
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                   disabled={isLoading.saving}
//                 >
//                   {isLoading.saving ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <Save className="w-5 h-5" />
//                   )}
//                   Save Mappings
//                 </motion.button>
//               )}
//               <button
//                 onClick={handleSyncToPowerBI}
//                 disabled={isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable}
//                 className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
//                   isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {isSyncing ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <RefreshCw className="w-5 h-5" />
//                 )}
//                 Sync Data
//               </button>
//             </div>
//           </div>

//           {mappingName && (
//             <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6">
//               <div className="flex items-start gap-3">
//                 <div className="mt-0.5">
//                   <CheckCircle2 className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-blue-800 font-medium">
//                     Save this mapping name for future reference:
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
//                       {mappingName}
//                     </code>
//                     <button 
//                       onClick={copyToClipboard}
//                       className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
//                     >
//                       <Clipboard className="w-4 h-4" />
//                       <span>Copy</span>
//                     </button>
//                   </div>
//                   <p className="text-xs text-blue-600 mt-2">
//                     You'll need this mapping name for automation scripts and API calls.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

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
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Date Filter Column
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
//                         Date Filter Value
//                       </label>
//                       <input
//                         type="text"
//                         name="date_filter_value"
//                         value={powerBIData.date_filter_value}
//                         onChange={handlePowerBIInputChange}
//                         placeholder="Enter date in mm-dd-yyyy format"
//                         className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                 )}
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
//       </div>
//     </div>
//   );
// };

// export default MappingRules;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Adjust path as needed
import { 
  Table, 
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
  Clipboard,
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface PowerBIData {
  workspace_id: string;
  dataset_id: string;
  table_name: string;
  date_filter_column: string;
  date_filter_value: string;
}

interface PowerBIUser {
  power_bi_email: string;
  power_bi_username: string;
  power_bi_id: number;
  connection_type: string;
  connection_status: string;
}

interface Dataset {
  id: string;
  name: string;
}

interface Table {
  name: string;
}

interface LoadingState {
  fetchingDatasets: boolean;
  fetchingPowerBIColumns: boolean;
  tables: boolean;
  columns: boolean;
  saving: boolean;
  fetchingUsers: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
  dismissable: boolean;
}

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
  date_filter_column: string;
  date_filter_value: string;
}

interface DatasetOption {
  id: string;
  name: string;
}

interface PowerBIColumnMapping {
  [key: string]: string;
}

const NotificationToast: React.FC<{
  notification: Notification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`
        rounded-xl p-4 flex items-start gap-3 max-w-2xl mx-auto relative mb-4
        ${notification.type === 'success' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'}
      `}
    >
      {notification.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p>{notification.message}</p>
      </div>
      {notification.dismissable && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="text-gray-500 hover:text-gray-700 ml-2"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};

const MappingRules: React.FC = () => {
  const [powerBIData, setPowerBIData] = useState<PowerBIData>({
    workspace_id: '',
    dataset_id: '',
    table_name: '',
    date_filter_column: '',
    date_filter_value: ''
  });
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [tables, setTables] = useState<TableData[]>([
    { name: "item" },
    { name: "customer_item_data" }
  ]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [mappingRows, setMappingRows] = useState<MappingData[]>([]);
  const [powerBIColumns, setPowerBIColumns] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    fetchingDatasets: false,
    fetchingPowerBIColumns: false,
    tables: false,
    columns: false,
    saving: false,
    fetchingUsers: false
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [showPowerBIForm, setShowPowerBIForm] = useState(false);
  const [powerBIColumnMappings, setPowerBIColumnMappings] = useState<PowerBIColumnMapping>({});
  const [mappingName, setMappingName] = useState<string>("");
  const [showMappingNameTooltip, setShowMappingNameTooltip] = useState(false);
  const [powerBiUsers, setPowerBiUsers] = useState<PowerBIUser[]>([]);
  const [selectedPowerBiUser, setSelectedPowerBiUser] = useState<PowerBIUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get powerBiUser from Redux store
  const powerBiUserFromStore = useSelector((state: RootState) => state?.Item?.powerBiUser || null);

  useEffect(() => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    setUserId(parseInt(storedUserId));
  } else {
    setNotification({
      id: Date.now().toString(),
      type: 'error',
      message: "User not authenticated. Please login again.",
      dismissable: true
    });
  }
}, []);

useEffect(() => {
  if (userId) {
    fetchPowerBiUsers();
  }
}, [userId]);

const fetchPowerBiUsers = async () => {
  setIsLoading(prev => ({...prev, fetchingUsers: true}));
  try {
    const response = await axios.post("https://auditlyai.com/api/power-bi-users", {
      auditly_user_id: userId,
      connection_type: "inbound"
    });
    const users = response.data;
    setPowerBiUsers(users);

    if (powerBiUserFromStore) {
      const match = users.find(u => u.power_bi_id === powerBiUserFromStore.power_bi_id);
      if (match) setSelectedPowerBiUser(match);
    }

    if (users.length === 1) {
      setSelectedPowerBiUser(users[0]);
    }

  } catch (error) {
    setNotification({
      id: Date.now().toString(),
      type: 'error',
      message: "Failed to fetch Power BI connections.",
      dismissable: true
    });
  } finally {
    setIsLoading(prev => ({...prev, fetchingUsers: false}));
  }
};

  

  useEffect(() => {
    if (!selectedTable) return;
    
    const fetchColumns = async () => {
      setIsLoading(prev => ({...prev, columns: true}));
      setNotification(null);
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
        setNotification({
          id: Date.now().toString(),
          type: 'error',
          message: "Failed to fetch columns for the selected table.",
          dismissable: true
        });
      } finally {
        setIsLoading(prev => ({...prev, columns: false}));
      }
    };
    
    fetchColumns();
  }, [selectedTable]);

  useEffect(() => {
    const fetchExistingMapping = async () => {
      if (selectedTable && userId && selectedPowerBiUser) {
        try {
          const response = await axios.get(
            `https://auditlyai.com/api/power-bi-sql-mapping/${userId}/${selectedTable}/${selectedPowerBiUser.power_bi_id}`
          );
          if (response.data && response.data.mapping_name) {
            setMappingName(response.data.mapping_name);
          }
        } catch (error) {
          console.log("No existing mapping found");
        }
      }
    };
    
    fetchExistingMapping();
  }, [selectedTable, userId, selectedPowerBiUser]);

  const handleDestinationChange = (index: number, value: string) => {
    const newRows = [...mappingRows];
    newRows[index].destination = value;
    setMappingRows(newRows);
  };

  const handlePowerBIInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPowerBIData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFetchDatasets = async () => {
  if (!powerBIData.workspace_id) {
    setNotification({
      id: Date.now().toString(),
      type: 'error',
      message: "Please enter a workspace ID.",
      dismissable: true
    });
    return;
  }

  if (!selectedPowerBiUser || !userId) {
    setNotification({
      id: Date.now().toString(),
      type: 'error',
      message: "User not authenticated. Please login again.",
      dismissable: true
    });
    return;
  }

  setIsLoading(prev => ({...prev, fetchingDatasets: true}));
  setNotification(null);

  try {
    const response = await axios.post(
      "https://auditlyai.com/api/get-powerbi-dataset-ids",
          {
            workspace_id: powerBIData.workspace_id,
            power_bi_id: String(selectedPowerBiUser.power_bi_id),
            auditly_user_id: String(userId)
          }
    );

    const datasetList = response.data.dataset_ids.map((id: string) => ({ id, name: id }));
    setDatasets(datasetList);

    setNotification({
      id: Date.now().toString(),
      type: 'success',
      message: "Datasets fetched successfully!",
      dismissable: true
    });
  } catch (error) {
    setNotification({
      id: Date.now().toString(),
      type: 'error',
      message: "Failed to fetch datasets. Please check the workspace ID.",
      dismissable: true
    });
  } finally {
    setIsLoading(prev => ({...prev, fetchingDatasets: false}));
  }
};


  const handleFetchPowerBIColumns = async () => {
    if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please fill all required fields.",
        dismissable: true
      });
      return;
    }

    if (!selectedPowerBiUser) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a Power BI connection first.",
        dismissable: true
      });
      return;
    }

    setIsLoading(prev => ({...prev, fetchingPowerBIColumns: true}));
    setNotification(null);

    try {
      const response = await axios.post(
        "https://auditlyai.com/api/powerbi/get-powerbi-table-columns",
        {
          workspace_id: powerBIData.workspace_id,
          dataset_id: powerBIData.dataset_id,
          power_bi_table_name: powerBIData.table_name,
          bi_user_id: selectedPowerBiUser.power_bi_id
        }
      );

      const columnMappings = response.data;
      setPowerBIColumnMappings(columnMappings);
      
      const actualColumnNames = Object.values(columnMappings);
      setPowerBIColumns(actualColumnNames);
      
      const autoMappedRows = mappingRows.map(row => {
        const matchingEntry = Object.entries(columnMappings).find(([_, actualName]) => 
          actualName.toLowerCase() === row.source.toLowerCase()
        );
        
        return {
          ...row,
          destination: matchingEntry ? columnMappings[matchingEntry[0]] : ""
        };
      });
      
      setMappingRows(autoMappedRows);
      
      setNotification({
        id: Date.now().toString(),
        type: 'success',
        message: "Power BI columns fetched successfully!",
        dismissable: true
      });
    } catch (error) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Failed to fetch Power BI columns. Please try again.",
        dismissable: true
      });
    } finally {
      setIsLoading(prev => ({...prev, fetchingPowerBIColumns: false}));
    }
  };

  const handleEdit = () => {
    if (!selectedTable) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a table first.",
        dismissable: true
      });
      return;
    }
    if (!selectedPowerBiUser) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a Power BI connection first.",
        dismissable: true
      });
      return;
    }
    setEditMode(true);
  };

  const handleSaveMapping = async () => {
    if (!selectedTable) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a table first.",
        dismissable: true
      });
      return;
    }

    if (!userId) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "User not authenticated. Please login again.",
        dismissable: true
      });
      return;
    }

    if (!selectedPowerBiUser) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a Power BI connection first.",
        dismissable: true
      });
      return;
    }

    if (!powerBIData.date_filter_column || !powerBIData.date_filter_value) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a date filter column and value.",
        dismissable: true
      });
      return;
    }

    setIsLoading(prev => ({...prev, saving: true}));
    setNotification(null);

    try {
      const mappingObject = mappingRows.reduce((acc, row) => {
        if (row.destination) {
          acc[row.source] = row.destination;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await axios.post("https://auditlyai.com/api/power-bi-sql-mapping/", {
        sql_table_name: selectedTable,
        bi_table_name: powerBIData.table_name,
        date_filter_column_name: powerBIData.date_filter_column,
        mapping: mappingObject,
        user_id: userId,
        date_filter_value: powerBIData.date_filter_value,
        bi_user_id: selectedPowerBiUser.power_bi_id
      });

      setMappingName(response.data.data.mapping_name);
      setNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Mapping saved successfully! Mapping name: ${response.data.data.mapping_name}`,
        dismissable: true
      });
      setEditMode(false);
    } catch (error) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Failed to save mapping. Please try again.",
        dismissable: true
      });
    } finally {
      setIsLoading(prev => ({...prev, saving: false}));
    }
  };

  const handleSyncToPowerBI = async () => {
    if (!userId) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "User not authenticated. Please login again.",
        dismissable: true
      });
      return;
    }

    if (!selectedPowerBiUser) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please select a Power BI connection first.",
        dismissable: true
      });
      return;
    }

    if (!powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Please complete all Power BI configuration steps first.",
        dismissable: true
      });
      return;
    }

    setIsSyncing(true);
    setNotification(null);

    try {
      const response = await axios.post("https://auditlyai.com/api/powerbi/get-table-data", {
        workspace_id: powerBIData.workspace_id,
        dataset_id: powerBIData.dataset_id,
        sql_table_name: selectedTable,
        user_id: userId,
        power_bi_table_name: powerBIData.table_name,
        bi_user_id: selectedPowerBiUser.power_bi_id
      });

      setNotification({
        id: Date.now().toString(),
        type: 'success',
        message: "Data synced to Power BI successfully!",
        dismissable: true
      });
    } catch (error) {
      setNotification({
        id: Date.now().toString(),
        type: 'error',
        message: "Failed to sync data to Power BI. Please try again.",
        dismissable: true
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mappingName);
    setShowMappingNameTooltip(true);
    setTimeout(() => setShowMappingNameTooltip(false), 2000);
  };

  const activeConnections = powerBiUsers.filter(user => 
    user.connection_status === 'Active' && user.connection_type === 'inbound'
  );

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
            <Database className="w-10 h-10 text-blue-600" />
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
            Configure Power BI integration and manage column mappings
          </motion.p>
        </motion.div>

        {/* Notification Section */}
        <AnimatePresence mode="wait">
          {notification && (
            <NotificationToast
              notification={notification}
              onDismiss={(id) => {
                if (notification.id === id) {
                  setNotification(null);
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Power BI Connection Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Power BI Connection</h2>
            <button
              onClick={() => fetchPowerBiUsers()}
              disabled={isLoading.fetchingUsers}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading.fetchingUsers ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {isLoading.fetchingUsers ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : activeConnections.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">No active inbound Power BI connections found.</p>
              <p className="text-sm text-yellow-700 mt-1">
                Please create a connection in the Inbound page first.
              </p>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {selectedPowerBiUser ? selectedPowerBiUser.power_bi_username : 'Select a connection'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedPowerBiUser ? selectedPowerBiUser.power_bi_email : ''}
                    </p>
                  </div>
                </div>
                {showUserDropdown ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {activeConnections.map((user) => (
                        <button
                          key={user.power_bi_id}
                          onClick={() => {
                            setSelectedPowerBiUser(user);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left p-3 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                            selectedPowerBiUser?.power_bi_id === user.power_bi_id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.power_bi_username}</p>
                            <p className="text-xs text-gray-500">{user.power_bi_email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Power BI Configuration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Settings className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Power BI Configuration</h2>
            </div>
            <button
              onClick={() => setShowPowerBIForm(!showPowerBIForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {showPowerBIForm ? (
                <>
                  <X className="w-4 h-4" />
                  Hide Form
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  Configure
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showPowerBIForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                        placeholder="Enter Power BI Workspace ID"
                      />
                      <button
                        onClick={handleFetchDatasets}
                        disabled={isLoading.fetchingDatasets || !selectedPowerBiUser}
                        className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                          isLoading.fetchingDatasets || !selectedPowerBiUser
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isLoading.fetchingDatasets ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Fetch Datasets"
                        )}
                      </button>
                    </div>
                  </div>

                  {datasets.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Dataset *
                      </label>
                      <select
                        name="dataset_id"
                        value={powerBIData.dataset_id}
                        onChange={handlePowerBIInputChange}
                        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
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
                      className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                      placeholder="Enter Power BI Table Name"
                    />
                    <button
                      onClick={handleFetchPowerBIColumns}
                      disabled={isLoading.fetchingPowerBIColumns || !selectedPowerBiUser}
                      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                        isLoading.fetchingPowerBIColumns || !selectedPowerBiUser
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isLoading.fetchingPowerBIColumns ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Fetch Columns"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Table Selection and Mapping Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Table className="w-6 h-6 text-blue-600" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Column Mappings</h2>
                {mappingName && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      Current mapping: <span className="font-medium text-blue-600">{mappingName}</span>
                    </p>
                    <div className="relative">
                      <button 
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy mapping name"
                      >
                        <Clipboard className="w-4 h-4" />
                      </button>
                      {showMappingNameTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
                        >
                          Copied!
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!editMode ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                    isLoading.saving || !selectedTable || !userId || !selectedPowerBiUser
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={isLoading.saving || !selectedTable || !userId || !selectedPowerBiUser}
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
              <button
                onClick={handleSyncToPowerBI}
                disabled={isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable || !selectedPowerBiUser}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                  isSyncing || !powerBIData.workspace_id || !powerBIData.dataset_id || !powerBIData.table_name || !selectedTable || !selectedPowerBiUser
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSyncing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                Sync Data
              </button>
            </div>
          </div>

          {mappingName && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Save this mapping name for future reference:
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                      {mappingName}
                    </code>
                    <button 
                      onClick={copyToClipboard}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Clipboard className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    You'll need this mapping name for automation scripts and API calls.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
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
                                <select
                                  value={row.destination}
                                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                                  className={`w-full p-2 rounded-lg transition-all duration-200 ${
                                    editMode 
                                      ? 'border-2 border-blue-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300' 
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

                {powerBIColumns.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="Enter date in mm-dd-yyyy format"
                        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                      />
                    </div>
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
      </div>
    </div>
  );
};

export default MappingRules;
