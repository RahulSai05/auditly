import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, ChevronDown, ChevronUp, Send, ShieldCheck, AlertCircle } from "lucide-react";

interface Message {
  text: string;
  type: "success" | "error" | "";
}

const HelpCenter = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    text: "",
    type: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to reset your password.",
    },
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile information by navigating to the 'Edit Profile' section in your account settings.",
    },
    {
      question: "What should I do if I encounter a bug?",
      answer: "If you encounter a bug, please report it to our support team using the contact form below. Provide as much detail as possible to help us resolve the issue quickly.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact customer support by filling out the contact form below or by emailing us at questions@auditlyai.com or info@auditlyai.com.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Simulate API call
    setTimeout(() => {
      setMessage({ 
        text: "Your message has been sent successfully! Our team will get back to you soon.", 
        type: "success" 
      });
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      setLoading(false);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99],
      },
    },
  };

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      transition: { duration: 0.3 } 
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.1,
      } 
    },
    disabled: {
      scale: 1,
      opacity: 0.7,
    }
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
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundSize: "400% 400%",
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
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"
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
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300 filter blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8"
            variants={itemVariants}
          >
            Help Center
          </motion.h1>

          {/* FAQ Section */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-10 overflow-hidden"
            variants={itemVariants}
          >
            <motion.div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 -mt-8 -mx-8 mb-6"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
            
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="border-b border-gray-200 pb-4"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left text-gray-700 hover:text-blue-600 focus:outline-none py-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-blue-500" />
                      )}
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 text-gray-600 pl-2 border-l-2 border-blue-200"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            variants={itemVariants}
          >
            <motion.div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            
            <div className="p-8">
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-6"
                variants={itemVariants}
              >
                Contact Support
              </motion.h2>
              
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <motion.div 
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === "name" ? "focus" : "blur"}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <motion.div 
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === "email" ? "focus" : "blur"}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <motion.div 
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === "message" ? "focus" : "blur"}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your issue or question"
                      required
                    />
                  </motion.div>
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  variants={buttonVariants}
                  whileHover={loading ? "disabled" : "hover"}
                  whileTap={loading ? "disabled" : "tap"}
                >
                  {loading ? (
                    <motion.span 
                      className="flex items-center justify-center gap-2"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </motion.span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </motion.button>
              </motion.form>
              
              <AnimatePresence mode="wait">
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {message.type === "success" ? (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </motion.div>
                    <p>{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="mt-10 text-center"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md py-6 px-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <motion.p 
                  className="flex items-center justify-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>questions@auditlyai.com</span>
                </motion.p>
                <motion.p 
                  className="flex items-center justify-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>info@auditlyai.com</span>
                </motion.p>
                <motion.p 
                  className="flex items-center justify-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span>Live Chat (Coming Soon)</span>
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HelpCenter;
