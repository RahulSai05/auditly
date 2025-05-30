import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Check, 
  Clock, 
  ChevronRight, 
  Info
} from "lucide-react";

interface Language {
  id: string;
  name: string;
  localName: string;
  status: "available" | "coming_soon" | "beta";
  completionPercentage?: number;
}

const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  
  const languages: Language[] = [
    { 
      id: "en-US", 
      name: "English (US)", 
      localName: "English",
      status: "available" 
    },
    { 
      id: "es-ES", 
      name: "Spanish", 
      localName: "Español",
      status: "coming_soon",
      completionPercentage: 85 
    },
    { 
      id: "fr-FR", 
      name: "French", 
      localName: "Français",
      status: "coming_soon",
      completionPercentage: 65 
    },
    { 
      id: "zh-CN", 
      name: "Chinese (Simplified)", 
      localName: "简体中文",
      status: "coming_soon",
      completionPercentage: 40 
    },
  ];

  const handleLanguageSelect = (id: string) => {
    if (languages.find(lang => lang.id === id)?.status === "available" || 
        languages.find(lang => lang.id === id)?.status === "beta") {
      setSelectedLanguage(id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
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
            <Globe className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Language Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose your preferred language for the application interface
          </motion.p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-50 overflow-hidden max-w-3xl mx-auto"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
              >
                <Globe className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Select Your Language</h2>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2 text-sm text-blue-700">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Changing your language affects the entire application interface.
                Some beta languages may have partial translations.
              </p>
            </div>

            <div className="space-y-3">
              {languages.map((language) => (
                <motion.div
                  key={language.id}
                  variants={itemVariants}
                  whileHover={language.status !== "coming_soon" ? { scale: 1.02 } : {}}
                  onClick={() => handleLanguageSelect(language.id)}
                  className={`rounded-xl border p-4 transition-all ${
                    selectedLanguage === language.id
                      ? "border-blue-300 bg-blue-50"
                      : language.status !== "coming_soon"
                      ? "border-gray-200 hover:border-blue-200 cursor-pointer"
                      : "border-gray-200 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedLanguage === language.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{language.name}</h3>
                        <p className="text-sm text-gray-500">{language.localName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {language.status === "available" ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Available
                        </span>
                      ) : language.status === "beta" ? (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          Beta
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="text-gray-400 w-4 h-4" />
                          <span className="text-gray-500 text-sm">Coming Soon</span>
                        </div>
                      )}
                      
                      {language.status !== "coming_soon" && (
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="text-blue-500"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {language.status === "coming_soon" && language.completionPercentage && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Translation progress</span>
                        <span>{language.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${language.completionPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-2 rounded-full bg-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Changes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSettings;