import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UploadMedia() {
    const router = useNavigate();
    const [data, setData] = useState({
        front_similarity: 0.0,
        back_similarity: 0.0,
        ssi_front: 0.0,
        ssi_back: 0.0,
        average_ssi: 0.0,
        overall_condition: "Unknown",
        front_diff_image_base64: "",
        back_diff_image_base64: "",
        receipt_number: 0,
    });

    const [baseImages, setBaseImages] = useState({
        front_image_base64: "",
        back_image_base64: "",
    });

    useEffect(() => {
        const fetchComparisonResult = async () => {
            const itemId = localStorage.getItem('lastItemId');
            const customerId = localStorage.getItem('lastCustomerId');
            if (!itemId || !customerId) {
                alert('Item ID is not available. Please go back and fetch item details again.');
                return;
            }

            try {
                // Fetch Comparison Data
                const response = await axios.post(
                    "http://http://54.210.159.220:8000/compare-images/",
                    {
                        customer_id: parseInt(customerId),
                        item_id: parseInt(itemId),
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                setData(response.data);
                localStorage.setItem('receiptNumber', response.data.receipt_number);
                localStorage.setItem('overallCondition', response.data.overall_condition);
            } catch (err) {
                console.error("Error fetching comparison result:", err);
                alert(err.response?.data?.detail || "An unexpected error occurred.");
            }
        };

        const fetchBaseImages = async () => {
            const itemId = localStorage.getItem('lastItemId');
            if (!itemId) return;

            try {
                // Fetch Base Images from API
                const response = await axios.get(`http://54.210.159.220:8000/base-images/mapping/${itemId}`);
                if (response.data.length > 0) {
                    setBaseImages(response.data[0]); // Assuming API returns an array
                }
            } catch (err) {
                console.error("Error fetching base images:", err);
                alert("Failed to fetch base images.");
            }
        };

        fetchComparisonResult();
        fetchBaseImages();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "completed" },
                    { label: "Upload Media", status: "completed" },
                    { label: "Compare", status: "current" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />

            <ProductDetails />

            <div className="mt-8 p-6 bg-white shadow-md border border-gray-200 rounded-lg max-w-[800px] w-full mx-auto">
                <h1 className="text-xl font-medium mb-8 text-center">Comparison Results</h1>

                {/* Image Grid */}
                <div className="flex flex-wrap justify-between gap-4 mb-12">
                    {/* Base Images (Left Side) */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-gray-900 font-medium text-center">Base Front Image</h2>
                        {baseImages.front_image_base64 && (
                            <img
                                src={`data:image/jpeg;base64,${baseImages.front_image_base64}`}
                                alt="Base Front"
                                className="rounded-lg border w-full"
                            />
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className="text-gray-900 font-medium text-center">Base Back Image</h2>
                        {baseImages.back_image_base64 && (
                            <img
                                src={`data:image/jpeg;base64,${baseImages.back_image_base64}`}
                                alt="Base Back"
                                className="rounded-lg border w-full"
                            />
                        )}
                    </div>

                    {/* Compare Images (Right Side) */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-gray-900 font-medium text-center">Front Image Differences</h2>
                        {data.front_diff_image_base64 && (
                            <img
                                src={`data:image/png;base64,${data.front_diff_image_base64}`}
                                alt="Front Differences"
                                className="rounded-lg border w-full"
                            />
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className="text-gray-900 font-medium text-center">Back Image Differences</h2>
                        {data.back_diff_image_base64 && (
                            <img
                                src={`data:image/png;base64,${data.back_diff_image_base64}`}
                                alt="Back Differences"
                                className="rounded-lg border w-full"
                            />
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
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

            <div className="flex justify-end gap-4 mt-6 max-w-[800px] w-full mx-auto">
                <button className="px-6 py-2 border rounded-lg hover:bg-gray-50" onClick={() => router("/return/upload-media")}>Back</button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => router("/return/review")}>Next</button>
            </div>
        </div>
    );
}
