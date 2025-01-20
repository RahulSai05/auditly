import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import the shared Navbar component
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/selection");
  };

  return (
    <div className="homepage">
      <Navbar /> {/* Include the Navbar component */}
      <div className="main-content">
        <h1>“Start your returns processings</h1>
        <p>
          Auditly offers an AI-driven solution to simplify and enhance your product return process. 
          Experience efficiency and transparency like never before.
        </p>
        <p>Click 'Start a Return' to begin the process.</p>
        <button className="start-button" onClick={handleNavigate}>
            Start your returns processing →
        </button>
      </div>
    </div>
  );
};

export default HomePage;

