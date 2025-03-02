// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Key, Mail, Lock } from "lucide-react";

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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       await axios.post("http://54.210.159.220:8000/reset-password", formData);

//       setMessage({
//         text: "Password reset successful! Redirecting...",
//         type: "success",
//       });

//       setTimeout(() => navigate("/"), 1500);
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.detail || "Reset failed!",
//         type: "error",
//       });
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
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-600">Username</label>
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
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-600">Email</label>
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
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-600">OTP</label>
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
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-600">New Password</label>
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
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//             disabled={loading}
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         {message.text && (
//           <div
//             className={`mt-4 text-center p-2 rounded-lg ${
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

// export default ResetPassword;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Key, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
        formData
      );

      setMessage({
        text: response.data.message || "Password reset successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 2000); // Redirect to login page after reset
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Reset failed!",
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

  return (
    <div className="flex justify-center items-center min-h-[75vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <div className="flex items-center border rounded-lg p-2">
              <Mail className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            {errors.user_name && (
              <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="flex items-center border rounded-lg p-2">
              <Mail className="text-gray-400 mr-2" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">OTP</label>
            <div className="flex items-center border rounded-lg p-2">
              <Key className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">New Password</label>
            <div className="flex items-center border rounded-lg p-2">
              <Lock className="text-gray-400 mr-2" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 text-center p-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p>{message.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResetPassword;
