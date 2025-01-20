import React, { useState } from "react";
import axios from "axios";
import "../styles/CustomerReturnItemDataUpload.css";

const CustomerReturnItemDataUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setNotification("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await axios.post("http://localhost:8000/upload-customer-return-item-data", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification(response.data.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      setNotification("Failed to upload the file.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setNotification("Please enter a query to search.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/search-customer-return-item-data", {
        params: { query: searchQuery },
      });

      setSearchResults(response.data || []);
      setNotification("");
    } catch (error) {
      console.error("Search error:", error.response?.data || error);
      setNotification("Failed to fetch search results.");
    }
  };

  return (
    <div className="upload-page">
      <h1>Customer Item Data Upload</h1>
      <p>Upload a CSV file or search the existing database for customer item data.</p>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="upload-form">
        <label htmlFor="file">Select CSV File:</label>
        <input
          type="file"
          id="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
        <button type="submit" className="button">Upload</button>
      </form>

      {/* Search Section */}
      <div className="search-section">
        <h2>Search Database</h2>
        <input
          type="text"
          placeholder="Enter query (e.g., serial number, return order)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="button">Search</button>
      </div>

      {/* Notifications */}
      {notification && <div className="notification">{notification}</div>}

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Return Order</th>
                <th>Condition</th>
                <th>Warehouse</th>
                <th>Shipped To</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((item, index) => (
                <tr key={index}>
                  <td>{item.serial_number}</td>
                  <td>{item.return_order_number}</td>
                  <td>{item.return_condition}</td>
                  <td>{item.return_warehouse}</td>
                  <td>{item.shipped_to_person}</td>
                  <td>{item.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerReturnItemDataUpload;
