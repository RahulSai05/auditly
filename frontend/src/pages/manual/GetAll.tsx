// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../store/slices/itemSlice";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Package, Send, ArrowLeft, ArrowRight, Loader2, AlertCircle, Package2, Truck, Ruler, FileText } from "lucide-react";

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
//                 "https://auditlyai.com/api/item_order_instance",
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
            
//             // Improved error handling
//             if (err.response && err.response.status === 404) {
//                 setError("We couldn't find a return with that number. Please check your return order number and try again.");
//             } else if (err.message === "Customer ID not found in response.") {
//                 setError("Invalid product data received. Please contact support.");
//             } else if (err.message.includes("Network Error")) {
//                 setError("Network error. Please check your connection and try again.");
//             } else {
//                 setError("An error occurred. Please try again later.");
//             }
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
//         window.location.href = "mailto:help@auditlyai.com";
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && searchQuery && !isLoading) {
//             fetchDetails();
//         }
//     };

//     const containerVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.5,
//                 staggerChildren: 0.1
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 }
//     };

//     return (
//         <motion.div 
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8"
//         >
//             {/* Search Bar */}
//             <motion.div variants={itemVariants} className="mb-8">
//                 <div className="text-center mb-12">
//                     <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <Package className="w-10 h-10 text-blue-600" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-800 mb-3">
//                         Product Return Portal
//                     </h2>
//                     <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                         Enter your Serial Number or Return Order Number below to begin the return process
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3 max-w-2xl mx-auto">
//                     <div className="relative flex-1">
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                             type="text"
//                             placeholder="e.g., RMA54321"
//                             className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             onKeyPress={handleKeyPress}
//                         />
//                     </div>
//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className={`
//                             flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg
//                             transition-all duration-200 shadow-sm
//                             ${!searchQuery || isLoading
//                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                                 : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
//                             }
//                         `}
//                         disabled={!searchQuery || isLoading}
//                         onClick={fetchDetails}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-5 h-5 animate-spin" />
//                                 <span>Searching...</span>
//                             </>
//                         ) : (
//                             <>
//                                 <Search className="w-5 h-5" />
//                                 <span>Search</span>
//                             </>
//                         )}
//                     </motion.button>
//                 </div>
//                 {error && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex items-center gap-2 mt-3 text-red-600 max-w-2xl mx-auto"
//                     >
//                         <AlertCircle className="w-4 h-4" />
//                         <span>{error}</span>
//                     </motion.div>
//                 )}
//             </motion.div>

//             <AnimatePresence mode="wait">
//                 {isFetched && productData ? (
//                     <motion.div
//                         key="results"
//                         initial="hidden"
//                         animate="visible"
//                         exit="hidden"
//                         variants={containerVariants}
//                     >
//                         {/* Information Grid */}
//                         <motion.div 
//                             variants={containerVariants}
//                             className="grid md:grid-cols-2 gap-8 mb-8"
//                         >
//                             {/* General Information */}
//                             <motion.div 
//                                 variants={itemVariants}
//                                 whileHover={{ scale: 1.02 }}
//                                 className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                             >
//                                 <div className="flex items-center justify-center mb-4">
//                                     <Package2 className="w-8 h-8 text-blue-600 mr-2" />
//                                     <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <InfoRow label="Original Sales Order" value={productData.original_sales_order_number} />
//                                     <InfoRow label="Order Line" value={productData.original_sales_order_line} />
//                                     <InfoRow label="Ordered Quantity" value={productData.ordered_qty} />
//                                 </div>
//                             </motion.div>

//                             {/* Return Information */}
//                             <motion.div 
//                                 variants={itemVariants}
//                                 whileHover={{ scale: 1.02 }}
//                                 className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                             >
//                                 <div className="flex items-center justify-center mb-4">
//                                     <FileText className="w-8 h-8 text-green-600 mr-2" />
//                                     <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <InfoRow label="Return Order Number" value={`#${productData.return_order_number}`} />
//                                     <InfoRow label="Order Line" value={productData.return_order_line} />
//                                     <InfoRow label="Return Quantity" value={productData.return_qty} />
//                                 </div>
//                             </motion.div>

//                             {/* Shipping Information */}
//                             <motion.div 
//                                 variants={itemVariants}
//                                 whileHover={{ scale: 1.02 }}
//                                 className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                             >
//                                 <div className="flex items-center justify-center mb-4">
//                                     <Truck className="w-8 h-8 text-purple-600 mr-2" />
//                                     <h3 className="font-bold text-xl text-gray-800">Product Information</h3>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <InfoRow label="Serial Number" value={productData.serial_number} />
//                                     <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
//                                     <InfoRow label="Shipped To" value={productData.shipped_to_person} />
//                                     <InfoRow 
//                                         label="Address" 
//                                         value={`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`} 
//                                     />
//                                 </div>
//                             </motion.div>

//                             {/* Dimensions */}
//                             <motion.div 
//                                 variants={itemVariants}
//                                 whileHover={{ scale: 1.02 }}
//                                 className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                             >
//                                 <div className="flex items-center justify-center mb-4">
//                                     <Ruler className="w-8 h-8 text-orange-600 mr-2" />
//                                     <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <InfoRow label="Depth" value={productData.dimensions.depth} />
//                                     <InfoRow label="Length" value={productData.dimensions.length} />
//                                     <InfoRow label="Breadth" value={productData.dimensions.breadth} />
//                                     <InfoRow label="Weight" value={productData.dimensions.weight} />
//                                 </div>
//                             </motion.div>
//                         </motion.div>

