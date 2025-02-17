// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Search, Package, Loader2, X, ArrowRight, ClipboardList } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Home() {
//     const router = useNavigate();
//     const [receiptNumber, setReceiptNumber] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const containerVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.4,
//                 ease: "easeOut"
//             }
//         }
//     };

//     const handleSearch = async () => {
//         if (!receiptNumber.trim()) {
//             setError('Please enter an inspection number');
//             return;
//         }
        
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.post('http://54.210.159.220:8000/get-receipt-data', {
//                 receipt_number: receiptNumber
//             });
//             setData(response.data);
//         } catch (error) {
//             console.error('Error fetching details:', error);
//             setError('Failed to fetch details. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClear = () => {
//         setReceiptNumber('');
//         setData(null);
//         setError('');
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !loading) {
//             handleSearch();
//         }
//     };

//     return (
//         <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
//         >
//             <div className="max-w-4xl mx-auto space-y-8">
//                 {/* Header Section */}
//                 <motion.div 
//                     className="text-center"
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
//                     >
//                         <Package className="w-8 h-8 text-blue-600" />
//                     </motion.div>
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Inspection Search</h1>
//                     <p className="text-gray-600">Enter an inspection number to view detailed information</p>
//                 </motion.div>

//                 {/* Search Section */}
//                 <motion.div 
//                     className="bg-white rounded-xl shadow-lg p-6"
//                     whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     <div className="flex items-center gap-4">
//                         <div className="relative flex-1">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Search className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Inspection Number"
//                                 value={receiptNumber}
//                                 onChange={(e) => setReceiptNumber(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                 disabled={loading}
//                             />
//                             {receiptNumber && (
//                                 <button
//                                     onClick={handleClear}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                 >
//                                     <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                 </button>
//                             )}
//                         </div>
//                         <motion.button
//                             onClick={handleSearch}
//                             disabled={loading}
//                             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 flex items-center gap-2"
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                     Searching...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Search className="w-5 h-5" />
//                                     Search
//                                 </>
//                             )}
//                         </motion.button>
//                     </div>

//                     <AnimatePresence mode="wait">
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: 10 }}
//                                 className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2"
//                             >
//                                 <X className="w-5 h-5 flex-shrink-0" />
//                                 <p>{error}</p>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </motion.div>

//                 {/* Results Section */}
//                 <AnimatePresence mode="wait">
//                     {data && (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             className="bg-white rounded-xl shadow-lg p-6"
//                         >
//                             <div className="flex items-center gap-3 mb-6">
//                                 <ClipboardList className="w-6 h-6 text-blue-600" />
//                                 <h2 className="text-xl font-bold text-gray-900">Inspection Details</h2>
//                             </div>
                            
