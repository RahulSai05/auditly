import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  ChevronDown,
  Clipboard,
  AlertCircle,
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  sampleRequest: object;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "update1",
    name: "Update Item Data",
    path: "https://auditlyai.com/api/update-database-json-item",
    method: "POST",
    description: "Update or add item data to the database using JSON",
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
  }
];

function ApiEndpoint() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Database className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Explore our available API endpoints and their usage
          </p>
        </motion.div>

        <div className="space-y-6">
          {apiEndpoints.map((endpoint) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
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
    </div>
  );
}

export default ApiEndpoint;
