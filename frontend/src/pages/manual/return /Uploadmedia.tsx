import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useState, useRef, ChangeEvent } from "react";
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import axios from "axios";

export default function UploadMedia() {
    const customerId = useSelector((state: RootState) => state.ids.customerID);
    const inspectionData = useSelector((state: RootState) => state.ids.inspectionData);
    const router = useNavigate();

    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (setter: React.Dispatch<React.SetStateAction<File | null>>, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setter(file);
    };

    const handleSubmit = async () => {
        if (!frontImage || !backImage) {
            alert("Please upload both front and back images.");
            return;
        }

        if (!customerId) {
            alert("Customer ID is missing. Please try again.");
            return;
        }

        const formData = new FormData();
        formData.append("front_image", frontImage);
        formData.append("back_image", backImage);

        // Prepare query string parameters
        const queryParams = new URLSearchParams({
            customer_item_data_id: String(customerId),
            ...Object.entries(inspectionData).reduce((acc, [key, value]) => {
                acc[key] = value !== null && value !== undefined ? value.toString() : "false";
                return acc;
            }, {} as Record<string, string>),
            send_email_flag: "false", // Default to false
        });

        try {
            const response = await axios.post(
                `http://18.205.235.223:8000/upload-customer-images?${queryParams.toString()}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                alert("Images uploaded successfully!");
                router("/return/compare");
            } else {
                alert("Failed to upload images. Please try again.");
            }
        } catch (error: any) {
            console.error("Error uploading images:", error.response?.data || error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Stepper */}
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "completed" },
                    { label: "Upload Media", status: "current" },
                    { label: "Compare", status: "upcoming" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />
            
            <ProductDetails/>

            {/* Upload Media Content */}
            <div className="max-w-3xl mx-auto p-6 border rounded-md">
                <h1 className="text-xl font-medium mb-6">Upload Images</h1>
                <div className="mb-6">
                    <label className="block text-sm mb-2">Front Image</label>
                    <input
                        ref={frontInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(setFrontImage, e)}
                        className="block w-full text-sm text-gray-500 border rounded-md cursor-pointer"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm mb-2">Back Image</label>
                    <input
                        ref={backInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(setBackImage, e)}
                        className="block w-full text-sm text-gray-500 border rounded-md cursor-pointer"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-3">
                    <button
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        onClick={() => router("/return/inspection")}
                    >
                        Back
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
