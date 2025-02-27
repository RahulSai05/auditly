// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Filter, Loader2, ClipboardList, ChevronDown, Users2 } from "lucide-react";

// // Debounce function
// const debounce = (func: Function, delay: number) => {
//   let timeoutId: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

// interface SalesData {
//   SalesOrder: string;
//   CustomerAccount: string;
//   Name: string;
//   ReturnStatus: string;
//   RMANumber: string;
//   OrderType: string;
//   Status: string;
//   Segment: string;
//   Subsegment: string;
// }

// const CustomerSerials: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const orderNumber = searchParams.get("OrderNumber");
//   const [customerData, setCustomerData] = useState<SalesData[]>([]);
//   const [searchSalesOrder, setSearchSalesOrder] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Debounced search handler
//   const handleSearchChange = useCallback(
//     debounce((value: string) => {
//       setSearchSalesOrder(value);
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
//         const response = await axios.get<{ message: string; data: SalesData[] }>(
//           "http://54.210.159.220:8000/sales-data"
//         );
//         setCustomerData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching sales data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredSalesData = useMemo(() => {
//     return customerData
//       .filter(
//         (data) =>
//           (searchSalesOrder === "" ||
//             data.SalesOrder.toLowerCase().includes(searchSalesOrder.toLowerCase())) &&
//           (statusFilter === "" || data.Status === statusFilter)
//       )
//       .slice(0, 5);
//   }, [customerData, searchSalesOrder, statusFilter]);

//   const SearchBar = React.memo(({ 
//     value, 
//     onChange, 
//     placeholder, 
//     filter, 
//     onFilterChange, 
//     filterOptions, 
//     filterPlaceholder 
//   }: {
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     placeholder: string;
//     filter: string;
//     onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     filterOptions: string[];
//     filterPlaceholder: string;
//   }) => (
//     <div className="flex flex-col md:flex-row gap-4 mb-6">
//       <div className="relative flex-1">
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
//           <Search className="w-5 h-5" />
//         </div>
//         <input
//           type="text"
//           placeholder={placeholder}
//           className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
//           defaultValue={value} // Use defaultValue instead of value
//           onChange={(e) => onChange(e)} // Pass the event to the debounced handler
//         />
//       </div>
//       <div className="relative min-w-[200px]">
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
//           <Filter className="w-4 h-4" />
//         </div>
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
//           <ChevronDown className="w-4 h-4" />
//         </div>
//         <select
//           className="w-full pl-10 pr-10 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
//           value={filter}
//           onChange={onFilterChange}
//         >
//           <option value="">{filterPlaceholder}</option>
//           {filterOptions.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   ));

//   const TableHeader = ({ children }: { children: React.ReactNode }) => (
//     <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
//       {children}
//     </th>
//   );

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
//             Customer Sales Data
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             View and manage customer sales information
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
//                 <div className="flex items-center gap-3 mb-6">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 10 }}
//                     className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                   >
//                     <ClipboardList className="w-6 h-6 text-blue-600" />
//                   </motion.div>
//                   <h2 className="text-xl font-bold text-gray-800">Sales Records</h2>
//                 </div>

//                 <SearchBar
//                   value={searchSalesOrder}
//                   onChange={(e) => handleSearchChange(e.target.value)} // Use debounced handler
//                   placeholder="Search by Sales Order..."
//                   filter={statusFilter}
//                   onFilterChange={(e) => setStatusFilter(e.target.value)}
//                   filterOptions={Array.from(new Set(customerData.map((data) => data.Status)))}
//                   filterPlaceholder="All Statuses"
//                 />

