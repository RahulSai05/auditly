import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserCheck,
  UserCog,
  Users,
  ShieldCheck,
  MapPin,
  Mail,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TeamMember {
  agent_name: string;
  agent_roles: "Agent" | "Manager" | "Both" | "Unknown";
  manager: string | null;
  agent_servicing_zip: string | null;
  agent_servicing_city: string;
  agent_servicing_state: string;
  agent_servicing_country: string;
}

const ManagerTeamView: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "agent" | "manager" | "both">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get manager_id from localStorage or context in a real app
  const managerId = 1; // Replace with actual manager ID in your implementation

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/agents-managers/assigned-to/${managerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      
      const result = await response.json();
      setTeamMembers(result);
      setSuccessMessage("Team data loaded successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch team data");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [managerId]);

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = searchTerm.toLowerCase() === "" || 
      member.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.agent_servicing_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.agent_servicing_state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === "all" ||
      (roleFilter === "agent" && member.agent_roles === "Agent") ||
      (roleFilter === "manager" && member.agent_roles === "Manager") ||
      (roleFilter === "both" && member.agent_roles === "Both");
    
    return matchesSearch && matchesRole;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                My Team
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                View and manage your assigned team members
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search team members by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as "all" | "agent" | "manager" | "both")}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="agent">Agents Only</option>
                  <option value="manager">Managers Only</option>
                  <option value="both">Both Roles</option>
                </select>

                <button
                  onClick={fetchTeamMembers}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  {teamMembers.length === 0
                    ? "No team members found"
                    : searchTerm || roleFilter !== "all"
                    ? "No matching results"
                    : "No team members assigned"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {teamMembers.length === 0
                    ? "There are currently no team members assigned to you."
                    : searchTerm || roleFilter !== "all"
                    ? "Try clearing your search or changing filters."
                    : "You might need to have team members assigned to you."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredMembers.map((member, index) => {
                  const id = `${member.agent_name}-${index}`;
                  const isExpanded = expandedId === id;
                  
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        isExpanded
                          ? "border-blue-300 shadow-md bg-blue-50"
                          : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleExpand(id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                              {member.agent_roles === "Agent" ? (
                                <User className="w-6 h-6" />
                              ) : member.agent_roles === "Manager" ? (
                                <UserCog className="w-6 h-6" />
                              ) : member.agent_roles === "Both" ? (
                                <Users className="w-6 h-6" />
                              ) : (
                                <User className="w-6 h-6 opacity-50" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {member.agent_name || "Unnamed"}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  member.agent_roles === "Agent"
                                    ? "bg-blue-100 text-blue-800"
                                    : member.agent_roles === "Manager"
                                    ? "bg-purple-100 text-purple-800"
                                    : member.agent_roles === "Both"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {member.agent_roles}
                                </span>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{member.agent_servicing_city}, {member.agent_servicing_state}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    Member Details
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-slate-500">Role</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {member.agent_roles}
                                        </p>
                                      </div>
                                      {member.manager && (
                                        <div>
                                          <p className="text-xs text-slate-500">Reporting To</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            {member.manager}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    Service Area
                                  </h4>
                                  <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-slate-500">City</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {member.agent_servicing_city}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">State</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {member.agent_servicing_state}
                                        </p>
                                      </div>
                                      {member.agent_servicing_zip && (
                                        <div>
                                          <p className="text-xs text-slate-500">ZIP Codes</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            {member.agent_servicing_zip}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerTeamView;