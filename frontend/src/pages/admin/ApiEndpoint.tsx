import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  ChevronDown,
  Clipboard,
  AlertCircle,
  X,
  SlidersHorizontal,
  Tag,
  Package,
  FilterX
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  sampleRequest: object;
  requiredFields?: string[];
}

interface SearchFilters {
  name: string;
  method: string;
  description: string;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "update1",
    name: "Update Item Data",
    path: "https://auditlyai.com/api/update-database-json-item",
    method: "POST",
    description: "Update or add item data to the database using JSON",
    requiredFields: ["onboard_token", "onboard_user_id", "json_data"],
    sampleRequest: {
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          item_number: 123456,
          item_description: "High-quality memory foam mattress",
          brand_id: 1,
          category: "Bedding",
          configuration: "King"
        }
      ]
    }
  },
  {
    id: "update2",
    name: "Update Customer Serials",
    path: "https://auditlyai.com/api/update-database-json-customer-serials",
    method: "POST",
    description: "Update or add customer serial numbers to the database",
    requiredFields: ["onboard_token", "onboard_user_id", "json_data"],
    sampleRequest: {
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          item_id: 123456,
          original_sales_order_number: "SO123456",
          original_sales_order_line: 1,
          ordered_qty: 1,
          serial_number: "SN987654321",
          sscc_number: "SSCC123456789",
          tag_number: "TAG123",
          vendor_item_number: "VIN456",
          shipped_from_warehouse: "Warehouse A",
          shipped_to_person: "John Doe",
          shipped_to_billing_address: "123 Main St",
          account_number: "ACC789",
          customer_email: "john.doe@example.com",
          shipped_to_apt_number: "Apt 4B",
          shipped_to_street: "123 Main St",
          shipped_to_city: "New York",
          shipped_to_zip: 10001,
          shipped_to_state: "NY",
          shipped_to_country: "USA",
          dimension_depth: 10.5,
          dimension_length: 80.0,
          dimension_breadth: 60.0,
          dimension_weight: 120.0,
          dimension_volume: 50400.0,
          dimension_size: "King",
          date_purchased: "2024-03-15T00:00:00",
          date_shipped: "2024-03-16T00:00:00",
          date_delivered: "2024-03-18T00:00:00"
        }
      ]
    }
  },
  {
    id: "update3",
    name: "Update Return Items",
    path: "https://auditlyai.com/api/update-database-json-return-items",
    method: "POST",
    description: "Update or add return items data to the database",
    requiredFields: ["onboard_token", "onboard_user_id", "json_data"],
    sampleRequest: {
      onboard_token: "693891674636CUST354241874921",
      onboard_user_id: "CUST354241",
      json_data: [
        {
          item_id: 123456,
          original_sales_order_number: "SO123456",
          return_order_number: "RMA456789",
          return_order_line: 1,
          return_qty: 1,
          return_destination: "Warehouse B",
          return_condition: "Good",
          return_carrier: "UPS",
          return_warehouse: "Warehouse A",
          return_house_number: "123",
          return_street: "Main St",
          return_city: "New York",
          return_zip: 10001,
          return_state: "NY",
          return_country: "USA",
          date_purchased: "2024-03-15T00:00:00",
          date_shipped: "2024-03-16T00:00:00",
          date_delivered: "2024-03-18T00:00:00",
          return_created_date: "2024-03-25T00:00:00",
          return_received_date: "2024-03-28T00:00:00"
        }
      ]
    }
  }
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-100 p-6 z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-600">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="font-semibold">Advanced Search</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                API Name
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Search by API name..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Description
              </label>
              <input
                type="text"
                value={filters.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Search by description..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function ApiEndpoint() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    method: '',
    description: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 3000);
  };

  const handleCopy = async (text: string, message: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(text);
      showNotification('success', message);
    } catch (err) {
      showNotification('error', 'Failed to copy to clipboard');
    }
  };

  const clearFilters = () => {
    setSearchFilters({
      name: '',
      method: '',
      description: '',
    });
  };

  const filteredEndpoints = apiEndpoints.filter((endpoint) => {
    const matchesName = endpoint.name.toLowerCase().includes(searchFilters.name.toLowerCase());
    const matchesMethod = endpoint.method.toLowerCase().includes(searchFilters.method.toLowerCase());
    const matchesDescription = endpoint.description.toLowerCase().includes(searchFilters.description.toLowerCase());
    return matchesName && matchesMethod && matchesDescription;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Notification Component */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg"
              style={{
                backgroundColor: notification.type === 'success' ? 'rgba(220, 252, 231, 0.95)' : 'rgba(254, 226, 226, 0.95)',
                color: notification.type === 'success' ? '#065f46' : '#991b1b',
              }}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
            <Database className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            API Documentation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore our available API endpoints and their usage
          </motion.p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                >
                  <Database className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-800">
                  Available Endpoints
                </h2>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <FilterX className="w-4 h-4" />
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                  className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                    isAdvancedSearchOpen 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isAdvancedSearchOpen ? 'Hide Filters' : 'More Filters'}
                </button>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search endpoints..."
                      className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                      value={searchFilters.name}
                      onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <AdvancedSearch
                isOpen={isAdvancedSearchOpen}
                onClose={() => setIsAdvancedSearchOpen(false)}
                filters={searchFilters}
                onFilterChange={setSearchFilters}
              />
            </div>

            <div className="space-y-4">
              {filteredEndpoints.map((endpoint) => (
                <motion.div
                  key={endpoint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-50"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
                        <p className="text-gray-600 mt-1">{endpoint.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            endpoint.method === 'POST'
                              ? 'bg-blue-100 text-blue-800'
                              : endpoint.method === 'GET'
                              ? 'bg-green-100 text-green-800'
                              : endpoint.method === 'PUT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm text-gray-600">{endpoint.path}</code>
                          <button
                            onClick={(e) => handleCopy(endpoint.path, 'API URL copied!', e)}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <Clipboard className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                          expandedEndpoint === endpoint.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedEndpoint === endpoint.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6">
                          <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">Required Fields</h4>
                            <div className="flex flex-wrap gap-2">
                              {endpoint.requiredFields?.map((field) => (
                                <span key={field} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">Sample Request</h4>
                              <button
                                onClick={(e) => handleCopy(
                                  JSON.stringify(endpoint.sampleRequest, null, 2),
                                  'Sample request copied!',
                                  e
                                )}
                                className="p-1 hover:bg-gray-100 rounded text-sm text-gray-600 flex items-center gap-1"
                              >
                                <Clipboard className="w-4 h-4" />
                                Copy
                              </button>
                            </div>
                            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                              {JSON.stringify(endpoint.sampleRequest, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ApiEndpoint;
