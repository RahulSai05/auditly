import React, { useState } from "react";
import axios from "axios";

const ItemUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      setNotification("Please select a CSV file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", csvFile);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://54.210.159.220:8000/upload-items-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification(response.data.message);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setNotification("An error occurred while uploading the CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setNotification("Please enter a search query.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://54.210.159.220:8000/search-items",
        {
          params: { query: searchQuery },
        }
      );
      setSearchResults(response.data);
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
    setNotification("");
  };

  return (
    <div className="h-[75vh] flex justify-center items-start bg-gray-100 p-6">
      <div className="w-full max-w-2xl space-y-4">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          Customer Item Data Upload
        </h1>
        <p className="text-gray-500 text-center">
          Upload a CSV file or search the database for customer item data
        </p>

        {/* CSV Upload Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <h2 className="text-lg font-semibold mb-2">Select CSV file</h2>
          <form onSubmit={handleFileUpload} className="space-y-2">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded p-2 w-full"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <h2 className="text-lg font-semibold mb-2">Search Database</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Query (ex: Serial)..."
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
              className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
              disabled={isLoading || !searchQuery}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Scrollable Search Results Table */}
        {searchResults.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full">
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Product</th>
                    <th className="border border-gray-300 p-2">Order Number</th>
                    <th className="border border-gray-300 p-2">Return Term</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">
                        {item.item_description}
                      </td>
                      <td className="border border-gray-300 p-2">
                        #{item.item_number}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.return_term || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemUpload;
