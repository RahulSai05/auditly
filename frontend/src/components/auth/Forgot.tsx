// import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import axios from "axios";
// import { Send } from "lucide-react";

// const ForgotPassword = () => {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState(""); // State to store user input (username or user ID)
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
//           user_name: inputValue, // Send the input value as username
//           user_id: inputValue,   // Also send the input value as user ID
//         }
//       );

//       // Display success message
//       setMessage({ text: data.message, type: "success" });

//       // Redirect to /reset-password after 2 seconds
//       setTimeout(() => {
//         navigate("/reset-password");
//       }, 2000);
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.detail || "Failed to send OTP!",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
//           Forgot Password
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
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
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
//             disabled={loading}
//           >
//             <Send className="mr-2" size={18} />
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         </form>

//         {message.text && (
//           <div
//             className={`mt-4 text-center p-3 rounded-lg ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
      if (data.message === "OTP sent successfully") {
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
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 },
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      transition: { duration: 0.3 },
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
        damping: 15,
      },
    },
    tap: {
      scale: 0.97,
      boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.1,
      },
    },
    disabled: {
      scale: 1,
      opacity: 0.7,
    },
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-6"
            variants={inputVariants}
            whileFocus="focus"
            initial="blur"
          >
            <label
              htmlFor="input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Username or User ID
            </label>
            <input
              type="text"
              id="input"
              placeholder="Username or User ID"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              disabled={loading}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            disabled={loading}
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
                <Send className="w-5 h-5" />
                Send OTP
              </span>
            )}
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
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
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
