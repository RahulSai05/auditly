// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { PackageCheck, ClipboardList, MapPin, AlertCircle } from "lucide-react";

// interface CustomerData {
//   id: number;
//   return_order_number: string;
//   serial_number: string;
//   return_condition: string;
//   return_destination: string;
// }

// const CustomerSerials: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const orderNumber = searchParams.get("OrderNumber");
//   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!orderNumber) return;

//     const fetchData = async () => {
//       try {
//         const response = await axios.get<CustomerData[]>(
//           "http://54.210.159.220:8000/customer-item-data"
//         );
//         const filteredData = response.data.find(
//           (item) => item.return_order_number === orderNumber
//         );
//         setCustomerData(filteredData || null);
//       } catch (error) {
//         console.error("Error fetching customer data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orderNumber]);

//   if (loading)
//     return <div className="text-center py-10 text-lg">Loading...</div>;

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

//       {customerData ? (
//         <div className="bg-white p-6 rounded-lg shadow-md max mx-auto">
//           <div className="flex items-center space-x-4 mb-4">
//             <ClipboardList className="w-6 h-6 text-blue-500" />
//             <p className="text-lg font-medium text-gray-700">
//               Order Number: {customerData.return_order_number}
//             </p>
//           </div>

//           <div className="flex items-center space-x-4 mb-4">
//             <PackageCheck className="w-6 h-6 text-blue-500" />
//             <p className="text-lg font-medium text-gray-700">
//               Serial Number: {customerData.serial_number}
//             </p>
//           </div>

//           <div className="flex items-center space-x-4 mb-4">
//             <AlertCircle className="w-6 h-6 text-blue-500" />
//             <p className="text-lg font-medium text-gray-700">
//               Return Condition: {customerData.return_condition}
//             </p>
//           </div>

//           <div className="flex items-center space-x-4">
//             <MapPin className="w-6 h-6 text-blue-500" />
//             <p className="text-lg font-medium text-gray-700">
//               Return Destination: {customerData.return_destination}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center text-red-500">
//           No data found for Order Number {orderNumber}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CustomerSerials;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

interface SalesData {
  id: number;
  SalesOrder: string;
  CustomerAccount: string;
  Name: string;
  CustomerRequisition: string;
  RMANumber: string;
  OrderType: string;
}

const CustomerSerials: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SalesData[]>("http://54.210.159.220:8000/sales-data");
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-8 bg-gray-50"
    >
      <AnimatePresence>
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
          <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Serials</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Account</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Requisition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMA Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData.map((data) => (
                      <tr key={data.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.SalesOrder}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.CustomerAccount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.CustomerRequisition}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.RMANumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.OrderType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomerSerials;
