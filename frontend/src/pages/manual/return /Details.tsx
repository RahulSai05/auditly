
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";
import { motion } from "framer-motion";
import { Package2, Truck, Ruler, FileText } from "lucide-react";

export default function Details() {
  const Item = useSelector((state: RootState) => state.ids.selectedItems);
  const router = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
    >
      {/* Progress Tracker */}
      <motion.div variants={itemVariants} className="mb-8">
        <Stepper
          steps={[
            { label: "Your details", status: "current" },
            { label: "Inspection", status: "upcoming" },
            { label: "Upload Media", status: "upcoming" },
            { label: "Compare", status: "upcoming" },
            { label: "Review & Submit", status: "upcoming" },
          ]}
        />
      </motion.div>

      {/* Product Details */}
      <motion.div variants={itemVariants} className="mb-8">
        <ProductDetails />
      </motion.div>

      {/* Information Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-8 mb-8"
      >
        {/* General Information */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-4">
            <Package2 className="w-8 h-8 text-blue-600 mr-2" />
            <h3 className="font-bold text-xl text-gray-800">General Information</h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
            <InfoRow label="Order Line" value={Item.original_sales_order_line} />
            <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
          </div>
        </motion.div>

        {/* Return Information */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-green-600 mr-2" />
            <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Return Order Number" value={`#${Item.return_order_number}`} />
            <InfoRow label="Order Line" value={Item.return_order_line} />
            <InfoRow label="Ordered Quantity" value={Item.return_qty} />
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-purple-600 mr-2" />
            <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Serial Number" value={Item.serial_number} />
            <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
            <InfoRow label="Shipped to" value={Item.shipped_to_person} />
            <InfoRow 
              label="Address" 
              value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
            />
          </div>
        </motion.div>

        {/* Dimensions */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-4">
            <Ruler className="w-8 h-8 text-orange-600 mr-2" />
            <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Depth" value={Item.dimensions.depth} />
            <InfoRow label="Length" value={Item.dimensions.length} />
            <InfoRow label="Breadth" value={Item.dimensions.breadth} />
            <InfoRow label="Weight" value={Item.dimensions.weight} />
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-end gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router("/option/manual")}
          className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router("/return/inspection")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          Next
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Helper component for consistent info row styling
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);


// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package2, Truck, Ruler, FileText, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
// import { useState } from "react";

// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };

//   const handleNext = async () => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
//       router("/return/inspection");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"
//     >
//       <motion.div 
//         variants={cardVariants}
//         className="mb-8"
//       >
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
//             { label: "Inspection", status: "upcoming" },
//             { label: "Upload Media", status: "upcoming" },
//             { label: "Compare", status: "upcoming" },
//             { label: "Review & Submit", status: "upcoming" },
//           ]}
//         />
//       </motion.div>

//       <motion.div 
//         variants={cardVariants}
//         className="mb-8 bg-white rounded-xl shadow-lg p-6"
//       >
//         <ProductDetails />
//       </motion.div>

//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         <AnimatePresence>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-blue-100 p-3 rounded-full mr-3">
//                 <Package2 className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//               <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-green-100 p-3 rounded-full mr-3">
//                 <FileText className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow 
//                 label="Return Order Number" 
//                 value={`#${Item.return_order_number}`}
//                 highlight 
//               />
//               <InfoRow label="Order Line" value={Item.return_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-purple-100 p-3 rounded-full mr-3">
//                 <Truck className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Serial Number" value={Item.serial_number} highlight />
//               <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//               <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//               <InfoRow 
//                 label="Address" 
//                 value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//               />
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-orange-100 p-3 rounded-full mr-3">
//                 <Ruler className="w-6 h-6 text-orange-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Depth" value={Item.dimensions.depth} />
//               <InfoRow label="Length" value={Item.dimensions.length} />
//               <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//               <InfoRow label="Weight" value={Item.dimensions.weight} />
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>

//       <motion.div 
//         variants={cardVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => router("/option/manual")}
//           className="group px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleNext}
//           disabled={isLoading}
//           className="group px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               Next
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }

// const InfoRow = ({ 
//   label, 
//   value, 
//   highlight 
// }: { 
//   label: string; 
//   value: string | number;
//   highlight?: boolean;
// }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`
//       flex justify-between items-center py-3 border-b border-gray-100 last:border-0
//       ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}
//     `}
//   >
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className={`
//       font-semibold
//       ${highlight ? 'text-blue-700' : 'text-gray-800'}
//     `}>
//       {value}
//     </span>
//   </motion.div>
// );




// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion } from "framer-motion";
// import { Package2, Truck, Ruler, FileText } from "lucide-react";
// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1
//       }
//     }
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };
//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
//     >
//       {/* Progress Tracker */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
//             { label: "Inspection", status: "upcoming" },
//             { label: "Upload Media", status: "upcoming" },
//             { label: "Compare", status: "upcoming" },
//             { label: "Review & Submit", status: "upcoming" },
//           ]}
//         />
//       </motion.div>
//       {/* Product Details */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <ProductDetails />
//       </motion.div>
//       {/* Information Grid */}
//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         {/* General Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Package2 className="w-8 h-8 text-blue-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//             <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//           </div>
//         </motion.div>
//         {/* Return Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <FileText className="w-8 h-8 text-green-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Return Order Number" value={`#${Item.return_order_number}`} />
//             <InfoRow label="Order Line" value={Item.return_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//           </div>
//         </motion.div>
//         {/* Shipping Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Truck className="w-8 h-8 text-purple-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Serial Number" value={Item.serial_number} />
//             <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//             <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//             <InfoRow 
//               label="Address" 
//               value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//             />
//           </div>
//         </motion.div>
//         {/* Dimensions */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Ruler className="w-8 h-8 text-orange-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Depth" value={Item.dimensions.depth} />
//             <InfoRow label="Length" value={Item.dimensions.length} />
//             <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//             <InfoRow label="Weight" value={Item.dimensions.weight} />
//           </div>
//         </motion.div>
//       </motion.div>
//       {/* Navigation Buttons */}
//       <motion.div 
//         variants={itemVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/option/manual")}
//           className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
//         >
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/return/inspection")}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-200"
//         >
//           Next
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }
// // Helper component for consistent info row styling
// const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
//   <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className="text-gray-800 font-semibold">{value}</span>
//   </div>
// // );
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package2, Truck, Ruler, FileText, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Package2, Truck, Ruler, FileText } from "lucide-react";

// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         when: "beforeChildren",
//         duration: 0.5,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const cardVariants = {
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };
//   const handleNext = async () => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
//       router("/return/inspection");
//     } finally {
//       setIsLoading(false);
//     }
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"
//       className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
//     >
//       <motion.div 
//         variants={cardVariants}
//         className="mb-8"
//       >
//       {/* Progress Tracker */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
// @@ -411,161 +222,350 @@ export default function Details() {
//         />
//       </motion.div>

//       <motion.div 
//         variants={cardVariants}
//         className="mb-8 bg-white rounded-xl shadow-lg p-6"
//       >
//       {/* Product Details */}
//       <motion.div variants={itemVariants} className="mb-8">
//         <ProductDetails />
//       </motion.div>

//       {/* Information Grid */}
//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         <AnimatePresence>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-blue-100 p-3 rounded-full mr-3">
//                 <Package2 className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//               <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-green-100 p-3 rounded-full mr-3">
//                 <FileText className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow 
//                 label="Return Order Number" 
//                 value={`#${Item.return_order_number}`}
//                 highlight 
//               />
//               <InfoRow label="Order Line" value={Item.return_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-purple-100 p-3 rounded-full mr-3">
//                 <Truck className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Serial Number" value={Item.serial_number} highlight />
//               <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//               <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//               <InfoRow 
//                 label="Address" 
//                 value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//               />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-orange-100 p-3 rounded-full mr-3">
//                 <Ruler className="w-6 h-6 text-orange-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Depth" value={Item.dimensions.depth} />
//               <InfoRow label="Length" value={Item.dimensions.length} />
//               <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//               <InfoRow label="Weight" value={Item.dimensions.weight} />
//             </div>
//           </motion.div>
//         </AnimatePresence>
//         {/* General Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Package2 className="w-8 h-8 text-blue-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//             <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//           </div>
//         </motion.div>
//         {/* Return Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <FileText className="w-8 h-8 text-green-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Return Order Number" value={`#${Item.return_order_number}`} />
//             <InfoRow label="Order Line" value={Item.return_order_line} />
//             <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//           </div>
//         </motion.div>
//         {/* Shipping Information */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Truck className="w-8 h-8 text-purple-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Serial Number" value={Item.serial_number} />
//             <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//             <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//             <InfoRow 
//               label="Address" 
//               value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//             />
//           </div>
//         </motion.div>
//         {/* Dimensions */}
//         <motion.div 
//           variants={itemVariants}
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Ruler className="w-8 h-8 text-orange-600 mr-2" />
//             <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//           </div>
//           <div className="space-y-4">
//             <InfoRow label="Depth" value={Item.dimensions.depth} />
//             <InfoRow label="Length" value={Item.dimensions.length} />
//             <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//             <InfoRow label="Weight" value={Item.dimensions.weight} />
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Navigation Buttons */}
//       <motion.div 
//         variants={cardVariants}
//         variants={itemVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/option/manual")}
//           className="group px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
//           className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleNext}
//           disabled={isLoading}
//           className="group px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router("/return/inspection")}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-200"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               Next
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//           Next
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }

