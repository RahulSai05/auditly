
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useState, useRef, ChangeEvent } from "react";
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import { Upload, Image as ImageIcon, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import axios from "axios";

export default function UploadMedia() {
    const customerId = useSelector((state: RootState) => state.ids.customerID);
    const itemId = useSelector((state: RootState) => state.ids.item_id);
    const inspectionData = useSelector((state: RootState) => state.ids.inspectionData);
    const router = useNavigate();

    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (
        setter: React.Dispatch<React.SetStateAction<File | null>>,
        previewSetter: React.Dispatch<React.SetStateAction<string | null>>,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setter(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                previewSetter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!frontImage || !backImage) {
            alert("Please upload both front and back images.");
            return;
        }

        if (!customerId || !itemId) {
            alert("Required information is missing. Please try again.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("front_image", frontImage);
        formData.append("back_image", backImage);

        const queryParams = new URLSearchParams({
            customer_item_data_id: String(customerId),
            ...Object.entries(inspectionData).reduce((acc, [key, value]) => {
                acc[key] = value !== null && value !== undefined ? value.toString() : "false";
                return acc;
            }, {} as Record<string, string>),
            send_email_flag: "false",
        });

        try {
            const response = await axios.post(
                `http://54.210.159.220:8000/upload-customer-images?${queryParams.toString()}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                router(`/return/compare/`);
            }
        } catch (error: any) {
            console.error("Error uploading images:", error.response?.data || error);
            alert("An unexpected error occurred while uploading images.");
        } finally {
            setUploading(false);
        }
    };

    const UploadBox = ({
        title,
        image,
        preview,
        inputRef,
        onUpload,
    }: {
        title: string;
        image: File | null;
        preview: string | null;
        inputRef: React.RefObject<HTMLInputElement>;
        onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    }) => (
        <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
            <div
                onClick={() => inputRef.current?.click()}
                className={`
                    relative group cursor-pointer
                    h-[300px] rounded-lg overflow-hidden
                    border-2 border-dashed transition-all duration-200
                    ${image ? 'border-green-200 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
                
                {preview ? (
                    <div className="relative h-full">
                        <img
                            src={preview}
                            alt={`${title} preview`}
                            className="w-full h-full object-cover"
                        />
                        <div className="
                            absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40
                            flex items-center justify-center transition-all duration-200
                        ">
                            <div className="
                                transform translate-y-4 opacity-0
                                group-hover:translate-y-0 group-hover:opacity-100
                                transition-all duration-200
                            ">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="
                        absolute inset-0
                        flex flex-col items-center justify-center
                        text-gray-500 group-hover:text-blue-600
                        transition-colors duration-200
                    ">
                        <ImageIcon className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">Click to upload {title}</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "completed" },
                    { label: "Upload Media", status: "current" },
                    { label: "Compare", status: "upcoming" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />
            
            <div className="mt-8 mb-6">
                <ProductDetails />
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Upload Product Images</h2>
                </div>

                {(!customerId || !itemId) && (
                    <div className="mb-6 flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">Required information is missing. Please go back and try again.</p>
                    </div>
                )}

                <div className="flex gap-6 mb-8">
                    <UploadBox
                        title="Front Image"
                        image={frontImage}
                        preview={frontPreview}
                        inputRef={frontInputRef}
                        onUpload={(e) => handleImageUpload(setFrontImage, setFrontPreview, e)}
                    />
                    <UploadBox
                        title="Back Image"
                        image={backImage}
                        preview={backPreview}
                        inputRef={backInputRef}
                        onUpload={(e) => handleImageUpload(setBackImage, setBackPreview, e)}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => router("/return/inspection")}
                        className="group flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading || !frontImage || !backImage}
                        className={`
                            group flex items-center gap-2 px-6 py-2 rounded-lg
                            font-medium transition-all duration-200
                            ${uploading || !frontImage || !backImage
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'}
                        `}
                    >
                        {uploading ? 'Uploading...' : 'Continue'}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
