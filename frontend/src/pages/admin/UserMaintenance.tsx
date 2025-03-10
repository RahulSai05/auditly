
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, X, Users, Loader2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface User {
//   user_name: string;
//   first_name: string;
//   last_name: string;
//   gender: string;
//   email: string;
// }

// const UserMaintenance: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch users from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://54.210.159.220:8000/users");
//         if (response.data && response.data.data) {
//           setUsers(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setError("Failed to fetch users. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Filter users based on search query
//   const filteredUsers = users.filter((user) =>
//     Object.values(user).some((value) =>
//       String(value).toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-12"
//         >
//           <motion.div
//             initial={{ scale: 0.8, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 20,
//             }}
//             className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
//           >
//             <Users className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-5xl font-bold text-center text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             User Maintenance
//           </motion.h1>
//         </motion.div>

//         {/* Search Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mb-8"
//         >
//           <div className="bg-white/80 rounded-3xl shadow-xl p-6 border border-blue-50">
//             <div className="flex flex-col md:flex-row gap-4">
//               {/* Search Input */}
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="w-full px-6 py-4 bg-white/50 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm pl-12"
//                 />
//                 <Search className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" />
//                 {searchQuery && (
//                   <motion.button
//                     onClick={handleClearSearch}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors"
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <X className="w-5 h-5 text-blue-400" />
//                   </motion.button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Loading State */}
//         <AnimatePresence>
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex justify-center items-center py-12"
//             >
//               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Error State */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-2"
//             >
//               <X className="w-5 h-5 flex-shrink-0" />
//               <p>{error}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Users Table */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-blue-50"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Username</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">First Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Last Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Gender</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Email</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-blue-50">
//                 <AnimatePresence>
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user, index) => (
//                       <motion.tr
//                         key={index}
//                         variants={rowVariants}
//                         className="hover:bg-blue-50/50 transition-colors group"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-900">{user.user_name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{user.first_name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{user.last_name}</td>
//                         <td className="px-6 py-4 text-sm">
//                           <span
//                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                               user.gender.toLowerCase() === "male"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-pink-100 text-pink-800"
//                             }`}
//                           >
//                             {user.gender}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
//                       </motion.tr>
//                     ))
//                   ) : (
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                     >
//                       <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
//                         No users found matching your criteria.
//                       </td>
//                     </motion.tr>
//                   )}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default UserMaintenance;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  is_super_user: boolean;
  is_admin: boolean;
  is_common_user: boolean;
}

const UserMaintenance: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedRoles, setEditedRoles] = useState<{
    is_super_user: boolean;
    is_admin: boolean;
    is_common_user: boolean;
  }>({
    is_super_user: false,
    is_admin: false,
    is_common_user: false,
  });

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://54.210.159.220:8000/users");
        if (response.data && response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle role update
  const handleRoleUpdate = async (userId: number) => {
    try {
      const response = await axios.post("http://54.210.159.220:8000/update-user-type-v1", {
        modifier_user_id: 1, // Replace with actual admin ID
        target_user_id: userId,
        ...editedRoles,
      });
      if (response.data) {
        setUsers(users.map((user) => (user.user_id === userId ? { ...user, ...editedRoles } : user)));
        setEditingUserId(null);
      }
    } catch (error) {
      console.error("Error updating user roles:", error);
      setError("Failed to update user roles. Please try again.");
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <Users className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-center text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            User Maintenance
          </motion.h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/80 rounded-3xl shadow-xl p-6 border border-blue-50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-4 bg-white/50 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-lg shadow-sm pl-12"
                />
                <Search className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <motion.button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-blue-400" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <X className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-blue-50"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">First Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Last Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Super User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Common User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={index}
                        variants={rowVariants}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{user.user_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.first_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.last_name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.gender.toLowerCase() === "male"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {user.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={user.is_super_user}
                            onChange={(e) => {
                              setEditedRoles({ ...editedRoles, is_super_user: e.target.checked });
                              setEditingUserId(user.user_id);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={user.is_admin}
                            onChange={(e) => {
                              setEditedRoles({ ...editedRoles, is_admin: e.target.checked });
                              setEditingUserId(user.user_id);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={user.is_common_user}
                            onChange={(e) => {
                              setEditedRoles({ ...editedRoles, is_common_user: e.target.checked });
                              setEditingUserId(user.user_id);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {editingUserId === user.user_id && (
                            <button
                              onClick={() => handleRoleUpdate(user.user_id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Save
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                        No users found matching your criteria.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserMaintenance;
