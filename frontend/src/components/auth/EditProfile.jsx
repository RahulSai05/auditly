import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Save, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EditProfile = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("token");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [formData, setFormData] = useState({
    user_name: userData?.["User Name"] || "",
    first_name: userData?.["First Name"] || "",
    last_name: userData?.["Last Name"] || "",
    gender: userData?.["Gender"] || "",
    email: userData?.["Email"] || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!userData) {
        setMessage({ text: "User data not found", type: "error" });
        setLoading(false);
        return;
      }

      const response = await axios.put("https://auditlyai.com/api/update-profile", {
        user_name: formData.user_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        email: formData.email,
      });

      if (response.status === 200) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        localStorage.setItem(
          "token",
          JSON.stringify({
            ...userData,
            ...formData,
          })
        );
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setMessage({ text: "Failed to update profile", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.detail || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="flex items-center gap-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-4"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>

            <div className="text-center mb-6">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <User className="h-8 w-8 text-blue-600" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Edit Profile
              </h2>
              <p className="text-gray-600">Update your personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["user_name", "first_name", "last_name", "gender", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace("_", " ").toUpperCase()}
                  </label>
                  {field === "gender" ? (
                    <select
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      readOnly={field === "user_name"}
                      required={field === "email"}
                    />
                  )}
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </span>
                )}
              </motion.button>
            </form>

            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <p>{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
