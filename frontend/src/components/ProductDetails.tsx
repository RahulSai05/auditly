import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Package, Loader2, Tag, Barcode, Settings } from "lucide-react";

interface ItemDetails {
  item_description: string;
  item_number: string;
  category: string;
  configuration: string;
  return_order_number: string;
}

export default function ProductDetails() {
  const returnOrderNumber = useSelector(
    (state: RootState) => state.ids.selectedItems?.return_order_number
  );
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (returnOrderNumber) {
      setLoading(true);
      setError(null);
      axios
        .get(`https://auditlyai.com/api/item-details/${returnOrderNumber}`)
        .then((response) => {
          setItemDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
          setError("Failed to load product details. Please try again later.");
          setItemDetails(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [returnOrderNumber]);

  if (!returnOrderNumber) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No product selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!itemDetails) return null;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium text-gray-900">Product Details</h2>
          </div>
          <span className="text-sm text-blue-600 font-medium">
            #{itemDetails.return_order_number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Product Info */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {itemDetails.item_description}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Barcode className="w-4 h-4" />
              <span className="text-sm">Item: {itemDetails.item_number}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Category
              </span>
            </div>
            <p className="text-gray-900">{itemDetails.category}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Configuration
              </span>
            </div>
            <p className="text-gray-900">{itemDetails.configuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
