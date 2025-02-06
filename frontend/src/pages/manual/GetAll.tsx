import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetAll: React.FC = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const dispatch = useDispatch();
    const router = useNavigate();

    const fetchDetails = async (): Promise<void> => {
        try {
            const response = await axios.get(
                `http://34.207.145.253:8000/item_order_instance`,
                { params: { identifier: searchQuery } }
            );
    
            if (response.status === 200) {
                console.log("API Response:", response.data); // Debugging
                const data = response.data;
    
                if (!data.customer_id) {
                    throw new Error("Customer ID not found in response.");
                }
    
                setProductData(data);
                setIsFetched(true);
    
                // Dispatch to Redux
                dispatch(addItem(data));
            }
        } catch (err: any) {
            console.error("API error:", err);
            setProductData(null);
            setIsFetched(true); // Set isFetched to true even if there's an error to show the no results message
        }
    };
    
    const handleNext = () => {
        if (productData) {
            router('/return/details'); // Navigate to the next page
        }
    };

    const handleSendEmail = () => {
        // Implement the logic to send an email
        console.log("Send email functionality to be implemented.");
    };

    return (
        <div className="flex flex-col items-center p-6 pt-[10vh] min-h-screen bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Enter Serial Number or Return Order Number (RA54321)
            </h2>

            {/* Search Bar */}
            <div className="flex items-center space-x-2 w-full max-w-[855px]">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Enter Serial or Return Number"
                        className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-600 w-[200px] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    disabled={!searchQuery}
                    onClick={fetchDetails}
                >
                    Fetch Details
                </button>
            </div>

            {/* Data Container */}
            {isFetched && productData ? (
                <>
                    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-[900px] w-full">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Card 1: General Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    General Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Original Sales Order</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.original_sales_order_number}
                                    </span>
                                    <span>Order Line</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.original_sales_order_line}
                                    </span>
                                    <span>Ordered Quantity</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.ordered_qty}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Return Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Return Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Return Order Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_order_number}
                                    </span>
                                    <span>Order Line</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_order_line}
                                    </span>
                                    <span>Ordered Quantity</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_qty}
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: Shipping Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Shipping Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Serial Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.serial_number}
                                    </span>
                                    <span>Vendor Item Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.vendor_item_number}
                                    </span>
                                    <span>Shipped To</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.shipped_to_person}
                                    </span>
                                    <span>Address</span>
                                    <span className="font-medium text-gray-800">
                                        : {`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`}
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: Dimensions */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Dimensions
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Depth</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.depth}
                                    </span>
                                    <span>Length</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.length}
                                    </span>
                                    <span>Breadth</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.breadth}
                                    </span>
                                    <span>Weight</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.weight}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end mt-6 max-w-[900px] w-full">
                        <button
                            onClick={() => router('/')}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                isFetched && (
                    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-[900px] w-full text-center">
                        <p className="text-gray-800 mb-4">
                            No results found. Please search again or click the button below to send an email to our team.
                        </p>
                        <button
                            onClick={handleSendEmail}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Send Email
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default GetAll;
