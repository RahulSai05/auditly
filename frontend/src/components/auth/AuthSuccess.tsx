import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || "Authentication successful!";
  const error = searchParams.get('error');

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) navbar.style.display = 'none';

    const timer = setTimeout(() => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: error ? 'AUTH_ERROR' : 'AUTH_SUCCESS',
            message: error || message,
          }, window.location.origin);
        }
        window.close();
      } catch (e) {
        console.error("Error closing window:", e);
      }
    }, 2000);

    return () => {
      if (navbar) navbar.style.display = 'block';
      clearTimeout(timer);
    };
  }, [message, error]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 max-w-md w-full"
        >
          <div className="p-8 text-center">
            <motion.div
              variants={iconVariants}
              className="mb-6 flex justify-center"
            >
              {error ? (
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-2xl font-bold mb-2 bg-clip-text text-transparent ${
                error 
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : "bg-gradient-to-r from-green-600 to-green-700"
              }`}
            >
              {error ? "Authentication Failed" : "Success!"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              {error || message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              This window will close automatically...
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthSuccess;
