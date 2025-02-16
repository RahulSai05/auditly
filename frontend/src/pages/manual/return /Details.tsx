// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { useNavigate } from "react-router-dom";
// import { Stepper } from "../../../components/Stepper";
// import ProductDetails from "../../../components/ProductDetails";

// export default function Details() {
//   const Item = useSelector((state: RootState) => state.ids.selectedItems);
//   const router = useNavigate();
//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       {/* Progress Tracker */}
//       <Stepper
//         steps={[
//           { label: "Your details", status: "current" },
//           { label: "Inspection", status: "upcoming" },
//           { label: "Upload Media", status: "upcoming" },
//           { label: "Compare", status: "upcoming" },
//           { label: "Review & Submit", status: "upcoming" },
//         ]}
//       />

//       {/* Product Details */}
//       <ProductDetails />

//       {/* Information Grid */}
//       <div className="grid md:grid-cols-2 gap-6 border p-6 rounded-md mb-8">
//         {/* General Information */}
//         <div className="border hover:shadow-xl rounded-lg p-6 bg-gray-100">
//           <h3 className="font-semibold  mb-4 text-center text-xl ">
//             General Information
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">
//                 Original sales Order
//               </div>
//               <div className="text-left w-[50%] ">
//                 : {Item.original_sales_order_number}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Order Line</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.original_sales_order_line}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">
//                 Ordered Quantity
//               </div>
//               <div className="text-left w-[50%] ">: {Item?.ordered_qty}</div>
//             </div>
//           </div>
//         </div>

//         {/* Return Information */}
//         <div className="border hover:shadow-xl rounded-lg p-6 bg-gray-100">
//           <h3 className="font-semibold mb-4 text-center text-xl ">
//             Return Information
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">
//                 Return Order Number
//               </div>
//               <div className="text-left w-[50%] ">
//                 : #{Item?.return_order_number}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Order Line</div>
//               <div className="text-left w-[50%] ">
//                 : {Item?.return_order_line}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">
//                 Ordered Quantity
//               </div>
//               <div className="text-left w-[50%] ">: {Item.return_qty}</div>
//             </div>
//           </div>
//         </div>

//         {/* Shipping Information */}
//         <div className="border hover:shadow-xl rounded-lg p-6 bg-gray-100">
//           <h3 className="font-semibold mb-4 text-center text-xl ">
//             Shipping Information
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Serial Number:</div>
//               <div className="text-left w-[50%] ">: {Item.serial_number}</div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">
//                 Vendor Item Number
//               </div>
//               <div className="text-left w-[50%] ">
//                 : {Item.vendor_item_number}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Shipped to</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.shipped_to_person}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Address</div>
//               <div className="text-left w-[50%]">
//                 {" "}
//                 :{Item.shipped_to_address.street_number},{" "}
//                 {Item.shipped_to_address.city}, {Item.shipped_to_address.state},{" "}
//                 {Item.shipped_to_address.country}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dimensions */}
//         <div className="border hover:shadow-xl rounded-lg p-6 bg-gray-100">
//           <h3 className="font-semibold mb-4 text-center text-xl ">
//             Dimensions
//           </h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Depth</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.dimensions.depth}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Length</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.dimensions.length}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Breadth</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.dimensions.breadth}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div className="text-gray-800 font-semibold ">Weight</div>
//               <div className="text-left w-[50%] ">
//                 : {Item.dimensions.weight}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-end gap-4">
//         <button
//           onClick={() => router("/option/manual")}
//           className="px-6 py-2 border rounded-lg hover:bg-gray-50"
//         >
//           Back
//         </button>
//         <button
//           onClick={() => router("/return/inspection")}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }


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
