// import React, { useState } from "react";
// import axios from "axios";

// const ItemImageUpload: React.FC = () => {
//   const [itemNumber, setItemNumber] = useState("");
//   const [frontImage, setFrontImage] = useState<File | null>(null);
//   const [backImage, setBackImage] = useState<File | null>(null);
//   const [notification, setNotification] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleImageUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!itemNumber.trim()) {
//       setNotification("Please enter an Item Number.");
//       return;
//     }
//     if (!frontImage || !backImage) {
//       setNotification("Both front and back images are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("front_image", frontImage);
//     formData.append("back_image", backImage);

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `http://54.210.159.220:8000/upload-base-images/?item_number=${itemNumber}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setNotification(response.data.message);
//     } catch (error) {
//       console.error("Error uploading images:", error);
//       setNotification("An error occurred while uploading images.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-[75vh] flex justify-center items-start p-6">
//       <div className="w-full max-w-2xl space-y-4">
//         {/* Title */}
//         <h1 className="text-2xl font-bold text-center">Item Image Upload</h1>
//         <p className="text-gray-500 text-center">
//           Upload base front and back images mapped to an item
//         </p>

//         {/* Image Upload Section */}
//         <div className="bg-white p-4 rounded-lg shadow-md w-full">
//           <h2 className="text-lg font-semibold mb-2">Upload Item Images</h2>
//           <form onSubmit={handleImageUpload} className="space-y-2">
//             {/* Item Number Input */}
//             <input
//               type="text"
//               placeholder="Enter Item Number"
//               value={itemNumber}
//               onChange={(e) => setItemNumber(e.target.value)}
//               className="border border-gray-300 rounded p-2 w-full"
//               disabled={isLoading}
//             />

//             {/* Front Image Upload */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setFrontImage(e.target.files?.[0] || null)}
//               className="border border-gray-300 rounded p-2 w-full"
//               disabled={isLoading}
//             />

//             {/* Back Image Upload */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setBackImage(e.target.files?.[0] || null)}
//               className="border border-gray-300 rounded p-2 w-full"
//               disabled={isLoading}
//             />

//             {/* Upload Button */}
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? "Uploading..." : "Upload Images"}
//             </button>
//           </form>
//         </div>

//         {/* Notification */}
//         {notification && (
//           <div className="bg-gray-200 text-black p-3 rounded-lg text-center">
//             {notification}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItemImageUpload;


// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

// const ItemImageUpload: React.FC = () => {
//   const [itemNumber, setItemNumber] = useState("");
//   const [frontImage, setFrontImage] = useState<File | null>(null);
//   const [backImage, setBackImage] = useState<File | null>(null);
//   const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
//   const [isLoading, setIsLoading] = useState(false);
//   const [frontPreview, setFrontPreview] = useState<string>('');
//   const [backPreview, setBackPreview] = useState<string>('');

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
//     hidden: { opacity: 0, y: 10 },
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

//   const handleImageChange = useCallback((
//     e: React.ChangeEvent<HTMLInputElement>,
//     setImage: (file: File | null) => void,
//     setPreview: (url: string) => void
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const clearImage = useCallback((
//     setImage: (file: File | null) => void,
//     setPreview: (url: string) => void
//   ) => {
//     setImage(null);
//     setPreview('');
//   }, []);

//   const handleImageUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!itemNumber.trim()) {
//       setNotification({ type: 'error', message: "Please enter an Item Number." });
//       return;
//     }
//     if (!frontImage || !backImage) {
//       setNotification({ type: 'error', message: "Both front and back images are required." });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("front_image", frontImage);
//     formData.append("back_image", backImage);

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `http://54.210.159.220:8000/upload-base-images/?item_number=${itemNumber}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setNotification({ type: 'success', message: response.data.message });
//       // Clear form after successful upload
//       setItemNumber('');
//       clearImage(setFrontImage, setFrontPreview);
//       clearImage(setBackImage, setBackPreview);
//     } catch (error) {
//       console.error("Error uploading images:", error);
//       setNotification({ type: 'error', message: "An error occurred while uploading images." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const ImageUploadBox = ({ 
//     title, 
//     preview, 
//     onChange, 
//     onClear 
//   }: { 
//     title: string;
//     preview: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onClear: () => void;
//   }) => (
//     <motion.div 
//       variants={itemVariants}
//       className="relative"
//     >
//       <div className={`
//         border-2 border-dashed rounded-lg p-4 transition-all duration-200
//         ${preview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
//       `}>
//         {preview ? (
//           <div className="relative">
//             <img 
//               src={preview} 
//               alt={title} 
//               className="w-full h-48 object-cover rounded-lg"
//             />
//             <button
//               onClick={onClear}
//               className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         ) : (
//           <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
//             <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
//             <span className="text-sm text-gray-500">{title}</span>
//             <span className="text-xs text-gray-400 mt-1">Click to upload</span>
//           </label>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onChange}
//           className="hidden"
//           disabled={isLoading}
//         />
//       </div>
//     </motion.div>
//   );

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
//     >
//       <motion.div 
//         variants={itemVariants}
//         className="max-w-2xl mx-auto"
//       >
//         <div className="text-center mb-8">
//           <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Image Upload</h1>
//           <p className="text-gray-600">
//             Upload base front and back images mapped to an item
//           </p>
//         </div>

