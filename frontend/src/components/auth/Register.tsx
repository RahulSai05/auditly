// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Mail, Lock, UserPlus, User, ChevronDown, Loader2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface FormData {
//   user_name: string;
//   first_name: string;
//   last_name: string;
//   gender: string;
//   email: string;
//   password: string;
// }

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     user_name: "",
//     first_name: "",
//     last_name: "",
//     gender: "Male",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });
//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage({ text: "", type: "" });

//   try {
//     const { data } = await axios.post(
//       "http://54.210.159.220:8000/register",
//       formData
//     );
//     setMessage({
//       text: "Registration successful! Redirecting to login...",
//       type: "success",
//     });
//     setTimeout(() => navigate("/login"), 1500); // Redirect to login page
//   } catch (error: any) {
//     setMessage({
//       text: error.response?.data?.detail || "Registration failed!",
//       type: "error",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

//   // Enhanced animation variants
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
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: 0.3,
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

//   const formTransition = {
//     type: "spring",
//     stiffness: 300,
//     damping: 30,
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
//           exit="exit"
//           variants={containerVariants}
//           className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
//           transition={formTransition}
//         >
//           <motion.div 
//             className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
//             initial={{ scaleX: 0, originX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//           />
          
//           <div className="p-6">
//             <motion.div
//               className="text-center mb-6"
//               variants={itemVariants}
//             >
//               <motion.div
//                 className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
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
//                 <UserPlus className="h-8 w-8 text-blue-600" />
//               </motion.div>
              
//               <motion.h2
//                 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-1"
//                 variants={itemVariants}
//               >
//                 Create Account
//               </motion.h2>
              
//               <motion.p
//                 className="text-gray-600 text-sm"
//                 variants={itemVariants}
//               >
//                 Join us today and get started
//               </motion.p>
//             </motion.div>

//             <motion.form 
//               onSubmit={handleSubmit} 
//               className="space-y-4"
//               variants={itemVariants}
//             >
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <motion.div 
//                   className="relative"
//                   variants={inputVariants}
//                   animate={focusedField === "user_name" ? "focus" : "blur"}
//                 >
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-4 w-4 text-blue-500" />
//                   </div>
//                   <input
//                     type="text"
//                     name="user_name"
//                     value={formData.user_name}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField("user_name")}
//                     onBlur={() => setFocusedField(null)}
//                     className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     placeholder="Choose a username"
//                   />
//                 </motion.div>
//               </motion.div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     First Name
//                   </label>
//                   <motion.div 
//                     variants={inputVariants}
//                     animate={focusedField === "first_name" ? "focus" : "blur"}
//                   >
//                     <input
//                       type="text"
//                       name="first_name"
//                       value={formData.first_name}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField("first_name")}
//                       onBlur={() => setFocusedField(null)}
//                       className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                       placeholder="Enter first name"
//                     />
//                   </motion.div>
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Last Name
//                   </label>
//                   <motion.div 
//                     variants={inputVariants}
//                     animate={focusedField === "last_name" ? "focus" : "blur"}
//                   >
//                     <input
//                       type="text"
//                       name="last_name"
//                       value={formData.last_name}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField("last_name")}
//                       onBlur={() => setFocusedField(null)}
//                       className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                       placeholder="Enter last name"
//                     />
//                   </motion.div>
//                 </motion.div>
//               </div>

//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Gender
//                 </label>
//                 <motion.div 
//                   className="relative"
//                   variants={inputVariants}
//                   animate={focusedField === "gender" ? "focus" : "blur"}
//                 >
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField("gender")}
//                     onBlur={() => setFocusedField(null)}
//                     className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
//                     required
//                   >
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     <ChevronDown className="h-4 w-4 text-gray-400" />
//                   </div>
//                 </motion.div>
//               </motion.div>

