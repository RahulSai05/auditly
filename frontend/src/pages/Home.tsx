// import dummy from "../assets/dummy.svg";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const router = useNavigate();
//   return (
//     <div className=" h-[75vh]">
//       <CustomerData />
//       <div className="text-center">
//         {/* <div className="mt-7">Click 'Start a Return' to begin the process.</div> */}
//         <button
//           onClick={() => router("/options")}
//           className="bg-[#5986E7] text-white px-4 mt-8 py-2 rounded-md"
//         >
//           Start a Return
//         </button>
//       </div>
//     </div>
//   );
// }

// const CustomerData = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   console.log(searchQuery);
//   const dummyData = [
//     {
//       acknowledgmentId: "RO54321",
//       returnDate: "18/09/2024",
//       products: [
//         {
//           name: "52093361USA ~ SMB RIDGE CREST PL (E)PT",
//           serialNumber: "SN1234567890",
//         },
//       ],
//     },
//     {
//       acknowledgmentId: "73920",
//       returnDate: "24/10/2024",
//       products: [
//         {
//           name: "Apple MacBook Air 2022 (13.6-inch, M2, 8GB, 256GB, macOS, Midnight)",
//           serialNumber: "SN9876543210",
//         },
//       ],
//     },
//     {
//       acknowledgmentId: "50921",
//       returnDate: "10/05/2024",
//       products: [
//         {
//           name: "Apple AirPods Pro (2nd Generation-USB C) TWS Earbuds with Active Noise",
//           serialNumber: "SN1122334455",
//         },
//       ],
//     },
//     {
//       acknowledgmentId: "91829",
//       returnDate: "14/08/2024",
//       products: [
//         {
//           name: "Apple AirPods (2nd Generation) with Charging Case",
//           serialNumber: "SN6677889900",
//         },
//       ],
//     },
//     {
//       acknowledgmentId: "91830",
//       returnDate: "14/08/2024",
//       products: [
//         {
//           name: "Apple AirPods (2nd Generation) with Charging Case",
//           serialNumber: "SN6677889901",
//         },
//       ],
//     },
//   ];

//   const filterData = () => {
//     if (!searchQuery) {
//       return dummyData.slice(0, 5);
//     }

//     const filtered = dummyData.filter((item) =>
//       item.acknowledgmentId.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return filtered.length > 0 ? filtered : dummyData;
//   };

//   const handleSearch = (e: any) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredData = filterData();

//   return (
//     <div className="p-4">
//       <div className=" max-w-[855px] mx-auto">
//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for Return Acknowledgment"
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//               Search
//             </button>
//           </div>
//         </div>

//         {searchQuery == "" || filteredData.length === 0 ? (
//           <></>
//         ) : (
//           <div className="mt-6 rounded-lg w-full">
//             <h3 className="font-medium mb-2 ml-4">{searchQuery ? "" : ""}</h3>

//             <table className="w-full shadow-md rounded-md border-collapse">
//               <thead className="bg-gray-200 rounded-md">
//                 <tr className="border-b">
//                   <th className="px-4 py-2 text-[11px] text-left">
//                     Item Details
//                   </th>
//                   <th className="px-4 py-2 text-[11px] text-left">
//                     Return Acknowledgment ID
//                   </th>
//                   <th className="px-4 py-2 text-[11px] text-left">
//                     WIP Inspection
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map(
//                   ({ acknowledgmentId, returnDate, products }) =>
//                     products.map(({ name, serialNumber }) => (
//                       <tr key={serialNumber} className="border-b">
//                         <td className="px-4 text-[14px] text-[#475467] py-2">
//                           <div className="flex gap-x-3">
//                             <img
//                               className="w-[48px]"
//                               src={dummy}
//                               alt="Product"
//                             />
//                             <div>{name}</div>
//                           </div>
//                         </td>
//                         <td className="px-4 text-[14px] text-[#475467] py-2">
//                           #{acknowledgmentId}
//                         </td>
//                         <td className="px-4 text-[14px] text-[#475467] py-2">
//                           {/* {returnDate} */}
//                           In progress
//                         </td>
//                       </tr>
//                     ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummy from "../assets/dummy.svg";

export default function Home() {
  const router = useNavigate();
  return (
    <div className="h-[75vh]">
      <CustomerData />
      <div className="text-center">
        <button
          onClick={() => router("/options")}
          className="bg-[#5986E7] text-white px-4 mt-8 py-2 rounded-md"
        >
          Start a Return
        </button>
      </div>
    </div>
  );
}

const CustomerData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/get-receipt-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receipt_number: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Data not found based on receipt number");
      }

      const result = await response.json();
      setData([result]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setData([]);
    setError(null);
  };

  return (
    <div className="p-4">
      <div className="max-w-[855px] mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for Return Acknowledgment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <button
              onClick={handleClear}
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear
            </button>
          )}
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {data.length > 0 && (
          <div className="mt-6 rounded-lg w-full">
            <table className="w-full shadow-md rounded-md border-collapse">
              <thead className="bg-gray-200 rounded-md">
                <tr className="border-b">
                  <th className="px-4 py-2 text-[11px] text-left">Item Details</th>
                  <th className="px-4 py-2 text-[11px] text-left">Return Acknowledgment ID</th>
                  <th className="px-4 py-2 text-[11px] text-left">WIP Inspection</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.receipt_number} className="border-b">
                    <td className="px-4 text-[14px] text-[#475467] py-2">
                      <div className="flex gap-x-3">
                        <img className="w-[48px]" src={dummy} alt="Product" />
                        <div>{item.item_description}</div>
                      </div>
                    </td>
                    <td className="px-4 text-[14px] text-[#475467] py-2">
                      #{item.receipt_number}
                    </td>
                    <td className="px-4 text-[14px] text-[#475467] py-2">
                      In progress
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