//                 <div className="overflow-hidden rounded-xl border border-blue-100">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-blue-100">
//                       <thead>
//                         <tr>
//                           <TableHeader>Sales Order</TableHeader>
//                           <TableHeader>Customer Account</TableHeader>
//                           <TableHeader>Name</TableHeader>
//                           <TableHeader>Return Status</TableHeader>
//                           <TableHeader>RMA Number</TableHeader>
//                           <TableHeader>Order Type</TableHeader>
//                           <TableHeader>Status</TableHeader>
//                           <TableHeader>Segment</TableHeader>
//                           <TableHeader>Subsegment</TableHeader>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-blue-50">
//                         <AnimatePresence>
//                           {filteredSalesData.map((data, index) => (
//                             <motion.tr
//                               key={data.SalesOrder}
//                               variants={itemVariants}
//                               custom={index}
//                               initial="hidden"
//                               animate="visible"
//                               exit="hidden"
//                               className="hover:bg-blue-50/50 transition-colors duration-200"
//                               whileHover={{ scale: 1.002 }}
//                             >
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                                 {data.SalesOrder}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.CustomerAccount}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.Name}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <span
//                                   className={`
//                                     inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                                     ${
//                                       data.ReturnStatus === "New"
//                                         ? "bg-green-100 text-green-800"
//                                         : "bg-yellow-100 text-yellow-800"
//                                     }
//                                   `}
//                                 >
//                                   {data.ReturnStatus}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.RMANumber}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.OrderType}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                   {data.Status}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.Segment}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                 {data.Subsegment}
//                               </td>
//                             </motion.tr>
//                           ))}
//                         </AnimatePresence>
//                         {filteredSalesData.length === 0 && (
//                           <motion.tr
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                           >
//                             <td
//                               colSpan={9}
//                               className="px-6 py-8 text-center text-gray-500 bg-gray-50/50"
//                             >
//                               No sales records found matching your criteria.
//                             </td>
//                           </motion.tr>
//                         )}
//                       </tbody>
//                     </table>
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

// export default CustomerSerials;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, ClipboardList, ChevronDown, Users2 } from "lucide-react";

// Debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface SalesData {
  SalesOrder: string;
  CustomerAccount: string;
  Name: string;
  ReturnStatus: string;
  RMANumber: string;
  OrderType: string;
  Status: string;
  Segment: string;
  Subsegment: string;
}

const CustomerSerials: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("OrderNumber");
  const [customerData, setCustomerData] = useState<SalesData[]>([]);
  const [searchSalesOrder, setSearchSalesOrder] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(5); // State for "Load More" feature

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchSalesOrder(value);
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
        const response = await axios.get<{ message: string; data: SalesData[] }>(
          "http://54.210.159.220:8000/sales-data"
        );
        setCustomerData(response.data.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSalesData = useMemo(() => {
    return customerData
      .filter(
        (data) =>
          (searchSalesOrder === "" ||
            data.SalesOrder.toLowerCase().includes(searchSalesOrder.toLowerCase())) &&
          (statusFilter === "" || data.Status === statusFilter)
      )
      .slice(0, visibleRows); // Use visibleRows for "Load More" feature
  }, [customerData, searchSalesOrder, statusFilter, visibleRows]);

  const SearchBar = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    filter, 
    onFilterChange, 
    filterOptions, 
    filterPlaceholder 
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
          onChange={(e) => onChange(e)}
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
  ));

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
      {children}
    </th>
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
            <Users2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Customer Sales Data
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            View and manage customer sales information
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
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-800">Sales Records</h2>
                </div>

                <SearchBar
                  value={searchSalesOrder}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by Sales Order..."
                  filter={statusFilter}
                  onFilterChange={(e) => setStatusFilter(e.target.value)}
                  filterOptions={Array.from(new Set(customerData.map((data) => data.Status)))}
                  filterPlaceholder="All Statuses"
                />

                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-100">
                      <thead>
                        <tr>
                          <TableHeader>Sales Order</TableHeader>
                          <TableHeader>Customer Account</TableHeader>
                          <TableHeader>Name</TableHeader>
                          <TableHeader>Return Status</TableHeader>
                          <TableHeader>RMA Number</TableHeader>
                          <TableHeader>Order Type</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Segment</TableHeader>
                          <TableHeader>Subsegment</TableHeader>
                        </tr>
                      </thead>
                      {/* Scrollable Table Body */}
                      <tbody
                        className="divide-y divide-blue-50 block max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
                        style={{ display: "block" }}
                      >
                        <AnimatePresence>
                          {filteredSalesData.map((data, index) => (
                            <motion.tr
                              key={data.SalesOrder}
                              variants={itemVariants}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="hover:bg-blue-50/50 transition-colors duration-200"
                              whileHover={{ scale: 1.002 }}
                              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                {data.SalesOrder}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.CustomerAccount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.Name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${
                                      data.ReturnStatus === "New"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  `}
                                >
                                  {data.ReturnStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.RMANumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.OrderType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {data.Status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.Segment}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {data.Subsegment}
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {filteredSalesData.length === 0 && (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: "table", width: "100%", tableLayout: "fixed" }}
                          >
                            <td
                              colSpan={9}
                              className="px-6 py-8 text-center text-gray-500 bg-gray-50/50"
                            >
                              No sales records found matching your criteria.
                            </td>
                          </motion.tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Load More Button */}
                {filteredSalesData.length >= visibleRows && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      onClick={() => setVisibleRows((prev) => prev + 5)}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerSerials;
