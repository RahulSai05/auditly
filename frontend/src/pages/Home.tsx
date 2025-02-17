// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Search, X, Package, Loader2, ArrowRight, MapPin } from 'lucide-react';
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

//         setError('');
//         setLoading(true);
//         try {
//             const response = await axios.post('http://54.210.159.220:8000/get-receipt-data/', {
//                 receipt_number: receiptNumber,
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

//     const containerVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.5,
//                 staggerChildren: 0.1,
//             },
//         },
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 },
//     };

//     return (
//         <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f9fafb, #f1f5f9)" }}>
//             <div className="max-w-7xl mx-auto px-4 py-12">
//                 {/* Header */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="text-center mb-12"
//                 >
//                     <motion.div variants={itemVariants}>
//                         <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
//                     </motion.div>
//                     <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
//                         Return Inspection Search
//                     </motion.h1>
//                     <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
//                         Enter your inspection number to view detailed information about your return
//                     </motion.p>
//                 </motion.div>

//                 {/* Search Section */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8"
//                 >
//                     <motion.div variants={itemVariants} className="relative">
//                         <input
//                             type="text"
//                             placeholder="Enter Inspection Number"
//                             value={receiptNumber}
//                             onChange={(e) => setReceiptNumber(e.target.value)}
//                             className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         />
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     </motion.div>

//                     <AnimatePresence>
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                                 className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
//                             >
//                                 <X className="w-5 h-5 mr-2" />
//                                 {error}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     <motion.div variants={itemVariants} className="flex gap-4 mt-6">
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleSearch}
//                             disabled={loading}
//                             className="group flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleClear}
//                             className="group flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
//                         >
//                             <X className="w-5 h-5" />
//                             Clear
//                         </motion.button>
//                     </motion.div>
//                 </motion.div>

//                 {/* Results Section */}
//                 <AnimatePresence>
//                     {data && (
//                         <motion.div
//                             initial="hidden"
//                             animate="visible"
//                             variants={containerVariants}
//                             className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
//                         >
//                             <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
//                                 <h2 className="text-xl font-semibold text-gray-800">Inspection Details</h2>
//                             </div>

//                             <div className="p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <InfoCard
//                                         title="Return Information"
//                                         items={[
//                                             { label: 'Inspection Number', value: data.receipt_number },
//                                             { label: 'Overall Condition', value: data.overall_condition },
//                                             { label: 'Return Order Number', value: data.return_order_number },
//                                             { label: 'Return Quantity', value: data.return_qty },
//                                         ]}
//                                     />

//                                     <InfoCard
//                                         title="Product Details"
//                                         items={[
//                                             { label: 'Item Description', value: data.item_description },
//                                             { label: 'Brand Name', value: data.brand_name },
//                                             { label: 'Original Sales Order', value: data.original_sales_order_number },
//                                         ]}
//                                     />
//                                 </div>

//                                 <motion.div
//                                     variants={itemVariants}
//                                     className="mt-6 p-6 bg-blue-50 rounded-lg"
//                                 >
//                                     <div className="flex items-start gap-4">
//                                         <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
//                                             <p className="text-gray-700">
//                                                 <span className="font-medium">{data.shipping_info.shipped_to_person}</span>
//                                                 <br />
//                                                 {data.shipping_info.address},<br />
//                                                 {data.shipping_info.city}, {data.shipping_info.state},<br />
//                                                 {data.shipping_info.country}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Call to Action */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="max-w-2xl mx-auto mt-12 text-center"
//                 >
//                     <motion.p variants={itemVariants} className="text-gray-600 mb-6">
//                         Experience our AI-driven solution to simplify and enhance your product return process.
//                     </motion.p>
//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => router('/options')}
//                         className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium"
//                     >
//                         Start a Return
//                         <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                     </motion.button>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

// function InfoCard({ title, items }) {
//     return (
//         <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={itemVariants}
//             className="rounded-lg border border-gray-200 overflow-hidden"
//         >
//             <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                 <h3 className="font-medium text-gray-700">{title}</h3>
//             </div>
//             <div className="p-4">
//                 <dl className="space-y-4">
//                     {items.map((item, index) => (
//                         <div key={index}>
//                             <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
//                             <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
//                         </div>
//                     ))}
//                 </dl>
//             </div>
//         </motion.div>
//     );
// }

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Search, X, Package, Loader2, ArrowRight, MapPin } from 'lucide-react';
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

//         setError('');
//         setLoading(true);
//         try {
//             const response = await axios.post('http://54.210.159.220:8000/get-receipt-data/', {
//                 receipt_number: receiptNumber,
//             });

