import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/Dropmenu";
import { CircleUser, LogOut, User, Settings, CreditCard, Lock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export function Profile() {
  const navigate = useNavigate(); // Use the useNavigate hook

  // Mock user data for demonstration
  const [userData, setUserData] = useState(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  const handleLogout = async () => {
    if (!userData) return;
    try {
      // Mock API call
      console.log("Logging out user:", userData["User Name"]);
      localStorage.removeItem("token");
      setUserData(null);
      navigate("/login"); // Use navigate for redirection
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
        className="flex items-center gap-x-3 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] text-base"
        onClick={() => navigate("/login")} // Use navigate for redirection
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
          className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-12 h-12 shadow-sm hover:shadow-md transition-all duration-300 text-lg font-semibold"
        >
          {userData["User Name"] ? userData["User Name"][0] : "U"}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mr-2 p-5 text-gray-700 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-blue-50">
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
              className="rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 uppercase text-blue-600 w-14 h-14 shadow-sm text-xl font-semibold"
            >
              {userData["User Name"] ? userData["User Name"][0] : "U"}
            </motion.button>
            <div className="text-base mt-3 text-gray-600">
              <p className="font-medium">{userData["User Name"] || "User Name"}</p>
            </div>
          </center>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mt-5"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300 text-base"
            onClick={() => navigate("/edit-profile")} // Redirect to /edit-profile
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <User className="w-5 h-5 text-blue-600" />
            </span>
            <span>Edit Profile</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300 text-base"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <Settings className="w-5 h-5 text-blue-600" />
            </span>
            <span>Account Settings</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300 text-base"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </span>
            <span>Renewal & Billing</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300 text-base"
            onClick={() => navigate("/forgot-password")} // Use navigate for redirection
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <Lock className="w-5 h-5 text-blue-600" />
            </span>
            <span>Forgot Password</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300 text-base"
            onClick={() => navigate("/reset-password")} // Use navigate for redirection
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </span>
            <span>Reset Settings</span>
          </motion.div>
        </motion.div>

        <DropdownMenuSeparator className="my-4 bg-blue-100 h-0.5" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-x-3 cursor-pointer text-red-600 hover:text-red-700 transition-colors duration-300 text-base"
            onClick={handleLogout}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors duration-200">
              <LogOut className="w-5 h-5 text-red-600" />
            </span>
            <span className="font-medium">Logout</span>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
