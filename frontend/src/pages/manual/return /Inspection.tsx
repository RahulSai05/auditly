// import React, { useState, useEffect } from "react";
// import { Stepper } from "../../../components/Stepper";
// import { useNavigate } from "react-router-dom";
// import ProductDetails from "../../../components/ProductDetails";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { setinspectionData, setCustomerId } from "../../../store/slices/itemSlice";
// import { Package, Shield, Droplets, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// export default function Inspection() {
//     const router = useNavigate();
//     const dispatch = useDispatch();
//     const selectedItems = useSelector((state: RootState) => state.ids.selectedItems);

//     const [condition, setCondition] = useState<string[]>([]);
//     const [issue, setIssue] = useState<string[]>([]);
//     const [productCondition, setProductCondition] = useState<string[]>([]);
//     const [activeSection, setActiveSection] = useState<string>("package");
//     const [isLoading, setIsLoading] = useState(false);

//     const conditions = [
//         { id: "sealed", label: "factory_seal", icon: <Shield className="w-5 h-5" /> },
//         { id: "mistake", label: "no_factory_seal", icon: <AlertCircle className="w-5 h-5" /> },
//         { id: "defective", label: "minimal_tear", icon: <Package className="w-5 h-5" /> },
//         { id: "unsealed", label: "no_package", icon: <Package className="w-5 h-5" /> },
//     ];

//     const productConditions = [
//         { id: "new_conditiono", label: "new_condition", icon: <Package className="w-5 h-5" /> },
//         { id: "not_new_condition", label: "not_new_condition", icon: <AlertCircle className="w-5 h-5" /> },
//     ];

//     const issues = [
//         { label: "No_stains", icon: <Droplets className="w-5 h-5" /> },
//         { id: "bio_stains", label: "bio_stains", icon: <Droplets className="w-5 h-5" /> },
//         { id: "package_stains", label: "package_stains", icon: <Droplets className="w-5 h-5" /> },
//     ];

//     const capitalizeFirstLetter = (str: string) => {
//         return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
//     };

//     useEffect(() => {
//         const fetchCustomerId = async () => {
//             try {
//                 const response = await axios.get("/item_order_instance", {
//                     params: { order_number: selectedItems?.orderNumber },
//                 });

//                 if (response.status === 200 && response.data?.customer_id) {
//                     dispatch(setCustomerId(response.data.customer_id));
//                 } else {
//                     console.error("Invalid response for customer ID:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching customer ID:", error);
//             }
//         };

//         if (selectedItems?.orderNumber) {
//             fetchCustomerId();
//         }
//     }, [selectedItems, dispatch]);

//     const handleNext = async () => {
//         setIsLoading(true);
//         const inspectionData = {
//             factory_seal: condition.includes("factory_seal"),
//             no_factory_seal: condition.includes("no_factory_seal"),
//             minimal_tear: condition.includes("minimal_tear"),
//             no_package: condition.includes("no_package"),
//             new_conditiono: productCondition.includes("new_conditiono"),
//             not_new_condition: productCondition.includes("not_new_condition"),
//             bio_stains: issue.includes("bio_stains"),
//             package_stains: issue.includes("package_stains"),
//         };

//         try {
//             dispatch(setinspectionData(inspectionData));
//             await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
//             router("/return/upload-media");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSelectionChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         setState: React.Dispatch<React.SetStateAction<string[]>>
//     ) => {
//         const { value, checked } = event.target;
//         setState(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
//     };

//     const CheckboxCard = ({ 
//         item, 
//         checked, 
//         onChange, 
//         name 
//     }: { 
//         item: { label: string; icon: JSX.Element }, 
//         checked: boolean, 
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
//         name: string 
//     }) => (
//         <motion.label
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`
//                 relative flex items-center p-4 cursor-pointer rounded-xl
//                 transition-all duration-200 
//                 ${checked 
//                     ? 'bg-blue-50 border-blue-200 shadow-md' 
//                     : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'}
//                 border-2
//             `}
//         >
//             <input
//                 type="checkbox"
//                 name={name}
//                 value={item.label}
//                 checked={checked}
//                 onChange={onChange}
//                 className="peer sr-only"
//             />
//             <div className="flex items-center gap-4 w-full">
//                 <div className={`
//                     flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg
//                     transition-all duration-200
//                     ${checked 
//                         ? 'bg-blue-500 text-white' 
//                         : 'bg-gray-100 text-gray-500'}
//                 `}>
//                     {item.icon}
//                 </div>
//                 <span className={`
//                     text-sm font-medium transition-colors duration-200
//                     ${checked ? 'text-blue-700' : 'text-gray-700'}
//                 `}>
//                     {capitalizeFirstLetter(item.label)}
//                 </span>
//                 {checked && (
//                     <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="absolute top-2 right-2"
//                     >
//                         <CheckCircle2 className="w-5 h-5 text-blue-500" />
//                     </motion.div>
//                 )}
//             </div>
//         </motion.label>
//     );

//     const SectionTab = ({ id, label, icon, active }: { id: string; label: string; icon: JSX.Element; active: boolean }) => (
//         <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => setActiveSection(id)}
//             className={`
//                 flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200
//                 ${active 
//                     ? 'bg-blue-50 text-blue-700 shadow-sm' 
//                     : 'text-gray-600 hover:bg-gray-50'}
//             `}
//         >
//             {icon}
//             <span className="font-medium">{label}</span>
//         </motion.button>
//     );

//     return (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="max-w-5xl mx-auto p-6"
//         >
//             <Stepper
//                 steps={[
//                     { label: "Your details", status: "completed" },
//                     { label: "Inspection", status: "current" },
//                     { label: "Upload Media", status: "upcoming" },
//                     { label: "Compare", status: "upcoming" },
//                     { label: "Review & Submit", status: "upcoming" },
//                 ]}
//             />
            
//             <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mt-8 mb-6"
//             >
//                 <ProductDetails />
//             </motion.div>

//             <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-white rounded-2xl shadow-sm border mt-8"
//             >
//                 <div className="flex gap-2 p-4 border-b overflow-x-auto">
//                     <SectionTab
//                         id="package"
//                         label="Package Condition"
//                         icon={<Package className="w-5 h-5" />}
//                         active={activeSection === "package"}
//                     />
//                     {condition.includes("factory_seal") && (
//                         <SectionTab
//                             id="product"
//                             label="Product Condition"
//                             icon={<Shield className="w-5 h-5" />}
//                             active={activeSection === "product"}
//                         />
//                     )}
//                     <SectionTab
//                         id="issues"
//                         label="Surface Issues"
//                         icon={<Droplets className="w-5 h-5" />}
//                         active={activeSection === "issues"}
//                     />
//                 </div>

//                 <div className="p-6">
//                     <AnimatePresence mode="wait">
//                         {activeSection === "package" && (
//                             <motion.div
//                                 key="package"
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: 20 }}
//                                 className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//                             >
//                                 {conditions.map((item) => (
//                                     <CheckboxCard
//                                         key={item.id}
//                                         item={item}
//                                         checked={condition.includes(item.label)}
//                                         onChange={(e) => handleSelectionChange(e, setCondition)}
//                                         name="condition"
//                                     />
//                                 ))}
//                             </motion.div>
//                         )}

//                         {activeSection === "product" && condition.includes("factory_seal") && (
//                             <motion.div
//                                 key="product"
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: 20 }}
//                                 className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//                             >
//                                 {productConditions.map((item) => (
//                                     <CheckboxCard
//                                         key={item.id}
//                                         item={item}
//                                         checked={productCondition.includes(item.label)}
//                                         onChange={(e) => handleSelectionChange(e, setProductCondition)}
//                                         name="productCondition"
//                                     />
//                                 ))}
//                             </motion.div>
//                         )}

//                         {activeSection === "issues" && (
//                             <motion.div
//                                 key="issues"
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: 20 }}
//                                 className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//                             >
//                                 {issues.map((item) => (
//                                     <CheckboxCard
//                                         key={item.id}
//                                         item={item}
//                                         checked={issue.includes(item.label)}
//                                         onChange={(e) => handleSelectionChange(e, setIssue)}
//                                         name="issue"
//                                     />
//                                 ))}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </motion.div>

//             <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="mt-8 flex justify-end"
//             >
//                 <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleNext}
//                     disabled={isLoading}
//                     className={`
//                         group flex items-center gap-2 px-6 py-3 rounded-lg
//                         transition-all duration-200 font-medium
//                         ${isLoading 
//                             ? 'bg-blue-400 cursor-not-allowed' 
//                             : 'bg-blue-600 hover:bg-blue-700'}
//                         text-white
//                     `}
//                 >
//                     {isLoading ? (
//                         <>
//                             <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                             />
//                             Processing...
//                         </>
//                     ) : (
//                         <>
//                             Continue to Media Upload
//                             <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                         </>
//                     )}
//                 </motion.button>
//             </motion.div>
//         </motion.div>
//     );
// }


