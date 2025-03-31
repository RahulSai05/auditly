import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f8f9fa"
    }}>
      <div>Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
