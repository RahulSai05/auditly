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
      
      // Also set the current week days for editing
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
      
      // Exit edit mode
      setIsEditingCurrent(false);
      // Refresh the displayed schedule
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
      // Reset routing modes after successful save
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
      // Reset days selection after successful save
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
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                >
                  <Calendar className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Work Schedule
                </h1>
              </div>
            </div>

            {/* Current Schedule Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Current Work Schedule
                </h2>
                {!isEditingCurrent ? (
                  <button
                    onClick={() => setIsEditingCurrent(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
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
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateCurrentWeekSchedule}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      disabled={loading.currentSchedule}
                    >
                      {loading.currentSchedule ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
              
              {loading.currentSchedule ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : error.currentSchedule ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{error.currentSchedule}</span>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4">
                  {isEditingCurrent ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentWeekDays.map((day) => (
                        <motion.div
                          key={day.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentWeekDays(currentWeekDays.map(d => 
                            d.id === day.id ? { ...d, selected: !d.selected } : d
                          ))}
                          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            day.selected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {day.name}
                        </motion.div>
                      ))}
                    </div>
                  ) : currentSchedule.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentSchedule.map((day, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {day}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No schedule set for current week</p>
                  )}
                </div>
              )}

              <AnimatePresence>
                {successMessage.currentSchedule && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{successMessage.currentSchedule}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Week Schedule Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Update Next Week's Schedule
              </h2>

              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg"
                >
                  <span className="font-medium text-gray-800">
                    Select Working Days
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {days.map((day) => (
                        <motion.div
                          key={day.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleDaySelection(day.id)}
                          className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                            day.selected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {day.name}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
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
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {day.name}
                        </motion.span>
                      ))
                  ) : (
                    <span className="text-gray-500">No days selected</span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {error.schedule && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{error.schedule}</span>
                  </motion.div>
                )}

                {successMessage.schedule && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{successMessage.schedule}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
                whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={loading.schedule || !isLastWorkingDay}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
                  loading.schedule
                    ? "bg-blue-200 text-blue-700"
                    : isLastWorkingDay
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

            {/* Routing Modes Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Routing Mode Preferences
              </h3>
              
              <div className="space-y-4">
                {/* Delivery Type Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Delivery Type</span>
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select delivery type</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Show only Pickup routing mode when Pickup is selected */}
                {routingModes.deliveryType === "Pickup" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <PackageCheck className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Pickup Routing Mode</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoutingModeChange("pickup", 0)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          routingModes.pickup === 0
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isLastWorkingDay}
                      >
                        <Cpu className="w-4 h-4" />
                        Auto
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoutingModeChange("pickup", 1)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          routingModes.pickup === 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isLastWorkingDay}
                      >
                        <Settings className="w-4 h-4" />
                        Manual
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Show only Delivery routing mode when Delivery is selected */}
                {routingModes.deliveryType === "Delivery" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Delivery Routing Mode</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoutingModeChange("delivery", 0)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          routingModes.delivery === 0
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isLastWorkingDay}
                      >
                        <Cpu className="w-4 h-4" />
                        Auto
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoutingModeChange("delivery", 1)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          routingModes.delivery === 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isLastWorkingDay}
                      >
                        <Settings className="w-4 h-4" />
                        Manual
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Show both routing modes when Both is selected */}
                {routingModes.deliveryType === "Both" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <PackageCheck className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Pickup Routing Mode</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRoutingModeChange("pickup", 0)}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            routingModes.pickup === 0
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isLastWorkingDay}
                        >
                          <Cpu className="w-4 h-4" />
                          Auto
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRoutingModeChange("pickup", 1)}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            routingModes.pickup === 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isLastWorkingDay}
                        >
                          <Settings className="w-4 h-4" />
                          Manual
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Delivery Routing Mode</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRoutingModeChange("delivery", 0)}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            routingModes.delivery === 0
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isLastWorkingDay}
                        >
                          <Cpu className="w-4 h-4" />
                          Auto
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRoutingModeChange("delivery", 1)}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            routingModes.delivery === 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } ${!isLastWorkingDay ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isLastWorkingDay}
                        >
                          <Settings className="w-4 h-4" />
                          Manual
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Auto</strong>: Routes are optimized automatically by the system.<br />
                    <strong>Manual</strong>: You have full control over your routing sequence.<br />
                    Changes can only be made on your last working day of the week.
                  </p>
                </div>

                <AnimatePresence>
                  {error.routing && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">{error.routing}</span>
                    </motion.div>
                  )}

                  {successMessage.routing && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">{successMessage.routing}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 ${
                      loading.routing
                        ? "bg-blue-200 text-blue-700"
                        : isLastWorkingDay && 
                          ((routingModes.deliveryType === "Pickup" && routingModes.pickup !== null) ||
                           (routingModes.deliveryType === "Delivery" && routingModes.delivery !== null) ||
                           (routingModes.deliveryType === "Both" && routingModes.pickup !== null && routingModes.delivery !== null))
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
            </div>

            {!isLastWorkingDay && (
              <div className="mt-6 text-center text-sm text-gray-500">
                You can only update your schedule and routing preferences on your last working day of the week.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;