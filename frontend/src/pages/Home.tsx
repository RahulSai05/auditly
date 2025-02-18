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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
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
                    <motion.div
                        initial={{ scale: 0.8, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
                    >
                        <Package className="w-10 h-10 text-blue-600" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
                    >
                        Return Inspection Portal
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Track and manage your return inspections with real-time updates
                    </motion.p>
                </motion.div>

                {/* Search Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50">
                        <div className="p-8">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Enter inspection number..."
                                        value={receiptNumber}
                                        onChange={(e) => setReceiptNumber(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm"
                                        disabled={loading}
                                    />
                                    {receiptNumber && (
                                        <motion.button
                                            onClick={handleClear}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors"
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <X className="w-5 h-5 text-blue-400" />
                                        </motion.button>
                                    )}
                                </div>
                                <motion.button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="border-t border-blue-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-blue-50">
                                        {[
                                            {
                                                icon: Box,
                                                title: "Item Details",
                                                data: [
                                                    { label: "Description", value: data.item_description },
                                                    { label: "Brand", value: data.brand_name },
                                                    { label: "Condition", value: data.overall_condition }
                                                ]
                                            },
                                            {
                                                icon: ShoppingBag,
                                                title: "Order Info",
                                                data: [
                                                    { label: "Return Order #", value: data.return_order_number },
                                                    { label: "Original Order #", value: data.original_sales_order_number },
                                                    { label: "Quantity", value: data.return_qty }
                                                ]
                                            },
                                            {
                                                icon: Building2,
                                                title: "Shipping Address",
                                                data: [
                                                    { label: "Recipient", value: data.shipping_info.shipped_to_person },
                                                    { label: "Address", value: data.shipping_info.address },
                                                    { label: "Location", value: `${data.shipping_info.city}, ${data.shipping_info.state}` }
                                                ]
                                            },
                                            {
                                                icon: Truck,
                                                title: "Inspection Status",
                                                data: [
                                                    { label: "Receipt Number", value: data.receipt_number },
                                                    { label: "Status", value: "Inspection Complete", isStatus: true }
                                                ]
                                            }
                                        ].map((section, index) => (
                                            <motion.div
                                                key={section.title}
                                                variants={itemVariants}
                                                className="p-6 group"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                                        className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                                                    >
                                                        <section.icon className="w-6 h-6 text-blue-600" />
                                                    </motion.div>
                                                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                                                </div>
                                                <dl className="space-y-2">
                                                    {section.data.map((item) => (
                                                        <div key={item.label}>
                                                            <dt className="text-sm text-gray-500">{item.label}</dt>
                                                            {item.isStatus ? (
                                                                <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                                                                    {item.value}
                                                                </dd>
                                                            ) : (
                                                                <dd className="font-medium text-gray-900">{item.value}</dd>
                                                            )}
                                                        </div>
                                                    ))}
                                                </dl>
                                            </motion.div>
                                        ))}
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
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
