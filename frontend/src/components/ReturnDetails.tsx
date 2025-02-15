import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReturnDetails = () => {
  const [returnStatus, setReturnStatus] = useState("Good");

  const response = {
    item_number: 52093240,
    item_description: "52093240USA ~ SMB RIDGE CREST CF (E)PT",
    brand_id: 1,
    category: "Mattress",
    configuration: "USA",
    return_order_number: "RA54321",
    return_qty: 1,
    return_condition: "Good",
  };

  const navigate = useNavigate();
  const handleSave = () => {
    navigate("/admin/reports/items");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          {Object.entries(response).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-300">
              <td className="p-2 font-medium capitalize">
                {key.replace(/_/g, " ")}
              </td>
              <td className="p-2">{value}</td>
            </tr>
          ))}
          <tr className="border-b border-gray-300">
            <td className="p-2 font-medium">Return Status</td>
            <td className="p-2">
              <select
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value)}
              >
                <option value="Done">Done</option>
                <option value="Declined">Declined</option>
                <option value="Inprogress">Inprogress</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ReturnDetails;