import React, { useState, useEffect } from "react";
import { Stepper } from "../../../components/Stepper";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../../components/ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setinspectionData, setCustomerId } from "../../../store/slices/itemSlice";
import { Package, Shield, Droplets, AlertCircle, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Inspection() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const selectedItems = useSelector((state: RootState) => state.ids.selectedItems);

    const [condition, setCondition] = useState<string[]>([]);
    const [issue, setIssue] = useState<string[]>([]);
    const [productCondition, setProductCondition] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState<string>("package");
    const [isLoading, setIsLoading] = useState(false);

    const conditions = [
        { id: "sealed", label: "factory_seal", icon: <Shield className="w-5 h-5" /> },
        { id: "mistake", label: "no_factory_seal", icon: <AlertCircle className="w-5 h-5" /> },
        { id: "defective", label: "minimal_tear", icon: <Package className="w-5 h-5" /> },
        { id: "unsealed", label: "no_package", icon: <Package className="w-5 h-5" /> },
    ];

    const productConditions = [
        { id: "new_conditiono", label: "new_condition", icon: <Package className="w-5 h-5" /> },
        { id: "not_new_condition", label: "not_new_condition", icon: <AlertCircle className="w-5 h-5" /> },
    ];

    const issues = [
        { label: "No_stains", icon: <Droplets className="w-5 h-5" /> },
        { id: "bio_stains", label: "bio_stains", icon: <Droplets className="w-5 h-5" /> },
        { id: "package_stains", label: "package_stains", icon: <Droplets className="w-5 h-5" /> },
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
                    dispatch(setCustomerId(response.data.customer_id));
                } else {
                    console.error("Invalid response for customer ID:", response.data);
                }
            } catch (error) {
                console.error("Error fetching customer ID:", error);
            }
        };

        if (selectedItems?.orderNumber) {
            fetchCustomerId();
        }
    }, [selectedItems, dispatch]);

    const handleNext = async () => {
        setIsLoading(true);
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

        try {
            dispatch(setinspectionData(inspectionData));
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            router("/return/upload-media");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setState: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const { value, checked } = event.target;
        setState(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
    };

    const CheckboxCard = ({ 
        item, 
        checked, 
        onChange, 
        name 
    }: { 
        item: { label: string; icon: JSX.Element }, 
        checked: boolean, 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        name: string 
    }) => (
        <motion.label
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex items-center p-4 cursor-pointer rounded-xl
                transition-all duration-200 
                ${checked 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'}
                border-2
            `}
        >
            <input
                type="checkbox"
                name={name}
                value={item.label}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <div className="flex items-center gap-4 w-full">
                <div className={`
                    flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg
                    transition-all duration-200
                    ${checked 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-500'}
                `}>
                    {item.icon}
                </div>
                <span className={`
                    text-sm font-medium transition-colors duration-200
                    ${checked ? 'text-blue-700' : 'text-gray-700'}
                `}>
                    {capitalizeFirstLetter(item.label)}
                </span>
                {checked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                    >
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </motion.div>
                )}
            </div>
        </motion.label>
    );

    const SectionTab = ({ id, label, icon, active }: { id: string; label: string; icon: JSX.Element; active: boolean }) => (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(id)}
            className={`
                flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200
                ${active 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'}
            `}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </motion.button>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto p-6"
        >
            <Stepper
                steps={[
                    { label: "Your details", status: "completed" },
                    { label: "Inspection", status: "current" },
                    { label: "Upload Media", status: "upcoming" },
                    { label: "Compare", status: "upcoming" },
                    { label: "Review & Submit", status: "upcoming" },
                ]}
            />
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 mb-6"
            >
                <ProductDetails />
            </motion.div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border mt-8"
            >
                <div className="flex gap-2 p-4 border-b overflow-x-auto">
                    <SectionTab
                        id="package"
                        label="Package Condition"
                        icon={<Package className="w-5 h-5" />}
                        active={activeSection === "package"}
                    />
                    {condition.includes("factory_seal") && (
                        <SectionTab
                            id="product"
                            label="Product Condition"
                            icon={<Shield className="w-5 h-5" />}
                            active={activeSection === "product"}
                        />
                    )}
                    <SectionTab
                        id="issues"
                        label="Surface Issues"
                        icon={<Droplets className="w-5 h-5" />}
                        active={activeSection === "issues"}
                    />
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {activeSection === "package" && (
                            <motion.div
                                key="package"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {conditions.map((item) => (
                                    <CheckboxCard
                                        key={item.id}
                                        item={item}
                                        checked={condition.includes(item.label)}
                                        onChange={(e) => handleSelectionChange(e, setCondition)}
                                        name="condition"
                                    />
                                ))}
                            </motion.div>
                        )}

                        {activeSection === "product" && condition.includes("factory_seal") && (
                            <motion.div
                                key="product"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {productConditions.map((item) => (
                                    <CheckboxCard
                                        key={item.id}
                                        item={item}
                                        checked={productCondition.includes(item.label)}
                                        onChange={(e) => handleSelectionChange(e, setProductCondition)}
                                        name="productCondition"
                                    />
                                ))}
                            </motion.div>
                        )}

                        {activeSection === "issues" && (
                            <motion.div
                                key="issues"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {issues.map((item) => (
                                    <CheckboxCard
                                        key={item.id}
                                        item={item}
                                        checked={issue.includes(item.label)}
                                        onChange={(e) => handleSelectionChange(e, setIssue)}
                                        name="issue"
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex justify-between"
            >
                {/* Back Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router("http://54.210.159.220:5173/return/details")}
                    className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back
                </motion.button>

                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={isLoading}
                    className={`
                        group flex items-center gap-2 px-6 py-3 rounded-lg
                        transition-all duration-200 font-medium
                        ${isLoading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'}
                        text-white
                    `}
                >
                    {isLoading ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            Continue to Media Upload
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
