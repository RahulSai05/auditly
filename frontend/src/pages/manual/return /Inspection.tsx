import React, { useState, useEffect } from "react";
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setinspectionData, setCustomerId } from "../../../store/slices/itemSlice";
import axios from "axios";

export default function Inspection() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const selectedItems = useSelector((state: RootState) => state.ids.selectedItems);

    const [condition, setCondition] = useState<string[]>([]); // Changed to an array for multiple selections
    const [issue, setIssue] = useState<string[]>([]); // Changed to an array for multiple selections
    const [productCondition, setProductCondition] = useState<string[]>([]); // Changed to an array for multiple selections

    const conditions = [
        { id: "sealed", label: "factory_seal" },
        { id: "mistake", label: "no_factory_seal" },
        { id: "defective", label: "minimal_tear" },
        { id: "unsealed", label: "no_package" },
    ];

    const productConditions = [
        { id: "new_conditiono", label: "new_condition" },
        { id: "not_new_condition", label: "not_new_condition" },
    ];

    const issues = [
        { id: "bio_stains", label: "bio_stains" },
        { id: "package_stains", label: "package_stains" },
    ];

    const capitalizeFirstLetter = (str: string) => {
        return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    useEffect(() => {
        const fetchCustomerId = async () => {
            try {
                const response = await axios.get("/item_order_instance", {
                    params: { order_number: selectedItems?.orderNumber },
                });

                if (response.status === 200 && response.data?.customer_id) {
                    console.log("Fetched Customer ID:", response.data.customer_id);
                    dispatch(setCustomerId(response.data.customer_id)); // Set in Redux
                } else {
                    console.error("Invalid response for customer ID:", response.data);
                    alert("Failed to fetch customer ID.");
                }
            } catch (error) {
                console.error("Error fetching customer ID:", error);
                alert("Unable to fetch customer ID.");
            }
        };

        if (selectedItems?.orderNumber) {
            fetchCustomerId();
        } else {
            console.error("Order number is missing in selectedItems.");
        }
    }, [selectedItems, dispatch]);

    const handleNext = () => {
        const inspectionData = {
            factory_seal: condition.includes("factory_seal"),
            no_factory_seal: condition.includes("no_factory_seal"),
            minimal_tear: condition.includes("minimal_tear"),
            no_package: condition.includes("no_package"),
            new_conditiono: productCondition.includes("new_conditiono"),
            not_new_condition: productCondition.includes("not_new_condition"),
            bio_stains: issue.includes("bio_stains"),
            package_stains: issue.includes("package_stains"),
        };

        dispatch(setinspectionData(inspectionData));
        router("/return/upload-media");
    };

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setState: React.Dispatch<React.SetStateAction<any>>
    ) => {
        const { value, checked } = event.target;
        if (checked) {
            setState((prevState: string[]) => [...prevState, value]);
        } else {
            setState((prevState: string[]) => prevState.filter((item) => item !== value));
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "current" },
                    { label: "Upload Media", status: "upcoming" },
                    { label: "Compare", status: "upcoming" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />
            <ProductDetails />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Condition Options */}
                <div className="border rounded-md bg-gray-100 p-4">
                    <h2 className="text-md font-semibold mb-4">Package Current Condition</h2>
                    <div className="space-y-3">
                        {conditions.map((item) => (
                            <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="condition"
                                    value={item.label}
                                    checked={condition.includes(item.label)}
                                    onChange={(e) => handleSelectionChange(e, setCondition)}
                                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">{capitalizeFirstLetter(item.label)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Condition Options */}
                {condition.includes("factory_seal") && (
                    <div className="border rounded-md bg-gray-100 p-4">
                        <h2 className="text-md font-semibold mb-4">Product Current Condition</h2>
                        <div className="space-y-3">
                            {productConditions.map((item) => (
                                <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="productCondition"
                                        value={item.label}
                                        checked={productCondition.includes(item.label)}
                                        onChange={(e) => handleSelectionChange(e, setProductCondition)}
                                        className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{capitalizeFirstLetter(item.label)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Issues Options */}
                <div className="border rounded-md bg-gray-100 p-4">
                    <h2 className="text-md font-semibold mb-4">Stain & Surface Issues</h2>
                    <div className="space-y-3">
                        {issues.map((item) => (
                            <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="issue"
                                    value={item.label}
                                    checked={issue.includes(item.label)}
                                    onChange={(e) => handleSelectionChange(e, setIssue)}
                                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">{capitalizeFirstLetter(item.label)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
