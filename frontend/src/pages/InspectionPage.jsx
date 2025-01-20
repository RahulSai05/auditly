// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/InspectionPage.css";

// const InspectionPage = () => {
//   const navigate = useNavigate();
//   const [selections, setSelections] = useState({
//     factorySealed: false,
//     noFactorySeal: false,
//     minimalTearFactorySeal: false,
//     noPackage: false,
//     newCondition: false,
//     notNewCondition: false,
//     bioStains: false,
//     packageStains: false,
//   });

//   const handleSelectionChange = (event) => {
//     const { name, checked } = event.target;
//     setSelections((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const handleProceed = () => {
//     console.log("User Selections:", selections);
//     navigate("/upload-images");
//   };

//   const handleBack = () => {
//     navigate(-1); // Navigate to the previous page
//   };

//   return (
//     <div className="inspection-page">
//       <h1>Product Inspection</h1>
//       <p className="instruction">
//         Review the following conditions and select the appropriate options.
//       </p>
//       <div className="cards-container">
//         {/* Package Condition */}
//         <div className="card">
//           <h3 className="card-title">Package Condition</h3>
//           <div className="card-content">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="factorySealed"
//                 checked={selections.factorySealed}
//                 onChange={handleSelectionChange}
//               />
//               Factory Sealed
//             </label>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="noFactorySeal"
//                 checked={selections.noFactorySeal}
//                 onChange={handleSelectionChange}
//               />
//               No Factory Seal / Teared and not in Factory Seal
//             </label>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="minimalTearFactorySeal"
//                 checked={selections.minimalTearFactorySeal}
//                 onChange={handleSelectionChange}
//               />
//               Minimal tear but still in Factory Seal
//             </label>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="noPackage"
//                 checked={selections.noPackage}
//                 onChange={handleSelectionChange}
//               />
//               No Package
//             </label>
//           </div>
//         </div>

//         {/* Additional Options for Factory Sealed */}
//         {selections.factorySealed && (
//           <div className="card">
//             <h3 className="card-title">Product Condition</h3>
//             <div className="card-content">
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="newCondition"
//                   checked={selections.newCondition}
//                   onChange={handleSelectionChange}
//                 />
//                 Product in New condition (No visible dirt’s)
//               </label>
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="notNewCondition"
//                   checked={selections.notNewCondition}
//                   onChange={handleSelectionChange}
//                 />
//                 Not in New condition
//               </label>
//             </div>
//           </div>
//         )}

//         {/* Review Stains */}
//         <div className="card">
//           <h3 className="card-title">Review Stains</h3>
//           <div className="card-content">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="bioStains"
//                 checked={selections.bioStains}
//                 onChange={handleSelectionChange}
//               />
//               Bio-Stains
//             </label>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="packageStains"
//                 checked={selections.packageStains}
//                 onChange={handleSelectionChange}
//               />
//               Package Stains but still new in condition
//             </label>
//           </div>
//         </div>
//       </div>

//       <div className="button-container">
//         <button className="back-button" onClick={handleBack}>
//           Back
//         </button>
//         <button
//           type="button"
//           className="proceed-button"
//           onClick={handleProceed}
//           disabled={!Object.values(selections).some((value) => value === true)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InspectionPage;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InspectionContext } from "../context/InspectionContext"; // Import context
import "../styles/InspectionPage.css";

const InspectionPage = () => {
  const { setInspectionData } = useContext(InspectionContext); // Save data to context
  const navigate = useNavigate();

  const [selections, setSelections] = useState({
    factory_seal: false,
    no_factory_seal: false,
    minimal_tear: false,
    no_package: false,
    new_conditiono: false,
    not_new_condition: false,
    bio_stains: false,
    package_stains: false,
  });

  const handleSelectionChange = (event) => {
    const { name, checked } = event.target;
    setSelections((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleProceed = () => {
    setInspectionData(selections); // Save checkbox data in context
    navigate("/upload-images");
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="inspection-page">
      <h1>Product Inspection</h1>
      <p className="instruction">
        Review the following conditions and select the appropriate options.
      </p>
      <div className="cards-container">
        {/* Package Condition */}
        <div className="card">
          <h3 className="card-title">Package Condition</h3>
          <div className="card-content">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="factory_seal"
                checked={selections.factory_seal}
                onChange={handleSelectionChange}
              />
              Factory Sealed
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="no_factory_seal"
                checked={selections.no_factory_seal}
                onChange={handleSelectionChange}
              />
              No Factory Seal / Teared and not in Factory Seal
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="minimal_tear"
                checked={selections.minimal_tear}
                onChange={handleSelectionChange}
              />
              Minimal tear but still in Factory Seal
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="no_package"
                checked={selections.no_package}
                onChange={handleSelectionChange}
              />
              No Package
            </label>
          </div>
        </div>

        {/* Additional Options for Factory Sealed */}
        {selections.factory_seal && (
          <div className="card">
            <h3 className="card-title">Product Condition</h3>
            <div className="card-content">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="new_conditiono"
                  checked={selections.new_conditiono}
                  onChange={handleSelectionChange}
                />
                Product in New condition (No visible dirt’s)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="not_new_condition"
                  checked={selections.not_new_condition}
                  onChange={handleSelectionChange}
                />
                Not in New condition
              </label>
            </div>
          </div>
        )}

        {/* Review Stains */}
        <div className="card">
          <h3 className="card-title">Review Stains</h3>
          <div className="card-content">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="bio_stains"
                checked={selections.bio_stains}
                onChange={handleSelectionChange}
              />
              Bio-Stains
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="package_stains"
                checked={selections.package_stains}
                onChange={handleSelectionChange}
              />
              Package Stains but still new in condition
            </label>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button
          type="button"
          className="proceed-button"
          onClick={handleProceed}
          disabled={!Object.values(selections).some((value) => value === true)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InspectionPage;
