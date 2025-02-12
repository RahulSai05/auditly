import { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const userDataString = localStorage.getItem("token");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!userData) {
        setMessage({ text: "Something went wrong", type: "error" });
        setLoading(false);
        return;
      }

      console.log(userData);
      const { data } = await axios.post(
        "http://54.210.159.220:8000/forget-password",
        {
          user_name: userData["User Name"], // Ensure these keys exist in your stored object
          user_id: JSON.stringify(userData["User ID"]),
        }
      );

      setMessage({ text: data.message, type: "success" });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4"></div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            <Send className="mr-2" size={18} />
            {loading ? "Sending OTP..." : "Send OTP"}
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
            {JSON.stringify(message.text)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
