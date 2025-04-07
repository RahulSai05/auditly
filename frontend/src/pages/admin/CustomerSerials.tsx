import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ClipboardList,
  Users2,
  SlidersHorizontal,
  Calendar,
  Tag,
  User,
  Package,
  X,
  FilterX
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface SalesData {
  original_sales_order_number: string;
  original_sales_order_line: number;
  account_number: string;
  shipped_to_person: string;
  item_description: string;
  configuration: string;
  serial_number: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
}

interface SearchFilters {
  salesOrder: string;
  accountNumber: string;
  customerName: string;
  itemDescription: string;
  serialNumber: string;
  dateRange: {
    start: string;
    end: string;
  };
  dateType: 'purchased' | 'shipped' | 'delivered';
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
                <User className="w-4 h-4" />
                Account Number
              </label>
              <input
                type="text"
                value={filters.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter account number..."
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
                onChange={(e) => handleInputChange('dateType', e.target.value as 'purchased' | 'shipped' | 'delivered')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              >
                <option value="purchased">Date Purchased</option>
                <option value="shipped">Date Shipped</option>
                <option value="delivered">Date Delivered</option>
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

const CustomerSerials: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("OrderNumber");
  const [customerData, setCustomerData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    salesOrder: "",
    accountNumber: "",
    customerName: "",
    itemDescription: "",
    serialNumber: "",
    dateRange: {
      start: "",
      end: "",
    },
    dateType: "purchased",
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
    const fetchData = async () => {
      try {
        const response = await axios.get<SalesData[]>(
          "https://auditlyai.com/api/customer-item-data"
        );

        const mappedData = response.data.map((item) => ({
          original_sales_order_number: item.original_sales_order_number || "N/A",
          original_sales_order_line: item.original_sales_order_line || 0,
          account_number: item.account_number || "N/A",
          shipped_to_person: item.shipped_to_person || "N/A",
          item_description: item.item_details?.item_description || "N/A",
          configuration: item.item_details?.configuration || "N/A",
          serial_number: item.serial_number || "N/A",
          date_purchased: item.date_purchased || "N/A",
          date_shipped: item.date_shipped || "N/A",
          date_delivered: item.date_delivered || "N/A",
        }));

        setCustomerData(mappedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSalesData = useMemo(() => {
    return customerData.filter((data) => {
      const matchesSalesOrder = searchFilters.salesOrder === "" || 
        data.original_sales_order_number.toLowerCase().includes(searchFilters.salesOrder.toLowerCase());
      
      const matchesAccountNumber = searchFilters.accountNumber === "" ||
        data.account_number.toLowerCase().includes(searchFilters.accountNumber.toLowerCase());
      
      const matchesCustomerName = searchFilters.customerName === "" ||
        data.shipped_to_person.toLowerCase().includes(searchFilters.customerName.toLowerCase());
      
      const matchesItemDescription = searchFilters.itemDescription === "" ||
        data.item_description.toLowerCase().includes(searchFilters.itemDescription.toLowerCase());
      
      const matchesSerialNumber = searchFilters.serialNumber === "" ||
        data.serial_number.toLowerCase().includes(searchFilters.serialNumber.toLowerCase());

      let matchesDateRange = true;
      if (searchFilters.dateRange.start && searchFilters.dateRange.end) {
        const startDate = new Date(searchFilters.dateRange.start);
        const endDate = new Date(searchFilters.dateRange.end);
        const dateToCheck = new Date(data[`date_${searchFilters.dateType}`]);

        matchesDateRange = dateToCheck >= startDate && dateToCheck <= endDate;
      }

      return matchesSalesOrder && 
             matchesAccountNumber && 
             matchesCustomerName && 
             matchesItemDescription && 
             matchesSerialNumber &&
             matchesDateRange;
    });
  }, [customerData, searchFilters]);

  const exportToXLSX = (data: SalesData[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "sales_data.xlsx");
  };

  const clearFilters = () => {
    setSearchFilters({
      salesOrder: "",
      accountNumber: "",
      customerName: "",
      itemDescription: "",
      serialNumber: "",
      dateRange: {
        start: "",
        end: "",
      },
      dateType: "purchased",
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
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                    >
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Sales Records
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
                      onClick={() => exportToXLSX(filteredSalesData)}
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
                          <Tag className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by sales order number..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.salesOrder}
                          onChange={(e) => setSearchFilters({ ...searchFilters, salesOrder: e.target.value })}
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

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by serial number..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.serialNumber}
                          onChange={(e) => setSearchFilters({ ...searchFilters, serialNumber: e.target.value })}
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
                            <TableHeader>Sales Order</TableHeader>
                            <TableHeader>Order Line</TableHeader>
                            <TableHeader>Customer Account #</TableHeader>
                            <TableHeader>Customer Name</TableHeader>
                            <TableHeader>Item Description</TableHeader>
                            <TableHeader>Item Configuration</TableHeader>
                            <TableHeader>Serial Number</TableHeader>
                            <TableHeader>Date Purchased</TableHeader>
                            <TableHeader>Date Shipped</TableHeader>
                            <TableHeader>Date Delivered</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredSalesData.length === 0 ? (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td
                                  colSpan={10}
                                  className="px-6 py-12 text-center text-gray-500 bg-gray-50/50"
                                >
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <Package className="w-10 h-10 text-gray-400" />
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
                              filteredSalesData.map((data, index) => (
                                <motion.tr
                                  key={`${data.original_sales_order_number}-${index}`}
                                  variants={itemVariants}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className="hover:bg-blue-50/50 transition-colors duration-200"
                                  whileHover={{ scale: 1.002 }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {data.original_sales_order_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.original_sales_order_line}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.account_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.shipped_to_person}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.item_description}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.configuration}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.serial_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.date_purchased}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.date_shipped}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {data.date_delivered}
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

export default CustomerSerials;
