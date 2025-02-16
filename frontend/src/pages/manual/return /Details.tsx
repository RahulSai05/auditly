
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion } from "framer-motion";
// import { Package2, Truck, Ruler, FileText } from "lucide-react";

// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
//     >
//       {/* Progress Tracker */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
//             { label: "Inspection", status: "upcoming" },
//             { label: "Upload Media", status: "upcoming" },
//             { label: "Compare", status: "upcoming" },
//             { label: "Review & Submit", status: "upcoming" },
//           ]}
//         />
//       </motion.div>

//       {/* Product Details */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <ProductDetails />
//       </motion.div>

//       {/* Information Grid */}
//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         {/* General Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Package2 className="w-8 h-8 text-blue-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//             <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//           </div>
//         </motion.div>

//         {/* Return Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <FileText className="w-8 h-8 text-green-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Return Order Number" value={`#${Item.return_order_number}`} />
//             <InfoRow label="Order Line" value={Item.return_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//           </div>
//         </motion.div>

//         {/* Shipping Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Truck className="w-8 h-8 text-purple-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Serial Number" value={Item.serial_number} />
//             <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//             <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//             <InfoRow 
//               label="Address" 
//               value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//             />
//           </div>
//         </motion.div>

//         {/* Dimensions */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Ruler className="w-8 h-8 text-orange-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Depth" value={Item.dimensions.depth} />
//             <InfoRow label="Length" value={Item.dimensions.length} />
//             <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//             <InfoRow label="Weight" value={Item.dimensions.weight} />
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Navigation Buttons */}
//       <motion.div 
//         variants={itemVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/option/manual")}
//           className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
//         >
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/return/inspection")}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-200"
//         >
//           Next
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }

// // Helper component for consistent info row styling
// const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
//   <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className="text-gray-800 font-semibold">{value}</span>
//   </div>
// );


// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package2, Truck, Ruler, FileText, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
// import { useState } from "react";

// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };

//   const handleNext = async () => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
//       router("/return/inspection");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"
//     >
//       <motion.div 
//         variants={cardVariants}
//         className="mb-8"
//       >
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
//             { label: "Inspection", status: "upcoming" },
//             { label: "Upload Media", status: "upcoming" },
//             { label: "Compare", status: "upcoming" },
//             { label: "Review & Submit", status: "upcoming" },
//           ]}
//         />
//       </motion.div>

//       <motion.div 
//         variants={cardVariants}
//         className="mb-8 bg-white rounded-xl shadow-lg p-6"
//       >
//         <ProductDetails />
//       </motion.div>

//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         <AnimatePresence>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-blue-100 p-3 rounded-full mr-3">
//                 <Package2 className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//               <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-green-100 p-3 rounded-full mr-3">
//                 <FileText className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow 
//                 label="Return Order Number" 
//                 value={`#${Item.return_order_number}`}
//                 highlight 
//               />
//               <InfoRow label="Order Line" value={Item.return_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-purple-100 p-3 rounded-full mr-3">
//                 <Truck className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Serial Number" value={Item.serial_number} highlight />
//               <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//               <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//               <InfoRow 
//                 label="Address" 
//                 value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//               />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-orange-100 p-3 rounded-full mr-3">
//                 <Ruler className="w-6 h-6 text-orange-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Depth" value={Item.dimensions.depth} />
//               <InfoRow label="Length" value={Item.dimensions.length} />
//               <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//               <InfoRow label="Weight" value={Item.dimensions.weight} />
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>

//       <motion.div 
//         variants={cardVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => router("/option/manual")}
//           className="group px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleNext}
//           disabled={isLoading}
//           className="group px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               Next
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }

// const InfoRow = ({ 
//   label, 
//   value, 
//   highlight 
// }: { 
//   label: string; 
//   value: string | number;
//   highlight?: boolean;
// }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`
//       flex justify-between items-center py-3 border-b border-gray-100 last:border-0
//       ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}
//     `}
//   >
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className={`
//       font-semibold
//       ${highlight ? 'text-blue-700' : 'text-gray-800'}
//     `}>
//       {value}
//     </span>
//   </motion.div>
// );


