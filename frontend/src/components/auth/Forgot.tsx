// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       if (!inputValue.trim()) {
//         setMessage({ text: "Please enter your username or user ID", type: "error" });
//         setLoading(false);
//         return;
//       }

//       const { data } = await axios.post(
//         "http://54.210.159.220:8000/forget-password",
//         {
//           user_name: inputValue,
//           user_id: inputValue,
//         }
//       );

//       // Check if the OTP was sent successfully
//       if (data.message.includes("OTP Sent Successfully")) {
//         setMessage({ text: data.message, type: "success" });

//         // Redirect to /reset-password only if OTP is sent successfully
//         setTimeout(() => {
//           navigate("/reset-password");
//         }, 2000);
//       } else {
//         // Handle cases where the user doesn't exist or the request fails
//         setMessage({ text: data.message || "User not found", type: "error" });
//       }
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.detail || "Failed to send OTP!",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   const inputVariants = {
//     focus: {
//       scale: 1.02,
//       boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
//       transition: { duration: 0.3 },
//     },
//     blur: {
//       scale: 1,
//       boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
//       transition: { duration: 0.3 },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.03,
//       boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       transition: {
//         duration: 0.3,
//         type: "spring",
//         stiffness: 500,
//         damping: 15,
//       },
//     },
//     tap: {
//       scale: 0.97,
//       boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
//       transition: {
//         duration: 0.1,
//       },
//     },
//     disabled: {
//       scale: 1,
//       opacity: 0.7,
//     },
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50"
//       >
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
//           Forgot Password
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <motion.div
//             className="mb-6"
//             variants={inputVariants}
//             whileFocus="focus"
//             initial="blur"
//           >
//             <label
//               htmlFor="input"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Enter Username or User ID
//             </label>
//             <input
//               type="text"
//               id="input"
//               placeholder="Username or User ID"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//               disabled={loading}
//             />
//           </motion.div>

//           <motion.button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
//             disabled={loading}
//             variants={buttonVariants}
//             whileHover={loading ? "disabled" : "hover"}
//             whileTap={loading ? "disabled" : "tap"}
//           >
//             {loading ? (
//               <motion.span
//                 className="flex items-center justify-center gap-2"
//                 animate={{ opacity: [0.6, 1, 0.6] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               >
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Sending OTP...
//               </motion.span>
//             ) : (
//               <span className="flex items-center justify-center gap-2">
//                 <Send className="w-5 h-5" />
//                 Send OTP
//               </span>
//             )}
//           </motion.button>
//         </form>

//         <AnimatePresence mode="wait">
//           {message.text && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, height: 0 }}
//               animate={{ opacity: 1, y: 0, height: "auto" }}
//               exit={{ opacity: 0, y: 10, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
//                 message.type === "success"
//                   ? "bg-green-100 text-green-700 border border-green-200"
//                   : "bg-red-100 text-red-700 border border-red-200"
//               }`}
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 500, damping: 15 }}
//               >
//                 {message.type === "success" ? (
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                 ) : (
//                   <AlertCircle className="w-5 h-5 text-red-500" />
//                 )}
//               </motion.div>
//               <p>{message.text}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default ForgotPassword;


// import { useState } from "react";
// import { Send, Loader2, CheckCircle, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const ForgotPassword = () => {
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       if (!inputValue.trim()) {
//         setMessage({ text: "Please enter your username or user ID", type: "error" });
//         setLoading(false);
//         return;
//       }

//       const { data } = await axios.post(
//         "http://54.210.159.220:8000/forget-password",
//         {
//           user_name: inputValue,
//           user_id: inputValue,
//         }
//       );

//       // Check if the OTP was sent successfully
//       if (data.message.includes("OTP Sent Successfully")) {
//         setMessage({ text: data.message, type: "success" });

//         // Redirect to /reset-password only if OTP is sent successfully
//         setTimeout(() => {
//           // In a real app with react-router-dom:
//           // navigate("/reset-password");
//           console.log("Redirecting to reset password page");
//           // For demo purposes, we'll just log this
//         }, 2000);
//       } else {
//         // Handle cases where the user doesn't exist or the request fails
//         setMessage({ text: data.message || "User not found", type: "error" });
//       }
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.detail || "Failed to send OTP!",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: [0.6, 0.05, 0.01, 0.99],
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: [0.6, 0.05, 0.01, 0.99],
//       },
//     },
//   };

//   const inputVariants = {
//     focus: { 
//       scale: 1.02, 
//       boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
//       transition: { duration: 0.3 } 
//     },
//     blur: { 
//       scale: 1, 
//       boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
//       transition: { duration: 0.3 } 
//     },
//   };

//   const buttonVariants = {
//     hover: { 
//       scale: 1.03,
//       boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       transition: { 
//         duration: 0.3,
//         type: "spring",
//         stiffness: 500,
//         damping: 15
//       } 
//     },
//     tap: { 
//       scale: 0.97,
//       boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
//       transition: { 
//         duration: 0.1,
//       } 
//     },
//     disabled: {
//       scale: 1,
//       opacity: 0.7,
//     }
//   };

//   const backgroundVariants = {
//     initial: {
//       backgroundPosition: "0% 0%",
//     },
//     animate: {
//       backgroundPosition: "100% 100%",
//       transition: {
//         duration: 20,
//         ease: "linear",
//         repeat: Infinity,
//         repeatType: "reverse" as const,
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial="initial"
//       animate="animate"
//       variants={backgroundVariants}
//       className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 overflow-hidden"
//       style={{
//         backgroundSize: "400% 400%",
//       }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           initial={{ opacity: 0.1, x: -100, y: -100 }}
//           animate={{ 
//             opacity: [0.1, 0.2, 0.1],
//             x: [-100, -80, -100],
//             y: [-100, -120, -100],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//           className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"
//         />
//         <motion.div
//           initial={{ opacity: 0.1, x: 100, y: 100 }}
//           animate={{ 
//             opacity: [0.1, 0.2, 0.1],
//             x: [100, 120, 100],
//             y: [100, 80, 100],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//           className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300 filter blur-3xl"
//         />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
//         >
//           <motion.div 
//             className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
//             initial={{ scaleX: 0, originX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//           />
          
//           <div className="p-8 sm:p-10">
//             <motion.div
//               className="text-center mb-8"
//               variants={itemVariants}
//             >
//               <motion.div
//                 className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{
//                   type: "spring",
//                   stiffness: 260,
//                   damping: 20,
//                   delay: 0.1,
//                 }}
//                 whileHover={{ 
//                   scale: 1.05,
//                   rotate: 5,
//                   transition: { duration: 0.3 }
//                 }}
//               >
//                 <KeyRound className="h-10 w-10 text-blue-600" />
//               </motion.div>
              
//               <motion.h2
//                 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
//                 variants={itemVariants}
//               >
//                 Forgot Password
//               </motion.h2>
              
//               <motion.p
//                 className="text-gray-600"
//                 variants={itemVariants}
//               >
//                 Enter your username or user ID to receive a verification code
//               </motion.p>
//             </motion.div>

//             <motion.form 
//               onSubmit={handleSubmit} 
//               className="space-y-6"
//               variants={itemVariants}
//             >
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username or User ID
//                 </label>
//                 <motion.div 
//                   className="relative"
//                   variants={inputVariants}
//                   animate={focusedField === "input" ? "focus" : "blur"}
//                 >
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <KeyRound className="h-5 w-5 text-blue-500" />
//                   </div>
//                   <input
//                     type="text"
//                     id="input"
//                     placeholder="Enter your username or user ID"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onFocus={() => setFocusedField("input")}
//                     onBlur={() => setFocusedField(null)}
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     disabled={loading}
//                   />
//                 </motion.div>
//               </motion.div>

//               <motion.button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
//                 variants={buttonVariants}
//                 whileHover={loading ? "disabled" : "hover"}
//                 whileTap={loading ? "disabled" : "tap"}
//               >
//                 {loading ? (
//                   <motion.span 
//                     className="flex items-center justify-center gap-2"
//                     animate={{ opacity: [0.6, 1, 0.6] }}
//                     transition={{ duration: 1.5, repeat: Infinity }}
//                   >
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Sending OTP...
//                   </motion.span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     Send OTP
//                     <motion.div
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 1, repeat: Infinity }}
//                     >
//                       <Send className="w-5 h-5" />
//                     </motion.div>
//                   </span>
//                 )}
//               </motion.button>
//             </motion.form>

