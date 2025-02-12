import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock } from "lucide-react";

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

  // Redirect if already logged in
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
      console.log(data);
      if (data.message == "Invalid Username or Password") {
        setMessage({ text: "Login failed", type: "error" });
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Username</label>
            <div className="flex items-center border rounded-lg p-2">
              <User className="text-gray-400 mr-2" size={20} />
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
            <label className="block text-gray-600">Password</label>
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
            {loading ? "Logging in..." : "Login"}
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

export default Login;