//             console.log('API Response:', response.data); // Debugging
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

//     const containerVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.5,
//                 staggerChildren: 0.1,
//             },
//         },
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 },
//     };

//     return (
//         <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f9fafb, #f1f5f9)" }}>
//             <div className="max-w-7xl mx-auto px-4 py-12">
//                 {/* Header */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="text-center mb-12"
//                 >
//                     <motion.div variants={itemVariants}>
//                         <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
//                     </motion.div>
//                     <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
//                         Return Inspection Search
//                     </motion.h1>
//                     <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
//                         Enter your inspection number to view detailed information about your return
//                     </motion.p>
//                 </motion.div>

//                 {/* Search Section */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8"
//                 >
//                     <motion.div variants={itemVariants} className="relative">
//                         <input
//                             type="text"
//                             placeholder="Enter Inspection Number"
//                             value={receiptNumber}
//                             onChange={(e) => setReceiptNumber(e.target.value)}
//                             className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         />
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     </motion.div>

//                     <AnimatePresence>
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                                 className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
//                             >
//                                 <X className="w-5 h-5 mr-2" />
//                                 {error}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     <motion.div variants={itemVariants} className="flex gap-4 mt-6">
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleSearch}
//                             disabled={loading}
//                             className="group flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={handleClear}
//                             className="group flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
//                         >
//                             <X className="w-5 h-5" />
//                             Clear
//                         </motion.button>
//                     </motion.div>
//                 </motion.div>

//                 {/* Results Section */}
//                 <AnimatePresence>
//                     {data ? (
//                         <motion.div
//                             initial="hidden"
//                             animate="visible"
//                             variants={containerVariants}
//                             className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
//                         >
//                             <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
//                                 <h2 className="text-xl font-semibold text-gray-800">Inspection Details</h2>
//                             </div>

//                             <div className="p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <InfoCard
//                                         title="Return Information"
//                                         items={[
//                                             { label: 'Inspection Number', value: data?.receipt_number || 'N/A' },
//                                             { label: 'Overall Condition', value: data?.overall_condition || 'N/A' },
//                                             { label: 'Return Order Number', value: data?.return_order_number || 'N/A' },
//                                             { label: 'Return Quantity', value: data?.return_qty || 'N/A' },
//                                         ]}
//                                     />

//                                     <InfoCard
//                                         title="Product Details"
//                                         items={[
//                                             { label: 'Item Description', value: data?.item_description || 'N/A' },
//                                             { label: 'Brand Name', value: data?.brand_name || 'N/A' },
//                                             { label: 'Original Sales Order', value: data?.original_sales_order_number || 'N/A' },
//                                         ]}
//                                     />
//                                 </div>

//                                 <motion.div
//                                     variants={itemVariants}
//                                     className="mt-6 p-6 bg-blue-50 rounded-lg"
//                                 >
//                                     <div className="flex items-start gap-4">
//                                         <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
//                                             <p className="text-gray-700">
//                                                 <span className="font-medium">{data?.shipping_info?.shipped_to_person || 'N/A'}</span>
//                                                 <br />
//                                                 {data?.shipping_info?.address || 'N/A'},<br />
//                                                 {data?.shipping_info?.city || 'N/A'}, {data?.shipping_info?.state || 'N/A'},<br />
//                                                 {data?.shipping_info?.country || 'N/A'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             </div>
//                         </motion.div>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-center"
//                         >
//                             No data found for the provided inspection number.
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Call to Action */}
//                 <motion.div
//                     initial="hidden"
//                     animate="visible"
//                     variants={containerVariants}
//                     className="max-w-2xl mx-auto mt-12 text-center"
//                 >
//                     <motion.p variants={itemVariants} className="text-gray-600 mb-6">
//                         Experience our AI-driven solution to simplify and enhance your product return process.
//                     </motion.p>
//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => router('/options')}
//                         className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium"
//                     >
//                         Start a Return
//                         <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
//                     </motion.button>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

