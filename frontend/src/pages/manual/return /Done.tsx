
import ProductDetails from '../../../components/ProductDetails';
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from 'react-router-dom';

export default function Done() {
    const router = useNavigate()

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Progress Tracker */}
            <Stepper
                steps={[
                    { label: 'Your details', status: 'completed' },
                    { label: 'Inspection', status: 'completed' },
                    { label: 'Upload Media', status: 'completed' },
                    { label: 'Compare', status: 'completed' },
                    { label: 'Review & Submit', status: 'completed' }
                ]}
            />

            {/* Product Details */}
            <ProductDetails/>

            <div className='my-10'>
                <div className='font-bold my-2'>Your request has been successfully recorded.</div>
                <div></div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
                <button onClick={() => router('/')} className="px-6 py-2 w-[256px] bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit</button>
            </div>
        </div>
    )
}
