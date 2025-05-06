import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface DayOption {
  id: number;
  name: string;
  selected: boolean;
}

const Schedule: React.FC = () => {
  const [days, setDays] = useState<DayOption[]>([
    { id: 1, name: "Monday", selected: false },
    { id: 2, name: "Tuesday", selected: false },
    { id: 3, name: "Wednesday", selected: false },
    { id: 4, name: "Thursday", selected: false },
    { id: 5, name: "Friday", selected: false },
    { id: 6, name: "Saturday", selected: false },
    { id: 7, name: "Sunday", selected: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLastWorkingDay, setIsLastWorkingDay] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agentId, setAgentId] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching agent ID - replace with your actual auth logic
    const storedAgentId = localStorage.getItem("userId");
    if (storedAgentId) {
      setAgentId(parseInt(storedAgentId));
      fetchSchedule(parseInt(storedAgentId));
      checkLastWorkingDay(parseInt(storedAgentId));
    } else {
      setError("Agent ID not found. Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchSchedule = async (agentId: number) => {
    try {
      // In a real app, you would fetch the existing schedule here
      // This is just a placeholder to simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch schedule");
      setLoading(false);
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

  const handleSubmit = async () => {
    if (!agentId) return;

    try {
      setLoading(true);
      setError(null);

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
      setSuccessMessage(successData.message || "Schedule updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Re-check if today is still the last working day
      await checkLastWorkingDay(agentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !agentId) {
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

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-800"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-800"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

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

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">
                Selected Days:
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

            <motion.button
              whileHover={isLastWorkingDay ? { scale: 1.02 } : {}}
              whileTap={isLastWorkingDay ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={loading || !isLastWorkingDay}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-200 text-blue-700"
                  : isLastWorkingDay
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isLastWorkingDay ? "Update Schedule" : "Updates allowed only on your last working day"}
                </>
              )}
            </motion.button>

            {!isLastWorkingDay && (
              <div className="mt-4 text-center text-sm text-gray-500">
                You can only update your schedule on your last working day of the week.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;