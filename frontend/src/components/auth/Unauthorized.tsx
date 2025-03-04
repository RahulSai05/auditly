import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldOff, ArrowLeft, LogIn, Mail } from 'lucide-react';

function App() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99]
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { scale: 0.97 }
  };

  const backgroundVariants = {
    initial: {
      backgroundPosition: "0% 0%",
    },
    animate: {
      backgroundPosition: "100% 100%",
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
      className="flex min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-blue-50 p-6"
      style={{
        backgroundSize: "400% 400%"
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0.1, x: -100, y: -100 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            x: [-100, -80, -100],
            y: [-100, -120, -100],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-red-200 filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0.1, x: 100, y: 100 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            x: [100, 120, 100],
            y: [100, 80, 100],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-200 filter blur-3xl"
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center"
      >
        <motion.div
          className="w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <motion.div 
            className="h-2 bg-gradient-to-r from-red-500 to-red-600"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />

          <div className="p-8">
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center mb-8"
            >
              <motion.div
                className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <ShieldOff className="w-10 h-10 text-red-600" />
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-2xl font-bold text-red-600 mb-4"
              >
                Unauthorized Access
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-gray-600 mb-8"
              >
                If you believe you should have access, reach out to the system administrator or IT support team.
              </motion.p>

              <motion.div className="flex flex-col gap-4 w-full">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  Go to Login
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <span>Need help?</span>
                <a 
                  href="mailto:questions@auditlyai.com" 
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App;
