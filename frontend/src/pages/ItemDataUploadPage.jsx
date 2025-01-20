import React, { useState } from "react";
import axios from "axios";
import "../styles/ItemDataUploadPage.css";

const ItemDataUploadPage = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notification, setNotification] = useState("");

    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!csvFile) {
            setNotification("Please select a CSV file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await axios.post(
                "http://localhost:8000/upload-items-csv",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setNotification(response.data.message);
        } catch (error) {
            console.error("Error uploading CSV:", error);
            setNotification("An error occurred while uploading the CSV.");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setNotification("Please enter a search query.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/search-items", {
                params: { query: searchQuery },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching items:", error);
            setNotification("An error occurred while searching for items.");
        }
    };

    return (
        <div className="item-data-upload">
            <h1>Item Data Upload</h1>

            {/* Upload Section */}
            <div className="upload-section">
                <h2>Upload Items via CSV</h2>
                <form onSubmit={handleFileUpload}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                    />
                    <button type="submit" className="upload-button">
                        Upload CSV
                    </button>
                </form>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <h2>Search Items</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by item number, description, or brand ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="search-button">
                        Search
                    </button>
                </div>
            </div>

            {/* Notification */}
            {notification && <p className="notification">{notification}</p>}

            {/* Results Section */}
            <div className="results-section">
                {searchResults.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Item Number</th>
                                <th>Brand ID</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Configuration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item_number}</td>
                                    <td>{item.brand_id}</td>
                                    <td>{item.item_description}</td>
                                    <td>{item.category}</td>
                                    <td>{item.configuration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No items found.</p>
                )}
            </div>
        </div>
    );
};

export default ItemDataUploadPage;
