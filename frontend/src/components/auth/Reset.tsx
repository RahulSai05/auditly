import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Key, Mail, Lock } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post("http://54.210.159.220:8000/reset-password", formData);

      setMessage({
        text: "Password reset successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Reset failed!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Username</label>
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">OTP</label>
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">New Password</label>
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message.text && (
          <div
            className={`mt-4 text-center p-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
