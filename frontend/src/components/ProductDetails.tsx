import { useSelector } from 'react-redux';
import dummy from '../assets/dummy.png';
import { RootState } from '../store/store';

export default function ProductDetails() {
    const Item = useSelector((state: RootState) => state.ids.selectedItems);

    return (
        <div className="w-full overflow-x-auto">
            <div className="mb-8 min-w-[600px] w-full">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>

                <div className='border rounded-md'>
                    <div className="flex w-full justify-between px-5  bg-gray-100 py-2 rounded-t-lg">
                        <div>Product</div>
                        <div className="flex gap-x-10">
                            <div>Order Number</div>
                            <div>Return Term</div>
                        </div>
                    </div>

                    <div className="flex justify-between px-5 mt-3  bg-[#F9FAFB] py-2 rounded-t-lg">
                        <div className="flex gap-x-4">
                            <img className='w-[48px] rounded-md' src={dummy} alt="" />
                            <p className="font-medium mt-2">
                                52093361USA ~ SMB RIDGE CREST PL (E)PT
                            </p>
                        </div>
                        <div className="flex gap-x-10 text-left">
                            <div>#{Item?.return_order_number}</div>
                            <div>18/09/2024</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
