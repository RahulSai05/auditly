import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";

export default function Review() {
    const router = useNavigate();
    const [receiptNumber, setReceiptNumber] = useState("");
    const [overallCondition, setOverallCondition] = useState("");

    useEffect(() => {
        const storedReceiptNumber = localStorage.getItem('receiptNumber');
        if (storedReceiptNumber) {
            setReceiptNumber(storedReceiptNumber);
        }
        const storedOverallCondition = localStorage.getItem('overallCondition');
        if (storedOverallCondition) {
            setOverallCondition(storedOverallCondition);
        }
    }, []);

    const reviewData = {
        uploadMedia: "Done",
        receiptNumber: receiptNumber,
        overallCondition: overallCondition,
    };

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
            <ProductDetails/>
            <div className="mt-8 p-6 bg-white shadow-md border border-gray-200 rounded-lg max-w-[600px] w-full mx-auto">
                <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">
                    Review Summary
                </h2>
                
                <div className="p-4 bg-gray-100 rounded-md">
                    <div className="grid grid-cols-[200px_1fr] gap-y-4 text-sm">
                        <span className="text-gray-600 font-medium">Upload Media</span>
                        <span className="text-gray-800 font-semibold">: {reviewData.uploadMedia}</span>
                        <span className="text-gray-600 font-medium">Inspection Number</span>
                        <span className="text-gray-800 font-semibold">: {reviewData.receiptNumber}</span>
                        <span className="text-gray-600 font-medium">Product Inspection</span>
                        <span className="text-gray-800 font-semibold">: {reviewData.overallCondition}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 max-w-[600px] w-full mx-auto">
                <button
                    onClick={() => router('/return/compare')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400"
                >
                    Back
                </button>
                <button
                    onClick={() => router('/return/done')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
