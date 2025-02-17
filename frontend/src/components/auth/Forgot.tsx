import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { Send } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State to store user input (username or user ID)
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
          user_name: inputValue, // Send the input value as username
          user_id: inputValue,   // Also send the input value as user ID
        }
      );

      // Display success message
      setMessage({ text: data.message, type: "success" });

      // Redirect to /reset-password after 2 seconds
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Failed to send OTP!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            <Send className="mr-2" size={18} />
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {message.text && (
          <div
            className={`mt-4 text-center p-3 rounded-lg ${
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

export default ForgotPassword;
