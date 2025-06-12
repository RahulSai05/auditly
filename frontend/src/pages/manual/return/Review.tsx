
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";
import { CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle, Camera, Package, ClipboardCheck } from "lucide-react";

export default function Review() {
    const router = useNavigate();
    const [receiptNumber, setReceiptNumber] = useState("");
    const [overallCondition, setOverallCondition] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedReceiptNumber = localStorage.getItem('receiptNumber');
        const storedOverallCondition = localStorage.getItem('overallCondition');
        
        if (storedReceiptNumber && storedOverallCondition) {
            setReceiptNumber(storedReceiptNumber);
            setOverallCondition(storedOverallCondition);
        }
        setLoading(false);
    }, []);

    const StatusBadge = ({ condition }: { condition: string }) => {
        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'excellent':
                    return 'bg-green-100 text-green-700 border-green-200';
                case 'good':
                    return 'bg-blue-100 text-blue-700 border-blue-200';
                case 'fair':
                    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                case 'poor':
                    return 'bg-red-100 text-red-700 border-red-200';
                default:
                    return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(condition)}`}>
                {condition}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <Stepper
                    steps={[
                        { label: "Your details", status: "completed" },
                        { label: "Inspection", status: "completed" },
                        { label: "Upload Media", status: "completed" },
                        { label: "Compare", status: "completed" },
                        { label: "Review & Submit", status: "current" },
                    ]}
                />
                <div className="mt-8 flex items-center justify-center h-64">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "completed" },
                    { label: "Upload Media", status: "completed" },
                    { label: "Compare", status: "completed" },
                    { label: "Review & Submit", status: "current" },
                ]}
            />
            
            <div className="mt-8 mb-6">
                <ProductDetails />
            </div>

            <div className="mt-8 space-y-6 max-w-3xl mx-auto">
                {/* Summary Card */}
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b bg-gray-50 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Inspection Summary
                            </h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Status Section */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Overall Condition</p>
                                    <div className="mt-1">
                                        <StatusBadge condition={overallCondition} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Inspection Number</p>
                                <p className="text-lg font-medium text-gray-900">#{receiptNumber}</p>
                            </div>
                        </div>

                        {/* Media Verification */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Media Verification</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <Camera className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Front Image</p>
                                        <p className="text-xs text-green-700">Verified</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <Camera className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Back Image</p>
                                        <p className="text-xs text-green-700">Verified</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Important Note */}
                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-900">Important Note</p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Please review all information carefully before submitting. This process cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={() => router('/return/compare')}
                        className="group flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                    <button
                        onClick={() => router('/return/done')}
                        className="group flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                        Submit
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