//             <AnimatePresence mode="wait">
//               {message.text && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10, height: 0 }}
//                   animate={{ opacity: 1, y: 0, height: "auto" }}
//                   exit={{ opacity: 0, y: 10, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
//                     message.type === "success"
//                       ? "bg-green-50 text-green-800 border border-green-200"
//                       : "bg-red-50 text-red-800 border border-red-200"
//                   }`}
//                 >
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: "spring", stiffness: 500, damping: 15 }}
//                   >
//                     {message.type === "success" ? (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     ) : (
//                       <AlertCircle className="w-5 h-5 text-red-500" />
//                     )}
//                   </motion.div>
//                   <p>{message.text}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <motion.div
//               className="mt-8 text-center text-gray-600"
//               variants={itemVariants}
//             >
//               <motion.button
//                 onClick={() => {
//                   // In a real app, you would use navigate("/login")
//                   console.log("Navigate to login");
//                 }}
//                 className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ArrowLeft className="w-4 h-4 mr-1" />
//                 Back to Login
//               </motion.button>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default ForgotPassword;



import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!inputValue.trim()) {
        setMessage({ text: "Please enter your username or user ID", type: "error" });
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "http://54.210.159.220:8000/forget-password",
        {
          user_name: inputValue,
          user_id: inputValue,
        }
      );

      // Check if the OTP was sent successfully
      if (data.message.includes("OTP Sent Successfully")) {
        setMessage({ text: data.message, type: "success" });

        // Redirect to /reset-password only if OTP is sent successfully
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        // Handle cases where the user doesn't exist or the request fails
        setMessage({ text: data.message || "User not found", type: "error" });
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Failed to send OTP!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99],
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
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99],
      },
    },
  };

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      transition: { duration: 0.3 } 
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.1,
      } 
    },
    disabled: {
      scale: 1,
      opacity: 0.7,
    }
  };

  const backgroundVariants = {
    initial: {
      backgroundPosition: "0% 0%",
    },
    animate: {
      backgroundPosition: "100% 100%",
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 overflow-hidden"
      style={{
        backgroundSize: "400% 400%",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0.1, x: -100, y: -100 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            x: [-100, -80, -100],
            y: [-100, -120, -100],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0.1, x: 100, y: 100 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            x: [100, 120, 100],
            y: [100, 80, 100],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300 filter blur-3xl"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <motion.div 
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          
          <div className="p-8 sm:p-10">
            <motion.div
              className="text-center mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <KeyRound className="h-10 w-10 text-blue-600" />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                variants={itemVariants}
              >
                Forgot Password
              </motion.h2>
              
              <motion.p
                className="text-gray-600"
                variants={itemVariants}
              >
                Enter your username or user ID to receive a verification code
              </motion.p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username or User ID
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === "input" ? "focus" : "blur"}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    id="input"
                    placeholder="Enter your username or user ID"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setFocusedField("input")}
                    onBlur={() => setFocusedField(null)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                </motion.div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                variants={buttonVariants}
                whileHover={loading ? "disabled" : "hover"}
                whileTap={loading ? "disabled" : "tap"}
              >
                {loading ? (
                  <motion.span 
                    className="flex items-center justify-center gap-2"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send OTP
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                  </span>
                )}
              </motion.button>
            </motion.form>

            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                  <p>{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="mt-8 text-center text-gray-600"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => {
                  navigate("/login");
                }}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
