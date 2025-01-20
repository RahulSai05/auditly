// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/ManualScanPage.css";

// const ManualScanPage = () => {
//   const [orderNumber, setOrderNumber] = useState("");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const fetchItemDetails = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/item_order_instance`,
//         { params: { order_number: orderNumber } }
//       );
//       if (response.status === 200) {
//         setData(response.data);
//         setError(""); // Clear error if successful
//       }
//     } catch (err) {
//       console.error("API error:", err);
//       if (err.response?.status === 404) {
//         setError("Order not found. Please verify the Serial or Return Order Number.");
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//       }
//       setData(null); // Clear data on error
//     }
//   };

//   const handleBack = () => {
//     navigate(-1); // Navigate to the previous page
//   };

//   const handleProceed = () => {
//     navigate("/inspection");
//   };

//   return (
//     <div className="manual-scan-page">
//       <h1>Manual Entry</h1>
//       <p className="instruction">
//         Please enter the Serial Number or Return Order Number below to retrieve the details.
//       </p>
//       <div className="input-container">
//         <div className="input-wrapper">
//           <input
//             type="text"
//             placeholder="Order Number/Serial Number"
//             value={orderNumber}
//             onChange={(e) => setOrderNumber(e.target.value)}
//           />
//           <button onClick={fetchItemDetails} disabled={!orderNumber}>
//             Fetch Details
//           </button>
//         </div>
//       </div>
//       {error && <div className="error-box">{error}</div>}
//       {data && (
//         <div className="details-container">
//           <h2>Item Details</h2>
//           <div className="details-grid">
//             {/* General Information */}
//             <div className="details-section">
//               <h3>General Information</h3>
//               <p><strong>Original Sales Order:</strong> {data.original_sales_order_number}</p>
//               <p><strong>Order Line:</strong> {data.original_sales_order_line}</p>
//               <p><strong>Ordered Quantity:</strong> {data.ordered_qty}</p>
//             </div>
//             {/* Return Information */}
//             <div className="details-section">
//               <h3>Return Information</h3>
//               <p><strong>Return Order Number:</strong> {data.return_order_number}</p>
//               <p><strong>Return Line:</strong> {data.return_order_line}</p>
//               <p><strong>Return Quantity:</strong> {data.return_qty}</p>
//               <p><strong>Return Destination:</strong> {data.return_destination}</p>
//             </div>
//             {/* Shipping Information (Including Address) */}
//             <div className="details-section">
//               <h3>Shipping Information</h3>
//               <p><strong>Serial Number:</strong> {data.serial_number}</p>
//               <p><strong>Vendor Item Number:</strong> {data.vendor_item_number}</p>
//               <p><strong>Shipped To:</strong> {data.shipped_to_person}</p>
//               <p><strong>Address:</strong> {data.shipped_to_address?.street_number}, {data.shipped_to_address?.city}, {data.shipped_to_address?.state}, {data.shipped_to_address?.country}</p>
//             </div>
//             {/* Dimensions */}
//             <div className="details-section">
//               <h3>Dimensions</h3>
//               <p><strong>Depth:</strong> {data.dimensions?.depth}</p>
//               <p><strong>Length:</strong> {data.dimensions?.length}</p>
//               <p><strong>Breadth:</strong> {data.dimensions?.breadth}</p>
//               <p><strong>Weight:</strong> {data.dimensions?.weight}</p>
//             </div>
//           </div>
//           <div className="button-container">
//             <button className="back-button" onClick={handleBack}>
//                Back
//             </button>
//             <button className="proceed-button" onClick={handleProceed}>
//               Proceed to Return 
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManualScanPage;


import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InspectionContext } from "../context/InspectionContext"; // Import the context
import "../styles/ManualScanPage.css";

const ManualScanPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setCustomerItemId } = useContext(InspectionContext); // Use context

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/item_order_instance`,
        { params: { order_number: orderNumber } }
      );
      if (response.status === 200) {
        setData(response.data);
        setError(""); // Clear error if successful
      }
    } catch (err) {
      console.error("API error:", err);
      if (err.response?.status === 404) {
        setError("Order not found. Please verify the Serial or Return Order Number.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setData(null); // Clear data on error
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleProceed = () => {
    if (data?.customer_id) {
      setCustomerItemId(data.customer_id); // Save customer_item_data_id in context
      navigate("/inspection");
    } else {
      setError("Customer ID not found. Please fetch the details again.");
    }
  };

  return (
    <div className="manual-scan-page">
      <h1>Manual Entry</h1>
      <p className="instruction">
        Please enter the Serial Number or Return Order Number below to retrieve the details.
      </p>
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Order Number/Serial Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button onClick={fetchItemDetails} disabled={!orderNumber}>
            Fetch Details
          </button>
        </div>
      </div>
      {error && <div className="error-box">{error}</div>}
      {data && (
        <div className="details-container">
          <h2>Item Details</h2>
          <div className="details-grid">
            {/* General Information */}
            <div className="details-section">
              <h3>General Information</h3>
              <p><strong>Original Sales Order:</strong> {data.original_sales_order_number}</p>
              <p><strong>Order Line:</strong> {data.original_sales_order_line}</p>
              <p><strong>Ordered Quantity:</strong> {data.ordered_qty}</p>
            </div>
            {/* Return Information */}
            <div className="details-section">
              <h3>Return Information</h3>
              <p><strong>Return Order Number:</strong> {data.return_order_number}</p>
              <p><strong>Return Line:</strong> {data.return_order_line}</p>
              <p><strong>Return Quantity:</strong> {data.return_qty}</p>
              <p><strong>Return Destination:</strong> {data.return_destination}</p>
            </div>
            {/* Shipping Information (Including Address) */}
            <div className="details-section">
              <h3>Shipping Information</h3>
              <p><strong>Serial Number:</strong> {data.serial_number}</p>
              <p><strong>Vendor Item Number:</strong> {data.vendor_item_number}</p>
              <p><strong>Shipped To:</strong> {data.shipped_to_person}</p>
              <p><strong>Address:</strong> {data.shipped_to_address?.street_number}, {data.shipped_to_address?.city}, {data.shipped_to_address?.state}, {data.shipped_to_address?.country}</p>
            </div>
            {/* Dimensions */}
            <div className="details-section">
              <h3>Dimensions</h3>
              <p><strong>Depth:</strong> {data.dimensions?.depth}</p>
              <p><strong>Length:</strong> {data.dimensions?.length}</p>
              <p><strong>Breadth:</strong> {data.dimensions?.breadth}</p>
              <p><strong>Weight:</strong> {data.dimensions?.weight}</p>
            </div>
          </div>
          <div className="button-container">
            <button className="back-button" onClick={handleBack}>
               Back
            </button>
            <button className="proceed-button" onClick={handleProceed}>
              Proceed to Return 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualScanPage;
