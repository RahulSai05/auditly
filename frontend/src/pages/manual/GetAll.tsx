// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../store/slices/itemSlice";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Package, Send, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";

// const GetAll: React.FC = () => {
//     const [productData, setProductData] = useState<any>(null);
//     const [isFetched, setIsFetched] = useState<boolean>(false);
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string>("");

//     const dispatch = useDispatch();
//     const router = useNavigate();

//     const fetchDetails = async (): Promise<void> => {
//         setIsLoading(true);
//         setError("");
//         try {
//             const response = await axios.get(
//                 "http://54.210.159.220:8000/item_order_instance",
//                 { params: { identifier: searchQuery } }
//             );
    
//             if (response.status === 200) {
//                 const data = response.data;
    
//                 if (!data.customer_id) {
//                     throw new Error("Customer ID not found in response.");
//                 }
    
//                 setProductData(data);
//                 setIsFetched(true);
//                 localStorage.setItem('lastItemId', data.item_id.toString());
//                 localStorage.setItem('lastCustomerId', data.customer_id.toString());
//                 dispatch(addItem(data));
//             }
//         } catch (err: any) {
//             console.error("API error:", err);
//             setProductData(null);
//             setIsFetched(true);
//             setError(err.message || "An error occurred while fetching the data.");
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const handleNext = () => {
//         if (productData) {
//             const itemId = localStorage.getItem('lastItemId');
//             console.log('Item ID from Local Storage:', itemId);
//             router('/return/details');
//         }
//     };

//     const handleSendEmail = () => {
//         console.log("Send email functionality to be implemented.");
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && searchQuery && !isLoading) {
//             fetchDetails();
//         }
//     };

//     const cardVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { 
//             opacity: 1, 
//             y: 0,
//             transition: { 
//                 type: "spring",
//                 stiffness: 100,
//                 damping: 15
//             }
//         },
//         hover: {
//             y: -5,
//             transition: {
//                 type: "spring",
//                 stiffness: 400,
//                 damping: 25
//             }
//         }
//     };

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 when: "beforeChildren",
//                 staggerChildren: 0.1
//             }
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white px-4"
//         >
//             <div className="max-w-7xl mx-auto pt-16 pb-8">
//                 <motion.div 
//                     initial={{ y: -20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ type: "spring", stiffness: 100 }}
//                     className="text-center mb-12"
//                 >
//                     <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <Package className="w-10 h-10 text-blue-600" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-800 mb-3">
//                         Product Return Portal
//                     </h2>
//                     <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                         Enter your Serial Number or Return Order Number below to begin the return process
//                     </p>
//                 </motion.div>

//                 {/* Search Bar */}
//                 <motion.div 
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="max-w-2xl mx-auto mb-12"
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                             <input
//                                 type="text"
//                                 placeholder="e.g., RA54321"
//                                 className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                             />
//                         </div>
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             className={`
//                                 flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg
//                                 transition-all duration-200 shadow-sm
//                                 ${!searchQuery || isLoading
//                                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                                     : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
//                                 }
//                             `}
//                             disabled={!searchQuery || isLoading}
//                             onClick={fetchDetails}
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                     <span>Searching...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Search className="w-5 h-5" />
//                                     <span>Search</span>
//                                 </>
//                             )}
//                         </motion.button>
//                     </div>
//                     {error && (
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="flex items-center gap-2 mt-3 text-red-600"
//                         >
//                             <AlertCircle className="w-4 h-4" />
//                             <span>{error}</span>
//                         </motion.div>
//                     )}
//                 </motion.div>

//                 <AnimatePresence mode="wait">
//                     {isFetched && productData ? (
//                         <motion.div
//                             key="results"
//                             initial="hidden"
//                             animate="visible"
//                             exit="hidden"
//                             variants={containerVariants}
//                         >
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                                 {/* General Information Card */}
//                                 <motion.div 
//                                     variants={cardVariants}
//                                     whileHover="hover"
//                                     className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
//                                 >
//                                     <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//                                         <h3 className="text-lg font-semibold text-white">General Information</h3>
//                                     </div>
//                                     <div className="p-6 space-y-4">
//                                         <InfoRow label="Original Sales Order" value={productData.original_sales_order_number} />
//                                         <InfoRow label="Order Line" value={productData.original_sales_order_line} />
//                                         <InfoRow label="Ordered Quantity" value={productData.ordered_qty} />
//                                     </div>
//                                 </motion.div>

//                                 {/* Return Information Card */}
//                                 <motion.div 
//                                     variants={cardVariants}
//                                     whileHover="hover"
//                                     className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
//                                 >
//                                     <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
//                                         <h3 className="text-lg font-semibold text-white">Return Information</h3>
//                                     </div>
//                                     <div className="p-6 space-y-4">
//                                         <InfoRow label="Return Order Number" value={productData.return_order_number} highlight />
//                                         <InfoRow label="Order Line" value={productData.return_order_line} />
//                                         <InfoRow label="Return Quantity" value={productData.return_qty} />
//                                     </div>
//                                 </motion.div>

//                                 {/* Shipping Information Card */}
//                                 <motion.div 
//                                     variants={cardVariants}
//                                     whileHover="hover"
//                                     className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
//                                 >
//                                     <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
//                                         <h3 className="text-lg font-semibold text-white">Shipping Information</h3>
//                                     </div>
//                                     <div className="p-6 space-y-4">
//                                         <InfoRow label="Serial Number" value={productData.serial_number} highlight />
//                                         <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
//                                         <InfoRow label="Shipped To" value={productData.shipped_to_person} />
//                                         <InfoRow 
//                                             label="Address" 
//                                             value={`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`} 
//                                         />
//                                     </div>
//                                 </motion.div>

//                                 {/* Dimensions Card */}
//                                 <motion.div 
//                                     variants={cardVariants}
//                                     whileHover="hover"
//                                     className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
//                                 >
//                                     <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
//                                         <h3 className="text-lg font-semibold text-white">Dimensions</h3>
//                                     </div>
//                                     <div className="p-6 space-y-4">
//                                         <InfoRow label="Depth" value={productData.dimensions.depth} />
//                                         <InfoRow label="Length" value={productData.dimensions.length} />
//                                         <InfoRow label="Breadth" value={productData.dimensions.breadth} />
//                                         <InfoRow label="Weight" value={productData.dimensions.weight} />
//                                     </div>
//                                 </motion.div>
//                             </div>

//                             {/* Navigation Buttons */}
//                             <motion.div 
//                                 variants={cardVariants}
//                                 className="flex justify-end gap-4"
//                             >
//                                 <motion.button
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                     onClick={() => router('/')}
//                                     className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
//                                 >
//                                     <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//                                     Back
//                                 </motion.button>
//                                 <motion.button
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                     onClick={handleNext}
//                                     className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
//                                 >
//                                     Next
//                                     <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                                 </motion.button>
//                             </motion.div>
//                         </motion.div>
//                     ) : isFetched && (
//                         <motion.div
//                             key="no-results"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto border border-gray-100"
//                         >
//                             <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <Package className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
//                             <p className="text-gray-600 mb-6">
//                                 We couldn't find any products matching your search. Please try again or contact our support team.
//                             </p>
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={handleSendEmail}
//                                 className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl mx-auto hover:bg-blue-700 transition-all duration-200 shadow-md"
//                             >
//                                 <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                                 Contact Support
//                             </motion.button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </motion.div>
//     );
// };

// const InfoRow: React.FC<{ 
//     label: string; 
//     value: string | number;
//     highlight?: boolean;
// }> = ({ 
//     label, 
//     value,
//     highlight 
// }) => (
//     <motion.div 
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`
//             flex justify-between items-center py-3 border-b border-gray-100 last:border-0
//             ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}
//         `}
//     >
//         <span className="text-gray-600">{label}</span>
//         <span className={`
//             font-medium
//             ${highlight ? 'text-blue-700' : 'text-gray-900'}
//         `}>
//             {value}
//         </span>
//     </motion.div>
// );

// export default GetAll;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Send, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const GetAll: React.FC = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const dispatch = useDispatch();
    const router = useNavigate();

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

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
        >
            {/* Search Bar */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="text-center mb-12">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        Product Return Portal
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Enter your Serial Number or Return Order Number below to begin the return process
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="e.g., RA54321"
                            className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg
                            transition-all duration-200 shadow-sm
                            ${!searchQuery || isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
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
            </motion.div>

            <AnimatePresence mode="wait">
                {isFetched && productData ? (
                    <motion.div
                        key="results"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={containerVariants}
                    >
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* General Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-blue-600 mr-2" />
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
                        </div>

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
                    </motion.div>
                ) : isFetched && (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto border border-gray-100"
                    >
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any products matching your search. Please try again or contact our support team.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSendEmail}
                            className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl mx-auto hover:bg-blue-700 transition-all duration-200 shadow-md"
                        >
                            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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

