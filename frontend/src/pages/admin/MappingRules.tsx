import React, { useState } from "react";

const MappingRules: React.FC = () => {
  const [data, setData] = useState({
    itemUpload: { source1: "", source2: "" },
    customerSerialUpload: { source1: "", source2: "" },
    returnsUpload: { source1: "", source2: "" },
  });

  const handleChange = (section: string, source: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [source]: value },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Mapping Rules</h1>

      {["itemUpload", "customerSerialUpload", "returnsUpload"].map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold capitalize border-b pb-2 mb-2">
            {section === "itemUpload"
              ? "Item Upload"
              : section === "customerSerialUpload"
              ? "Customer Serial Upload"
              : "Returns Upload"}
          </h2>

          {["source1", "source2"].map((source) => (
            <div key={source} className="mb-4">
              <h3 className="text-lg font-medium capitalize">{`Source ${
                source === "source1" ? "1" : "2"
              }`}</h3>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={data[section as keyof typeof data][source as "source1" | "source2"]}
                onChange={(e) => handleChange(section, source, e.target.value)}
                placeholder={`Enter details for ${source}...`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MappingRules;
