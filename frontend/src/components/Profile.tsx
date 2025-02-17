
// "use client";

// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/Dropmenu";
// import { CircleUser, LogOut, User, Settings, CreditCard, Lock, RefreshCw } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export function Profile() {
//   const router = useNavigate();
//   const userDataString = localStorage.getItem("token");
//   const userData = userDataString ? JSON.parse(userDataString) : null;

//   const handleLogout = async () => {
//     if (!userData) return;
//     try {
//       const response = await axios.post("http://54.210.159.220:8000/logout", {
//         user_name: userData["User Name"],
//         user_id: JSON.stringify(userData["User ID"]),
//       });
//       if (response.status === 200) {
//         localStorage.removeItem("token");
//         router("/login");
//       } else {
//         console.error("Logout failed:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   if (!userData) {
//     return (
//       <motion.button
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
//         onClick={() => router("/login")}
//       >
//         <CircleUser className="w-5 h-5" />
//         Login
//       </motion.button>
//     );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="-mt-1" asChild>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-10 h-10 shadow-sm hover:shadow-md transition-all duration-300"
//         >
//           {userData["User Name"][0]}
//         </motion.button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56 mr-2 p-4 text-gray-700 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-50">
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="border-b pb-4"
//         >
//           <center>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-10 h-10 shadow-sm"
//             >
//               {userData["User Name"][0]}
//             </motion.button>
//             <div className="text-sm mt-2 text-gray-600">
//               Customer ID: {userData["User ID"]}
//             </div>
//           </center>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="space-y-3 mt-4"
//         >
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
//           >
//             <User className="w-4 h-4" />
//             <span>Edit Profile</span>
//           </motion.div>
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
//           >
//             <Settings className="w-4 h-4" />
//             <span>Account Settings</span>
//           </motion.div>
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
//           >
//             <CreditCard className="w-4 h-4" />
//             <span>Renewal & Billing</span>
//           </motion.div>
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
//             onClick={() => router("/forgot-password")}
//           >
//             <Lock className="w-4 h-4" />
//             <span>Forgot Password</span>
//           </motion.div>
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
//             onClick={() => router("/reset-password")}
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Reset Settings</span>
//           </motion.div>
//         </motion.div>

//         <DropdownMenuSeparator className="my-3 bg-blue-100" />

//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mt-3"
//         >
//           <motion.div
//             whileHover={{ x: 5 }}
//             className="flex items-center gap-x-3 cursor-pointer text-red-600 hover:text-red-700 transition-colors duration-300"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-4 h-4" />
//             <span className="font-medium">Logout</span>
//           </motion.div>
//         </motion.div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/Dropmenu";
import { CircleUser, LogOut, User, Settings, CreditCard, Lock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Profile() {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("token");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleLogout = async () => {
    if (!userData) return;
    try {
      const response = await axios.post("http://54.210.159.220:8000/logout", {
        user_name: userData["User Name"],
        user_id: JSON.stringify(userData["User ID"]),
      });
      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!userData) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
        onClick={() => navigate("/login")}
      >
        <CircleUser className="w-5 h-5" />
        Login
      </motion.button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="-mt-1" asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-10 h-10 shadow-sm hover:shadow-md transition-all duration-300"
        >
          {userData["User Name"][0]}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2 p-4 text-gray-700 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-b pb-4"
        >
          <center>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-10 h-10 shadow-sm"
            >
              {userData["User Name"][0]}
            </motion.button>
            <div className="text-sm mt-2 text-gray-600">
              <p className="font-medium">{userData["User Name"]}</p>
              <p className="text-xs text-gray-500">{userData["Email"]}</p>
            </div>
          </center>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mt-4"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
          >
            <CreditCard className="w-4 h-4" />
            <span>Renewal & Billing</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
            onClick={() => navigate("/forgot-password")}
          >
            <Lock className="w-4 h-4" />
            <span>Forgot Password</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300"
            onClick={() => navigate("/reset-password")}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Settings</span>
          </motion.div>
        </motion.div>

        <DropdownMenuSeparator className="my-3 bg-blue-100" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-red-600 hover:text-red-700 transition-colors duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
