import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get<Item[]>(
          "http://54.210.159.220:8000/items"
        );
        setItems(itemsResponse.data.slice(0, 20));

        const customerDataResponse = await axios.get<CustomerData[]>(
          "http://54.210.159.220:8000/customer-item-data"
        );
        setCustomerData(customerDataResponse.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 p-10">
      <h1 className="font-bold text-2xl mb-5">Dashboard Tables</h1>
      <div className="grid md:flex gap-10 overflow-hidden">
        {/* Table for Items */}
        <div className="flex-1 overflow-hidden">
          <h2 className="font-semibold text-lg mb-3">Items</h2>
          <div className="overflow-auto max-h-64 shadow-md sm:rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.item_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.item_description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table for Customer Item Data */}
        <div className="flex-1 overflow-hidden">
          <h2 className="font-semibold text-lg mb-3">Customer Item Data</h2>
          <div className="overflow-auto max-h-64 shadow-md sm:rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerData.map((data) => (
                  <tr key={data.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data?.return_order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data?.serial_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data?.return_condition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data?.return_destination}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTables;
