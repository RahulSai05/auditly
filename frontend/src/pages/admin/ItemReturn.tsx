import React, { useState } from "react";
import axios from "axios";

const ItemReturn = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notification, setNotification] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (event) => {
        event.preventDefault();
        if (!csvFile) {
            setNotification("Please select a CSV file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", csvFile);

        setIsLoading(true);
        try {
            const response = await axios.post("http://34.207.145.253:8000/upload-customer-return-item-data", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setNotification(response.data.message);
        } catch (error) {
            console.error("Error uploading CSV:", error);
            setNotification("An error occurred while uploading the CSV.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) {
            setNotification("Please enter a search query.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get("http://34.207.145.253:8000/search-customer-return-item-data", {
                params: { query: searchQuery }
            });
            setSearchResults(response.data);
            setNotification(`Search results for "${searchQuery}"`);
        } catch (error) {
            console.error("Error searching items:", error);
            setNotification("An error occurred while searching for items.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setNotification("Search cleared.");
    };

    return (
        <div className="h-screen flex justify-center items-start bg-gray-100 p-6">
            <div className="w-full max-w-2xl space-y-4">
                <h1 className="text-2xl font-bold text-center">Customer Return Item Data Upload</h1>
                <p className="text-gray-500 text-center">Upload a CSV file containing return item data</p>

                {/* Notification */}
                {notification && (
                    <div className="bg-gray-200 text-black p-3 rounded-lg text-center mb-4">
                        {notification}
                    </div>
                )}

                {/* File Upload Section */}
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    <form onSubmit={handleFileUpload} className="space-y-3">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files[0])}
                            className="border border-gray-300 rounded p-2 w-full"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Uploading..." : "Upload CSV"}
                        </button>
                    </form>
                </div>

                {/* Search and Clear Section */}
                <div className="bg-white p-4 rounded-lg shadow-md w-full mt-4">
                    <h2 className="text-lg font-semibold mb-2">Search Database</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Query (ex: Serial Number, Return Order Number, etc.)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                        <button
                            onClick={handleClearSearch}
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            disabled={isLoading}
                        >
                            Clear
                        </button>
                    </div>
                    {/* Display search results */}
                    {searchResults.length > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-md w-full mt-4">
                            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 p-2">Order Number</th>
                                            <th className="border border-gray-300 p-2">Serial Number</th>
                                            <th className="border border-gray-300 p-2">Return Condition</th>
                                            <th className="border border-gray-300 p-2">Destination</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border border-gray-300 p-2">{item.return_order_number}</td>
                                                <td className="border border-gray-300 p-2">{item.serial_number}</td>
                                                <td className="border border-gray-300 p-2">{item.return_condition}</td>
                                                <td className="border border-gray-300 p-2">{item.return_destination}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemReturn;
