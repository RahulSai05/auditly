import { useState } from "react";

const AuditlyInspection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dummyData = [
    {
      acknowledgmentId: "RO54321",
      returnDate: "2024-09-18",
      products: [
        {
          name: "52093361USA ~ SMB RIDGE CREST PL (E)PT",
          serialNumber: "SN1234567890",
        },
      ],
    },
    {
      acknowledgmentId: "73920",
      returnDate: "2024-10-24",
      products: [
        {
          name: "Apple MacBook Air 2022 (13.6-inch, M2, 8GB, 256GB, macOS, Midnight)",
          serialNumber: "SN9876543210",
        },
      ],
    },
    {
      acknowledgmentId: "50921",
      returnDate: "2024-05-10",
      products: [
        {
          name: "Apple AirPods Pro (2nd Generation-USB C) TWS Earbuds with Active Noise",
          serialNumber: "SN1122334455",
        },
      ],
    },
    {
      acknowledgmentId: "91829",
      returnDate: "2024-08-14",
      products: [
        {
          name: "Apple AirPods (2nd Generation) with Charging Case",
          serialNumber: "SN6677889900",
        },
      ],
    },
    {
      acknowledgmentId: "91830",
      returnDate: "2024-08-14",
      products: [
        {
          name: "Apple AirPods (2nd Generation) with Charging Case",
          serialNumber: "SN6677889901",
        },
      ],
    },
  ];

  const filteredData = dummyData.filter((item) => {
    const itemDate = new Date(item.returnDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      item.acknowledgmentId.includes(searchQuery) &&
      (!start || itemDate >= start) &&
      (!end || itemDate <= end)
    );
  });

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Auditly Inspection
      </h2>
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Acknowledgment ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>
      <table className="w-full border-collapse  rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gray-300 text-black text-left">
            <th className="p-3">Acknowledgment ID</th>
            <th className="p-3">Return Date</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Serial Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr
                key={item.acknowledgmentId}
                className="border-b border-gray-300 hover:bg-gray-200"
              >
                <td className="p-3">{item.acknowledgmentId}</td>
                <td className="p-3">{item.returnDate}</td>
                <td className="p-3">{item.products[0].name}</td>
                <td className="p-3">{item.products[0].serialNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditlyInspection;
