import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { PackageCheck, ClipboardList, MapPin, AlertCircle } from "lucide-react";

interface CustomerData {
  id: number;
  return_order_number: string;
  serial_number: string;
  return_condition: string;
  return_destination: string;
}

const CustomerSerials: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("OrderNumber");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchData = async () => {
      try {
        const response = await axios.get<CustomerData[]>(
          "http://54.210.159.220:8000/customer-item-data"
        );
        const filteredData = response.data.find(
          (item) => item.return_order_number === orderNumber
        );
        setCustomerData(filteredData || null);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderNumber]);

  if (loading)
    return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

      {customerData ? (
        <div className="bg-white p-6 rounded-lg shadow-md max mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <ClipboardList className="w-6 h-6 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">
              Order Number: {customerData.return_order_number}
            </p>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <PackageCheck className="w-6 h-6 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">
              Serial Number: {customerData.serial_number}
            </p>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">
              Return Condition: {customerData.return_condition}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">
              Return Destination: {customerData.return_destination}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">
          No data found for Order Number {orderNumber}
        </p>
      )}
    </div>
  );
};

export default CustomerSerials;
