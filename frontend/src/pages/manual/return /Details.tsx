
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../../../components/Stepper";
import ProductDetails from "../../../components/ProductDetails";
import { motion } from "framer-motion";
import { Package2, Truck, Ruler, FileText, ArrowLeft, ArrowRight } from "lucide-react";

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
            <h3 className="font-bold text-xl text-gray-800">Product Information</h3>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router("/option/manual")}
          className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router("/return/inspection")}
          className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Next
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