// function InfoCard({ title, items }) {
//     return (
//         <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={itemVariants}
//             className="rounded-lg border border-gray-200 overflow-hidden"
//         >
//             <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                 <h3 className="font-medium text-gray-700">{title}</h3>
//             </div>
//             <div className="p-4">
//                 <dl className="space-y-4">
//                     {items.map((item, index) => (
//                         <div key={index}>
//                             <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
//                             <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
//                         </div>
//                     ))}
//                 </dl>
//             </div>
//         </motion.div>
//     );
// }


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function Home() {
//     const router = useNavigate();
//     const [receiptNumber, setReceiptNumber] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleSearch = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post('http://54.210.159.220:8000/get-receipt-data', {
//                 receipt_number: receiptNumber
//             });
//             setData(response.data); // Ensure the response structure matches
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching details:', error);
//             setLoading(false);
//             alert('Failed to fetch details. Please try again.');
//         }
//     };

//     const handleClear = () => {
//         setReceiptNumber(''); // Clear the input field
//         setData(null); // Clear the displayed data
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//             {/* Search Section */}
//             <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Return</h1>
//                 <div className="flex items-center gap-4">
//                     <input
//                         type="text"
//                         placeholder="Enter Inspection Number"
//                         value={receiptNumber}
//                         onChange={(e) => setReceiptNumber(e.target.value)}
//                         className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         onClick={handleSearch}
//                         className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
//                     >
//                         Search
//                     </button>
//                     <button
//                         onClick={handleClear}
//                         className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200"
//                     >
//                         Clear
//                     </button>
//                 </div>
//             </div>

//             {/* Data Display Section */}
//             {loading && (
//                 <div className="mt-6 text-blue-500">Loading...</div>
//             )}
//             {data && (
//                 <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md mt-6">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Inspection Details</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full">
//                             <thead>
//                                 <tr>
//                                     <th className="px-4 py-2 text-left text-gray-700">Field</th>
//                                     <th className="px-4 py-2 text-left text-gray-700">Value</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Inspectioin Number</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.receipt_number}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Overall Condition</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.overall_condition}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Item Description</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.item_description}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Brand Name</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.brand_name}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Original Sales Order Number</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.original_sales_order_number}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Return Order Number</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.return_order_number}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Return Quantity</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.return_qty}</td>
//                                 </tr>
//                                 <tr className="border-b">
//                                     <td className="px-4 py-2 font-medium text-gray-700">Shipped To Person</td>
//                                     <td className="px-4 py-2 text-gray-600">{data.shipping_info.shipped_to_person}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="px-4 py-2 font-medium text-gray-700">Address</td>
//                                     <td className="px-4 py-2 text-gray-600">
//                                         {data.shipping_info.address}, {data.shipping_info.city}, {data.shipping_info.state}, {data.shipping_info.country}
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* Bottom Section */}
//             <div className="w-full max-w-2xl mt-6 text-center">
//                 <p className="text-gray-700 mb-6">
//                     Auditly offers an AI-driven solution to simplify and enhance your product return process. Experience efficiency and transparency like never before.
//                 </p>
//                 <button
//                     onClick={() => router('/options')}
//                     className="bg-[#5986E7] text-white px-6 py-3 rounded-lg hover:bg-[#4a6dc4] transition duration-200"
//                 >
//                     Start a Return
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Loader2, X, ArrowRight, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const router = useNavigate();
    const [receiptNumber, setReceiptNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <Package className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Inspection Search</h1>
                    <p className="text-gray-600">Enter an inspection number to view detailed information</p>
                </motion.div>

                {/* Search Section */}
                <motion.div 
                    className="bg-white rounded-xl shadow-lg p-6"
                    whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Inspection Number"
                                value={receiptNumber}
                                onChange={(e) => setReceiptNumber(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={loading}
                            />
                            {receiptNumber && (
                                <button
                                    onClick={handleClear}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <motion.button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Search
                                </>
                            )}
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2"
                            >
                                <X className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ClipboardList className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900">Inspection Details</h2>
                            </div>
                            
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Inspection Number</label>
                                        <p className="text-gray-900 font-medium">{data.receipt_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Overall Condition</label>
                                        <p className="text-gray-900 font-medium">{data.overall_condition}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Item Description</label>
                                        <p className="text-gray-900 font-medium">{data.item_description}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Brand Name</label>
                                        <p className="text-gray-900 font-medium">{data.brand_name}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Original Sales Order</label>
                                        <p className="text-gray-900 font-medium">{data.original_sales_order_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Return Order Number</label>
                                        <p className="text-gray-900 font-medium">{data.return_order_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Return Quantity</label>
                                        <p className="text-gray-900 font-medium">{data.return_qty}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Shipped To</label>
                                        <p className="text-gray-900 font-medium">{data.shipping_info.shipped_to_person}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Address</label>
                                        <p className="text-gray-900 font-medium">
                                            {data.shipping_info.address}, {data.shipping_info.city}, {data.shipping_info.state}, {data.shipping_info.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Call to Action Section */}
                <motion.div 
                    className="text-center space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Auditly offers an AI-driven solution to simplify and enhance your product return process. 
                        Experience efficiency and transparency like never before.
                    </p>
                    <motion.button
                        onClick={() => router('/options')}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start a Return
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}
