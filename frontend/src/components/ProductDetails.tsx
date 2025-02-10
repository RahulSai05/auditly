import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function ProductDetails() {
    const returnOrderNumber = useSelector((state: RootState) => state.ids.selectedItems?.return_order_number);
    const [itemDetails, setItemDetails] = useState(null);

    useEffect(() => {
        if (returnOrderNumber) {
            axios.get(`http://54.210.159.220:8000/item-details/${returnOrderNumber}`)
                .then(response => {
                    setItemDetails(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item details:', error);
                    setItemDetails(null);
                });
        }
    }, [returnOrderNumber]);

    return (
        <div className="w-full overflow-x-auto">
            <div className="mb-8 min-w-[600px] w-full">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className='border rounded-md'>
                    <div className="flex w-full justify-between px-5 bg-gray-100 py-2 rounded-t-lg">
                        <div className="font-semibold text-gray-700">Product Information</div>
                        <div className="font-semibold text-gray-700">Return Details</div>
                    </div>
                    {itemDetails ? (
                        <div className="flex flex-col justify-between px-5 mt-3 bg-[#F9FAFB] py-2 rounded-b-lg">
                            <div>
                                <h3 className="font-semibold">{itemDetails.item_description}</h3>
                                <p><strong>Item Number:</strong> {itemDetails.item_number}</p>
                                <p><strong>Category:</strong> {itemDetails.category}</p>
                                <p><strong>Configuration:</strong> {itemDetails.configuration}</p>
                            </div>
                            <div className="mt-2">
                                <p><strong>Return Order Number:</strong> #{itemDetails.return_order_number}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-5">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
