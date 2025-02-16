import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const router = useNavigate();
    const [receiptNumber, setReceiptNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://54.210.159.220:8000/get-receipt-data', {
                receipt_number: receiptNumber
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching details:', error);
            setLoading(false);
            alert('Failed to fetch details. Please try again.');
        }
    };

    const handleClear = () => {
        setReceiptNumber(''); // Clear the input field
        setData(null); // Clear the displayed data
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Search Section */}
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Return</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter Inspection Number"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClear}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Data Display Section */}
            {loading && (
                <div className="mt-6 text-blue-500">Loading...</div>
            )}
            {data && (
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Inspection Details</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-700">Field</th>
                                    <th className="px-4 py-2 text-left text-gray-700">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Inspectioin Number</td>
                                    <td className="px-4 py-2 text-gray-600">{data.receipt_number}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Overall Condition</td>
                                    <td className="px-4 py-2 text-gray-600">{data.overall_condition}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Item Description</td>
                                    <td className="px-4 py-2 text-gray-600">{data.item_description}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Brand Name</td>
                                    <td className="px-4 py-2 text-gray-600">{data.brand_name}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Original Sales Order Number</td>
                                    <td className="px-4 py-2 text-gray-600">{data.original_sales_order_number}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Return Order Number</td>
                                    <td className="px-4 py-2 text-gray-600">{data.return_order_number}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Return Quantity</td>
                                    <td className="px-4 py-2 text-gray-600">{data.return_qty}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-700">Shipped To Person</td>
                                    <td className="px-4 py-2 text-gray-600">{data.shipping_info.shipped_to_person}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-medium text-gray-700">Address</td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {data.shipping_info.address}, {data.shipping_info.city}, {data.shipping_info.state}, {data.shipping_info.country}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bottom Section */}
            <div className="w-full max-w-2xl mt-6 text-center">
                <p className="text-gray-700 mb-6">
                    Auditly offers an AI-driven solution to simplify and enhance your product return process. Experience efficiency and transparency like never before.
                </p>
                <button
                    onClick={() => router('/options')}
                    className="bg-[#5986E7] text-white px-6 py-3 rounded-lg hover:bg-[#4a6dc4] transition duration-200"
                >
                    Start a Return
                </button>
            </div>
        </div>
    );
}
