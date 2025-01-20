import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SelectionPage from "./pages/SelectionPage";
import ManualScanPage from "./pages/ManualScanPage";
import AutomatedScanPage from "./pages/AutomatedScanPage";
import InspectionPage from "./pages/InspectionPage";
import UploadImagesPage from "./pages/UploadImagesPage";
import ComparisonPage from "./pages/ComparisonPage";
import { InspectionProvider } from "./context/InspectionContext";
import CustomerReturnItemDataUpload from "./pages/CustomerReturnItemDataUpload"; 
import ItemDataUploadPage from "./pages/ItemDataUploadPage";
import BaseImageUploadPage from "./pages/BaseImageUploadPage";

function App() {
  return (
    <InspectionProvider> {/* Wrap the app with the provider */}
      <Router>
        <Navbar /> {/* Include the Navbar directly */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/manual-scan" element={<ManualScanPage />} />
          <Route path="/automated-scan" element={<AutomatedScanPage />} />
          <Route path="/inspection" element={<InspectionPage />} />
          <Route path="/upload-images" element={<UploadImagesPage />} />
          <Route path="/compare-images" element={<ComparisonPage />} />
          <Route path="/upload-customer-return-item-data" element={<CustomerReturnItemDataUpload />} />
          <Route path="/item-data-upload" element={<ItemDataUploadPage />} />
          <Route path="/base-image-upload" element={<BaseImageUploadPage />} />
        </Routes>
      </Router>
    </InspectionProvider>
  );
}

export default App;
