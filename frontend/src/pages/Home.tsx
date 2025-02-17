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
