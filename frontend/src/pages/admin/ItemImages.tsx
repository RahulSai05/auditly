import React, { useState } from "react";
import axios from "axios";

const ItemImages: React.FC = () => {
  const [itemNumber, setItemNumber] = useState<string>("");
  const [itemData, setItemData] = useState<{
    item_id: number;
    item_number: number;
    item_description: string;
    brand_id: number;
    category: string;
    configuration: string;
    front_image_path: string;
    back_image_path: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemData = async () => {
    if (!itemNumber) {
      setError("Please enter an item number.");
      return;
    }

    setLoading(true);
    setError(null);
    setItemData(null);

    try {
      const response = await axios.get(`http://your-api-url/images/${itemNumber}`);
      const data = response.data;

      // Construct full image URLs dynamically
      const backendUrl = "http://your-api-url"; // Replace with your backend URL
      data.front_image_path = `${backendUrl}${data.front_image_path}`;
      data.back_image_path = `${backendUrl}${data.back_image_path}`;

      setItemData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An unexpected error occurred while fetching the item data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Item Image Viewer</h1>

      {/* Input for item number */}
      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter Item Number"
          value={itemNumber}
          onChange={(e) => setItemNumber(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={fetchItemData}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </div>

      {/* Display error message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Display item data and images */}
      {itemData && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Item Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p><span className="font-semibold">Item Number:</span> {itemData.item_number}</p>
              <p><span className="font-semibold">Description:</span> {itemData.item_description}</p>
              <p><span className="font-semibold">Brand ID:</span> {itemData.brand_id}</p>
              <p><span className="font-semibold">Category:</span> {itemData.category}</p>
              <p><span className="font-semibold">Configuration:</span> {itemData.configuration}</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Front Image</h3>
                <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                  {itemData.front_image_path ? (
                    <img
                      src={itemData.front_image_path}
                      alt="Front Image"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No front image available
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Back Image</h3>
                <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                  {itemData.back_image_path ? (
                    <img
                      src={itemData.back_image_path}
                      alt="Back Image"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No back image available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemImages;