//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <motion.div 
//                   className="relative"
//                   variants={inputVariants}
//                   animate={focusedField === "email" ? "focus" : "blur"}
//                 >
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-4 w-4 text-blue-500" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField("email")}
//                     onBlur={() => setFocusedField(null)}
//                     className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </motion.div>
//               </motion.div>

//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <motion.div 
//                   className="relative"
//                   variants={inputVariants}
//                   animate={focusedField === "password" ? "focus" : "blur"}
//                 >
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-4 w-4 text-blue-500" />
//                   </div>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField("password")}
//                     onBlur={() => setFocusedField(null)}
//                     className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     required
//                     placeholder="Choose a password"
//                   />
//                 </motion.div>
//               </motion.div>

//               <motion.button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-2"
//                 variants={buttonVariants}
//                 whileHover={loading ? "disabled" : "hover"}
//                 whileTap={loading ? "disabled" : "tap"}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 {loading ? (
//                   <motion.span 
//                     className="flex items-center justify-center gap-2"
//                     animate={{ opacity: [0.6, 1, 0.6] }}
//                     transition={{ duration: 1.5, repeat: Infinity }}
//                   >
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Creating account...
//                   </motion.span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     Create Account
//                     <motion.div
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 1, repeat: Infinity }}
//                     >
//                       <ArrowRight className="w-4 h-4" />
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
//                   className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
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
//                       <ShieldCheck className="w-4 h-4 text-green-500" />
//                     ) : (
//                       <AlertCircle className="w-4 h-4 text-red-500" />
//                     )}
//                   </motion.div>
//                   <p>{message.text}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <motion.div 
//               className="mt-4 text-center text-gray-600 text-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               Already have an account?{" "}
//               <motion.button
//                 onClick={() => navigate("/login")}
//                 className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Sign in
//               </motion.button>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Register;




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, UserPlus, User, ChevronDown, Loader2, ArrowRight, AlertCircle, ShieldCheck, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define backgroundVariants for animations
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

// Define FormData interface
interface FormData {
  user_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  password: string;
  user_company: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "", // Default to empty (required field)
    email: "",
    password: "",
    user_company: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validate gender field
    if (!formData.gender) {
      setMessage({
        text: "Please select a gender.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://54.210.159.220:8000/register",
        formData
      );
      setMessage({
        text: "Registration successful! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 1500); // Redirect to login page
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Registration failed!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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

      {/* Registration Form */}
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backgroundVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <motion.div 
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          
          <div className="p-6">
            <motion.div
              className="text-center mb-6"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
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
                <UserPlus className="h-8 w-8 text-blue-600" />
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-1"
              >
                Create Account
              </motion.h2>
              
              <motion.p
                className="text-gray-600 text-sm"
              >
                Join us today and get started
              </motion.p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {/* Username Field */}
              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <motion.div 
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("user_name")}
                    onBlur={() => setFocusedField(null)}
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Choose a username"
                  />
                </motion.div>
              </motion.div>

              {/* First Name and Last Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Enter first name"
                  />
                </motion.div>

                <motion.div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Enter last name"
                  />
                </motion.div>
              </div>

              {/* Gender Dropdown */}
              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <motion.div 
                  className="relative"
                >
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Email Field */}
              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <motion.div 
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Enter your email"
                  />
                </motion.div>
              </motion.div>

              {/* Password Field */}
              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <motion.div 
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Choose a password"
                  />
                </motion.div>
              </motion.div>

              {/* Organization Name Field */}
              <motion.div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <motion.div 
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="user_company"
                    value={formData.user_company}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    placeholder="Enter your organization name"
                  />
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-2"
              >
                {loading ? (
                  <motion.span 
                    className="flex items-center justify-center gap-2"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                )}
              </motion.button>
            </motion.form>

            {/* Success/Error Message */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
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
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </motion.div>
                  <p>{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Link */}
            <motion.div 
              className="mt-4 text-center text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Already have an account?{" "}
              <motion.button
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;