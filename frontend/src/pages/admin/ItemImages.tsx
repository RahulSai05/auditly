import React, { useEffect, useState } from "react";
import axios from "axios";

const ItemImages: React.FC = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemImages = async () => {
      const itemNumber = 52093240; // Replace with the actual item number or get it from props/route
      try {
        const response = await axios.get(`http://your-api-url/images/${itemNumber}`);
        setItemData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "An unexpected error occurred while fetching the item images.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-2xl font-bold">
      {itemData ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Item Details</h1>
            <p>Item Number: {itemData.item_number}</p>
            <p>Description: {itemData.item_description}</p>
            <p>Brand ID: {itemData.brand_id}</p>
            <p>Category: {itemData.category}</p>
            <p>Configuration: {itemData.configuration}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Front Image</p>
              <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                {itemData.front_image_path ? (
                  <img
                    src={itemData.front_image_path} // Use the full URL returned by the API
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
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Back Image</p>
              <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                {itemData.back_image_path ? (
                  <img
                    src={itemData.back_image_path} // Use the full URL returned by the API
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
        </>
      ) : (
        <div>No item data found</div>
      )}
    </div>
  );
};

export default ItemImages;
