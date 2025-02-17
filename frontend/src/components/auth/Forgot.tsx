// import { useState } from "react";
// import axios from "axios";
// import { Send } from "lucide-react";

// const ForgotPassword = () => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });

//   const userDataString = localStorage.getItem("token");
//   const userData = userDataString ? JSON.parse(userDataString) : null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       if (!userData) {
//         setMessage({ text: "Something went wrong", type: "error" });
//         setLoading(false);
//         return;
//       }

//       console.log(userData);
//       const { data } = await axios.post(
//         "http://54.210.159.220:8000/forget-password",
//         {
//           user_name: userData["User Name"], // Ensure these keys exist in your stored object
//           user_id: JSON.stringify(userData["User ID"]),
//         }
//       );

//       setMessage({ text: data.message, type: "success" });
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
//     <div className="flex justify-center items-center min-h-[75vh] bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Forgot Password
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4"></div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
//             disabled={loading}
//           >
//             <Send className="mr-2" size={18} />
//             {loading ? "Sending OTP..." : "Send OTP"}
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
//             {JSON.stringify(message.text)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const ForgotPassword = () => {
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
