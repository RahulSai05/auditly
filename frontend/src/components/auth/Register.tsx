import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from './Register'
import axios from "axios";
import { Mail, Lock, UserPlus } from "lucide-react";

interface FormData {
  user_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "Male", // Default gender
    email: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        "http://54.210.159.220:8000/register",
        formData
      );
      setMessage({
        text: "User registered successfully! Redirecting...",
        type: "success",
      });

      // Store user ID in localStorage
      localStorage.setItem("token", JSON.stringify(data.data));
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "Registration failed!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Username</label>
            <div className="flex items-center border rounded-lg p-2">
              <UserPlus className="text-gray-400 mr-2" size={20} />
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-600">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4 mt-2">
            <label className="block text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full outline-none"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
            {loading ? "Registering..." : "Register"}
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
        <div className="mt-5 ">
          {" "}
          Had an account ?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 underline"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
