import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  UserCog, 
  Users, 
  Info, 
  MapPin, 
  ChevronDown, 
  Search, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

interface AgentManager {
  agent_name: string;
  agent_roles: "Agent" | "Manager" | "Both";
  manager: string | null;
  agent_servicing_zip: string | null;
  agent_servicing_city: string;
  agent_servicing_state: string;
  agent_servicing_country: string;
}

function AgentManagerList() {
  const [data, setData] = useState<AgentManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "agent" | "manager" | "both">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/agents-managers/all");
      if (!response.ok) {
        throw new Error("Failed to fetch agents and managers");
      }
      
      const result = await response.json();
      setData(result);
      setSuccessMessage("Data loaded successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = searchTerm.toLowerCase() === "" || 
      (item.agent_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (item.agent_servicing_city?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (item.agent_servicing_state?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());

    
    const matchesRole = 
      roleFilter === "all" ||
      (roleFilter === "agent" && item.agent_roles === "Agent") ||
      (roleFilter === "manager" && item.agent_roles === "Manager") ||
      (roleFilter === "both" && item.agent_roles === "Both");
    
    return matchesSearch && matchesRole;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const AgentRoleBadge: React.FC<{ role: "Agent" | "Manager" | "Both" }> = ({ role }) => {
    const styles = {
      Agent: "bg-blue-100 text-blue-800",
      Manager: "bg-purple-100 text-purple-800",
      Both: "bg-indigo-100 text-indigo-800"
    };

    const icons = {
      Agent: <User className="w-3 h-3" />,
      Manager: <UserCog className="w-3 h-3" />,
      Both: <Users className="w-3 h-3" />
    };

    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${styles[role]}`}
      >
        {icons[role]}
        <span>{role}</span>
      </motion.span>
    );
  };

  const LocationBadge: React.FC<{ city: string; state: string }> = ({ city, state }) => (
    <motion.div 
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-slate-500 flex items-center text-xs gap-0.5"
    >
      <MapPin className="w-3 h-3" />
      <span>{city}, {state}</span>
    </motion.div>
  );

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
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
              <motion.div
                initial={{ scale: 0.8, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" 
                }}
                className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
              >
                <Users className="w-10 h-10 text-blue-600" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
              >
                Agents & Managers
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                View and manage all delivery personnel
              </motion.p>
            </div>

            {/* Status Messages */}
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

            {/* Search and Filter Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-3">
                <motion.select
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="all">All Roles</option>
                  <option value="agent">Agents Only</option>
                  <option value="manager">Managers Only</option>
                  <option value="both">Both Roles</option>
                </motion.select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchData}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2 transition-all duration-200"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Empty State */}
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100"
              >
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  {data.length === 0
                    ? "No agents or managers found"
                    : searchTerm || roleFilter !== "all"
                    ? "No matching results"
                    : "No personnel available"}
                </h3>
                <p className="text-slate-500 mt-2">
                  {data.length === 0
                    ? "There are currently no agents or managers in the system."
                    : searchTerm || roleFilter !== "all"
                    ? "Try clearing your search or changing filters."
                    : "You might need to add some personnel first."}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredData.map((item, index) => {
                  const id = `${item.agent_name}-${index}`;
                  const isExpanded = expandedId === id;
                  
                  return (
                    <motion.div
                      key={id}
                      variants={itemVariants}
                      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? "border-blue-300 shadow-md bg-blue-50"
                          : "border-slate-200 hover:border-blue-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <motion.div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleExpand(id)}
                        whileHover={{ backgroundColor: isExpanded ? "" : "rgba(239, 246, 255, 0.5)" }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"
                            >
                              {item.agent_roles === "Agent" ? (
                                <User className="w-6 h-6" />
                              ) : item.agent_roles === "Manager" ? (
                                <UserCog className="w-6 h-6" />
                              ) : (
                                <Users className="w-6 h-6" />
                              )}
                            </motion.div>
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {item.agent_name || "Unnamed"}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <AgentRoleBadge role={item.agent_roles} />
                                <LocationBadge 
                                  city={item.agent_servicing_city} 
                                  state={item.agent_servicing_state}
                                />
                              </div>
                            </div>
                          </div>
                          <motion.div 
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          </motion.div>
                        </div>
                      </motion.div>

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
                                    <Info className="w-5 h-5 text-blue-500" />
                                    Details
                                  </h4>
                                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-slate-500">Role</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {item.agent_roles}
                                        </p>
                                      </div>
                                      {item.manager && (
                                        <div>
                                          <p className="text-xs text-slate-500">Assigned Manager(s)</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            {item.manager}
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
                                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-slate-500">City</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {item.agent_servicing_city}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">State</p>
                                        <p className="text-sm font-medium text-slate-800">
                                          {item.agent_servicing_state}
                                        </p>
                                      </div>
                                      {item.agent_servicing_zip && (
                                        <div>
                                          <p className="text-xs text-slate-500">ZIP Codes</p>
                                          <p className="text-sm font-medium text-slate-800">
                                            {item.agent_servicing_zip}
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
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AgentManagerList;