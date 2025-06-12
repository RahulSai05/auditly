import ProductDetails from '../../../components/ProductDetails';
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package, Clock } from 'lucide-react';

export default function Done() {
    const router = useNavigate();
    const receiptNumber = localStorage.getItem('receiptNumber');

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Stepper
                steps={[
                    { label: 'Your details', status: 'completed' },
                    { label: 'Inspection', status: 'completed' },
                    { label: 'Upload Media', status: 'completed' },
                    { label: 'Compare', status: 'completed' },
                    { label: 'Review & Submit', status: 'completed' }
                ]}
            />

            <div className="mt-8 mb-6">
                <ProductDetails/>
            </div>

            <div className="max-w-2xl mx-auto mt-12 text-center">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                    Request Successfully Submitted
                </h1>
                <p className="text-gray-600 mb-8">
                    Your inspection request has been recorded and is being processed.
                </p>

                {/* Receipt Card */}
                <div className="bg-white border rounded-lg p-6 mb-8 inline-block min-w-[300px]">
                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-3">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Inspection Details</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        #{receiptNumber}
                    </div>
                    <div className="text-sm text-gray-500">Reference Number</div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-left mb-8">
                    <h3 className="flex items-center gap-2 text-blue-900 font-medium mb-4">
                        <Clock className="w-5 h-5" />
                        Next Steps
                    </h3>
                    <ul className="space-y-3 text-blue-800">
                        <li className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 text-sm">1</span>
                            </div>
                            <span>Our team will review your submission within 1-2 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 text-sm">2</span>
                            </div>
                            <span>You will receive an email notification with the inspection results</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 text-sm">3</span>
                            </div>
                            <span>Keep your receipt number handy for future reference</span>
                        </li>
                    </ul>
                </div>

                {/* Action Button */}
                <button 
                    onClick={() => router('/')}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                    Return to Home
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
