import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Package, Loader2, ArrowRight, MapPin } from 'lucide-react';
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

        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://54.210.159.220:8000/get-receipt-data/', {
                receipt_number: receiptNumber,
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f9fafb, #f1f5f9)" }}>
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-12"
                >
                    <motion.div variants={itemVariants}>
                        <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
                        Return Inspection Search
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Enter your inspection number to view detailed information about your return
                    </motion.p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <motion.div variants={itemVariants} className="relative">
                        <input
                            type="text"
                            placeholder="Enter Inspection Number"
                            value={receiptNumber}
                            onChange={(e) => setReceiptNumber(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                            >
                                <X className="w-5 h-5 mr-2" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="flex gap-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSearch}
                            disabled={loading}
                            className="group flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClear}
                            className="group flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            <X className="w-5 h-5" />
                            Clear
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-xl font-semibold text-gray-800">Inspection Details</h2>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoCard
                                        title="Return Information"
                                        items={[
                                            { label: 'Inspection Number', value: data.receipt_number },
                                            { label: 'Overall Condition', value: data.overall_condition },
                                            { label: 'Return Order Number', value: data.return_order_number },
                                            { label: 'Return Quantity', value: data.return_qty },
                                        ]}
                                    />

                                    <InfoCard
                                        title="Product Details"
                                        items={[
                                            { label: 'Item Description', value: data.item_description },
                                            { label: 'Brand Name', value: data.brand_name },
                                            { label: 'Original Sales Order', value: data.original_sales_order_number },
                                        ]}
                                    />
                                </div>

                                <motion.div
                                    variants={itemVariants}
                                    className="mt-6 p-6 bg-blue-50 rounded-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
                                            <p className="text-gray-700">
                                                <span className="font-medium">{data.shipping_info.shipped_to_person}</span>
                                                <br />
                                                {data.shipping_info.address},<br />
                                                {data.shipping_info.city}, {data.shipping_info.state},<br />
                                                {data.shipping_info.country}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Call to Action */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-2xl mx-auto mt-12 text-center"
                >
                    <motion.p variants={itemVariants} className="text-gray-600 mb-6">
                        Experience our AI-driven solution to simplify and enhance your product return process.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router('/options')}
                        className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium"
                    >
                        Start a Return
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

function InfoCard({ title, items }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="rounded-lg border border-gray-200 overflow-hidden"
        >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">{title}</h3>
            </div>
            <div className="p-4">
                <dl className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index}>
                            <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </motion.div>
    );
}

