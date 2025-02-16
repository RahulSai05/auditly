import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get<Item[]>(
          "http://54.210.159.220:8000/items"
        );
        setItems(itemsResponse.data.slice(0, 20));

        const customerDataResponse = await axios.get<CustomerData[]>(
          "http://54.210.159.22:8000/customer-item-data"
        );
        setCustomerData(customerDataResponse.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtered Data
  const filteredItems = items.filter(
    (item) =>
      (searchItem === "" ||
        String(item.item_number)
          .toLowerCase()
          .includes(searchItem.toLowerCase())) &&
      (categoryFilter === "" || item.category === categoryFilter)
  );

  const filteredCustomerData = customerData.filter(
    (data) =>
      (searchCustomer === "" ||
        String(data.return_order_number)
          .toLowerCase()
          .includes(searchCustomer.toLowerCase())) &&
      (conditionFilter === "" || data.return_condition === conditionFilter)
  );

  return (
    <div className="flex-1 p-10">
      <div className="grid gap-10 overflow-hidden">
        {/* Table for Items */}
        <div className=" bg-white p-5 rounded-lg">
          <h2 className="font-semibold text-lg mb-3 text-gray-700">Items</h2>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by Item Number..."
              className="px-3 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-400"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {Array.from(new Set(items.map((item) => item.category))).map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-auto max-h-64  sm:rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Item Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.item_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.item_description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table for Customer Item Data */}
        <div className="flex-1 overflow-hidden bg-white p-5 rounded-lg ">
          <h2 className="font-semibold text-lg mb-3 text-gray-700">
            Customer Item Data
          </h2>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by Order Number..."
              className="px-3 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-400"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="">All Conditions</option>
              {Array.from(
                new Set(customerData.map((data) => data.return_condition))
              ).map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-auto max-h-64  sm:rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Return Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Destination
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomerData.map((data) => (
                  <tr
                    onClick={() =>
                      navigate(
                        `/admin/reports/customer-serials?OrderNumber=${data.return_order_number}`
                      )
                    }
                    key={data.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {data.return_order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {data.serial_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {data.return_condition}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {data.return_destination}
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
