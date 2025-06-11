import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  PackageCheck,
  Info,
  Settings,
  Cpu,
  Edit,
  Clock,
  AlertCircle,
  Save,
  RefreshCw,
  User,
  MapPin,
} from "lucide-react";

interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

interface RoutingModes {
  pickup: number | null;
  delivery: number | null;
  deliveryType?: "Delivery" | "Pickup" | "Both";
}

const Schedule: React.FC = () => {
  const defaultDays = [
    { id: 1, name: "Monday", selected: false },
    { id: 2, name: "Tuesday", selected: false },
    { id: 3, name: "Wednesday", selected: false },
    { id: 4, name: "Thursday", selected: false },
    { id: 5, name: "Friday", selected: false },
    { id: 6, name: "Saturday", selected: false },
    { id: 7, name: "Sunday", selected: false },
  ];

  const defaultRoutingModes = {
    pickup: null,
    delivery: null,
    deliveryType: undefined,
  };

  const [days, setDays] = useState<DayOption[]>(defaultDays);
  const [currentSchedule, setCurrentSchedule] = useState<string[]>([]);
  const [currentWeekDays, setCurrentWeekDays] = useState<DayOption[]>(defaultDays);
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [routingModes, setRoutingModes] = useState<RoutingModes>(defaultRoutingModes);
  const [loading, setLoading] = useState({
    schedule: false,
    routing: false,
    currentSchedule: false
  });
  const [error, setError] = useState({
    schedule: null as string | null,
    routing: null as string | null,
    currentSchedule: null as string | null
  });
  const [successMessage, setSuccessMessage] = useState({
    schedule: null as string | null,
    routing: null as string | null,
    currentSchedule: null as string | null
  });
  const [isLastWorkingDay, setIsLastWorkingDay] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const agentId = useSelector((state: RootState) => state.ids.agentId);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    if (agentId) {
      fetchCurrentSchedule(agentId);
      fetchSchedule(agentId);
      checkLastWorkingDay(agentId);
      fetchRoutingModes(agentId);
    } else {
      setError(prev => ({...prev, schedule: "Agent ID not found. Please log in."}));
      setLoading(prev => ({...prev, schedule: false}));
    }
  }, [agentId]);

  const fetchCurrentSchedule = async (agentId: number) => {
    try {
      setLoading(prev => ({...prev, currentSchedule: true}));
      const response = await fetch(`/api/agent/work-schedule/${agentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch current schedule");
      }
      const data = await response.json();
      const daysArray = data.work_schedule?.days?.split(',').map(Number) || [];
      
      setCurrentSchedule(
        defaultDays
          .filter(day => daysArray.includes(day.id))
          .map(day => day.name)
      );
      
      setCurrentWeekDays(
        defaultDays.map(day => ({
          ...day,
          selected: daysArray.includes(day.id)
        }))
      );
    } catch (err) {
      setError(prev => ({...prev, currentSchedule: "Failed to fetch current schedule"}));
    } finally {
      setLoading(prev => ({...prev, currentSchedule: false}));
    }
  };

  const updateCurrentWeekSchedule = async () => {
    if (!agentId) return;

    try {
      setLoading(prev => ({...prev, currentSchedule: true}));
      setError(prev => ({...prev, currentSchedule: null}));

      const selectedDays = currentWeekDays
        .filter(day => day.selected)
        .map(day => day.id)
        .sort((a, b) => a - b);

      if (selectedDays.length === 0) {
        throw new Error("Please select at least one working day");
      }

      const response = await fetch("/api/agent/update-curent-week-work-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          work_schedule: {
            days: selectedDays.join(","),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update current schedule");
      }

      const successData = await response.json();
      setSuccessMessage(prev => ({...prev, currentSchedule: successData.message || "Current week schedule updated successfully!"}));
      setTimeout(() => setSuccessMessage(prev => ({...prev, currentSchedule: null})), 3000);
      
      setIsEditingCurrent(false);
      await fetchCurrentSchedule(agentId);
    } catch (err) {
      setError(prev => ({...prev, currentSchedule: err instanceof Error ? err.message : "Update failed"}));
      setTimeout(() => setError(prev => ({...prev, currentSchedule: null})), 3000);
    } finally {
      setLoading(prev => ({...prev, currentSchedule: false}));
    }
  };

  const fetchSchedule = async (agentId: number) => {
    try {
      setTimeout(() => {
        setLoading(prev => ({...prev, schedule: false}));
      }, 1000);
    } catch (err) {
      setError(prev => ({...prev, schedule: "Failed to fetch schedule"}));
      setLoading(prev => ({...prev, schedule: false}));
    }
  };

  const fetchRoutingModes = async (agentId: number) => {
    try {
      const response = await fetch(`/api/update-routing-modes/${agentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch routing modes");
      }
      const data = await response.json();
      setRoutingModes({
        pickup: data.pickup_routing_mode,
        delivery: data.delivery_routing_mode,
        deliveryType: data.delivery_type,
      });
    } catch (err) {
      console.error("Error fetching routing modes:", err);
    }
  };

  const checkLastWorkingDay = async (agentId: number) => {
    try {
      const response = await fetch("/api/check-agent-last-working-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: agentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to check last working day");
      }

      const data = await response.json();
      setIsLastWorkingDay(data.is_last_working_day);
    } catch (err) {
      console.error("Error checking last working day:", err);
    }
  };

  const toggleDaySelection = (dayId: number) => {
    setDays(days.map(day => 
      day.id === dayId ? { ...day, selected: !day.selected } : day
    ));
  };

  const handleRoutingModeChange = (mode: keyof RoutingModes, value: number) => {
    setRoutingModes(prev => ({
      ...prev,
      [mode]: value,
    }));
  };

  const updateRoutingModes = async () => {
    if (!agentId) return;

    try {
      setLoading(prev => ({...prev, routing: true}));
      setError(prev => ({...prev, routing: null}));

      let pickupMode: number | null = null;
      let deliveryMode: number | null = null;

      if (routingModes.deliveryType === "Pickup") {
        pickupMode = routingModes.pickup;
      } else if (routingModes.deliveryType === "Delivery") {
        deliveryMode = routingModes.delivery;
      } else if (routingModes.deliveryType === "Both") {
        pickupMode = routingModes.pickup;
        deliveryMode = routingModes.delivery;
      }

      const response = await fetch("/api/update-routing-modes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          pickup_routing_mode: pickupMode,
          delivery_routing_mode: deliveryMode,
          delivery_type: routingModes.deliveryType === "Pickup" ? "Return" : routingModes.deliveryType || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update routing modes");
      }

      const successData = await response.json();
      setSuccessMessage(prev => ({...prev, routing: successData.message || "Routing preferences saved successfully!"}));
      setRoutingModes(defaultRoutingModes);
      setTimeout(() => setSuccessMessage(prev => ({...prev, routing: null})), 3000);
    } catch (err) {
      setError(prev => ({...prev, routing: err instanceof Error ? err.message : "Update failed"}));
      setTimeout(() => setError(prev => ({...prev, routing: null})), 3000);
    } finally {
      setLoading(prev => ({...prev, routing: false}));
    }
  };

  const handleSubmit = async () => {
    if (!agentId) return;

    try {
      setLoading(prev => ({...prev, schedule: true}));
      setError(prev => ({...prev, schedule: null}));

      const selectedDays = days
        .filter(day => day.selected)
        .map(day => day.id)
        .sort((a, b) => a - b);

      if (selectedDays.length === 0) {
        throw new Error("Please select at least one working day");
      }

      const response = await fetch("/api/update-work-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          work_schedule: {
            days: selectedDays.join(","),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update schedule");
      }

      const successData = await response.json();
      setSuccessMessage(prev => ({...prev, schedule: successData.message || "Schedule saved successfully!"}));
      setDays(defaultDays);
      setTimeout(() => setSuccessMessage(prev => ({...prev, schedule: null})), 3000);
      
      await checkLastWorkingDay(agentId);
      await fetchCurrentSchedule(agentId);
    } catch (err) {
      setError(prev => ({...prev, schedule: err instanceof Error ? err.message : "Update failed"}));
      setTimeout(() => setError(prev => ({...prev, schedule: null})), 3000);
    } finally {
      setLoading(prev => ({...prev, schedule: false}));
    }
  };

  if (loading.schedule && !agentId) {
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
                  damping: 20,
                }}
                className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
              >
                <Calendar className="w-10 h-10 text-blue-600" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Work Schedule
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your work schedule and routing preferences
              </p>
            </div>

            {/* Alert Messages */}
            <AnimatePresence>
              {(error.schedule || error.routing || error.currentSchedule) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-800 border border-red-100"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {error.schedule || error.routing || error.currentSchedule}
                  </span>
                </motion.div>
              )}

              {(successMessage.schedule || successMessage.routing || successMessage.currentSchedule) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-800 border border-green-100"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    {successMessage.schedule || successMessage.routing || successMessage.currentSchedule}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Banner */}
            {!isLastWorkingDay && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Schedule Updates Restricted</p>
                    <p className="text-yellow-600">You can only update your schedule and routing preferences on your last working day of the week.</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-8">
              {/* Current Schedule Section */}
              <motion.div
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-slate-50 rounded-xl border border-slate-100 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    Current Work Schedule
                  </h2>
                  {!isEditingCurrent ? (
                    <button
                      onClick={() => setIsEditingCurrent(true)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingCurrent(false);
                          setCurrentWeekDays(defaultDays.map(day => ({
                            ...day,
                            selected: currentSchedule.includes(day.name)
                          })));
                        }}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateCurrentWeekSchedule}
                        disabled={loading.currentSchedule}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                      >
                        {loading.currentSchedule ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </button>
                    </div>
                  )}
                </div>
                
                {loading.currentSchedule ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4">
                    {isEditingCurrent ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {currentWeekDays.map((day) => (
                          <motion.button
                            key={day.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentWeekDays(currentWeekDays.map(d => 
                              d.id === day.id ? { ...d, selected: !d.selected } : d
                            ))}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${
                              day.selected
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {day.name}
                          </motion.button>
                        ))}
                      </div>
                    ) : currentSchedule.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentSchedule.map((day, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                          >
                            {day}
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No schedule set for current week</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Next Week Schedule Section */}
              <motion.div
                custom={1}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-slate-50 rounded-xl border border-slate-100 p-6"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Update Next Week's Schedule
                </h2>

                <div className="space-y-6">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
                  >
                    <span className="font-medium text-slate-800">
                      Select Working Days
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                      >
                        {days.map((day) => (
                          <motion.button
                            key={day.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleDaySelection(day.id)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${
                              day.selected
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {day.name}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">
                      Selected Days for Next Week:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {days.filter(day => day.selected).length > 0 ? (
                        days
                          .filter(day => day.selected)
                          .map(day => (
                            <motion.span
                              key={day.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                            >
                              {day.name}
                            </motion.span>
                          ))
                      ) : (
                        <span className="text-slate-500">No days selected</span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
                    whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={loading.schedule || !isLastWorkingDay}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                      loading.schedule
                        ? "bg-blue-200 text-blue-700"
                        : isLastWorkingDay
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {loading.schedule ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {isLastWorkingDay ? "Save Schedule" : "Updates allowed only on your last working day"}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Routing Modes Section */}
              <motion.div
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-slate-50 rounded-xl border border-slate-100 p-6"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  Routing Mode Preferences
                </h2>
                
                <div className="space-y-6">
                  {/* Delivery Type Selection */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Truck className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-700">Delivery Type</span>
                    </div>
                    <select
                      value={routingModes.deliveryType || ""}
                      onChange={(e) =>
                        setRoutingModes((prev) => ({
                          ...prev,
                          deliveryType: e.target.value as "Delivery" | "Pickup" | "Both",
                        }))
                      }
                      disabled={!isLastWorkingDay}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select delivery type</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* Routing Mode Options */}
                  {routingModes.deliveryType && (
                    <div className="space-y-4">
                      {(routingModes.deliveryType === "Pickup" || routingModes.deliveryType === "Both") && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <PackageCheck className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-700">Pickup Routing Mode</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRoutingModeChange("pickup", 0)}
                              disabled={!isLastWorkingDay}
                              className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                routingModes.pickup === 0
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <Cpu className="w-4 h-4" />
                              Auto
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRoutingModeChange("pickup", 1)}
                              disabled={!isLastWorkingDay}
                              className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                routingModes.pickup === 1
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <User className="w-4 h-4" />
                              Manual
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {(routingModes.deliveryType === "Delivery" || routingModes.deliveryType === "Both") && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Truck className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-700">Delivery Routing Mode</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRoutingModeChange("delivery", 0)}
                              disabled={!isLastWorkingDay}
                              className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                routingModes.delivery === 0
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <Cpu className="w-4 h-4" />
                              Auto
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRoutingModeChange("delivery", 1)}
                              disabled={!isLastWorkingDay}
                              className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                routingModes.delivery === 1
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <User className="w-4 h-4" />
                              Manual
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Routing Mode Information:</p>
                        <ul className="space-y-1">
                          <li><strong>Auto:</strong> Routes are optimized automatically by the system</li>
                          <li><strong>Manual:</strong> You have full control over your routing sequence</li>
                          <li><strong>Note:</strong> Changes can only be made on your last working day of the week</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {routingModes.deliveryType && (
                    <motion.button
                      whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
                      whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
                      onClick={updateRoutingModes}
                      disabled={
                        loading.routing ||
                        !isLastWorkingDay ||
                        (routingModes.deliveryType === "Pickup" && routingModes.pickup === null) ||
                        (routingModes.deliveryType === "Delivery" && routingModes.delivery === null) ||
                        (routingModes.deliveryType === "Both" && (routingModes.pickup === null || routingModes.delivery === null))
                      }
                      className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                        loading.routing
                          ? "bg-blue-200 text-blue-700"
                          : isLastWorkingDay && 
                            ((routingModes.deliveryType === "Pickup" && routingModes.pickup !== null) ||
                             (routingModes.deliveryType === "Delivery" && routingModes.delivery !== null) ||
                             (routingModes.deliveryType === "Both" && routingModes.pickup !== null && routingModes.delivery !== null))
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {loading.routing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Save Routing Preferences
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;