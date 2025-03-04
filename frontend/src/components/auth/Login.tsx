// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { User, Lock, Loader2, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface FormData {
//   user_name: string;
//   password: string;
//   otp?: string;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     user_name: "",
//     password: "",
//     otp: "",
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [otpSent, setOtpSent] = useState<boolean>(false);
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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       if (!otpSent) {
//         // Step 1: Send username and password to get OTP
//         const { data } = await axios.post(
//           "http://54.210.159.220:8000/login",
//           {
//             user_name: formData.user_name,
//             password: formData.password,
//           }
//         );

//         if (data.message === "Invalid Username or Password") {
//           setMessage({ text: "Invalid username or password", type: "error" });
//         } else {
//           setOtpSent(true);
//           setMessage({
//             text: "OTP sent successfully! Check your email.",
//             type: "success",
//           });
//         }
//       } else {
//         // Step 2: Verify OTP
//         const { data } = await axios.post(
//           "http://54.210.159.220:8000/verify-login-otp",
//           {
//             user_name: formData.user_name,
//             login_otp: formData.otp,
//           }
//         );

//         if (data.message === "Login Successfull") {
//           localStorage.setItem("token", JSON.stringify(data.data));
//           setMessage({
//             text: "Login successful! Redirecting...",
//             type: "success",
//           });
//           setTimeout(() => navigate("/"), 1500);
//         } else {
//           setMessage({ text: "Invalid OTP", type: "error" });
//         }
//       }
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.message || "Login failed!",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

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
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={otpSent ? "otp" : "login"}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             variants={containerVariants}
//             className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
//             transition={formTransition}
//           >
//             <motion.div 
//               className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
//               initial={{ scaleX: 0, originX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 0.2, duration: 0.8 }}
//             />
            
//             <div className="p-8 sm:p-10">
//               <motion.div
//                 className="text-center mb-8"
//                 variants={itemVariants}
//               >
//                 <motion.div
//                   className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 260,
//                     damping: 20,
//                     delay: 0.1,
//                   }}
//                   whileHover={{ 
//                     scale: 1.05,
//                     rotate: 5,
//                     transition: { duration: 0.3 }
//                   }}
//                 >
//                   {otpSent ? (
//                     <ShieldCheck className="h-10 w-10 text-blue-600" />
//                   ) : (
//                     <User className="h-10 w-10 text-blue-600" />
//                   )}
//                 </motion.div>
                
//                 <motion.h2
//                   className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
//                   variants={itemVariants}
//                 >
//                   {otpSent ? "Verify OTP" : "Welcome Back"}
//                 </motion.h2>
                
//                 <motion.p
//                   className="text-gray-600"
//                   variants={itemVariants}
//                 >
//                   {otpSent 
//                     ? "Enter the verification code sent to your email" 
//                     : "Sign in to your account"}
//                 </motion.p>
//               </motion.div>

//               <motion.form 
//                 onSubmit={handleSubmit} 
//                 className="space-y-6"
//                 variants={itemVariants}
//               >
//                 <AnimatePresence mode="wait">
//                   {!otpSent ? (
//                     <motion.div
//                       key="credentials"
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                       variants={containerVariants}
//                       className="space-y-6"
//                     >
//                       <motion.div variants={itemVariants}>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Username
//                         </label>
//                         <motion.div 
//                           className="relative"
//                           variants={inputVariants}
//                           animate={focusedField === "user_name" ? "focus" : "blur"}
//                         >
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <User className="h-5 w-5 text-blue-500" />
//                           </div>
//                           <input
//                             type="text"
//                             name="user_name"
//                             value={formData.user_name}
//                             onChange={handleChange}
//                             onFocus={() => setFocusedField("user_name")}
//                             onBlur={() => setFocusedField(null)}
//                             className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                             required
//                             placeholder="Enter your username"
//                           />
//                         </motion.div>
//                       </motion.div>

//                       <motion.div variants={itemVariants}>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Password
//                         </label>
//                         <motion.div 
//                           className="relative"
//                           variants={inputVariants}
//                           animate={focusedField === "password" ? "focus" : "blur"}
//                         >
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock className="h-5 w-5 text-blue-500" />
//                           </div>
//                           <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             onFocus={() => setFocusedField("password")}
//                             onBlur={() => setFocusedField(null)}
//                             className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                             required
//                             placeholder="Enter your password"
//                           />
//                         </motion.div>
//                       </motion.div>
//                     </motion.div>
//                   ) : (
//                     <motion.div
//                       key="otp"
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                       variants={containerVariants}
//                     >
//                       <motion.div variants={itemVariants}>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Verification Code
//                         </label>
//                         <motion.div 
//                           className="relative"
//                           variants={inputVariants}
//                           animate={focusedField === "otp" ? "focus" : "blur"}
//                         >
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Mail className="h-5 w-5 text-blue-500" />
//                           </div>
//                           <input
//                             type="text"
//                             name="otp"
//                             value={formData.otp}
//                             onChange={handleChange}
//                             onFocus={() => setFocusedField("otp")}
//                             onBlur={() => setFocusedField(null)}
//                             className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                             required
//                             placeholder="Enter OTP from your email"
//                           />
//                         </motion.div>
//                       </motion.div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
//                   variants={buttonVariants}
//                   whileHover={loading ? "disabled" : "hover"}
//                   whileTap={loading ? "disabled" : "tap"}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                 >
//                   {loading ? (
//                     <motion.span 
//                       className="flex items-center justify-center gap-2"
//                       animate={{ opacity: [0.6, 1, 0.6] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       {otpSent ? "Verifying..." : "Signing in..."}
//                     </motion.span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       {otpSent ? "Verify OTP" : "Sign in"}
//                       <motion.div
//                         animate={{ x: [0, 5, 0] }}
//                         transition={{ duration: 1, repeat: Infinity }}
//                       >
//                         <ArrowRight className="w-5 h-5" />
//                       </motion.div>
//                     </span>
//                   )}
//                 </motion.button>
//               </motion.form>

//               <AnimatePresence mode="wait">
//                 {message.text && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, height: 0 }}
//                     animate={{ opacity: 1, y: 0, height: "auto" }}
//                     exit={{ opacity: 0, y: 10, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
//                       message.type === "success"
//                         ? "bg-green-50 text-green-800 border border-green-200"
//                         : "bg-red-50 text-red-800 border border-red-200"
//                     }`}
//                   >
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ type: "spring", stiffness: 500, damping: 15 }}
//                     >
//                       {message.type === "success" ? (
//                         <ShieldCheck className="w-5 h-5 text-green-500" />
//                       ) : (
//                         <AlertCircle className="w-5 h-5 text-red-500" />
//                       )}
//                     </motion.div>
//                     <p>{message.text}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <motion.div
//                 className="mt-8 text-center text-gray-600 space-y-2"
//                 variants={itemVariants}
//               >
//                 <p>
//                   Don't have an account?{" "}
//                   <motion.button
//                     onClick={() => navigate("/register")}
//                     className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Register
//                   </motion.button>
//                 </p>
//                 <motion.button
//                   onClick={() => navigate("/forgot-password")}
//                   className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Forgot Password?
//                 </motion.button>
//               </motion.div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// };