//                             <div className="grid gap-6 md:grid-cols-2">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Inspection Number</label>
//                                         <p className="text-gray-900 font-medium">{data.receipt_number}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Overall Condition</label>
//                                         <p className="text-gray-900 font-medium">{data.overall_condition}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Item Description</label>
//                                         <p className="text-gray-900 font-medium">{data.item_description}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Brand Name</label>
//                                         <p className="text-gray-900 font-medium">{data.brand_name}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Original Sales Order</label>
//                                         <p className="text-gray-900 font-medium">{data.original_sales_order_number}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Return Order Number</label>
//                                         <p className="text-gray-900 font-medium">{data.return_order_number}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Return Quantity</label>
//                                         <p className="text-gray-900 font-medium">{data.return_qty}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mt-6 pt-6 border-t border-gray-200">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Shipped To</label>
//                                         <p className="text-gray-900 font-medium">{data.shipping_info.shipped_to_person}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-500">Address</label>
//                                         <p className="text-gray-900 font-medium">
//                                             {data.shipping_info.address}, {data.shipping_info.city}, {data.shipping_info.state}, {data.shipping_info.country}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Call to Action Section */}
//                 <motion.div 
//                     className="text-center space-y-6"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                 >
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Auditly offers an AI-driven solution to simplify and enhance your product return process. 
//                         Experience efficiency and transparency like never before.
//                     </p>
//                     <motion.button
//                         onClick={() => router('/options')}
//                         className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                     >
//                         Start a Return
//                         <ArrowRight className="w-5 h-5" />
//                     </motion.button>
//                 </motion.div>
//             </div>
//         </motion.div>
//     );
// }


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Search, Package, Loader2, X, ArrowRight, ClipboardList, Box, Truck, Building2, ShoppingBag } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Home() {
//     const router = useNavigate();
//     const [receiptNumber, setReceiptNumber] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleSearch = async () => {
//         if (!receiptNumber.trim()) {
//             setError('Please enter an inspection number');
//             return;
//         }
        
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.post('http://54.210.159.220:8000/get-receipt-data', {
//                 receipt_number: receiptNumber
//             });
//             setData(response.data);
//         } catch (error) {
//             console.error('Error fetching details:', error);
//             setError('Failed to fetch details. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClear = () => {
//         setReceiptNumber('');
//         setData(null);
//         setError('');
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !loading) {
//             handleSearch();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
//             <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//                 {/* Hero Section */}
//                 <motion.div 
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-center mb-16"
//                 >
//                     <motion.div
//                         initial={{ scale: 0.8 }}
//                         animate={{ scale: 1 }}
//                         transition={{ 
//                             type: "spring",
//                             stiffness: 200,
//                             damping: 20
//                         }}
//                         className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
//                     >
//                         <Package className="w-10 h-10 text-white" />
//                     </motion.div>
//                     <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                         Return Inspection Portal
//                     </h1>
//                     <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//                         Track and manage your return inspections with real-time updates and detailed information
//                     </p>
//                 </motion.div>

//                 {/* Search Card */}
//                 <motion.div 
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="max-w-3xl mx-auto"
//                 >
//                     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                         <div className="p-8">
//                             <div className="flex gap-4">
//                                 <div className="relative flex-1">
//                                     <input
//                                         type="text"
//                                         placeholder="Enter inspection number..."
//                                         value={receiptNumber}
//                                         onChange={(e) => setReceiptNumber(e.target.value)}
//                                         onKeyPress={handleKeyPress}
//                                         className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
//                                         disabled={loading}
//                                     />
//                                     {receiptNumber && (
//                                         <button
//                                             onClick={handleClear}
//                                             className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
//                                         >
//                                             <X className="w-5 h-5 text-gray-400" />
//                                         </button>
//                                     )}
//                                 </div>
//                                 <motion.button
//                                     onClick={handleSearch}
//                                     disabled={loading}
//                                     className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200"
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                 >
//                                     {loading ? (
//                                         <Loader2 className="w-6 h-6 animate-spin" />
//                                     ) : (
//                                         <Search className="w-6 h-6" />
//                                     )}
//                                 </motion.button>
//                             </div>

//                             <AnimatePresence mode="wait">
//                                 {error && (
//                                     <motion.div
//                                         initial={{ opacity: 0, y: -10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: 10 }}
//                                         className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2"
//                                     >
//                                         <X className="w-5 h-5 flex-shrink-0" />
//                                         <p>{error}</p>
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </div>

//                         <AnimatePresence mode="wait">
//                             {data && (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                     className="border-t border-gray-100"
//                                 >
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
//                                         <motion.div 
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: 0.1 }}
//                                             className="p-6"
//                                         >
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 <div className="p-2 bg-blue-50 rounded-lg">
//                                                     <Box className="w-5 h-5 text-blue-600" />
//                                                 </div>
//                                                 <h3 className="font-semibold text-gray-900">Item Details</h3>
//                                             </div>
//                                             <dl className="space-y-2">
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Description</dt>
//                                                     <dd className="font-medium text-gray-900">{data.item_description}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Brand</dt>
//                                                     <dd className="font-medium text-gray-900">{data.brand_name}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Condition</dt>
//                                                     <dd className="font-medium text-gray-900">{data.overall_condition}</dd>
//                                                 </div>
//                                             </dl>
//                                         </motion.div>

//                                         <motion.div 
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: 0.2 }}
//                                             className="p-6"
//                                         >
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 <div className="p-2 bg-indigo-50 rounded-lg">
//                                                     <ShoppingBag className="w-5 h-5 text-indigo-600" />
//                                                 </div>
//                                                 <h3 className="font-semibold text-gray-900">Order Info</h3>
//                                             </div>
//                                             <dl className="space-y-2">
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Return Order #</dt>
//                                                     <dd className="font-medium text-gray-900">{data.return_order_number}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Original Order #</dt>
//                                                     <dd className="font-medium text-gray-900">{data.original_sales_order_number}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Quantity</dt>
//                                                     <dd className="font-medium text-gray-900">{data.return_qty}</dd>
//                                                 </div>
//                                             </dl>
//                                         </motion.div>

//                                         <motion.div 
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: 0.3 }}
//                                             className="p-6"
//                                         >
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 <div className="p-2 bg-purple-50 rounded-lg">
//                                                     <Building2 className="w-5 h-5 text-purple-600" />
//                                                 </div>
//                                                 <h3 className="font-semibold text-gray-900">Shipping Address</h3>
//                                             </div>
//                                             <dl className="space-y-2">
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Recipient</dt>
//                                                     <dd className="font-medium text-gray-900">{data.shipping_info.shipped_to_person}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Address</dt>
//                                                     <dd className="font-medium text-gray-900">
//                                                         {data.shipping_info.address}
//                                                     </dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Location</dt>
//                                                     <dd className="font-medium text-gray-900">
//                                                         {data.shipping_info.city}, {data.shipping_info.state}
//                                                     </dd>
//                                                 </div>
//                                             </dl>
//                                         </motion.div>

