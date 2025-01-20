import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="nav-logo">
        <img src="/images/logo.png" alt="Logo" />
      </div>
    </nav>
  );
};

export default Navbar;
