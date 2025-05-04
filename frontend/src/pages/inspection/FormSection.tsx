import React from "react";
import { motion } from "framer-motion";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
        {children}
      </div>
    </motion.div>
  );
};

export default FormSection;
