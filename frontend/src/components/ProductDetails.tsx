
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { Package, Loader2, Tag, Box, Barcode, ClipboardList } from 'lucide-react';

// interface ItemDetails {
//   item_description: string;
//   item_number: string;
//   category: string;
//   configuration: string;
//   return_order_number: string;
// }

// export default function ProductDetails() {
//     const returnOrderNumber = useSelector((state: RootState) => state.ids.selectedItems?.return_order_number);
//     const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (returnOrderNumber) {
//             setLoading(true);
//             setError(null);
//             axios.get(`http://54.210.159.220:8000/item-details/${returnOrderNumber}`)
//                 .then(response => {
//                     setItemDetails(response.data);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching item details:', error);
//                     setError('Failed to load product details. Please try again later.');
//                     setItemDetails(null);
//                 })
//                 .finally(() => {
//                     setLoading(false);
//                 });
//         }
//     }, [returnOrderNumber]);

//     if (!returnOrderNumber) {
//         return (
//             <div className="w-full p-8 text-center">
//                 <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//                     <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-600">No product selected. Please select a return order to view details.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full p-4 md:p-8">
//             <div className="max-w-4xl mx-auto">
//                 <div className="flex items-center gap-3 mb-6">
//                     <Package className="w-6 h-6 text-blue-600" />
//                     <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
//                 </div>

//                 {loading ? (
//                     <div className="bg-white rounded-lg shadow-md p-8">
//                         <div className="flex flex-col items-center justify-center">
//                             <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
//                             <p className="text-gray-600">Loading product details...</p>
//                         </div>
//                     </div>
//                 ) : error ? (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                         <p className="text-red-600 text-center">{error}</p>
//                     </div>
//                 ) : itemDetails && (
//                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                         {/* Header */}
//                         <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                             <h3 className="text-white font-semibold text-lg">
//                                 Return Order #{itemDetails.return_order_number}
//                             </h3>
//                         </div>

//                         {/* Content Grid */}
//                         <div className="grid md:grid-cols-2 gap-6 p-6">
//                             {/* Product Information */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-2 text-blue-600 font-medium">
//                                     <Box className="w-5 h-5" />
//                                     <h4>Product Information</h4>
//                                 </div>
                                
//                                 <div className="space-y-3">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <p className="text-lg font-semibold text-gray-900 mb-2">
//                                             {itemDetails.item_description}
//                                         </p>
//                                         <div className="flex items-center gap-2 text-gray-600">
//                                             <Barcode className="w-4 h-4" />
//                                             <span>Item: {itemDetails.item_number}</span>
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="bg-gray-50 p-4 rounded-lg">
//                                             <div className="flex items-center gap-2 text-gray-600 mb-1">
//                                                 <Tag className="w-4 h-4" />
//                                                 <span className="font-medium">Category</span>
//                                             </div>
//                                             <p className="text-gray-900">{itemDetails.category}</p>
//                                         </div>

//                                         <div className="bg-gray-50 p-4 rounded-lg">
//                                             <div className="flex items-center gap-2 text-gray-600 mb-1">
//                                                 <ClipboardList className="w-4 h-4" />
//                                                 <span className="font-medium">Configuration</span>
//                                             </div>
//                                             <p className="text-gray-900">{itemDetails.configuration}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Return Details */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-2 text-blue-600 font-medium">
//                                     <Package className="w-5 h-5" />
//                                     <h4>Return Details</h4>
//                                 </div>
                                
//                                 <div className="bg-blue-50 p-6 rounded-lg">
//                                     <div className="flex items-start gap-4">
//                                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                             <Package className="w-6 h-6 text-blue-600" />
//                                         </div>
//                                         <div>
//                                             <h5 className="font-medium text-blue-900 mb-1">Return Order Information</h5>
//                                             <p className="text-blue-700">
//                                                 Order #{itemDetails.return_order_number}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Package, Loader2, Tag, Barcode, Settings } from 'lucide-react';

interface ItemDetails {
  item_description: string;
  item_number: string;
  category: string;
  configuration: string;
  return_order_number: string;
}

export default function ProductDetails() {
    const returnOrderNumber = useSelector((state: RootState) => state.ids.selectedItems?.return_order_number);
    const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (returnOrderNumber) {
            setLoading(true);
            setError(null);
            axios.get(`http://54.210.159.220:8000/item-details/${returnOrderNumber}`)
                .then(response => {
                    setItemDetails(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item details:', error);
                    setError('Failed to load product details. Please try again later.');
                    setItemDetails(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [returnOrderNumber]);

    if (!returnOrderNumber) {
        return (
            <div className="bg-white border rounded-lg p-6 text-center">
                <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No product selected</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white border rounded-lg p-6 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!itemDetails) return null;

    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50 border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h2 className="font-medium text-gray-900">
                            Product Details
                        </h2>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                        #{itemDetails.return_order_number}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {itemDetails.item_description}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Barcode className="w-4 h-4" />
                            <span className="text-sm">Item: {itemDetails.item_number}</span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Category</span>
                        </div>
                        <p className="text-gray-900">{itemDetails.category}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Settings className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Configuration</span>
                        </div>
                        <p className="text-gray-900">{itemDetails.configuration}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