//         <motion.div 
//           variants={itemVariants}
//           className="bg-white rounded-xl shadow-lg p-6 mb-6"
//         >
//           <form onSubmit={handleImageUpload} className="space-y-6">
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Item Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Item Number"
//                 value={itemNumber}
//                 onChange={(e) => setItemNumber(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
//                 disabled={isLoading}
//               />
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <ImageUploadBox
//                 title="Upload Front Image"
//                 preview={frontPreview}
//                 onChange={(e) => handleImageChange(e, setFrontImage, setFrontPreview)}
//                 onClear={() => clearImage(setFrontImage, setFrontPreview)}
//               />
//               <ImageUploadBox
//                 title="Upload Back Image"
//                 preview={backPreview}
//                 onChange={(e) => handleImageChange(e, setBackImage, setBackPreview)}
//                 onClear={() => clearImage(setBackImage, setBackPreview)}
//               />
//             </div>

//             <motion.button
//               variants={itemVariants}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               className={`
//                 w-full px-6 py-3 rounded-lg font-medium text-white
//                 transition-all duration-200 flex items-center justify-center gap-2
//                 ${isLoading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700'}
//               `}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="w-5 h-5" />
//                   Upload Images
//                 </>
//               )}
//             </motion.button>
//           </form>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {notification.message && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               className={`
//                 rounded-lg p-4 flex items-center gap-3
//                 ${notification.type === 'success' 
//                   ? 'bg-green-100 text-green-800' 
//                   : 'bg-red-100 text-red-800'}
//               `}
//             >
//               {notification.type === 'success' ? (
//                 <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
//               ) : (
//                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
//               )}
//               <p>{notification.message}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ItemImageUpload;


import React, { useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

const ItemImageUpload: React.FC = () => {
  const [itemNumber, setItemNumber] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleImageChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void,
    setPreview: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file); // Debugging
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clearImage = useCallback((
    setImage: (file: File | null) => void,
    setPreview: (url: string) => void
  ) => {
    setImage(null);
    setPreview('');
  }, []);

  const handleImageUpload = async (e: React.FormEvent) => {
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

    // Debugging: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://54.210.159.220:8000/upload-base-images/?item_number=${itemNumber}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNotification({ type: 'success', message: response.data.message });
      // Clear form after successful upload
      setItemNumber('');
      clearImage(setFrontImage, setFrontPreview);
      clearImage(setBackImage, setBackPreview);
    } catch (error) {
      console.error("Error uploading images:", error);
      setNotification({ type: 'error', message: "An error occurred while uploading images." });
    } finally {
      setIsLoading(false);
    }
  };

  const ImageUploadBox = ({ 
    title, 
    preview, 
    onChange, 
    onClear 
  }: { 
    title: string;
    preview: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
  }) => (
    <motion.div 
      variants={itemVariants}
      className="relative"
    >
      <div className={`
        border-2 border-dashed rounded-lg p-4 transition-all duration-200
        ${preview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}>
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt={title} 
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={onClear}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">{title}</span>
            <span className="text-xs text-gray-400 mt-1">Click to upload</span>
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        variants={itemVariants}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Image Upload</h1>
          <p className="text-gray-600">
            Upload base front and back images mapped to an item
          </p>
        </div>

        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
                w-full px-6 py-3 rounded-lg font-medium text-white
                transition-all duration-200 flex items-center justify-center gap-2
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
              disabled={isLoading}
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
                rounded-lg p-4 flex items-center gap-3
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
    </motion.div>
  );
};

export default ItemImageUpload;
