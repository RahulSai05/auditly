// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { User, Lock } from "lucide-react";

// interface FormData {
//   user_name: string;
//   password: string;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     user_name: "",
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

//   // Redirect if already logged in
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
//       const { data } = await axios.post(
//         "http://54.210.159.220:8000/login",
//         formData
//       );
//       console.log(data);
//       if (data.message == "Invalid Username or Password") {
//         setMessage({ text: "Login failed", type: "error" });
//       } else {
//         localStorage.setItem("token", JSON.stringify(data.data));
//         setMessage({
//           text: "Login successful! Redirecting...",
//           type: "success",
//         });
//         setTimeout(() => navigate("/"), 1500);
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

//   return (
//     <div className="flex justify-center items-center min-h-[75vh] bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-600">Username</label>
//             <div className="flex items-center border rounded-lg p-2">
//               <User className="text-gray-400 mr-2" size={20} />
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
//             <label className="block text-gray-600">Password</label>
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
//             {loading ? "Logging in..." : "Login"}
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
//         <div className="mt-5 ">
//           {" "}
//           Dont have an account ?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-blue-600 underline"
//           >
//             Register
//           </span>
//         </div>
//       </div>
//     </div>
//   );


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  user_name: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        "http://54.210.159.220:8000/login",
        formData
      );
      if (data.message === "Invalid Username or Password") {
        setMessage({ text: "Invalid username or password", type: "error" });
      } else {
        localStorage.setItem("token", JSON.stringify(data.data));
        setMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/"), 1500);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4"
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10"
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sign in to your account
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Enter your username"
                />
              </div>
            </motion.div>

            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              initial="blur"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Enter your password"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 p-4 rounded-lg flex items-center justify-center ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p>{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="mt-8 text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Don't have an account?{" "}
            <motion.button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
// };

// export default Login;
