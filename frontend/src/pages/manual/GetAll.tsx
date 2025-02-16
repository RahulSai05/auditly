// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../store/slices/itemSlice";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const GetAll: React.FC = () => {
//   const [productData, setProductData] = useState<any>(null);
//   const [isFetched, setIsFetched] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const dispatch = useDispatch();
//   const router = useNavigate();

//   const fetchDetails = async (): Promise<void> => {
//     try {
//       const response = await axios.get(
//         `http://54.210.159.220:8000/item_order_instance`,
//         { params: { identifier: searchQuery } }
//       );

//       if (response.status === 200) {
//         console.log("API Response:", response.data); // Debugging
//         const data = response.data;

//         if (!data.customer_id) {
//           throw new Error("Customer ID not found in response.");
//         }

//         setProductData(data);
//         setIsFetched(true);

//         // Store item_id in local storage
//         localStorage.setItem("lastItemId", data.item_id.toString());
//         localStorage.setItem("lastCustomerId", data.customer_id.toString());

//         // Dispatch to Redux
//         dispatch(addItem(data));
//       }
//     } catch (err: any) {
//       console.error("API error:", err);
//       setProductData(null);
//       setIsFetched(true); // Set isFetched to true even if there's an error to show the no results message
//     }
//   };

//   const handleNext = () => {
//     if (productData) {
//       // Optionally retrieve item_id from local storage if needed here or in the next component
//       const itemId = localStorage.getItem("lastItemId");
//       console.log("Item ID from Local Storage:", itemId); // Debug for seeing the stored item_id

//       router("/return/details"); // Navigate to the next page
//     }
//   };

//   const handleSendEmail = () => {
//     // Implement the logic to send an email
//     console.log("Send email functionality to be implemented.");
//   };

//   return (
//     <div className="flex flex-col items-center p-6 pt-[10vh] min-h-[75vh] bg-gray-50">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Enter Serial Number or Return Order Number (RA54321)
//       </h2>

//       {/* Search Bar */}
//       <div className="flex items-center space-x-2 w-full max-w-[855px]">
//         <div className="relative w-full">
//           <input
//             type="text"
//             placeholder="Enter Serial or Return Number"
//             className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button
//           className="bg-blue-600 w-[200px] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           disabled={!searchQuery}
//           onClick={fetchDetails}
//         >
//           Fetch Details
//         </button>
//       </div>

//       {/* Data Container */}
//       {isFetched && productData ? (
//         <>
//           <div className="mt-8 md:p-6 bg-white  rounded-lg max-w-[900px] w-full">
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Card 1: General Information */}
//               <div className="p-6 bg-gray-100 hover:shadow-xl rounded-lg">
//                 <h3 className="font-semibold text-lg mb-4  text-center">
//                   General Information
//                 </h3>
//                 <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
//                   <span>Original Sales Order</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.original_sales_order_number}
//                   </span>
//                   <span>Order Line</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.original_sales_order_line}
//                   </span>
//                   <span>Ordered Quantity</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.ordered_qty}
//                   </span>
//                 </div>
//               </div>

//               {/* Card 2: Return Information */}
//               <div className="p-6 bg-gray-100 hover:shadow-xl rounded-lg">
//                 <h3 className="font-semibold text-lg mb-4  text-center">
//                   Return Information
//                 </h3>
//                 <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
//                   <span>Return Order Number</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.return_order_number}
//                   </span>
//                   <span>Order Line</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.return_order_line}
//                   </span>
//                   <span>Ordered Quantity</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.return_qty}
//                   </span>
//                 </div>
//               </div>

//               {/* Card 3: Shipping Information */}
//               <div className="p-6 bg-gray-100 hover:shadow-xl rounded-lg">
//                 <h3 className="font-semibold text-lg mb-4  text-center">
//                   Shipping Information
//                 </h3>
//                 <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
//                   <span>Serial Number</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.serial_number}
//                   </span>
//                   <span>Vendor Item Number</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.vendor_item_number}
//                   </span>
//                   <span>Shipped To</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.shipped_to_person}
//                   </span>
//                   <span>Address</span>
//                   <span className="font-medium text-gray-800">
//                     :{" "}
//                     {`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`}
//                   </span>
//                 </div>
//               </div>

