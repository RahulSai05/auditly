import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Mail,
  Users,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  Headphones,
  Building,
  Code,
  Briefcase,
  Edit,
  Save,
  X,
} from "lucide-react";

interface TeamEmail {
  id: string;
  team_name: string;
  email: string;
  description: string;
  members: number;
}

interface UpdateTeamEmailRequest {
  email?: string;
  description?: string;
  team_name?: string;
}

function EmailConfigurations() {
  const [teamEmails, setTeamEmails] = useState<TeamEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateTeamEmailRequest>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    const fetchTeamEmails = async () => {
      try {
        const response = await axios.get('/api/team-emails/');
        // Add default members count for UI consistency
        const emailsWithMembers = response.data.map((email: any) => ({
          ...email,
          members: Math.floor(Math.random() * 10) + 3 // Random members count for demo
        }));
        setTeamEmails(emailsWithMembers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch team emails');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };

    fetchTeamEmails();
  }, []);

  const handleEdit = (teamEmail: TeamEmail) => {
    setEditingId(teamEmail.id);
    setEditForm({
      email: teamEmail.email,
      description: teamEmail.description,
      team_name: teamEmail.team_name
    });
    setError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (id: string) => {
    try {
      if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
        setError('Please enter a valid email address');
        return;
      }

      const payload: UpdateTeamEmailRequest = {};
      if (editForm.email !== undefined) payload.email = editForm.email;
      if (editForm.description !== undefined) payload.description = editForm.description;
      if (editForm.team_name !== undefined) payload.team_name = editForm.team_name;

      if (Object.keys(payload).length === 0) {
        setError('No changes detected');
        return;
      }

      const { data } = await axios.put(`/api/team-emails/${id}`, payload);
      
      setTeamEmails(prev => 
        prev.map(item => 
          item.id === id ? { 
            ...item, 
            email: data.email || item.email,
            description: data.description || item.description,
            team_name: data.team_name || item.team_name
          } : item
        )
      );
      
      setEditingId(null);
      setSuccessMessage('Team email updated successfully');
      setError(null);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.detail || 'Failed to update team email';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Update error:', err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setError(null);
    setSuccessMessage(null);
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getTeamIcon = (teamName: string) => {
    switch (teamName.toLowerCase()) {
      case 'customer support':
        return Headphones;
      case 'development team':
        return Code;
      case 'sales department':
        return Briefcase;
      case 'security team':
        return Shield;
      case 'operations':
        return Building;
      default:
        return Users;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 text-2xl mb-4">Error</div>
        <div className="text-gray-700 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
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
            <Mail className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Team Email Configuration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Manage and configure email addresses for different teams and departments
          </motion.p>
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg inline-block"
            >
              {successMessage}
            </motion.div>
          )}
        </motion.div>

        {/* Email Configuration Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {teamEmails.map((team) => {
            const TeamIcon = getTeamIcon(team.team_name);
            return (
              <motion.div
                key={team.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                    >
                      <TeamIcon className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          {editingId === team.id ? (
                            <input
                              type="text"
                              name="team_name"
                              value={editForm.team_name || ''}
                              onChange={handleInputChange}
                              className="text-lg font-semibold text-gray-900 bg-blue-50 rounded px-2 py-1 w-full mb-1"
                            />
                          ) : (
                            <h3 className="text-lg font-semibold text-gray-900">
                              {team.team_name}
                            </h3>
                          )}
                          {editingId === team.id ? (
                            <textarea
                              name="description"
                              value={editForm.description || ''}
                              onChange={handleInputChange}
                              className="text-sm text-gray-500 bg-blue-50 rounded px-2 py-1 w-full"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm text-gray-500 mt-1">
                              {team.description}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {team.members} members
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-gray-900">
                        <Mail className="w-4 h-4 text-blue-500" />
                        {editingId === team.id ? (
                          <input
                            type="email"
                            name="email"
                            value={editForm.email || ''}
                            onChange={handleInputChange}
                            className="text-sm font-medium bg-blue-50 rounded px-2 py-1 flex-1"
                          />
                        ) : (
                          <span className="text-sm font-medium">{team.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    {editingId === team.id ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdate(team.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(team)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSendEmail(team.email)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Send Email
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Global Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Notifications</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default EmailConfigurations;
