import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, Truck, Home, ShoppingBag, Clock, CheckCircle2} from "lucide-react";

const DeliverySettings: React.FC = () => {
  const [deliveryType, setDeliveryType] = useState("home"); 
  const [deliveryTime, setDeliveryTime] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchDeliveryTime = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/delivery-type-time/${deliveryType}`);
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.detail || "Failed to fetch delivery time");
        setDeliveryTime(data.delivery_time);
      } catch (err) {
        console.error("Error fetching delivery time:", err);
        setNotification({
          type: "error",
          message: "Could not fetch delivery time for selected type"
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeliveryTime();
  }, [deliveryType]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    
    try {
      const res = await fetch("/api/delivery-type-time/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          delivery_type: deliveryType,
          delivery_time: deliveryTime
        })
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.detail || "Something went wrong");

      setNotification({
        type: 'success',
        message: `✅ ${result.delivery_type} delivery time updated to ${result.delivery_time} mins`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || "Failed to update delivery time"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
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
                <Truck className="w-10 h-10 text-blue-600" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Delivery-Return Settings
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Configure your delivery & return preferences and timings
              </p>
            </div>

            {/* Notification */}
            <AnimatePresence mode="wait">
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
                    notification.type === 'success' 
                      ? 'bg-green-50 border border-green-100 text-green-800' 
                      : 'bg-red-50 border border-red-100 text-red-800'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{notification.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl border border-blue-100 p-6"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  Delivery-Return Configuration
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deliver-Return Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDeliveryType("home")}
                        className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                          deliveryType === "home"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <Home className="w-5 h-5" />
                        Home 
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDeliveryType("retail")}
                        className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                          deliveryType === "retail"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Retail 
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                       Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                      min={1}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-blue-200 text-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliverySettings;