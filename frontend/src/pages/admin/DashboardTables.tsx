// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Package2,
//   Search,
//   Filter,
//   Loader2,
//   Users2,
//   ChevronDown,
// } from "lucide-react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// // Debounce function
// const debounce = (func: Function, delay: number) => {
//   let timeoutId: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

// interface Item {
//   id: number;
//   item_number: string;
//   item_description: string;
//   category: string;
// }

// const DashboardTables: React.FC = () => {
//   const [items, setItems] = useState<Item[]>([]);
//   const [searchItem, setSearchItem] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Debounced search handler
//   const handleSearchChange = useCallback(
//     debounce((value: string) => {
//       setSearchItem(value);
//     }, 300), // 300ms delay
//     []
//   );

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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const itemsResponse = await axios.get<Item[]>(
//           "http://54.210.159.220:8000/items"
//         );
//         setItems(itemsResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Memoize filtered items
//   const filteredItems = useMemo(() => {
//     return items.filter(
//       (item) =>
//         (searchItem === "" ||
//           String(item.item_number)
//             .toLowerCase()
//             .includes(searchItem.toLowerCase())) &&
//         (categoryFilter === "" || item.category === categoryFilter)
//     );
//   }, [items, searchItem, categoryFilter]);

//   const SearchBar = React.memo(
//     ({
//       value,
//       onChange,
//       placeholder,
//       filter,
//       onFilterChange,
//       filterOptions,
//       filterPlaceholder,
//     }: {
//       value: string;
//       onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//       placeholder: string;
//       filter: string;
//       onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//       filterOptions: string[];
//       filterPlaceholder: string;
//     }) => (
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
//             <Search className="w-5 h-5" />
//           </div>
//           <input
//             type="text"
//             placeholder={placeholder}
//             className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
//             defaultValue={value}
//             onChange={onChange}
//           />
//         </div>
//         <div className="relative min-w-[200px]">
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
//             <Filter className="w-4 h-4" />
//           </div>
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
//             <ChevronDown className="w-4 h-4" />
//           </div>
//           <select
//             className="w-full pl-10 pr-10 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
//             value={filter}
//             onChange={onFilterChange}
//           >
//             <option value="">{filterPlaceholder}</option>
//             {filterOptions.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     )
//   );

//   const TableHeader = ({ children }: { children: React.ReactNode }) => (
//     <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
//       {children}
//     </th>
//   );

//   // XLSX Export function
//   const exportToXLSX = (data: Item[]) => {
//     const ws = XLSX.utils.json_to_sheet(data); // Convert data to Excel sheet
//     const wb = XLSX.utils.book_new(); // Create a new Excel workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Item Records"); // Append sheet to workbook
//     const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" }); // Convert workbook to binary array
//     const blob = new Blob([excelFile], { type: "application/octet-stream" }); // Create a Blob from binary data
//     saveAs(blob, "item_records.xlsx"); // Trigger the download as .xlsx
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
//             Dashboard Items
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             View and manage item information
//           </motion.p>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {isLoading ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center py-12"
//             >
//               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//             </motion.div>
//           ) : (
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between">
//                   <div className="flex items-center gap-3 mb-6">
//                     <motion.div
//                       whileHover={{ scale: 1.1, rotate: 10 }}
//                       className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                     >
//                       <Package2 className="w-6 h-6 text-blue-600" />
//                     </motion.div>
//                     <h2 className="text-xl font-bold text-gray-800">
//                       Item Records
//                     </h2>
//                   </div>
//                   <div className="flex justify-between mb-4">
//                     <button
//                       onClick={() => exportToXLSX(filteredItems)} // Trigger export on click
//                       className="px-4 h-10 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
//                     >
//                       Export to XLSX
//                     </button>
//                   </div>
//                 </div>

//                 <SearchBar
//                   value={searchItem}
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   placeholder="Search by Item Number..."
//                   filter={categoryFilter}
//                   onFilterChange={(e) => setCategoryFilter(e.target.value)}
//                   filterOptions={Array.from(
//                     new Set(items.map((item) => item.category))
//                   )}
//                   filterPlaceholder="All Categories"
//                 />

//                 <div className="overflow-hidden rounded-xl border border-blue-100">
//                   <div className="overflow-x-auto">
//                     <div className="overflow-y-auto max-h-[300px]">
//                       <table className="min-w-full divide-y divide-blue-100">
//                         <thead className="sticky top-0 bg-white z-10">
//                           <tr>
//                             <TableHeader>Item Number</TableHeader>
//                             <TableHeader>Description</TableHeader>
//                             <TableHeader>Category</TableHeader>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-blue-50">
//                           <AnimatePresence>
//                             {filteredItems.map((item, index) => (
//                               <motion.tr
//                                 key={item.id}
//                                 variants={itemVariants}
//                                 custom={index}
//                                 initial="hidden"
//                                 animate="visible"
//                                 exit="hidden"
//                                 className="hover:bg-blue-50/50 transition-colors duration-200"
//                                 whileHover={{ scale: 1.002 }}
//                               >
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                                   {item.item_number}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {item.item_description}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                   {item.category}
//                                 </td>
//                               </motion.tr>
//                             ))}
//                           </AnimatePresence>
//                           {filteredItems.length === 0 && (
//                             <motion.tr
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               exit={{ opacity: 0 }}
//                             >
//                               <td
//                                 colSpan={3}
//                                 className="px-6 py-8 text-center text-gray-500 bg-gray-50/50"
//                               >
//                                 No items found matching your criteria.
//                               </td>
//                             </motion.tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default DashboardTables;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package2,
  Search,
  Filter,
  Loader2,
  Users2,
  ChevronDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface Brand {
  id: number;
  brand_name: string;
  description: string;
}

interface Item {
  id: number;
  item_number: string;
  item_description: string;
  category: string;
  configuration: string;
  brand: Brand;
}

const DashboardTables: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchItem(value);
    }, 300), // 300ms delay
    []
  );

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
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get<Item[]>(
          "http://54.210.159.220:8000/items"
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        (searchItem === "" ||
          String(item.item_number)
            .toLowerCase()
            .includes(searchItem.toLowerCase())) &&
        (brandFilter === "" || item.brand.brand_name === brandFilter)
    );
  }, [items, searchItem, brandFilter]);

  const SearchBar = React.memo(
    ({
      value,
      onChange,
      placeholder,
      filter,
      onFilterChange,
      filterOptions,
      filterPlaceholder,
    }: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder: string;
      filter: string;
      onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
      filterOptions: string[];
      filterPlaceholder: string;
    }) => (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
            defaultValue={value}
            onChange={onChange}
          />
        </div>
        <div className="relative min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
            <Filter className="w-4 h-4" />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
          <select
            className="w-full pl-10 pr-10 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
            value={filter}
            onChange={onFilterChange}
          >
            <option value="">{filterPlaceholder}</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  );

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
      {children}
    </th>
  );

  // XLSX Export function
  const exportToXLSX = (data: Item[]) => {
    const ws = XLSX.utils.json_to_sheet(data); // Convert data to Excel sheet
    const wb = XLSX.utils.book_new(); // Create a new Excel workbook
    XLSX.utils.book_append_sheet(wb, ws, "Item Records"); // Append sheet to workbook
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" }); // Convert workbook to binary array
    const blob = new Blob([excelFile], { type: "application/octet-stream" }); // Create a Blob from binary data
    saveAs(blob, "item_records.xlsx"); // Trigger the download as .xlsx
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
            <Users2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Dashboard Items
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            View and manage item information
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
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
                <div className="flex justify-between">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                    >
                      <Package2 className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Item Records
                    </h2>
                  </div>
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => exportToXLSX(filteredItems)} // Trigger export on click
                      className="px-4 h-10 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Export to XLSX
                    </button>
                  </div>
                </div>

                <SearchBar
                  value={searchItem}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by Item Number..."
                  filter={brandFilter}
                  onFilterChange={(e) => setBrandFilter(e.target.value)}
                  filterOptions={Array.from(
                    new Set(items.map((item) => item.brand.brand_name))
                  )}
                  filterPlaceholder="All Brands"
                />

                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[300px]">
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <TableHeader>Item Number</TableHeader>
                            <TableHeader>Description</TableHeader>
                            <TableHeader>Category</TableHeader>
                            <TableHeader>Configuration</TableHeader>
                            <TableHeader>Brand</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredItems.map((item, index) => (
                              <motion.tr
                                key={item.id}
                                variants={itemVariants}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="hover:bg-blue-50/50 transition-colors duration-200"
                                whileHover={{ scale: 1.002 }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                  {item.item_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {item.item_description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {item.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {item.configuration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {item.brand.brand_name}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                          {filteredItems.length === 0 && (
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <td
                                colSpan={5}
                                className="px-6 py-8 text-center text-gray-500 bg-gray-50/50"
                              >
                                No items found matching your criteria.
                              </td>
                            </motion.tr>
                          )}
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

export default DashboardTables;
