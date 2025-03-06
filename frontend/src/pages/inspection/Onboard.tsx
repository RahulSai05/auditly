import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Onboard: React.FC = () => {
  const [onboardName, setOnboardName] = useState("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [response, setResponse] = useState<{
    message: string;
    data: { "Customer User Id": string; "Customer Token": string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axios.post("http://54.210.159.220:8000/onboard", {
        onboard_name: onboardName,
        onboard_email: onboardEmail,
      });

      setResponse(response.data);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboard User</h1>
          <p className="text-gray-600">
            Enter your details to onboard and get your customer credentials.
          </p>
        </motion.div>

        {/* Onboarding Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="onboardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="onboardName"
                value={onboardName}
                onChange={(e) => setOnboardName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="onboardEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="onboardEmail"
                value={onboardEmail}
                onChange={(e) => setOnboardEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Onboard"
                )}
              </button>
            </div>
          </form>

          {/* Display API Response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100"
            >
              <h3 className="text-lg font-semibold text-green-800">
                {response.message}
              </h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Customer User Id:</span>{" "}
                  {response.data["Customer User Id"]}
                </p>
                <p className="text-sm text-green-700">
                  <span className="font-medium">Customer Token:</span>{" "}
                  {response.data["Customer Token"]}
                </p>
              </div>
            </motion.div>
          )}

          {/* Display Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Onboard;
