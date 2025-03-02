// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { User, Save, ArrowLeft } from "lucide-react";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const userDataString = localStorage.getItem("token");
//   const userData = userDataString ? JSON.parse(userDataString) : null;

//   const [formData, setFormData] = useState({
//     user_name: userData?.["User Name"] || "",
//     first_name: userData?.["First Name"] || "",
//     last_name: userData?.["Last Name"] || "",
//     gender: userData?.["Gender"] || "",
//     email: userData?.["Email"] || "",
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error" | "";
//   }>({
//     text: "",
//     type: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       if (!userData) {
//         setMessage({ text: "User data not found", type: "error" });
//         setLoading(false);
//         return;
//       }

//       const response = await axios.post("http://54.210.159.220:8000/update-profile", {
//         user_id: userData["User ID"],
//         ...formData,
//       });

//       if (response.status === 200) {
//         setMessage({ text: "Profile updated successfully!", type: "success" });
//         localStorage.setItem(
//           "token",
//           JSON.stringify({
//             ...userData,
//             ...formData,
//           })
//         );
//         setTimeout(() => {
//           navigate("/profile");
//         }, 2000);
//       } else {
//         setMessage({ text: "Failed to update profile", type: "error" });
//       }
//     } catch (error: any) {
//       setMessage({
//         text: error.response?.data?.detail || "An error occurred",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back
//         </button>

//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
//           Edit Profile
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="user_name"
//                 name="user_name"
//                 value={formData.user_name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 id="first_name"
//                 name="first_name"
//                 value={formData.first_name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//               />
//             </div>

//             <div>
//               <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 id="last_name"
//                 name="last_name"
//                 value={formData.last_name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//               />
//             </div>

//             <div>
//               <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
//                 Gender
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
//             disabled={loading}
//           >
//             <Save className="mr-2" size={18} />
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </form>

//         {message.text && (
//           <div
//             className={`mt-4 text-center p-3 rounded-lg ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditProfile;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Save, ArrowLeft } from "lucide-react";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!userData) {
        setMessage({ text: "User data not found", type: "error" });
        setLoading(false);
        return;
      }

      const response = await axios.put("http://54.210.159.220:8000/update-profile", {
        user_name: formData.user_name, // Use user_name to identify the user
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
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg w-96 border border-blue-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-100 cursor-not-allowed"
                readOnly // Make the username field read-only
              />
            </div>

            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            <Save className="mr-2" size={18} />
            {loading ? "Saving..." : "Save Changes"}
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

export default EditProfile;
