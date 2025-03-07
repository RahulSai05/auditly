import React from "react";

const MappingRules: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Mapping Rules</h1>

      {/* Item Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Item Upload</h2>

        {/* Source 1 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 1 - CSV Upload</h3>
          <p>Source table name: <strong>Items</strong></p>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ item_number</li>
            <li>Column 2 ⟷ Item_description</li>
            <li>Column 3 ⟷ brand_id</li>
            <li>Column 4 ⟷ category</li>
            <li>Column 5 ⟷ configuration</li>
          </ul>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2 - Power BI to S3/Azure Blob</h3>
          <p>Source table name: <strong>Items</strong></p>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ item_number</li>
            <li>Column 2 ⟷ Item_description</li>
            <li>Column 3 ⟷ brand_id</li>
            <li>Column 4 ⟷ category</li>
            <li>Column 5 ⟷ configuration</li>
          </ul>
        </div>
      </div>

      {/* Customer Serial Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Customer Serial Upload</h2>

        {/* Source 1 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 1 - CSV Upload</h3>
          <p>Source table name: <strong>customer_item_data</strong></p>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ original_sales_order_number</li>
            <li>Column 2 ⟷ original_sales_order_line</li>
            <li>Column 3 ⟷ account_number</li>
            <li>Column 4 ⟷ date_purchased</li>
            <li>Column 5 ⟷ date_delivered</li>
            <li>Column 6 ⟷ serial_number</li>
            <li>Column 7 ⟷ shipped_to_address</li>
          </ul>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2 - Power BI to S3/Azure Blob</h3>
          <p>Source table name: <strong>customer_item_data</strong></p>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ original_sales_order_number</li>
            <li>Column 2 ⟷ original_sales_order_line</li>
            <li>Column 3 ⟷ account_number</li>
            <li>Column 4 ⟷ date_purchased</li>
            <li>Column 5 ⟷ date_delivered</li>
            <li>Column 6 ⟷ serial_number</li>
            <li>Column 7 ⟷ shipped_to_address</li>
          </ul>
        </div>
      </div>

      {/* Returns Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Returns Upload</h2>

        {/* Source 1 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 1 - CSV Upload</h3>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ original_sales_order_number</li>
            <li>Column 2 ⟷ original_sales_order_line</li>
            <li>Column 3 ⟷ account_number</li>
            <li>Column 4 ⟷ date_purchased</li>
            <li>Column 5 ⟷ date_delivered</li>
            <li>Column 6 ⟷ serial_number</li>
            <li>Column 7 ⟷ shipped_to_address</li>
            <li>Column 8 ⟷ Status</li>
          </ul>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2 - Power BI to S3/Azure Blob</h3>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ SalesOrder</li>
            <li>Column 2 ⟷ ReturnReasonCode</li>
            <li>Column 3 ⟷ ReturnStatus</li>
            <li>Column 4 ⟷ RMANumber</li>
            <li>Column 5 ⟷ InvoiceAccount</li>
            <li>Column 6 ⟷ OrderType</li>
            <li>Column 7 ⟷ CustomerRequisition</li>
            <li>Column 8 ⟷ Status</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MappingRules;