//                                         <motion.div 
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: 0.4 }}
//                                             className="p-6"
//                                         >
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 <div className="p-2 bg-green-50 rounded-lg">
//                                                     <Truck className="w-5 h-5 text-green-600" />
//                                                 </div>
//                                                 <h3 className="font-semibold text-gray-900">Inspection Status</h3>
//                                             </div>
//                                             <dl className="space-y-2">
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Receipt Number</dt>
//                                                     <dd className="font-medium text-gray-900">{data.receipt_number}</dd>
//                                                 </div>
//                                                 <div>
//                                                     <dt className="text-sm text-gray-500">Status</dt>
//                                                     <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                         Inspection Complete
//                                                     </dd>
//                                                 </div>
//                                             </dl>
//                                         </motion.div>
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </motion.div>

//                 {/* Call to Action */}
//                 <motion.div 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     className="mt-12 text-center"
//                 >
//                     <motion.button
//                         onClick={() => router('/options')}
//                         className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                     >
//                         Start New Return
//                         <ArrowRight className="w-5 h-5" />
//                     </motion.button>
//                     <p className="mt-4 text-gray-600">
//                         Experience our AI-powered return process management system
//                     </p>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Loader2, X, ArrowRight, ClipboardList, Box, Truck, Building2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const router = useNavigate();
    const [receiptNumber, setReceiptNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!receiptNumber.trim()) {
            setError('Please enter an inspection number');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://54.210.159.220:8000/get-receipt-data', {
                receipt_number: receiptNumber
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
            setError('Failed to fetch details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setReceiptNumber('');
        setData(null);
        setError('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Return Management</span>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    >
                        <Package className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Return Inspection Portal
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Track and manage your return inspections with real-time updates and detailed information
                    </p>
                </motion.div>

                {/* Search Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="p-8">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Enter inspection number..."
                                        value={receiptNumber}
                                        onChange={(e) => setReceiptNumber(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-lg"
                                        disabled={loading}
                                    />
                                    {receiptNumber && (
                                        <button
                                            onClick={handleClear}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                                <motion.button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transform hover:scale-[1.02] active:scale-[0.98]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Search className="w-6 h-6" />
                                    )}
                                </motion.button>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2"
                                    >
                                        <X className="w-5 h-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                            {data && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="border-t border-gray-100"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Box className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Item Details</h3>
                                            </div>
                                            <dl className="space-y-2">
                                                <div>
                                                    <dt className="text-sm text-gray-500">Description</dt>
                                                    <dd className="font-medium text-gray-900">{data.item_description}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Brand</dt>
                                                    <dd className="font-medium text-gray-900">{data.brand_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Condition</dt>
                                                    <dd className="font-medium text-gray-900">{data.overall_condition}</dd>
                                                </div>
                                            </dl>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Order Info</h3>
                                            </div>
                                            <dl className="space-y-2">
                                                <div>
                                                    <dt className="text-sm text-gray-500">Return Order #</dt>
                                                    <dd className="font-medium text-gray-900">{data.return_order_number}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Original Order #</dt>
                                                    <dd className="font-medium text-gray-900">{data.original_sales_order_number}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Quantity</dt>
                                                    <dd className="font-medium text-gray-900">{data.return_qty}</dd>
                                                </div>
                                            </dl>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                                            </div>
                                            <dl className="space-y-2">
                                                <div>
                                                    <dt className="text-sm text-gray-500">Recipient</dt>
                                                    <dd className="font-medium text-gray-900">{data.shipping_info.shipped_to_person}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Address</dt>
                                                    <dd className="font-medium text-gray-900">
                                                        {data.shipping_info.address}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Location</dt>
                                                    <dd className="font-medium text-gray-900">
                                                        {data.shipping_info.city}, {data.shipping_info.state}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Truck className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Inspection Status</h3>
                                            </div>
                                            <dl className="space-y-2">
                                                <div>
                                                    <dt className="text-sm text-gray-500">Receipt Number</dt>
                                                    <dd className="font-medium text-gray-900">{data.receipt_number}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Status</dt>
                                                    <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        Inspection Complete
                                                    </dd>
                                                </div>
                                            </dl>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <motion.button
                        onClick={() => router('/options')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transform hover:scale-[1.02] active:scale-[0.98]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start New Return
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <p className="mt-4 text-gray-600">
                        Experience our AI-powered return process management system
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
