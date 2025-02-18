import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, ClipboardList } from "lucide-react";

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
      .slice(0, 5); // Limit to 5 items
  }, [customerData, searchSalesOrder, statusFilter]);

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
            {/* Customer Data Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Sales Data</h2>
                </div>

                <SearchBar
                  value={searchSalesOrder}
                  onChange={(e) => setSearchSalesOrder(e.target.value)}
                  placeholder="Search by Sales Order..."
                  filter={statusFilter}
                  onFilterChange={(e) => setStatusFilter(e.target.value)}
                  filterOptions={Array.from(new Set(customerData.map((data) => data.Status)))}
                  filterPlaceholder="All Statuses"
                />

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
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
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSalesData.map((data) => (
                          <motion.tr
                            key={data.SalesOrder}
                            className="hover:bg-blue-50 transition-colors duration-150"
                            whileHover={{ scale: 1.002 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {data.SalesOrder}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.CustomerAccount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.Name}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`
                                px-3 py-1 rounded-full text-xs font-medium
                                ${data.ReturnStatus === 'New' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'}
                              `}>
                                {data.ReturnStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.RMANumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.OrderType}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.Status}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.Segment}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {data.Subsegment}
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

export default CustomerSerials;
