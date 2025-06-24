import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X, Users, Loader2, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  user_id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  organization: string;
  is_admin: boolean;
  is_inspection_user: boolean;
  is_reports_user: boolean;
}

interface UpdateUserRequest {
  modifier_user_id: number;
  target_user_id: number;
  is_inspection_user: boolean;
  is_admin: boolean;
  is_reports_user: boolean;
}

const UserMaintenance: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });
  const [userId, setuserId] = useState(36);

  useEffect(() => {
    if (userData && userData["User ID"]) {
      setuserId(userData["User ID"]);
    }
  });

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://auditlyai.com/api/users");
        if (response.data && response.data.data) {
          // Add id field if not present
          const usersWithIds = response.data.data.map(
            (user: User, index: number) => ({
              ...user,
              id: user.user_id || index + 1, // Use existing id or create one
            })
          );
          setUsers(usersWithIds);
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

  const handleUserSelect = (user: User) => {
    // If the user is the logged in user, don't select them
    if (user.user_id == userId) {
      return;
    } else if (selectedUser && selectedUser.user_id === user.user_id) {
      // If the user is already selected, deselect them
      setSelectedUser(null);
      setUpdatedUser(null);
    } else {
      setSelectedUser(user);
      setUpdatedUser(user);
    }
    setSuccessMessage("");
  };

  const handleCheckboxChange = (field: keyof User) => {
    if (!updatedUser) return;

    setUpdatedUser({
      ...updatedUser,
      [field]: !updatedUser[field],
    });
  };

  // Check if at least one role is selected
  const hasAtLeastOneRole = (user: User): boolean => {
    return user.is_admin || user.is_reports_user || user.is_inspection_user;
  };

  // Check if at least one role has changed
  const hasRoleChanged = (original: User, updated: User): boolean => {
    return (
      original.is_admin !== updated.is_admin ||
      original.is_reports_user !== updated.is_reports_user ||
      original.is_inspection_user !== updated.is_inspection_user
    );
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !updatedUser) return;
  
    if (!hasAtLeastOneRole(updatedUser)) {
      setError("Please select at least one role for the user.");
      return;
    }
  
    if (!hasRoleChanged(selectedUser, updatedUser)) {
      setError("Please change at least one role to update the user.");
      return;
    }
  
    setUpdateLoading(true);
    setError("");
    setSuccessMessage("");
  
    try {
      // Step 1: Update Inspection Role (if changed)
      if (selectedUser.is_inspection_user !== updatedUser.is_inspection_user) {
        await axios.put("https://auditlyai.com/api/users/update-inspection-status", {
          auditly_user_id: selectedUser.user_id,
          is_inspection_user: updatedUser.is_inspection_user,
          approver_id: userId,
        });
      }
  
      // Step 2: Update Admin and Reports Roles (if changed)
      const shouldUpdateUserType =
        selectedUser.is_admin !== updatedUser.is_admin ||
        selectedUser.is_reports_user !== updatedUser.is_reports_user;
  
      if (shouldUpdateUserType) {
        await axios.post("https://auditlyai.com/api/update-user-type", {
          modifier_user_id: userId,
          target_user_id: selectedUser.user_id,
          is_admin: updatedUser.is_admin,
          is_reports_user: updatedUser.is_reports_user,
          // ✅ Pass current is_inspection_user from DB (not from updatedUser)
          is_inspection_user: selectedUser.is_inspection_user,
        });
      }
  
      // Update local state
      const updatedUsers = users.map((user) =>
        user.user_id === selectedUser.user_id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setSuccessMessage(`User ${selectedUser.user_name} updated successfully!`);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Update error:", error);
      setError(
        error?.response?.data?.detail ||
        "Failed to update user. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
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

  // Check if a user is the currently logged in user
  const isCurrentUser = (user: User): boolean => {
    return user.user_id == userId;
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
            className="text-4xl font-bold text-center text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
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

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-green-50 text-green-800 p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 13L9 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Select
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Last Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Reports
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">
                    Inspection
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.user_id}
                        variants={rowVariants}
                        className={`transition-colors group ${isCurrentUser(user)
                            ? "bg-gray-100 opacity-60 cursor-not-allowed"
                            : "hover:bg-blue-50/50"
                          } ${selectedUser && selectedUser.user_id === user.user_id
                            ? "bg-blue-100/50"
                            : ""
                          }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="radio"
                            name="selectedUser"
                            checked={selectedUser?.user_id === user.user_id}
                            onChange={() => handleUserSelect(user)}
                            disabled={isCurrentUser(user)}
                            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${isCurrentUser(user) ? "cursor-not-allowed" : ""
                              }`}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.user_name}
                          {isCurrentUser(user) && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                              You
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.first_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.gender.toLowerCase() === "male"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                              }`}
                          >
                            {user.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.organization}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={
                              selectedUser?.user_id === user.user_id
                                ? updatedUser?.is_admin
                                : user.is_admin
                            }
                            onChange={() => {
                              if (selectedUser?.user_id === user.user_id) {
                                handleCheckboxChange("is_admin");
                              }
                            }}
                            disabled={
                              selectedUser?.user_id !== user.user_id ||
                              isCurrentUser(user)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={
                              selectedUser?.user_id === user.user_id
                                ? updatedUser?.is_reports_user
                                : user.is_reports_user
                            }
                            onChange={() => {
                              if (selectedUser?.user_id === user.user_id) {
                                handleCheckboxChange("is_reports_user");
                              }
                            }}
                            disabled={
                              selectedUser?.user_id !== user.user_id ||
                              isCurrentUser(user)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={
                              selectedUser?.user_id === user.user_id
                                ? updatedUser?.is_inspection_user
                                : user.is_inspection_user
                            }
                            onChange={() => {
                              if (selectedUser?.user_id === user.user_id) {
                                handleCheckboxChange("is_inspection_user");
                              }
                            }}
                            disabled={
                              selectedUser?.user_id !== user.user_id ||
                              isCurrentUser(user)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td
                        colSpan={10}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found matching your criteria.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Update User Button */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                onClick={handleUpdateUser}
                disabled={updateLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-300/50 transition-all duration-300 disabled:opacity-50"
              >
                {updateLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Update User
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserMaintenance;