import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package2, Send, ArrowLeft, ArrowRight, Loader2, AlertCircle, Truck, Ruler, FileText } from "lucide-react";
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";

const GetAll: React.FC = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const dispatch = useDispatch();
    const router = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const fetchDetails = async (): Promise<void> => {
        setIsLoading(true);
        setError("");
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
            setError(err.message || "An error occurred while fetching the data.");
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery && !isLoading) {
            fetchDetails();
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
        >
            {/* Progress Tracker */}
            <motion.div variants={itemVariants} className="mb-8">
                <Stepper
                    steps={[
                        { label: "Your details", status: "current" },
                        { label: "Inspection", status: "upcoming" },
                        { label: "Upload Media", status: "upcoming" },
                        { label: "Compare", status: "upcoming" },
                        { label: "Review & Submit", status: "upcoming" },
                    ]}
                />
            </motion.div>

            {/* Search Section */}
            <motion.div 
                variants={itemVariants}
                className="mb-8 bg-white rounded-xl p-6 shadow-lg"
            >
                <div className="flex items-center justify-center mb-4">
                    <Package2 className="w-8 h-8 text-blue-600 mr-2" />
                    <h2 className="font-bold text-xl text-gray-800">
                        Search Product Details
                    </h2>
                </div>
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Serial or Return Number"
                                className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                                transition-all duration-200
                                ${!searchQuery || isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }
                            `}
                            disabled={!searchQuery || isLoading}
                            onClick={fetchDetails}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Search</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mt-3 text-red-600"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {isFetched && productData ? (
                    <>
                        {/* Product Details */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <ProductDetails />
                        </motion.div>

                        {/* Information Grid */}
                        <motion.div 
                            variants={containerVariants}
                            className="grid md:grid-cols-2 gap-8 mb-8"
                        >
                            {/* General Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Package2 className="w-8 h-8 text-blue-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">General Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Original Sales Order" value={productData.original_sales_order_number} />
                                    <InfoRow label="Order Line" value={productData.original_sales_order_line} />
                                    <InfoRow label="Ordered Quantity" value={productData.ordered_qty} />
                                </div>
                            </motion.div>

                            {/* Return Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-green-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Return Order Number" value={`#${productData.return_order_number}`} />
                                    <InfoRow label="Order Line" value={productData.return_order_line} />
                                    <InfoRow label="Return Quantity" value={productData.return_qty} />
                                </div>
                            </motion.div>

                            {/* Shipping Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Truck className="w-8 h-8 text-purple-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Serial Number" value={productData.serial_number} />
                                    <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
                                    <InfoRow label="Shipped To" value={productData.shipped_to_person} />
                                    <InfoRow 
                                        label="Address" 
                                        value={`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`} 
                                    />
                                </div>
                            </motion.div>

                            {/* Dimensions */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Ruler className="w-8 h-8 text-orange-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Depth" value={productData.dimensions.depth} />
                                    <InfoRow label="Length" value={productData.dimensions.length} />
                                    <InfoRow label="Breadth" value={productData.dimensions.breadth} />
                                    <InfoRow label="Weight" value={productData.dimensions.weight} />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Navigation Buttons */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex justify-end gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router('/')}
                                className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            >
                                Back
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Next
                            </motion.button>
                        </motion.div>
                    </>
                ) : isFetched && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl p-8 shadow-lg text-center max-w-2xl mx-auto"
                    >
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any products matching your search. Please try again or contact our support team.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendEmail}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl mx-auto hover:bg-blue-700 transition-colors duration-200 shadow-md"
                        >
                            <Send className="w-5 h-5" />
                            Contact Support
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold">{value}</span>
    </div>
);

export default GetAll;
