import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, Filter, Loader2 } from "lucide-react";

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
  const [customerData, setCustomerData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchSalesOrder, setSearchSalesOrder] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSalesData = useMemo(() => {
    return customerData
      .filter((data) =>
        (searchSalesOrder === "" || data.SalesOrder.includes(searchSalesOrder)) &&
        (statusFilter === "" || data.Status === statusFilter)
      )
      .slice(0, 5);
  }, [customerData, searchSalesOrder, statusFilter]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex-1 p-8 bg-gray-50"
    >
      <AnimatePresence>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div>
            <Search
              value={searchSalesOrder}
              onChange={(e) => setSearchSalesOrder(e.target.value)}
              placeholder="Search by Sales Order..."
            />
            <Filter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={["Invoiced", "Processing", "Completed", "Returned"]}
              placeholder="Filter by Status"
            />
            <div>
              {filteredSalesData.map((data, index) => (
                <div key={index}>
                  <p>{data.SalesOrder}</p>
                  <p>{data.CustomerAccount}</p>
                  <p>{data.Name}</p>
                  <p>{data.ReturnStatus}</p>
                  <p>{data.RMANumber}</p>
                  <p>{data.OrderType}</p>
                  <p>{data.Status}</p>
                  <p>{data.Segment}</p>
                  <p>{data.Subsegment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomerSerials;
