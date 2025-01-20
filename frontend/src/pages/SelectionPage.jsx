import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SelectionPage.css";

const SelectionPage = () => {
  const navigate = useNavigate();

  const handleManualScan = () => {
    navigate("/manual-scan");
  };

  const handleAutomatedScan = () => {
    navigate("/automated-scan");
  };

  return (
    <div className="selection-page">
      <h1 className="title">Choose the Best Scan Option for Your Needs</h1>
      <p className="subtitle">Whether you prefer speed or customization, we've got you covered!</p>
      <div className="card-container">
        {/* Automated Scan Card */}
        <div className="card">
          <div className="icon">
            <img src="/images/automated.png" alt="Automated Scan" />
          </div>
          <h2>Automated Scan</h2>
          <p>Quickly scan your system with automated settings.</p>
          <button className="card-button" onClick={handleAutomatedScan}>
            Proceed with Automated Scan
          </button>
        </div>

        {/* Manual Scan Card */}
        <div className="card">
          <div className="icon">
            <img src="/images/manul.png" alt="Manual Scan" />
          </div>
          <h2>Manual Entry</h2>
          <p>Customize your scan settings for a personalized experience.</p>
          <button className="card-button" onClick={handleManualScan}>
            Proceed with Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
