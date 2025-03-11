import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Database,
  Globe,
  Cloud,
  Server,
  Network,
  Share2,
} from "lucide-react";

const destinations = [
  {
    id: 1,
    title: "Azure",
    description:
      "Microsoft's scalable object storage solution for unstructured data.",
    icon: Database,
    color: "#43A047",
    status: "Enterprise",
  },
  {
    id: 2,
    title: "Amazon S3",
    description:
      "Secure cloud storage with unlimited scalability and high availability.",
    icon: Globe,
    color: "#00796B",
    status: "Popular",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const Outbound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Configure data destination</span>
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Search Destinations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl"
          >
            Choose where to index your data for powerful search capabilities
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((destination) => (
            <motion.div
              key={destination.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 group"
            >
              <div
                className="h-2 bg-gradient-to-r"
                style={{
                  background: `linear-gradient(to right, ${destination.color}40, ${destination.color}60)`,
                }}
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <destination.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {destination.title}
                    </h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r"
                      style={{
                        background: `linear-gradient(to right, ${destination.color}20, ${destination.color}40)`,
                        color: destination.color,
                      }}
                    >
                      {destination.status}
                    </motion.span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {destination.description}
                </p>

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  <span className="text-sm font-medium">Configure</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each destination offers unique features and capabilities. Choose the
            one that best fits your search requirements and performance needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Outbound;
