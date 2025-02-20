
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import { ChevronLeft, ChevronRight, Camera, Gauge, AlertCircle, CheckCircle2 } from "lucide-react";
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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const itemId = localStorage.getItem('lastItemId');
            const customerId = localStorage.getItem('lastCustomerId');
            
            if (!itemId || !customerId) {
                setError('Required information is missing. Please go back and try again.');
                setLoading(false);
                return;
            }

            try {
                const [comparisonResponse, baseImagesResponse] = await Promise.all([
                    axios.post(
                        "http://54.210.159.220:8000/compare-images/",
                        {
                            customer_id: parseInt(customerId),
                            item_id: parseInt(itemId),
                        },
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    ),
                    axios.get(`http://54.210.159.220:8000/base-images/mapping/${itemId}`)
                ]);

                setData(comparisonResponse.data);
                localStorage.setItem('receiptNumber', comparisonResponse.data.receipt_number);
                localStorage.setItem('overallCondition', comparisonResponse.data.overall_condition);

                if (baseImagesResponse.data.length > 0) {
                    setBaseImages(baseImagesResponse.data[0]);
                }
            } catch (err: any) {
                setError(err.response?.data?.detail || "An unexpected error occurred while fetching the comparison data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const MetricCard = ({ title, metrics }: { 
        title: string, 
        metrics: { label: string; value: number; }[] 
    }) => (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="space-y-4">
                {metrics.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                        <span className="text-gray-600">{label}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${value * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium min-w-[60px] text-right">
                                {(value * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ImageComparison = ({ 
        title, 
        baseImage, 
        diffImage 
    }: { 
        title: string; 
        baseImage: string; 
        diffImage: string; 
    }) => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                {title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Base Image</p>
                    <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                        {baseImage ? (
                            <img
                                src={`data:image/jpeg;base64,${baseImage}`}
                                alt={`${title} Base`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image available
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Difference Overlay</p>
                    <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                        {diffImage ? (
                            <img
                                src={`data:image/png;base64,${diffImage}`}
                                alt={`${title} Differences`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No differences detected
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
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
                <div className="mt-8 flex items-center justify-center h-64">
                    <div className="text-center">
                        <Gauge className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Analyzing images...</p>
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
                    { label: "Compare", status: "current" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />

            <div className="mt-8 mb-6">
                <ProductDetails />
            </div>

            {error ? (
                <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-600">{error}</p>
                </div>
            ) : (
                <div className="mt-8 space-y-8">
                    {/* Overall Status */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${data.average_ssi > 0.8 ? 'bg-green-100' : 'bg-amber-100'}
                            `}>
                                <CheckCircle2 className={`
                                    w-6 h-6
                                    ${data.average_ssi > 0.8 ? 'text-green-600' : 'text-amber-600'}
                                `} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Overall Condition: {data.overall_condition}
                                </h2>
                                <p className="text-gray-600">
                                    Inspection #{data.receipt_number}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Front Image Analysis"
                                metrics={[
                                    { label: "Similarity", value: data.front_similarity },
                                    { label: "SSI Score", value: data.ssi_front }
                                ]}
                            />
                            <MetricCard
                                title="Back Image Analysis"
                                metrics={[
                                    { label: "Similarity", value: data.back_similarity },
                                    { label: "SSI Score", value: data.ssi_back }
                                ]}
                            />
                            <MetricCard
                                title="Overall Metrics"
                                metrics={[
                                    { label: "Average SSI", value: data.average_ssi }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Image Comparisons */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <ImageComparison
                            title="Front View"
                            baseImage={baseImages.front_image_base64}
                            diffImage={data.front_diff_image_base64}
                        />
                        <ImageComparison
                            title="Back View"
                            baseImage={baseImages.back_image_base64}
                            diffImage={data.back_diff_image_base64}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
                <button
                    onClick={() => router("/return/upload-media")}
                    className="group flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>
                <button
                    onClick={() => router("/return/review")}
                    disabled={!!error}
                    className={`
                        group flex items-center gap-2 px-6 py-2 rounded-lg
                        font-medium transition-all duration-200
                        ${error
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'}
                    `}
                >
                    Continue
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