//               {/* Card 4: Dimensions */}
//               <div className="p-6 bg-gray-100 shadow rounded-lg">
//                 <h3 className="font-semibold text-lg mb-4  text-center">
//                   Dimensions
//                 </h3>
//                 <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
//                   <span>Depth</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.dimensions.depth}
//                   </span>
//                   <span>Length</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.dimensions.length}
//                   </span>
//                   <span>Breadth</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.dimensions.breadth}
//                   </span>
//                   <span>Weight</span>
//                   <span className="font-medium text-gray-800">
//                     : {productData.dimensions.weight}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-end mt-6 max-w-[900px] w-full">
//             <button
//               onClick={() => router("/options")}
//               className="px-4 py-2 bg-gray-300  rounded-lg mr-2 hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       ) : (
//         isFetched && (
//           <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-[900px] w-full text-center">
//             <p className="text-gray-800 mb-4">
//               No results found. Please search again or click the button below to
//               send an email to our team.
//             </p>
//             <button
//               onClick={handleSendEmail}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Send Email
//             </button>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default GetAll;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Send, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const GetAll: React.FC = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const router = useNavigate();

    const fetchDetails = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                "http://54.210.159.220:8000/item_order_instance",
                { params: { identifier: searchQuery } }
            );
    
            if (response.status === 200) {
                const data = response.data;
    
                if (!data.customer_id) {
                    throw new Error("Customer ID not found in response.");
                }
    
                setProductData(data);
                setIsFetched(true);
                localStorage.setItem('lastItemId', data.item_id.toString());
                localStorage.setItem('lastCustomerId', data.customer_id.toString());
                dispatch(addItem(data));
            }
        } catch (err: any) {
            console.error("API error:", err);
            setProductData(null);
            setIsFetched(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleNext = () => {
        if (productData) {
            const itemId = localStorage.getItem('lastItemId');
            console.log('Item ID from Local Storage:', itemId);
            router('/return/details');
        }
    };

    const handleSendEmail = () => {
        console.log("Send email functionality to be implemented.");
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4"
        >
            <div className="max-w-7xl mx-auto pt-16 pb-8">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <Package className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Product Return Portal
                    </h2>
                    <p className="text-gray-600">
                        Enter your Serial Number or Return Order Number below
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="e.g., RA54321"
                                className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
                                !searchQuery 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={!searchQuery || isLoading}
                            onClick={fetchDetails}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Search'
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isFetched && productData ? (
                        <motion.div
                            key="results"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.5,
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* General Information Card */}
                                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-blue-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white">General Information</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <InfoRow label="Original Sales Order" value={productData.original_sales_order_number} />
                                        <InfoRow label="Order Line" value={productData.original_sales_order_line} />
                                        <InfoRow label="Ordered Quantity" value={productData.ordered_qty} />
                                    </div>
                                </motion.div>

                                {/* Return Information Card */}
                                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-green-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white">Return Information</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <InfoRow label="Return Order Number" value={productData.return_order_number} />
                                        <InfoRow label="Order Line" value={productData.return_order_line} />
                                        <InfoRow label="Return Quantity" value={productData.return_qty} />
                                    </div>
                                </motion.div>

                                {/* Shipping Information Card */}
                                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-purple-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white">Shipping Information</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <InfoRow label="Serial Number" value={productData.serial_number} />
                                        <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
                                        <InfoRow label="Shipped To" value={productData.shipped_to_person} />
                                        <InfoRow 
                                            label="Address" 
                                            value={`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`} 
                                        />
                                    </div>
                                </motion.div>

                                {/* Dimensions Card */}
                                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-orange-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white">Dimensions</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <InfoRow label="Depth" value={productData.dimensions.depth} />
                                        <InfoRow label="Length" value={productData.dimensions.length} />
                                        <InfoRow label="Breadth" value={productData.dimensions.breadth} />
                                        <InfoRow label="Weight" value={productData.dimensions.weight} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Navigation Buttons */}
                            <motion.div 
                                variants={cardVariants}
                                className="flex justify-end gap-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router('/')}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ) : isFetched && (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto"
                        >
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                            <p className="text-gray-600 mb-6">
                                We couldn't find any products matching your search. Please try again or contact our support team.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSendEmail}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl mx-auto hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Send className="w-5 h-5" />
                                Contact Support
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

export default GetAll;
