import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from 'react-router-dom';
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";

export default function Details() {
    const Item = useSelector((state: RootState) => state.ids.selectedItems);
    const router = useNavigate()
    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Progress Tracker */}
            <Stepper
                steps={[
                    { label: 'Your details', status: 'current' },
                    { label: 'Inspection', status: 'upcoming' },
                    { label: 'Upload Media', status: 'upcoming' },
                    { label: 'Compare', status: 'upcoming' },
                    { label: 'Review & Submit', status: 'upcoming' }
                ]}
            />

            {/* Product Details */}
           <ProductDetails/>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6 border p-6 rounded-md mb-8">
                {/* General Information */}
                <div className="border rounded-lg p-6 bg-gray-100">
                    <h3 className="font-semibold mb-4 text-center text-xl text-gray-700">General Information</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Original sales Order</div>
                            <div className='text-left w-[50%] '>: {Item.original_sales_order_number}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Order Line</div>
                            <div className='text-left w-[50%] '>: {Item.original_sales_order_line}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Ordered Quantity</div>
                            <div className='text-left w-[50%] '>: {Item?.ordered_qty}</div>
                        </div>
                    </div>
                </div>

                {/* Return Information */}
                <div className="border rounded-lg p-6 bg-gray-100">
                    <h3 className="font-semibold mb-4 text-center text-xl text-gray-700">Return Information</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Return Order Number</div>
                            <div className='text-left w-[50%] '>: #{Item?.return_order_number}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Order Line</div>
                            <div className='text-left w-[50%] '>: {Item?.return_order_line}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Ordered Quantity</div>
                            <div className='text-left w-[50%] '>: {Item.return_qty}</div>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="border rounded-lg p-6 bg-gray-100">
                    <h3 className="font-semibold mb-4 text-center text-xl text-gray-700">Shipping Information</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Serial Number:</div>
                            <div className='text-left w-[50%] '>: {Item.serial_number}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Vendor Item Number</div>
                            <div className='text-left w-[50%] '>: {Item.vendor_item_number}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Shipped to</div>
                            <div className='text-left w-[50%] '>: {Item.shipped_to_person}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Address</div>
                            <div className='text-left w-[50%]'> :{Item.shipped_to_address.street_number}, {Item.shipped_to_address.city}, {Item.shipped_to_address.state}, {Item.shipped_to_address.country}</div>
                        </div>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="border rounded-lg p-6 bg-gray-100">
                    <h3 className="font-semibold mb-4 text-center text-xl text-gray-700">Dimensions</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Depth</div>
                            <div className='text-left w-[50%] '>: {Item.dimensions.depth}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Length</div>
                            <div className='text-left w-[50%] '>: {Item.dimensions.length}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Breadth</div>
                            <div className='text-left w-[50%] '>: {Item.dimensions.breadth}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-800 font-semibold ">Weight</div>
                            <div className='text-left w-[50%] '>: {Item.dimensions.weight}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4">
                <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
                <button onClick={() => router('/return/inspection')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</button>
            </div>
        </div>
    )
}
