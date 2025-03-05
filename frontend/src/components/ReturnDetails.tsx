import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ClipboardList, Users2 } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";

// Debounce function with a shorter delay (100ms)
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface ReturnData {
  return_order_number: string;
  account_number: string;
  shipped_to_person: string;
  item_details: {
    item_description: string;
    configuration: string;
  };
  original_sales_order_number: string;
  original_sales_order_line: number;
  serial_number: string;
  date_purchased: string;
  date_shipped: string;
  date_delivered: string;
  return_created_date: string;
}

const ReturnDetails: React.FC = () => {
  const [returnData, setReturnData] = useState<ReturnData[]>([]);
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Debounced search handler with a shorter delay (100ms)
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchOrderNumber(value);
    }, 100), // 100ms delay
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
        const response = await axios.get<ReturnData[]>(
          "http://54.210.159.220:8000/customer-item-data"
        );

        // Map the API response to the required fields
        const mappedData = response.data.map((item) => ({
          return_order_number: item.return_order_number || "N/A",
          account_number: item.account_number || "N/A",
          shipped_to_person: item.shipped_to_person || "N/A",
          item_details: {
            item_description: item.item_details?.item_description || "N/A",
            configuration: item.item_details?.configuration || "N/A",
          },
          original_sales_order_number: item.original_sales_order_number || "N/A",
          original_sales_order_line: item.original_sales_order_line || 0,
          serial_number: item.serial_number || "N/A",
          date_purchased: item.date_purchased || "N/A",
          date_shipped: item.date_shipped || "N/A",
          date_delivered: item.date_delivered || "N/A",
          return_created_date: item.return_created_date || "N/A",
        }));

        setReturnData(mappedData);
      } catch (error) {
        console.error("Error fetching return data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered return data
  const filteredReturnData = useMemo(() => {
    return returnData.filter(
      (data) =>
        searchOrderNumber === "" ||
        String(data.return_order_number)
          .toLowerCase()
          .includes(searchOrderNumber.toLowerCase())
    );
  }, [returnData, searchOrderNumber]);

  // Export to CSV
  const exportToCSV = (data: ReturnData[]) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "return_records.csv");
  };

  // Export to Excel
  const exportToExcel = (data: ReturnData[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Return Records");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "return_records.xlsx");
  };

  const SearchBar = React.memo(
    ({
      value,
      onChange,
      placeholder,
    }: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder: string;
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
      </div>
    )
  );

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
            Customer Return Details
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            View and manage customer return information
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
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Return Records
                    </h2>
                  </div>
                  <div className="flex h-10">
                    <button
                      onClick={() => exportToExcel(filteredReturnData)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Export to xlsx
                    </button>
                  </div>
                </div>

                <SearchBar
                  value={searchOrderNumber}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by Return Order Number..."
                />

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[300px]">
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <TableHeader>RMA Number</TableHeader>
                            <TableHeader>Customer Account #</TableHeader>
                            <TableHeader>Customer Name</TableHeader>
                            <TableHeader>Item Name</TableHeader>
                            <TableHeader>Item Configuration</TableHeader>
                            <TableHeader>Original Sales </TableHeader>
                            <TableHeader>Sales Line</TableHeader>
                            <TableHeader>Serial Number</TableHeader>
                            <TableHeader>Date Purchased</TableHeader>
                            <TableHeader>Date Shipped</TableHeader>
                            <TableHeader>Date Delivered</TableHeader>
                            <TableHeader>Return Created Date</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredReturnData.map((data, index) => (
                              <motion.tr
                                key={data.return_order_number}
                                variants={itemVariants}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="hover:bg-blue-50/50 transition-colors duration-200"
                                whileHover={{ scale: 1.002 }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                  {data.return_order_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.account_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.shipped_to_person}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.item_details.item_description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.item_details.configuration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.original_sales_order_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.original_sales_order_line}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {data.return_created_date}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                          {filteredReturnData.length === 0 && (
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <td
                                colSpan={13}
                                className="px-6 py-8 text-center text-gray-500 bg-gray-50/50"
                              >
                                No return records found matching your criteria.
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

export default ReturnDetails;