//                         {/* Navigation Buttons */}
//                         <motion.div 
//                             variants={itemVariants}
//                             className="flex justify-end gap-4"
//                         >
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={() => router('/')}
//                                 className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
//                             >
//                                 <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//                                 Back
//                             </motion.button>
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={handleNext}
//                                 className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
//                             >
//                                 Next
//                                 <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                             </motion.button>
//                         </motion.div>
//                     </motion.div>
//                 ) : isFetched && (
//                     <motion.div
//                         key="no-results"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto border border-gray-100"
//                     >
//                         <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Package className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
//                         <p className="text-gray-600 mb-6">
//                             We couldn't find any products matching your search. Please try again or contact our support team.
//                         </p>
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleSendEmail}
//                             className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl mx-auto hover:bg-blue-700 transition-all duration-200 shadow-md"
//                         >
//                             <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                             Contact Support
//                         </motion.button>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     );
// };

// // Helper component for consistent info row styling
// const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
//     <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//         <span className="text-gray-600 font-medium">{label}</span>
//         <span className="text-gray-800 font-semibold">{value}</span>
//     </div>
// );

// export default GetAll;



import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Send, ArrowLeft, ArrowRight, Loader2, AlertCircle, Package2, Truck, Ruler, FileText } from "lucide-react";

const GetAll: React.FC = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const dispatch = useDispatch();
    const router = useNavigate();

    // Format address helper function
    const formatAddress = (address: any) => {
        return `${address.street_number}, ${address.city}, ${address.state}, ${address.country}`;
    };

    const fetchDetails = async (): Promise<void> => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(
                "https://auditlyai.com/api/item_order_instance",
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
            
            // Improved error handling
            if (err.response && err.response.status === 404) {
                setError("We couldn't find a return with that number. Please check your return order number and try again.");
            } else if (err.message === "Customer ID not found in response.") {
                setError("Invalid product data received. Please contact support.");
            } else if (err.message.includes("Network Error")) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
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
        window.location.href = "mailto:help@auditlyai.com";
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
            className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8"
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

                <div className="flex items-center gap-3 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="e.g., RMA54321"
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
                        className="flex items-center gap-2 mt-3 text-red-600 max-w-2xl mx-auto"
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
                        {/* Information Grid */}
                        <motion.div 
                            variants={containerVariants}
                            className="grid md:grid-cols-2 gap-8 mb-8"
                        >
                            {/* Sales Order Info */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Package2 className="w-8 h-8 text-blue-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Sales Order Info</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Sales Order" value={productData.original_sales_order_number} />
                                    <InfoRow label="Order Line" value={productData.original_sales_order_line} />
                                    <InfoRow label="Order Quantity" value={productData.ordered_qty} />
                                    <InfoRow label="Shipped to" value={productData.shipped_to_person} />
                                    <InfoRow label="Customer Address" value={formatAddress(productData.shipped_to_address)} />
                                    <InfoRow label="Billed to" value={productData.shipped_to_person} />
                                    <InfoRow label="Billing Address" value={formatAddress(productData.shipped_to_address)} />
                                </div>
                            </motion.div>

                            {/* Return Order Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-green-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Return Order Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Return Order Number" value={`#${productData.return_order_number}`} />
                                    <InfoRow label="Order Line" value={productData.return_order_line} />
                                    <InfoRow label="Return Quantity" value={productData.return_qty} />
                                    <InfoRow label="Return Pick up Location" value={formatAddress(productData.shipped_to_address)} />
                                </div>
                            </motion.div>

                            {/* Product Information */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Truck className="w-8 h-8 text-purple-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Product Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="SKU Number" value={productData.item_details.item_number} />
                                    <InfoRow label="Item Description" value={productData.item_details.item_description} />
                                    <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
                                    <InfoRow label="SSCC Number" value={productData.sscc_number} />
                                    <InfoRow label="Tag Number" value={productData.tag_number} />
                                </div>
                            </motion.div>

                            {/* Product Dimensions */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Ruler className="w-8 h-8 text-orange-600 mr-2" />
                                    <h3 className="font-bold text-xl text-gray-800">Product Dimensions</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoRow label="Depth" value={`${productData.dimensions.depth} in`} />
                                    <InfoRow label="Length" value={`${productData.dimensions.length} in`} />
                                    <InfoRow label="Breadth" value={`${productData.dimensions.breadth} in`} />
                                    <InfoRow label="Weight" value={`${productData.dimensions.weight} lbs`} />
                                    <InfoRow label="Volume" value={`${productData.dimensions.volume} cu in`} />
                                    <InfoRow label="Size" value={productData.dimensions.size} />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Navigation Buttons */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex justify-end gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router('/')}
                                className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                Back
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
                            >
                                Next
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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

// Helper component for consistent info row styling
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold text-right max-w-[60%] break-words">{value}</span>
    </div>
);

export default GetAll;

