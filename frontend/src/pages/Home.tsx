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
//             setData(response.data);
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
import { Search, X, Package, Loader2, ArrowRight, MapPin } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Return Inspection Search
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Enter your inspection number to view detailed information about your return
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Inspection Number"
                            value={receiptNumber}
                            onChange={(e) => setReceiptNumber(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                            <X className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {data && (
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800">Inspection Details</h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard
                                    title="Return Information"
                                    items={[
                                        { label: "Inspection Number", value: data.receipt_number },
                                        { label: "Overall Condition", value: data.overall_condition },
                                        { label: "Return Order Number", value: data.return_order_number },
                                        { label: "Return Quantity", value: data.return_qty }
                                    ]}
                                />
                                
                                <InfoCard
                                    title="Product Details"
                                    items={[
                                        { label: "Item Description", value: data.item_description },
                                        { label: "Brand Name", value: data.brand_name },
                                        { label: "Original Sales Order", value: data.original_sales_order_number }
                                    ]}
                                />
                            </div>

                            <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
                                        <p className="text-gray-700">
                                            <span className="font-medium">{data.shipping_info.shipped_to_person}</span><br />
                                            {data.shipping_info.address},<br />
                                            {data.shipping_info.city}, {data.shipping_info.state},<br />
                                            {data.shipping_info.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="max-w-2xl mx-auto mt-12 text-center">
                    <p className="text-gray-600 mb-6">
                        Experience our AI-driven solution to simplify and enhance your product return process.
                    </p>
                    <button
                        onClick={() => router('/options')}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-medium"
                    >
                        Start a Return
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, items }) {
    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
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
        </div>
    );
}
