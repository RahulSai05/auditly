import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Box,
  Home,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Warehouse,
  ClipboardList,
  Phone,
  ClipboardCheck
} from "lucide-react";

interface Pickup {
  id: number;
  pickup_request_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip: string;
  pickup_country: string;
  pickup_instructions: string;
  items_to_pickup: {
    item_number: string;
    description: string;
    quantity: number;
    condition: string;
    notes: string;
  }[];
  scheduled_pickup_date: string;
  pickup_time_window: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  delivery_agent_id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_contact: string;
}

const ScheduledPickups: React.FC = () => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPickupId, setExpandedPickupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        // Get agent_id from localStorage or wherever it's stored
        const agentId = localStorage.getItem("agentId");
        if (!agentId) {
          throw new Error("Agent ID not found");
        }

        const response = await fetch(`/api/agent/return-orders/${agentId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch pickups: ${response.statusText}`);
        }

        const data = await response.json();
        setPickups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pickups");
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, []);

  const togglePickupExpansion = (pickupId: number) => {
    setExpandedPickupId(expandedPickupId === pickupId ? null : pickupId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        No scheduled pickups found
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Scheduled Pickups
      </h1>

      <div className="space-y-4">
        {pickups.map((pickup) => (
          <motion.div 
            key={pickup.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <motion.div
              whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50"
              onClick={() => togglePickupExpansion(pickup.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Pickup #{pickup.pickup_request_number}</h3>
                  <p className="text-sm text-gray-600">{pickup.customer_name} • {pickup.pickup_city}, {pickup.pickup_state}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pickup.status)}`}>
                  {pickup.status}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedPickupId === pickup.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {expandedPickupId === pickup.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white"
                >
                  <div className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4" />
                        Pickup Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Request Number</p>
                          <p className="font-medium">{pickup.pickup_request_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Scheduled Date</p>
                          <p className="font-medium">{formatDate(pickup.scheduled_pickup_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time Window</p>
                          <p className="font-medium">{pickup.pickup_time_window}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Warehouse</p>
                          <p className="font-medium">{pickup.warehouse_name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Home className="w-4 h-4 mt-0.5 text-gray-400" />
                          <div>
                            <p className="font-medium">{pickup.pickup_address}</p>
                            <p className="text-sm">
                              {pickup.pickup_city}, {pickup.pickup_state} {pickup.pickup_zip}
                            </p>
                            <p className="text-sm">{pickup.pickup_country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p>{pickup.customer_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p>{pickup.customer_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p>{pickup.customer_phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items to Pickup */}
                    <div className="space-y-4 md:col-span-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Items to Pickup
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {pickup.items_to_pickup.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.condition}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.notes || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Warehouse & Instructions */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Warehouse className="w-4 h-4" />
                        Warehouse Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Warehouse Name</p>
                          <p className="font-medium">{pickup.warehouse_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">{pickup.warehouse_contact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Special Instructions
                      </h4>
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          {pickup.pickup_instructions || "No special instructions provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledPickups;
