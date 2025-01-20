import React, { createContext, useState } from "react";

export const InspectionContext = createContext();

export const InspectionProvider = ({ children }) => {
  const [inspectionData, setInspectionData] = useState({});
  const [customerItemId, setCustomerItemId] = useState(null); // Store customer_item_data_id

  return (
    <InspectionContext.Provider value={{ inspectionData, setInspectionData, customerItemId, setCustomerItemId }}>
      {children}
    </InspectionContext.Provider>
  );
};
