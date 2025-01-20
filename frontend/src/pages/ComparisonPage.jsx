// import React, { useEffect, useState, useContext } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { InspectionContext } from "../context/InspectionContext"; // Import context
// import "../styles/ComparisonPage.css";

// const ComparisonPage = () => {
//     const [searchParams] = useSearchParams();
//     const { customerItemId, baseId } = useContext(InspectionContext); // Retrieve IDs from context
//     const customerId = searchParams.get("customerId") || customerItemId; // Fallback to context if not in URL
//     const [comparisonResult, setComparisonResult] = useState(null);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         // Debugging: Check IDs
//         console.log("baseId:", baseId, "customerId:", customerId);

//         const fetchComparisonResult = async () => {
//             if (!customerId || !baseId) {
//                 setError("Required IDs are missing.");
//                 return;
//             }

//             try {
//                 const response = await axios.post(
//                     `http://localhost:8000/compare-images/`,
//                     {
//                         base_id: baseId || 1, 
//                         customer_id: parseInt(customerId),
//                     },
//                     {
//                         headers: { "Content-Type": "application/json" },
//                     }
//                 );
//                 setComparisonResult(response.data);
//             } catch (err) {
//                 console.error("Error fetching comparison result:", err);
//                 setError(err.response?.data?.detail || "Failed to fetch comparison results.");
//             }
//         };

//         fetchComparisonResult();
//     }, [customerId, baseId]);

//     return (
//         <div className="comparison-page">
//             <h1>Inspection Results</h1>
//             {error && <p className="error">{error}</p>}
//             {comparisonResult ? (
//                 <div className="cards-container">
//                     {/* Packaging Condition */}
//                     <div className="card">
//                         <h3 className="card-title">
//                             Packaging Condition{" "}
//                             <span className="info-icon" data-tooltip="This evaluates the packaging's seal integrity and surface condition.">?</span>
//                         </h3>
//                         <div className="card-content">
//                             <p>
//                                 <strong>Seal Integrity:</strong> {comparisonResult.front_similarity.toFixed(2)}{" "}
//                                 <span className="info-icon" data-tooltip="Reflects the completeness of the product's seal. Higher values are better.">?</span>
//                             </p>
//                             <p>
//                                 <strong>Surface Condition:</strong> {comparisonResult.ssi_front.toFixed(2)}{" "}
//                                 <span className="info-icon" data-tooltip="Measures the condition of the packaging's surface.">?</span>
//                             </p>
//                         </div>
//                     </div>

//                     {/* Product Condition */}
//                     <div className="card">
//                         <h3 className="card-title">
//                             Product Condition{" "}
//                             <span className="info-icon" data-tooltip="This assesses the product's physical and functional state.">?</span>
//                         </h3>
//                         <div className="card-content">
//                             <p>
//                                 <strong>Structural Similarity:</strong> {comparisonResult.back_similarity.toFixed(2)}{" "}
//                                 <span className="info-icon" data-tooltip="Indicates similarity between the returned product and the reference image.">?</span>
//                             </p>
//                             <p>
//                                 <strong>Stain Index:</strong> {comparisonResult.ssi_back.toFixed(2)}{" "}
//                                 <span className="info-icon" data-tooltip="Measures stain presence and intensity on the product.">?</span>
//                             </p>
//                         </div>
//                     </div>

//                     {/* Summary Section */}
//                     <div className="card summary-card">
//                         <h3 className="card-title">
//                             Overall Summary{" "}
//                             <span className="info-icon" data-tooltip="A summary of the aggregate score and final classification for the returned product.">?</span>
//                         </h3>
//                         <div className="card-content">
//                             <p>
//                                 <strong>Aggregate Condition Index:</strong> {comparisonResult.average_ssi.toFixed(2)}{" "}
//                                 <span className="info-icon" data-tooltip="The average score across all condition parameters.">?</span>
//                             </p>
//                             <p>
//                                 <strong>Final Classification:</strong> {comparisonResult.overall_condition}{" "}
//                                 <span className="info-icon" data-tooltip="The final category assigned to the product based on its inspection.">?</span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 !error && <p>Loading results...</p>
//             )}
//         </div>
//     );
// };

// export default ComparisonPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ComparisonPage.css";

const ComparisonPage = () => {
    const customerId = 1; // Hardcoded customer ID
    const baseId = 1; // Hardcoded base ID

    const [comparisonResult, setComparisonResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComparisonResult = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8000/compare-images/`,
                    {
                        item_id: baseId, // Use 'item_id' instead of 'base_id'
                        customer_id: customerId,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                setComparisonResult(response.data);
            } catch (err) {
                console.error("Error fetching comparison result:", err);
                const errorMessage =
                    err.response?.data?.detail ||
                    (typeof err.message === "string" ? err.message : "An unexpected error occurred.");
                setError(errorMessage);
            }
        };
    
        fetchComparisonResult();
    }, []);
    

    return (
        <div className="comparison-page">
            <h1>Inspection Results</h1>
            {error && (
                <p className="error">
                    {typeof error === "object"
                        ? JSON.stringify(error, null, 2) // Convert object errors to JSON string
                        : error}
                </p>
            )}
            {comparisonResult ? (
                <div className="cards-container">
                    {/* Packaging Condition */}
                    <div className="card">
                        <h3 className="card-title">
                            Packaging Condition{" "}
                            <span className="info-icon" data-tooltip="This evaluates the packaging's seal integrity and surface condition.">?</span>
                        </h3>
                        <div className="card-content">
                            <p>
                                <strong>Seal Integrity:</strong> {comparisonResult.front_similarity.toFixed(2)}{" "}
                                <span className="info-icon" data-tooltip="Reflects the completeness of the product's seal. Higher values are better.">?</span>
                            </p>
                            <p>
                                <strong>Surface Condition:</strong> {comparisonResult.ssi_front.toFixed(2)}{" "}
                                <span className="info-icon" data-tooltip="Measures the condition of the packaging's surface.">?</span>
                            </p>
                        </div>
                    </div>

                    {/* Product Condition */}
                    <div className="card">
                        <h3 className="card-title">
                            Product Condition{" "}
                            <span className="info-icon" data-tooltip="This assesses the product's physical and functional state.">?</span>
                        </h3>
                        <div className="card-content">
                            <p>
                                <strong>Structural Similarity:</strong> {comparisonResult.back_similarity.toFixed(2)}{" "}
                                <span className="info-icon" data-tooltip="Indicates similarity between the returned product and the reference image.">?</span>
                            </p>
                            <p>
                                <strong>Stain Index:</strong> {comparisonResult.ssi_back.toFixed(2)}{" "}
                                <span className="info-icon" data-tooltip="Measures stain presence and intensity on the product.">?</span>
                            </p>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="card summary-card">
                        <h3 className="card-title">
                            Overall Summary{" "}
                            <span className="info-icon" data-tooltip="A summary of the aggregate score and final classification for the returned product.">?</span>
                        </h3>
                        <div className="card-content">
                            <p>
                                <strong>Aggregate Condition Index:</strong> {comparisonResult.average_ssi.toFixed(2)}{" "}
                                <span className="info-icon" data-tooltip="The average score across all condition parameters.">?</span>
                            </p>
                            <p>
                                <strong>Final Classification:</strong> {comparisonResult.overall_condition}{" "}
                                <span className="info-icon" data-tooltip="The final category assigned to the product based on its inspection.">?</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                !error && <p>Loading results...</p>
            )}
        </div>
    );
};

export default ComparisonPage;
