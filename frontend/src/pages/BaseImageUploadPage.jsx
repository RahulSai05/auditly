import React, { useState } from "react";
import axios from "axios";
import "../styles/BaseImageUploadPage.css";

const BaseImageUploadPage = () => {
    const [itemNumber, setItemNumber] = useState("");
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [notification, setNotification] = useState("");
    const [responseDetails, setResponseDetails] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!itemNumber.trim()) {
            setNotification("Item number is required.");
            return;
        }
        if (!frontImage || !backImage) {
            setNotification("Both front and back images are required.");
            return;
        }

        const formData = new FormData();
        formData.append("front_image", frontImage);
        formData.append("back_image", backImage);

        try {
            const response = await axios.post(
                `http://localhost:8000/upload-base-images/?item_number=${encodeURIComponent(itemNumber.trim())}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setResponseDetails(response.data.data);
                setNotification("Images uploaded successfully!");
            } else {
                setNotification("Unexpected server response.");
            }
        } catch (error) {
            console.error("Error uploading images:", error.response || error.message);

            const errorMsg = error.response?.data?.detail || "An unexpected error occurred.";
            setNotification(`Error: ${errorMsg}`);
        }
    };

    return (
        <div className="base-image-upload-page">
            <h1>Base Image Upload</h1>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="item-number">Item Number:</label>
                    <input
                        type="text"
                        id="item-number"
                        value={itemNumber}
                        onChange={(e) => setItemNumber(e.target.value)}
                        placeholder="Enter Item Number"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="front-image">Front Image:</label>
                    <input
                        type="file"
                        id="front-image"
                        accept="image/*"
                        onChange={(e) => setFrontImage(e.target.files[0])}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="back-image">Back Image:</label>
                    <input
                        type="file"
                        id="back-image"
                        accept="image/*"
                        onChange={(e) => setBackImage(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" className="button upload-button">
                    Upload Images
                </button>
            </form>

            {notification && <p className="notification">{notification}</p>}

            {responseDetails && (
                <div className="response-details">
                    <h3>Upload Details:</h3>
                    <p><strong>ID:</strong> {responseDetails.id}</p>
                    <p><strong>Item Number:</strong> {responseDetails.item_number}</p>
                    <p><strong>Front Image Path:</strong> {responseDetails.front_image_path}</p>
                    <p><strong>Back Image Path:</strong> {responseDetails.back_image_path}</p>
                </div>
            )}
        </div>
    );
};

export default BaseImageUploadPage;
