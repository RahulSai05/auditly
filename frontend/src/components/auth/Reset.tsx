// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Key, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     user_name: "",
//     email: "",
//     otp: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });

//   const [errors, setErrors] = useState<{
//     user_name?: string;
//     email?: string;
//     otp?: string;
//     password?: string;
//   }>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
//   };

//   const validateForm = () => {
//     const newErrors: typeof errors = {};

//     if (!formData.user_name.trim()) {
//       newErrors.user_name = "Username is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!formData.otp.trim()) {
//       newErrors.otp = "OTP is required";
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 3) {
//       newErrors.password = "Password must be at least 3 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     if (!validateForm()) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://54.210.159.220:8000/reset-password",
//         {
//           user_name: formData.user_name,
//           email: formData.email,
//           otp: formData.otp,
//           password: formData.password,
//         }
//       );

//       // Check if the response indicates success
//       if (response.data.message === "Password Reset Successfull") {
//         setMessage({
//           text: "Password reset successful! Redirecting...",
//           type: "success",
//         });

//         setTimeout(() => navigate("/login"), 2000); // Redirect to login page after reset
//       } else {
//         // Handle cases where the backend returns an error message with a 200 status code
//         setMessage({
//           text: response.data.message || "Reset failed!",
//           type: "error",
//         });
//       }
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.message || "Reset failed!",
//         type: "error",
//       });

//       // Handle field-specific errors from the API
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[75vh] bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Reset Password
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-600 mb-1">Username</label>
//             <div className="flex items-center border rounded-lg p-2">
//               <Mail className="text-gray-400 mr-2" size={20} />
//               <input
//                 type="text"
//                 name="user_name"
//                 value={formData.user_name}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>
//             {errors.user_name && (
//               <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">Email</label>
//             <div className="flex items-center border rounded-lg p-2">
//               <Mail className="text-gray-400 mr-2" size={20} />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">OTP</label>
//             <div className="flex items-center border rounded-lg p-2">
//               <Key className="text-gray-400 mr-2" size={20} />
//               <input
//                 type="text"
//                 name="otp"
//                 value={formData.otp}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>
//             {errors.otp && (
//               <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">New Password</label>
//             <div className="flex items-center border rounded-lg p-2">
//               <Lock className="text-gray-400 mr-2" size={20} />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <Loader2 className="w-5 h-5 animate-spin" />
//             ) : (
//               "Reset Password"
//             )}
//           </button>
//         </form>

//         <AnimatePresence mode="wait">
//           {message.text && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               transition={{ duration: 0.3 }}
//               className={`mt-4 text-center p-2 rounded-lg ${
//                 message.type === "success"
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 {message.type === "success" ? (
//                   <CheckCircle className="w-5 h-5" />
//                 ) : (
//                   <AlertCircle className="w-5 h-5" />
//                 )}
//                 <p>{message.text}</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Key, Mail, Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    otp: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const [errors, setErrors] = useState<{
    user_name?: string;
    email?: string;
    otp?: string;
    password?: string;
  }>({});

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://54.210.159.220:8000/reset-password",
        {
          user_name: formData.user_name,
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }
      );

      // Check if the response indicates success
      if (response.data.message === "Password Reset Successfull") {
        setMessage({
          text: "Password reset successful! Redirecting...",
          type: "success",
        });

        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after reset
      } else {
        // Handle cases where the backend returns an error message with a 200 status code
        setMessage({
          text: response.data.message || "Reset failed!",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Reset failed!",
        type: "error",
      });

      // Handle field-specific errors from the API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
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

  const errorVariants = {
    initial: { opacity: 0, y: -5, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -5, height: 0 },
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
                <ShieldCheck className="h-10 w-10 text-blue-600" />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                variants={itemVariants}
              >
                Reset Password
              </motion.h2>
              
              <motion.p
                className="text-gray-600"
                variants={itemVariants}
              >
                Enter your details to create a new password
              </motion.p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === "user_name" ? "focus" : "blur"}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("user_name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.user_name && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1 flex items-center"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1 inline" />
                      {errors.user_name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === "email" ? "focus" : "blur"}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1 flex items-center"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1 inline" />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === "otp" ? "focus" : "blur"}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("otp")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter verification code"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.otp && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1 flex items-center"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1 inline" />
                      {errors.otp}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === "password" ? "focus" : "blur"}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create new password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {errors.password && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1 flex items-center"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1 inline" />
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-6"
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
                    Resetting Password...
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Reset Password
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Lock className="w-5 h-5" />
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
                onClick={() => navigate("/forgot-password")}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Forgot Password
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
