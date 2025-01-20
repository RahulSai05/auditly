import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InspectionContext } from "../context/InspectionContext";
import axios from "axios";
import "../styles/UploadImagesPage.css";

const UploadImagesPage = () => {
  const { inspectionData, customerItemId } = useContext(InspectionContext); // Use context for data
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [notification, setNotification] = useState("");
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      setNotification("Please upload both front and back images.");
      return;
    }

    const formData = new FormData();
    formData.append("front_image", frontImage);
    formData.append("back_image", backImage);

    // Append boolean data to the query string
    const queryParams = new URLSearchParams({
      customer_item_data_id: customerItemId,
      ...inspectionData, // Spread inspection data (checkbox values)
      send_email_flag: false, // Default value
    });

    try {
      const response = await axios.post(
        `http://localhost:8000/upload-customer-images?${queryParams.toString()}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setNotification("Images uploaded successfully!");
        setIsUploadSuccessful(true);
      } else {
        setNotification("Failed to upload images. Please try again.");
        setIsUploadSuccessful(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error.response?.data || error);
      setNotification("An unexpected error occurred.");
      setIsUploadSuccessful(false);
    }
  };

  const handleBack = () => {
    window.history.back(); 
  };

  const handleProceed = () => {
    navigate(`/compare-images?customerId=${customerItemId}`);
  };

  return (
    <div className="upload-images-page">
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit} className="upload-form">
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
      <div className="button-container">
        <button className="button back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="button proceed-button"
          onClick={handleProceed}
          disabled={!isUploadSuccessful}
        >
          Next
        </button>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default UploadImagesPage;
