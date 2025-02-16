// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store";

// export default function ProductDetails() {
//   const returnOrderNumber = useSelector(
//     (state: RootState) => state.ids.selectedItems?.return_order_number
//   );
//   const [itemDetails, setItemDetails] = useState(null);

//   useEffect(() => {
//     if (returnOrderNumber) {
//       axios
//         .get(`http://54.210.159.220:8000/item-details/${returnOrderNumber}`)
//         .then((response) => {
//           setItemDetails(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching item details:", error);
//           setItemDetails(null);
//         });
//     }
//   }, [returnOrderNumber]);

//   return (
//     <div className="w-full overflow-x-auto">
//       <div className="mb-8 min-w-[600px] w-full">
//         <h2 className="text-lg font-semibold mb-4">Product Details</h2>
//         <div className="border rounded-md">
//           <div className="flex w-full justify-between px-5 bg-gray-100 py-2 rounded-t-lg">
//             <div className="font-semibold ">Product Information</div>
//             <div className="font-semibold ">Return Details</div>
//           </div>
//           {itemDetails ? (
//             <div className="flex flex-col  justify-between px-5 mt-3  py-2 rounded-b-lg ">
//               <div className="grid gap-y-2">
//                 <h3 className="font-semibold text-wrap">
//                   {itemDetails.item_description}
//                 </h3>
//                 <p>
//                   <strong>Item Number:</strong> {itemDetails.item_number}
//                 </p>
//                 <p>
//                   <strong>Category:</strong> {itemDetails.category}
//                 </p>
//                 <p>
//                   <strong>Configuration:</strong> {itemDetails.configuration}
//                 </p>
//               </div>
//               <div className="mt-2">
//                 <p>
//                   <strong>Return Order Number:</strong> #
//                   {itemDetails.return_order_number}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center p-5">Loading...</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// // }

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
import { Package, Loader2 } from 'lucide-react';

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
            axios.get(`http://localhost:8000/item-details/${returnOrderNumber}`)
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
            <div className="p-4 text-center bg-gray-50 rounded-lg">
                <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No product selected</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 text-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-600 text-sm">
                {error}
            </div>
        );
    }

    if (!itemDetails) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b bg-gray-50 px-4 py-3">
                <h2 className="text-sm font-medium text-gray-900">
                    Return Order #{itemDetails.return_order_number}
                </h2>
            </div>

            <div className="p-4 space-y-4">
                {/* Product Info */}
                <div>
                    <p className="font-medium text-gray-900">
                        {itemDetails.item_description}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Item: {itemDetails.item_number}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 mb-1">Category</p>
                        <p className="text-gray-900">{itemDetails.category}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Configuration</p>
                        <p className="text-gray-900">{itemDetails.configuration}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

