import React from "react";
import { CircularProgress } from "@mui/material"; // If using Material-UI

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f8f9fa",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <div style={{ textAlign: "center" }}>
        {/* You can replace this with any spinner component */}
        <CircularProgress />
        <div style={{ marginTop: "16px" }}>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