// export default Login;




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Loader2, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  user_name: string;
  password: string;
  otp?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage({ text: "", type: "" });

  //   try {
  //     if (!otpSent) {
  //       // Step 1: Send username and password to get OTP
  //       const { data } = await axios.post(
  //         "http://54.210.159.220:8000/login",
  //         {
  //           user_name: formData.user_name,
  //           password: formData.password,
  //         }
  //       );

  //       if (data.message === "Invalid Username or Password") {
  //         setMessage({ text: "Invalid username or password", type: "error" });
  //       } else {
  //         setOtpSent(true);
  //         setMessage({
  //           text: "OTP sent successfully! Check your email.",
  //           type: "success",
  //         });
  //       }
  //     } else {
  //       // Step 2: Verify OTP
  //       const { data } = await axios.post(
  //         "http://54.210.159.220:8000/verify-login-otp",
  //         {
  //           user_name: formData.user_name,
  //           login_otp: formData.otp,
  //         }
  //       );

  //       if (data.message === "Login Successfull") {
  //         localStorage.setItem("token", JSON.stringify(data.data));
  //         setMessage({
  //           text: "Login successful! Redirecting...",
  //           type: "success",
  //         });
  //         setTimeout(() => navigate("/"), 1500);
  //       } else {
  //         setMessage({ text: "Invalid OTP", type: "error" });
  //       }
  //     }
  //   } catch (error: any) {
  //     setMessage({
  //       text: error.response?.data?.message || "Login failed!",
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
  
    try {
      if (!otpSent) {
        // Step 1: Send username and password to get OTP
        const { data } = await axios.post(
          "http://54.210.159.220:8000/login",
          {
            user_name: formData.user_name,
            password: formData.password,
          }
        );
  
        if (data.message === "Invalid Username or Password") {
          setMessage({ text: "Invalid username or password", type: "error" });
        } else {
          setOtpSent(true);
          setMessage({
            text: "OTP sent successfully! Check your email.",
            type: "success",
          });
        }
      } else {
        // Step 2: Verify OTP
        const { data } = await axios.post(
          "http://54.210.159.220:8000/verify-login-otp",
          {
            user_name: formData.user_name,
            login_otp: formData.otp,
          }
        );
  
        if (data.message === "Login Successfull") {
          localStorage.setItem("token", JSON.stringify(data.data));
          localStorage.setItem("user_type", data.user_type); // Store user_type in local storage
          setMessage({
            text: "Login successful! Redirecting...",
            type: "success",
          });
          setTimeout(() => navigate("/"), 1500);
        } else {
          setMessage({ text: "Invalid OTP", type: "error" });
        }
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Login failed!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced animation variants
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
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
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

  const formTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
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
        <AnimatePresence mode="wait">
          <motion.div
            key={otpSent ? "otp" : "login"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            transition={formTransition}
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
                  {otpSent ? (
                    <ShieldCheck className="h-10 w-10 text-blue-600" />
                  ) : (
                    <User className="h-10 w-10 text-blue-600" />
                  )}
                </motion.div>
                
                <motion.h2
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                  variants={itemVariants}
                >
                  {otpSent ? "Verify OTP" : "Welcome Back"}
                </motion.h2>
                
                <motion.p
                  className="text-gray-600"
                  variants={itemVariants}
                >
                  {otpSent 
                    ? "Enter the verification code sent to your email" 
                    : "Sign in to your account"}
                </motion.p>
              </motion.div>

              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={itemVariants}
              >
                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.div
                      key="credentials"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className="space-y-6"
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
                            <User className="h-5 w-5 text-blue-500" />
                          </div>
                          <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("user_name")}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            placeholder="Enter your username"
                          />
                        </motion.div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
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
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            placeholder="Enter your password"
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="otp"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Code
                        </label>
                        <motion.div 
                          className="relative"
                          variants={inputVariants}
                          animate={focusedField === "otp" ? "focus" : "blur"}
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-blue-500" />
                          </div>
                          <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("otp")}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            placeholder="Enter OTP from your email"
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  variants={buttonVariants}
                  whileHover={loading ? "disabled" : "hover"}
                  whileTap={loading ? "disabled" : "tap"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {loading ? (
                    <motion.span 
                      className="flex items-center justify-center gap-2"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {otpSent ? "Verifying..." : "Signing in..."}
                    </motion.span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {otpSent ? "Verify OTP" : "Sign in"}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
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
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </motion.div>
                    <p>{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="mt-8 text-center text-gray-600 space-y-2"
                variants={itemVariants}
              >
                <p>
                  Don't have an account?{" "}
                  <motion.button
                    onClick={() => navigate("/register")}
                    className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </p>
                <motion.button
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot Password?
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Login;