// const InfoRow = ({ 
//   label, 
//   value, 
//   highlight 
// }: { 
//   label: string; 
//   value: string | number;
//   highlight?: boolean;
// }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`
//       flex justify-between items-center py-3 border-b border-gray-100 last:border-0
//       ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}
//     `}
//   >
// // Helper component for consistent info row styling
// const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
//   <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className={`
//       font-semibold
//       ${highlight ? 'text-blue-700' : 'text-gray-800'}
//     `}>
//       {value}
//     </span>
//   </motion.div>
//     <span className="text-gray-800 font-semibold">{value}</span>
//   </div>
// );
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package2, Truck, Ruler, FileText, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
// import { useState } from "react";
// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };
//   const handleNext = async () => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
//       router("/return/inspection");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"
//     >
//       <motion.div 
//         variants={cardVariants}
//         className="mb-8"
//       >
//         <Stepper
//           steps={[
//             { label: "Your details", status: "current" },
//             { label: "Inspection", status: "upcoming" },
//             { label: "Upload Media", status: "upcoming" },
//             { label: "Compare", status: "upcoming" },
//             { label: "Review & Submit", status: "upcoming" },
//           ]}
//         />
//       </motion.div>
//       <motion.div 
//         variants={cardVariants}
//         className="mb-8 bg-white rounded-xl shadow-lg p-6"
//       >
//         <ProductDetails />
//       </motion.div>
//       <motion.div 
//         variants={containerVariants}
//         className="grid md:grid-cols-2 gap-8 mb-8"
//       >
//         <AnimatePresence>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-blue-100 p-3 rounded-full mr-3">
//                 <Package2 className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">General Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Original sales Order" value={Item.original_sales_order_number} />
//               <InfoRow label="Order Line" value={Item.original_sales_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.ordered_qty} />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-green-100 p-3 rounded-full mr-3">
//                 <FileText className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Return Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow 
//                 label="Return Order Number" 
//                 value={`#${Item.return_order_number}`}
//                 highlight 
//               />
//               <InfoRow label="Order Line" value={Item.return_order_line} />
//               <InfoRow label="Ordered Quantity" value={Item.return_qty} />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-purple-100 p-3 rounded-full mr-3">
//                 <Truck className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Shipping Information</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Serial Number" value={Item.serial_number} highlight />
//               <InfoRow label="Vendor Item Number" value={Item.vendor_item_number} />
//               <InfoRow label="Shipped to" value={Item.shipped_to_person} />
//               <InfoRow 
//                 label="Address" 
//                 value={`${Item.shipped_to_address.street_number}, ${Item.shipped_to_address.city}, ${Item.shipped_to_address.state}, ${Item.shipped_to_address.country}`} 
//               />
//             </div>
//           </motion.div>
//           <motion.div 
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, translateY: -5 }}
//             className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex items-center justify-center mb-6">
//               <div className="bg-orange-100 p-3 rounded-full mr-3">
//                 <Ruler className="w-6 h-6 text-orange-600" />
//               </div>
//               <h3 className="font-bold text-xl text-gray-800">Dimensions</h3>
//             </div>
//             <div className="space-y-4">
//               <InfoRow label="Depth" value={Item.dimensions.depth} />
//               <InfoRow label="Length" value={Item.dimensions.length} />
//               <InfoRow label="Breadth" value={Item.dimensions.breadth} />
//               <InfoRow label="Weight" value={Item.dimensions.weight} />
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>
//       <motion.div 
//         variants={cardVariants}
//         className="flex justify-end gap-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => router("/option/manual")}
//           className="group px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleNext}
//           disabled={isLoading}
//           className="group px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               Next
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// }
// const InfoRow = ({ 
//   label, 
//   value, 
//   highlight 
// }: { 
//   label: string; 
//   value: string | number;
//   highlight?: boolean;
// }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`
//       flex justify-between items-center py-3 border-b border-gray-100 last:border-0
//       ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}
//     `}
//   >
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className={`
//       font-semibold
//       ${highlight ? 'text-blue-700' : 'text-gray-800'}
//     `}>
//       {value}
//     </span>
//   </motion.div>
// );
