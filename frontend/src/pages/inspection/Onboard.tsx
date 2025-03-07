import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Send, Database, AlertCircle, CheckCircle2 } from "lucide-react";

const Onboard: React.FC = () => {
  const navigate = useNavigate();
  const [onboardName, setOnboardName] = useState("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [response, setResponse] = useState<{
    message: string;
    data: { "Customer User Id": string; "Customer Token": string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setShowEmailAlert(false);

    try {
      const response = await axios.post("http://54.210.159.220:8000/onboard", {
        onboard_name: onboardName,
        onboard_email: onboardEmail,
      });

      setResponse(response.data);
      setShowEmailAlert(true);
      
      // Hide email alert after 5 seconds
      setTimeout(() => {
        setShowEmailAlert(false);
      }, 5000);
    } catch (error) {
      setError("An error occurred while onboarding. Please try again.");
      console.error("Error onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <UserPlus className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Onboard User
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            Enter your details to onboard and get your customer credentials
          </motion.p>
        </motion.div>

        {/* Email Sent Alert */}
        <AnimatePresence>
          {showEmailAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-green-700">Email sent successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Onboarding Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="onboardName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="onboardName"
                value={onboardName}
                onChange={(e) => setOnboardName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="onboardEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                id="onboardEmail"
                value={onboardEmail}
                onChange={(e) => setOnboardEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Onboard
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/inspection-data')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Get Inspection Data
              </motion.button>
            </div>
          </form>

          {/* Display API Response */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-6 bg-green-50 rounded-xl border border-green-100"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  {response.message}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">Customer User Id:</span>
                    <code className="px-2 py-1 bg-green-100 rounded text-green-800">
                      {response.data["Customer User Id"]}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">Customer Token:</span>
                    <code className="px-2 py-1 bg-green-100 rounded text-green-800">
                      {response.data["Customer Token"]}
                    </code>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Display Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboard;
