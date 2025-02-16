// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package2, Truck, Search, Filter, Users, Database, Loader2 } from "lucide-react";

// interface Item {
//   id: number;
//   item_number: string;
//   item_description: string;
//   category: string;
// }

// interface CustomerData {
//   id: number;
//   return_order_number: string;
//   serial_number: string;
//   return_condition: string;
//   return_destination: string;
// }

// const DashboardTables: React.FC = () => {
//   const [items, setItems] = useState<Item[]>([]);
//   const [customerData, setCustomerData] = useState<CustomerData[]>([]);
//   const [searchItem, setSearchItem] = useState("");
//   const [searchCustomer, setSearchCustomer] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [conditionFilter, setConditionFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate();

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
//         const [itemsResponse, customerDataResponse] = await Promise.all([
//           axios.get<Item[]>("http://54.210.159.220:8000/items"),
//           axios.get<CustomerData[]>("http://54.210.159.220:8000/customer-item-data"),
//         ]);

//         setItems(itemsResponse.data);
//         setCustomerData(customerDataResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Memoize filtered items and customer data
//   const filteredItems = useMemo(() => {
//     return items
//       .filter(
//         (item) =>
//           (searchItem === "" ||
//             String(item.item_number)
//               .toLowerCase()
//               .includes(searchItem.toLowerCase())) &&
//           (categoryFilter === "" || item.category === categoryFilter)
//       )
//       .slice(0, 5); // Limit to 5 items
//   }, [items, searchItem, categoryFilter]);

//   const filteredCustomerData = useMemo(() => {
//     return customerData
//       .filter(
//         (data) =>
//           (searchCustomer === "" ||
//             String(data.return_order_number)
//               .toLowerCase()
//               .includes(searchCustomer.toLowerCase())) &&
//           (conditionFilter === "" || data.return_condition === conditionFilter)
//       )
//       .slice(0, 5); // Limit to 5 items
//   }, [customerData, searchCustomer, conditionFilter]);

//   // Memoize SearchBar to prevent unnecessary re-renders
//   const SearchBar = React.memo(({ 
//     value, 
//     onChange, 
//     placeholder, 
//     filter, 
//     onFilterChange, 
//     filterOptions, 
//     filterPlaceholder 
//   }) => (
//     <div className="flex gap-4 mb-4">
//       <div className="relative flex-1">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder={placeholder}
//           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
//           value={value}
//           onChange={onChange}
//         />
//       </div>
//       <div className="relative">
//         <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//         <select
//           className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
//     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//       {children}
//     </th>
//   );

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="flex-1 p-8 bg-gray-50"
//     >
//       <AnimatePresence mode="wait">
//         {isLoading ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="flex items-center justify-center h-full"
//           >
//             <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//           </motion.div>
//         ) : (
//           <motion.div variants={containerVariants} className="grid gap-8">
//             {/* Items Table */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-xl shadow-lg overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <Package2 className="w-6 h-6 text-blue-600" />
//                   <h2 className="text-xl font-bold text-gray-800">Items</h2>
//                 </div>

//                 <SearchBar
//                   value={searchItem}
//                   onChange={(e) => setSearchItem(e.target.value)}
//                   placeholder="Search by Item Number..."
//                   filter={categoryFilter}
//                   onFilterChange={(e) => setCategoryFilter(e.target.value)}
//                   filterOptions={Array.from(new Set(items.map((item) => item.category)))}
//                   filterPlaceholder="All Categories"
//                 />

//                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <TableHeader>Item Number</TableHeader>
//                           <TableHeader>Description</TableHeader>
//                           <TableHeader>Category</TableHeader>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredItems.map((item) => (
//                           <motion.tr
//                             key={item.id}
//                             className="hover:bg-blue-50 transition-colors duration-150"
//                             whileHover={{ scale: 1.002 }}
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                               {item.item_number}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                               {item.item_description}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                               {item.category}
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Customer Data Table */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-xl shadow-lg overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <Users className="w-6 h-6 text-purple-600" />
//                   <h2 className="text-xl font-bold text-gray-800">Customer Item Data</h2>
//                 </div>

//                 <SearchBar
//                   value={searchCustomer}
//                   onChange={(e) => setSearchCustomer(e.target.value)}
//                   placeholder="Search by Order Number..."
//                   filter={conditionFilter}
//                   onFilterChange={(e) => setConditionFilter(e.target.value)}
//                   filterOptions={Array.from(new Set(customerData.map((data) => data.return_condition)))}
//                   filterPlaceholder="All Conditions"
//                 />

