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
          <h3 className="text-lg font-medium">Source 1 (D365)</h3>
          <p>Source table name = &lt;&lt;&lt; &gt;&gt;&gt;</p>
          <ul className="list-disc pl-6">
            <li>Column 1 ⟷ Item Number</li>
            <li>Column 2 ⟷ Description</li>
            <li>Column 3 ⟷ Category</li>
          </ul>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2 (S3/Azure Blob)</h3>
          <p>Source file name format – ITEM*.csv (Where * is a substitution character)</p>
        </div>
      </div>

      {/* Customer Serial Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Customer Serial Upload</h2>

        {/* Source 1 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 1</h3>
          <p>Serial numbers stored in the customer database under column "Serial_ID".</p>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2</h3>
          <p>Extracted from warehouse logs, stored in "SERIALS.csv" file format.</p>
        </div>
      </div>

      {/* Returns Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Returns Upload</h2>

        {/* Source 1 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 1</h3>
          <p>RMA records from ERP system, stored in "RMA_Records" table.</p>
        </div>

        {/* Source 2 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Source 2</h3>
          <p>Returns data extracted from CSV reports named "RETURNS_*.csv".</p>
        </div>
      </div>
    </div>
  );
};

export default MappingRules;
