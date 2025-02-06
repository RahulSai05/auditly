import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import axios from "axios";
import { useEffect, useState } from "react";


export default function UploadMedia() {
    const customerId = 1; // Hardcoded customer ID
    const baseId = 1; // Hardcoded base ID
    const router = useNavigate();
    const [data, setData] = useState({
        front_similarity: 0.0,
        back_similarity: 0.0,
        ssi_front: 0.0,
        ssi_back: 0.0,
        average_ssi: 0.0,
        overall_condition: "Unknown",
    });

    useEffect(() => {
        const fetchComparisonResult = async () => {
            try {
                const response = await axios.post(
                    "http://18.205.235.223:8000/compare-images/",
                    {
                        customer_id: customerId,
                        item_id: baseId, // `item_id` is the correct field as per your backend
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                setData(response.data);
            } catch (err: any) {
                console.error("Error fetching comparison result:", err);
                const errorMessage =
                    err.response?.data?.detail ||
                    (typeof err.message === "string" ? err.message : "An unexpected error occurred.");
                alert(errorMessage);
            }
        };

        fetchComparisonResult();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Progress Tracker */}
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "completed" },
                    { label: "Upload Media", status: "completed" },
                    { label: "Compare", status: "current" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />

            <ProductDetails/>

            {/* Outer Box with Enhanced Shadow */}
            <div className="mt-8 p-6 bg-white shadow-md border border-gray-200 rounded-lg max-w-[800px] w-full mx-auto">
                <h1 className="text-xl font-medium mb-8 text-center">Comparison Results</h1>
                
                {/* Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Front Image Metrics */}
                    <div className="space-y-4 bg-gray-50 border p-4 rounded-md">
                        <h2 className="text-gray-900 font-medium text-center">Front Image</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Cosine Similarity</span>
                                <span className="text-sm font-medium">{data.front_similarity.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">SSI</span>
                                <span className="text-sm font-medium">{data.ssi_front.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Back Image Metrics */}
                    <div className="space-y-4 bg-gray-50 border p-4 rounded-md">
                        <h2 className="text-gray-900 font-medium text-center">Back Image</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Cosine Similarity</span>
                                <span className="text-sm font-medium">{data.back_similarity.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">SSI</span>
                                <span className="text-sm font-medium">{data.ssi_back.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="space-y-4 bg-gray-50 border p-4 rounded-md">
                        <h2 className="text-gray-900 font-medium text-center">Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Average SSI</span>
                                <span className="text-sm font-medium">{data.average_ssi.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Overall Condition</span>
                                <span className="text-sm font-medium">{data.overall_condition}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-6 max-w-[800px] w-full mx-auto">
                <button
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    onClick={() => router("/return/upload-media")}
                >
                    Back
                </button>
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => router("/return/review")}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