//                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <TableHeader>Order Number</TableHeader>
//                           <TableHeader>Serial Number</TableHeader>
//                           <TableHeader>Return Condition</TableHeader>
//                           <TableHeader>Destination</TableHeader>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredCustomerData.map((data) => (
//                           <motion.tr
//                             key={data.id}
//                             className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
//                             whileHover={{ scale: 1.002 }}
//                             onClick={() =>
//                               navigate(
//                                 `/admin/reports/customer-serials?OrderNumber=${data.return_order_number}`
//                               )
//                             }
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                               {data.return_order_number}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                               {data.serial_number}
//                             </td>
//                             <td className="px-6 py-4 text-sm">
//                               <span className={`
//                                 px-3 py-1 rounded-full text-xs font-medium
//                                 ${data.return_condition === 'New' 
//                                   ? 'bg-green-100 text-green-800' 
//                                   : 'bg-yellow-100 text-yellow-800'}
//                               `}>
//                                 {data.return_condition}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                               {data.return_destination}
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default DashboardTables;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package2, Truck, Search, Filter, Users, Database, Loader2 } from "lucide-react";

interface Item {
  id: number;
  item_number: string;
  item_description: string;
  category: string;
}

interface CustomerData {
  id: number;
  return_order_number: string;
  serial_number: string;
  return_condition: string;
  return_destination: string;
}

const DashboardTables: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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
        const [itemsResponse, customerDataResponse] = await Promise.all([
          axios.get<Item[]>("http://54.210.159.220:8000/items"),
          axios.get<CustomerData[]>("http://54.210.159.220:8000/customer-item-data"),
        ]);

        setItems(itemsResponse.data);
        setCustomerData(customerDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered items and customer data
  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          (searchItem === "" ||
            String(item.item_number)
              .toLowerCase()
              .includes(searchItem.toLowerCase())) &&
          (categoryFilter === "" || item.category === categoryFilter)
      )
      .slice(0, 5); // Limit to 5 items
  }, [items, searchItem, categoryFilter]);

  const filteredCustomerData = useMemo(() => {
    return customerData
      .filter(
        (data) =>
          (searchCustomer === "" ||
            String(data.return_order_number)
              .toLowerCase()
              .includes(searchCustomer.toLowerCase())) &&
          (conditionFilter === "" || data.return_condition === conditionFilter)
      )
      .slice(0, 5); // Limit to 5 items
  }, [customerData, searchCustomer, conditionFilter]);

  // Memoize SearchBar to prevent unnecessary re-renders
  const SearchBar = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    filter, 
    onFilterChange, 
    filterOptions, 
    filterPlaceholder 
  }) => (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 p-8 bg-gray-50"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full"
          >
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="grid gap-8">
            {/* Items Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Items</h2>
                </div>

                <SearchBar
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  placeholder="Search by Item Number..."
                  filter={categoryFilter}
                  onFilterChange={(e) => setCategoryFilter(e.target.value)}
                  filterOptions={Array.from(new Set(items.map((item) => item.category)))}
                  filterPlaceholder="All Categories"
                />

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <TableHeader>Item Number</TableHeader>
                          <TableHeader>Description</TableHeader>
                          <TableHeader>Category</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item) => (
                          <motion.tr
                            key={item.id}
                            className="hover:bg-blue-50 transition-colors duration-150"
                            whileHover={{ scale: 1.002 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {item.item_number}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.item_description}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.category}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Customer Data Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Customer Item Data</h2>
                </div>

                <SearchBar
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search by Order Number..."
                  filter={conditionFilter}
                  onFilterChange={(e) => setConditionFilter(e.target.value)}
                  filterOptions={Array.from(new Set(customerData.map((data) => data.return_condition)))}
                  filterPlaceholder="All Conditions"
                />

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <TableHeader>Order Number</TableHeader>
                          <TableHeader>Serial Number</TableHeader>
                          <TableHeader>Return Condition</TableHeader>
                          <TableHeader>Destination</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomerData.map((data) => (
                          <motion.tr
                            key={data.id}
                            className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
                            whileHover={{ scale: 1.002 }}
                            onClick={() =>
                              navigate(
                                `/admin/reports/customer-serials?OrderNumber=${data.return_order_number}`
                              )
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {data.return_order_number}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.serial_number}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`
                                px-3 py-1 rounded-full text-xs font-medium
                                ${data.return_condition === 'New' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'}
                              `}>
                                {data.return_condition}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.return_destination}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardTables;
