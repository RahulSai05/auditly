import React, { useState } from "react";
import axios from "axios";

const ItemImageUpload: React.FC = () => {
    const [itemNumber, setItemNumber] = useState("");
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [notification, setNotification] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemNumber.trim()) {
            setNotification("Please enter an Item Number.");
            return;
        }
        if (!frontImage || !backImage) {
            setNotification("Both front and back images are required.");
            return;
        }

        const formData = new FormData();
        formData.append("front_image", frontImage);
        formData.append("back_image", backImage);

        setIsLoading(true);
        try {
            const response = await axios.post(
                `http://34.207.145.253:8000/upload-base-images/?item_number=${itemNumber}`, 
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setNotification(response.data.message);
        } catch (error) {
            console.error("Error uploading images:", error);
            setNotification("An error occurred while uploading images.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-start bg-gray-100 p-6">
            <div className="w-full max-w-2xl space-y-4">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center">Item Image Upload</h1>
                <p className="text-gray-500 text-center">Upload base front and back images mapped to an item</p>

                {/* Image Upload Section */}
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    <h2 className="text-lg font-semibold mb-2">Upload Item Images</h2>
                    <form onSubmit={handleImageUpload} className="space-y-2">
                        {/* Item Number Input */}
                        <input
                            type="text"
                            placeholder="Enter Item Number"
                            value={itemNumber}
                            onChange={(e) => setItemNumber(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            disabled={isLoading}
                        />

                        {/* Front Image Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFrontImage(e.target.files?.[0] || null)}
                            className="border border-gray-300 rounded p-2 w-full"
                            disabled={isLoading}
                        />

                        {/* Back Image Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBackImage(e.target.files?.[0] || null)}
                            className="border border-gray-300 rounded p-2 w-full"
                            disabled={isLoading}
                        />

                        {/* Upload Button */}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Uploading..." : "Upload Images"}
                        </button>
                    </form>
                </div>

                {/* Notification */}
                {notification && (
                    <div className="bg-gray-200 text-black p-3 rounded-lg text-center">
                        {notification}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemImageUpload;
