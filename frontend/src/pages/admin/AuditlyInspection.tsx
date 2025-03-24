// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, Loader2, X, ClipboardList, Box, Truck, Building2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface ShippingInfo {
//   shipped_to_person: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
// }

// interface ReceiptData {
//   item_description: string;
//   brand_name: string;
//   overall_condition: string;
//   return_order_number: string;
//   original_sales_order_number: string;
//   return_qty: number;
//   receipt_number: string;
//   shipping_info: ShippingInfo;
// }

// const AuditlyInspection = () => {
//   const [receiptNumber, setReceiptNumber] = useState("");
//   const [data, setData] = useState<ReceiptData[] | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0); // Track the current receipt index

//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await axios.post("https://auditlyai.com/api/get-inspection-data", {
//           receipt_number: null,
//         });
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching details:", error);
//         setError("Failed to fetch details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   const handleSearch = async () => {
//     if (!receiptNumber.trim()) {
//       setError("Please enter a receipt number");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.post("https://auditlyai.com/api/get-inspection-data", {
//         receipt_number: receiptNumber,
//       });
//       setData(response.data);
//       setCurrentIndex(0); // Reset to the first item after search
//     } catch (error) {
//       console.error("Error fetching details:", error);
//       setError("Failed to fetch details. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setReceiptNumber("");
//     setData(null);
//     setError("");
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !loading) {
//       handleSearch();
//     }
//   };

//   const handleNext = () => {
//     if (data && currentIndex < data.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (data && currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

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
//             Auditly Inspection
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Track and verify inspection details with real-time updates
//           </motion.p>
//         </motion.div>

//         {/* Search Section */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.4 }}
//           className="max-w-3xl mx-auto"
//         >
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50">
//             <div className="p-8">
//               <div className="flex gap-4">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     placeholder="Enter receipt number..."
//                     value={receiptNumber}
//                     onChange={(e) => setReceiptNumber(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
//                     disabled={loading}
//                   />
//                   {receiptNumber && (
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
//                   onClick={handleSearch}
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
//                     className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2"
//                   >
//                     <X className="w-5 h-5 flex-shrink-0" />
//                     <p>{error}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <AnimatePresence mode="wait">
//               {data && data.length > 0 && (
//                 <motion.div
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className="border-t border-blue-50"
//                 >
//                   {/* Navigation Buttons */}
//                   <div className="flex justify-between items-center p-4 bg-blue-50">
//                     <motion.button
//                       onClick={handlePrevious}
//                       disabled={currentIndex === 0}
//                       className="p-2 bg-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <ChevronLeft className="w-6 h-6 text-blue-600" />
//                     </motion.button>
//                     <span className="text-sm text-gray-600">
//                       {currentIndex + 1} of {data.length}
//                     </span>
//                     <motion.button
//                       onClick={handleNext}
//                       disabled={currentIndex === data.length - 1}
//                       className="p-2 bg-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <ChevronRight className="w-6 h-6 text-blue-600" />
//                     </motion.button>
//                   </div>

//                   {/* Display Current Receipt */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-blue-50">
//                     {[
//                       {
//                         icon: Box,
//                         title: "Item Details",
//                         data: [
//                           { label: "Description", value: data[currentIndex].item_description },
//                           { label: "Brand", value: data[currentIndex].brand_name },
//                           { label: "Condition", value: data[currentIndex].overall_condition },
//                         ],
//                       },
//                       {
//                         icon: ShoppingBag,
//                         title: "Order Info",
//                         data: [
//                           { label: "Return Order #", value: data[currentIndex].return_order_number },
//                           { label: "Original Order #", value: data[currentIndex].original_sales_order_number },
//                           { label: "Quantity", value: data[currentIndex].return_qty },
//                         ],
//                       },
//                       {
//                         icon: Building2,
//                         title: "Shipping Address",
//                         data: [
//                           { label: "Recipient", value: data[currentIndex].shipping_info.shipped_to_person },
//                           { label: "Address", value: data[currentIndex].shipping_info.address },
//                           { label: "Location", value: `${data[currentIndex].shipping_info.city}, ${data[currentIndex].shipping_info.state}, ${data[currentIndex].shipping_info.country}` },
//                         ],
//                       },
//                       {
//                         icon: Truck,
//                         title: "Inspection Status",
//                         data: [
//                           { label: "Receipt Number", value: data[currentIndex].receipt_number },
//                           { label: "Status", value: "Inspection Complete", isStatus: true },
//                         ],
//                       },
//                     ].map((section) => (
//                       <motion.div
//                         key={section.title}
//                         variants={itemVariants}
//                         className="p-6 group"
//                       >
//                         <div className="flex items-center gap-3 mb-4">
//                           <motion.div
//                             whileHover={{ scale: 1.1, rotate: 10 }}
//                             className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                           >
//                             <section.icon className="w-6 h-6 text-blue-600" />
//                           </motion.div>
//                           <h3 className="font-semibold text-gray-900">{section.title}</h3>
//                         </div>
//                         <dl className="space-y-2">
//                           {section.data.map((item) => (
//                             <div key={item.label}>
//                               <dt className="text-sm text-gray-500">{item.label}</dt>
//                               {item.isStatus ? (
//                                 <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
//                                   {item.value}
//                                 </dd>
//                               ) : (
//                                 <dd className="font-medium text-gray-900">{item.value}</dd>
//                               )}
//                             </div>
//                           ))}
//                         </dl>
//                       </motion.div>
//                     ))}
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

// export default AuditlyInspection;



import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Search, 
  Loader2, 
  X, 
  ClipboardList, 
  SlidersHorizontal,
  Calendar,
  Tag,
  User,
  Package,
  FilterX,
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ShippingInfo {
  shipped_to_person: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface ReceiptData {
  item_description: string;
  brand_name: string;
  overall_condition: string;
  return_order_number: string;
  original_sales_order_number: string;
  return_qty: number;
  receipt_number: string;
  shipping_info: ShippingInfo;
  date_received: string;
  date_inspected: string;
}

interface SearchFilters {
  receiptNumber: string;
  returnOrderNumber: string;
  salesOrderNumber: string;
  customerName: string;
  itemDescription: string;
  dateRange: {
    start: string;
    end: string;
  };
  dateType: 'received' | 'inspected';
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-100 p-6 z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-600">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="font-semibold">Advanced Search</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ClipboardList className="w-4 h-4" />
                Receipt Number
              </label>
              <input
                type="text"
                value={filters.receiptNumber}
                onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter receipt number..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Return Order #
              </label>
              <input
                type="text"
                value={filters.returnOrderNumber}
                onChange={(e) => handleInputChange('returnOrderNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter return order number..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Sales Order #
              </label>
              <input
                type="text"
                value={filters.salesOrderNumber}
                onChange={(e) => handleInputChange('salesOrderNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter sales order number..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                Customer Name
              </label>
              <input
                type="text"
                value={filters.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter customer name..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Item Description
              </label>
              <input
                type="text"
                value={filters.itemDescription}
                onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter item description..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date Type
              </label>
              <select
                value={filters.dateType}
                onChange={(e) => handleInputChange('dateType', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              >
                <option value="received">Date Received</option>
                <option value="inspected">Date Inspected</option>
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleInputChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleInputChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AuditlyInspection = () => {
  const [data, setData] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    receiptNumber: "",
    returnOrderNumber: "",
    salesOrderNumber: "",
    customerName: "",
    itemDescription: "",
    dateRange: {
      start: "",
      end: "",
    },
    dateType: "received",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post<ReceiptData[]>("https://auditlyai.com/api/get-inspection-data", {
          receipt_number: null,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to fetch details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesReceiptNumber = searchFilters.receiptNumber === "" || 
        item.receipt_number.toLowerCase().includes(searchFilters.receiptNumber.toLowerCase());
      
      const matchesReturnOrder = searchFilters.returnOrderNumber === "" ||
        item.return_order_number.toLowerCase().includes(searchFilters.returnOrderNumber.toLowerCase());
      
      const matchesSalesOrder = searchFilters.salesOrderNumber === "" ||
        item.original_sales_order_number.toLowerCase().includes(searchFilters.salesOrderNumber.toLowerCase());
      
      const matchesCustomerName = searchFilters.customerName === "" ||
        item.shipping_info.shipped_to_person.toLowerCase().includes(searchFilters.customerName.toLowerCase());
      
      const matchesItemDescription = searchFilters.itemDescription === "" ||
        item.item_description.toLowerCase().includes(searchFilters.itemDescription.toLowerCase());

      let matchesDateRange = true;
      if (searchFilters.dateRange.start && searchFilters.dateRange.end) {
        const startDate = new Date(searchFilters.dateRange.start);
        const endDate = new Date(searchFilters.dateRange.end);
        const dateField = `date_${searchFilters.dateType}`;
        const dateToCheck = new Date(item[dateField as keyof typeof item] as string);

        matchesDateRange = dateToCheck >= startDate && dateToCheck <= endDate;
      }

      return matchesReceiptNumber && 
             matchesReturnOrder && 
             matchesSalesOrder && 
             matchesCustomerName && 
             matchesItemDescription &&
             matchesDateRange;
    });
  }, [data, searchFilters]);

  const exportToXLSX = (data: ReceiptData[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspection Data");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "inspection_data.xlsx");
  };

  const clearFilters = () => {
    setSearchFilters({
      receiptNumber: "",
      returnOrderNumber: "",
      salesOrderNumber: "",
      customerName: "",
      itemDescription: "",
      dateRange: {
        start: "",
        end: "",
      },
      dateType: "received",
    });
  };

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
      {children}
    </th>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
            Auditly Inspection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Track and verify inspection details with real-time updates
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                    >
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Inspection Records
                    </h2>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <FilterX className="w-4 h-4" />
                      Clear Filters
                    </button>
                    <button
                      onClick={() => exportToXLSX(filteredData)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Export to XLSX
                    </button>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by receipt number..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.receiptNumber}
                          onChange={(e) => setSearchFilters({ ...searchFilters, receiptNumber: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <Tag className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by return order..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.returnOrderNumber}
                          onChange={(e) => setSearchFilters({ ...searchFilters, returnOrderNumber: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by customer name..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.customerName}
                          onChange={(e) => setSearchFilters({ ...searchFilters, customerName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="md:w-auto">
                      <button
                        onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                        className={`w-full md:w-auto px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                          isAdvancedSearchOpen 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        {isAdvancedSearchOpen ? 'Hide Filters' : 'More Filters'}
                      </button>
                    </div>
                  </div>

                  <AdvancedSearch
                    isOpen={isAdvancedSearchOpen}
                    onClose={() => setIsAdvancedSearchOpen(false)}
                    filters={searchFilters}
                    onFilterChange={setSearchFilters}
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <div 
                      className="overflow-y-auto"
                      style={{ maxHeight: '400px' }}
                    >
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <TableHeader>Receipt #</TableHeader>
                            <TableHeader>Return Order #</TableHeader>
                            <TableHeader>Sales Order #</TableHeader>
                            <TableHeader>Customer</TableHeader>
                            <TableHeader>Item Description</TableHeader>
                            <TableHeader>Brand</TableHeader>
                            <TableHeader>Condition</TableHeader>
                            <TableHeader>Qty</TableHeader>
                            <TableHeader>Date Received</TableHeader>
                            <TableHeader>Date Inspected</TableHeader>
                            <TableHeader>Status</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredData.length === 0 ? (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td
                                  colSpan={11}
                                  className="px-6 py-12 text-center text-gray-500 bg-gray-50/50"
                                >
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <ClipboardList className="w-10 h-10 text-gray-400" />
                                    <p className="text-lg font-medium">No matching records found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                    <button
                                      onClick={clearFilters}
                                      className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                                    >
                                      <FilterX className="w-4 h-4" />
                                      Clear all filters
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ) : (
                              filteredData.map((item, index) => (
                                <motion.tr
                                  key={`${item.receipt_number}-${index}`}
                                  variants={itemVariants}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className="hover:bg-blue-50/50 transition-colors duration-200"
                                  whileHover={{ scale: 1.002 }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {item.receipt_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.return_order_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.original_sales_order_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.shipping_info.shipped_to_person}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.item_description}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.brand_name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.overall_condition}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.return_qty}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.date_received}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.date_inspected}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                                      Inspection Complete
                                    </span>
                                  </td>
                                </motion.tr>
                              ))
                            )}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuditlyInspection;
