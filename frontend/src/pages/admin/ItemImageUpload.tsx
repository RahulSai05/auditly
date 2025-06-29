import React, { useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

const ItemImageUpload = () => {
  const [itemNumber, setItemNumber] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const handleImageChange = useCallback((e, setImage, setPreview) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clearImage = useCallback((setImage, setPreview) => {
    setImage(null);
    setPreview('');
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!itemNumber.trim()) {
      setNotification({ type: 'error', message: "Please enter an Item Number." });
      return;
    }
    if (!frontImage || !backImage) {
      setNotification({ type: 'error', message: "Both front and back images are required." });
      return;
    }

    const formData = new FormData();
    formData.append("front_image", frontImage);
    formData.append("back_image", backImage);

    setIsLoading(true);
    try {
      const organization = localStorage.getItem("organization") || "";
      const response = await axios.post(
        `https://auditlyai.com/api/upload-base-images/${organization}?item_number=${itemNumber}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification({ type: 'success', message: response.data.message });
      setItemNumber('');
      clearImage(setFrontImage, setFrontPreview);
      clearImage(setBackImage, setBackPreview);
    } catch (error) {
      setNotification({ type: 'error', message: "An error occurred while uploading images." });
    } finally {
      setIsLoading(false);
    }
  };

  const ImageUploadBox = ({ title, preview, onChange, onClear }) => (
    <motion.div 
      variants={itemVariants}
      className="relative"
    >
      <div className={`
        border-2 border-dashed rounded-xl p-6 transition-all duration-200
        ${preview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}>
        {preview ? (
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={preview} 
              alt={title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 z-10">
              <motion.button
                onClick={onClear}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">{title}</span>
            <span className="text-xs text-gray-400 mt-1">Click to upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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
            <Upload className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Item Image Upload
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Upload base front and back images mapped to an item
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 p-6 mb-6"
          >
            <form onSubmit={handleImageUpload} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Item Number"
                  value={itemNumber}
                  onChange={(e) => setItemNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  disabled={isLoading}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploadBox
                  title="Upload Front Image"
                  preview={frontPreview}
                  onChange={(e) => handleImageChange(e, setFrontImage, setFrontPreview)}
                  onClear={() => clearImage(setFrontImage, setFrontPreview)}
                />
                <ImageUploadBox
                  title="Upload Back Image"
                  preview={backPreview}
                  onChange={(e) => handleImageChange(e, setBackImage, setBackPreview)}
                  onClear={() => clearImage(setBackImage, setBackPreview)}
                />
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`
                  w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 
                  flex items-center justify-center gap-2
                  ${isLoading || !frontImage || !backImage || !itemNumber.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
                disabled={isLoading || !frontImage || !backImage || !itemNumber.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Images
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <AnimatePresence mode="wait">
            {notification.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`
                  rounded-xl p-4 flex items-center gap-3
                  ${notification.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}
                `}
              >
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p>{notification.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemImageUpload;
