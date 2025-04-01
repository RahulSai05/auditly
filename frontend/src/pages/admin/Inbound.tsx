import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Database,
  Cloud,
  FileText,
  Server,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const dataSources = [
  {
    id: 1,
    title: "CSV Import",
    description: "Efficient and straightforward data import from structured CSV files.",
    icon: FileText,
    color: "#424242",
    status: "Basic",
  },
  {
    id: 2,
    title: "Power BI",
    description: "Business analytics tool for visualizing data and sharing insights across your organization.",
    icon: Cloud,
    color: "#00796B",
    status: "Enterprise",
    authEndpoint: "/api/powerbi/auth_login",
  },
  {
    id: 3,
    title: "D365",
    description: "Microsoft's suite of enterprise resource planning (ERP) and customer relationship management (CRM) applications.",
    icon: Database,
    color: "#43A047",
    status: "Enterprise",
  },
  {
    id: 4,
    title: "Inbound Automate",
    description: "Automate workflows and integrate apps, services, and systems to improve productivity.",
    icon: Server,
    color: "#FF9900",
    status: "Enterprise",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

const Inbound: React.FC = () => {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);
  const [activeAuthWindow, setActiveAuthWindow] = useState<Window | null>(null);

  // Handle callback messages from authentication
  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    
    if (message) {
      const decodedMessage = decodeURIComponent(message.replace(/\+/g, ' '));
      toast.success(decodedMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      // Clean up URL
      searchParams.delete('message');
      setSearchParams(searchParams, { replace: true });
    }
    
    if (error) {
      const decodedError = decodeURIComponent(error.replace(/\+/g, ' '));
      toast.error(decodedError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      // Clean up URL
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle message from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message
      const trustedOrigins = ['https://auditlyai.com'];
      if (!trustedOrigins.includes(event.origin)) return;

      if (event.data.type === 'AUTH_SUCCESS') {
        // Close the popup window if it's still open
        if (activeAuthWindow && !activeAuthWindow.closed) {
          activeAuthWindow.close();
        }
        
        setIsAuthWindowOpen(false);
        setActiveAuthWindow(null);
        
        // Clear loading state for all sources
        setLoading({});
        
        toast.success('Authentication successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
      
      if (event.data.type === 'AUTH_ERROR') {
        // Close the popup window if it's still open
        if (activeAuthWindow && !activeAuthWindow.closed) {
          activeAuthWindow.close();
        }
        
        setIsAuthWindowOpen(false);
        setActiveAuthWindow(null);
        
        // Clear loading state for all sources
        setLoading({});
        
        toast.error(event.data.message || 'Authentication failed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeAuthWindow]);

  // Cleanup effect for auth window
  useEffect(() => {
    return () => {
      if (activeAuthWindow && !activeAuthWindow.closed) {
        activeAuthWindow.close();
      }
    };
  }, [activeAuthWindow]);

  const handleAuthClick = async (source: any) => {
    if (!source.authEndpoint) return;
  
    try {
      setLoading(prev => ({ ...prev, [source.id]: true }));
      setIsAuthWindowOpen(true);
      
      // Calculate center position for popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Add return URL parameter to the auth endpoint
      const returnUrl = encodeURIComponent(window.location.origin);
      const authUrl = `${source.authEndpoint}?returnUrl=${returnUrl}`;
      
      // Open authentication in a new window
      const authWindow = window.open(
        authUrl,
        'AuthPopup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );

      if (authWindow) {
        setActiveAuthWindow(authWindow);
        
        // Check if the window was closed manually
        const checkWindowClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkWindowClosed);
            setIsAuthWindowOpen(false);
            setActiveAuthWindow(null);
            setLoading(prev => ({ ...prev, [source.id]: false }));
          }
        }, 500);
      } else {
        throw new Error("Failed to open authentication window");
      }
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to initiate authentication. Please try again.");
      setIsAuthWindowOpen(false);
      setActiveAuthWindow(null);
      setLoading(prev => ({ ...prev, [source.id]: false }));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative ${isAuthWindowOpen ? 'pointer-events-none' : ''}`}>
      {/* Overlay when auth window is open */}
      <AnimatePresence>
        {isAuthWindowOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      <div className={`max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 transition-opacity duration-200 ${isAuthWindowOpen ? 'opacity-50' : 'opacity-100'}`}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Create a new data source</span>
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Data Sources
          </motion.h1>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dataSources.map((source) => (
            <motion.div
              key={source.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 group"
            >
              <div
                className="h-2 bg-gradient-to-r"
                style={{
                  background: `linear-gradient(to right, ${source.color}40, ${source.color}60)`,
                }}
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <source.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {source.title}
                    </h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r"
                      style={{
                        background: `linear-gradient(to right, ${source.color}20, ${source.color}40)`,
                        color: source.color,
                      }}
                    >
                      {source.status}
                    </motion.span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {source.description}
                </p>

                <div className="flex justify-between items-center">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </motion.div>

                  {source.authEndpoint && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAuthClick(source)}
                      disabled={loading[source.id] || isAuthWindowOpen}
                      className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all ${
                        (loading[source.id] || isAuthWindowOpen) ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading[source.id] ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </span>
                      ) : (
                        'Connect'
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Inbound;
