// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mail, MessageCircle, ChevronDown, ChevronUp, Send, ShieldCheck, AlertCircle } from "lucide-react";

// interface Message {
//   text: string;
//   type: "success" | "error" | "";
// }

// const HelpCenter = () => {
//   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: ""
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<Message>({
//     text: "",
//     type: "",
//   });
//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   const faqs = [
//     {
//       question: "How do I reset my password?",
//       answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to reset your password.",
//     },
//     {
//       question: "How do I update my profile information?",
//       answer: "You can update your profile information by navigating to the 'Edit Profile' section in your account settings.",
//     },
//     {
//       question: "What should I do if I encounter a bug?",
//       answer: "If you encounter a bug, please report it to our support team using the contact form below. Provide as much detail as possible to help us resolve the issue quickly.",
//     },
//     {
//       question: "How do I contact customer support?",
//       answer: "You can contact customer support by filling out the contact form below or by emailing us at questions@auditlyai.com or info@auditlyai.com.",
//     },
//   ];

//   const toggleFaq = (index: number) => {
//     setOpenFaqIndex(openFaqIndex === index ? null : index);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     // Simulate API call
//     setTimeout(() => {
//       setMessage({ 
//         text: "Your message has been sent successfully! Our team will get back to you soon.", 
//         type: "success" 
//       });
//       setFormData({
//         name: "",
//         email: "",
//         message: ""
//       });
//       setLoading(false);
//     }, 1500);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: [0.6, 0.05, 0.01, 0.99],
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: [0.6, 0.05, 0.01, 0.99],
//       },
//     },
//   };

//   const inputVariants = {
//     focus: { 
//       scale: 1.02, 
//       boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
//       transition: { duration: 0.3 } 
//     },
//     blur: { 
//       scale: 1, 
//       boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
//       transition: { duration: 0.3 } 
//     },
//   };

//   const buttonVariants = {
//     hover: { 
//       scale: 1.03,
//       boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       transition: { 
//         duration: 0.3,
//         type: "spring",
//         stiffness: 500,
//         damping: 15
//       } 
//     },
//     tap: { 
//       scale: 0.97,
//       boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
//       transition: { 
//         duration: 0.1,
//       } 
//     },
//     disabled: {
//       scale: 1,
//       opacity: 0.7,
//     }
//   };

//   const backgroundVariants = {
//     initial: {
//       backgroundPosition: "0% 0%",
//     },
//     animate: {
//       backgroundPosition: "100% 100%",
//       transition: {
//         duration: 20,
//         ease: "linear",
//         repeat: Infinity,
//         repeatType: "reverse" as const,
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial="initial"
//       animate="animate"
//       variants={backgroundVariants}
//       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
//       style={{
//         backgroundSize: "400% 400%",
//       }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           initial={{ opacity: 0.1, x: -100, y: -100 }}
//           animate={{ 
//             opacity: [0.1, 0.2, 0.1],
//             x: [-100, -80, -100],
//             y: [-100, -120, -100],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//           className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"
//         />
//         <motion.div
//           initial={{ opacity: 0.1, x: 100, y: 100 }}
//           animate={{ 
//             opacity: [0.1, 0.2, 0.1],
//             x: [100, 120, 100],
//             y: [100, 80, 100],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//           className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300 filter blur-3xl"
//         />
//       </div>

//       <div className="max-w-4xl mx-auto relative z-10">
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           <motion.h1 
//             className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8"
//             variants={itemVariants}
//           >
//             Help Center
//           </motion.h1>

//           {/* FAQ Section */}
//           <motion.div 
//             className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-10 overflow-hidden"
//             variants={itemVariants}
//           >
//             <motion.div 
//               className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 -mt-8 -mx-8 mb-6"
//               initial={{ scaleX: 0, originX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 0.2, duration: 0.8 }}
//             />
            
//             <motion.h2 
//               className="text-2xl font-bold text-gray-800 mb-6"
//               variants={itemVariants}
//             >
//               Frequently Asked Questions
//             </motion.h2>
            
//             <motion.div 
//               className="space-y-4"
//               variants={containerVariants}
//             >
//               {faqs.map((faq, index) => (
//                 <motion.div 
//                   key={index} 
//                   className="border-b border-gray-200 pb-4"
//                   variants={itemVariants}
//                   whileHover={{ x: 5 }}
//                   transition={{ type: "spring", stiffness: 400 }}
//                 >
//                   <motion.button
//                     onClick={() => toggleFaq(index)}
//                     className="w-full flex justify-between items-center text-left text-gray-700 hover:text-blue-600 focus:outline-none py-2"
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <span className="text-lg font-medium">{faq.question}</span>
//                     <motion.div
//                       whileHover={{ scale: 1.2 }}
//                       transition={{ type: "spring", stiffness: 400 }}
//                     >
//                       {openFaqIndex === index ? (
//                         <ChevronUp className="w-5 h-5 text-blue-500" />
//                       ) : (
//                         <ChevronDown className="w-5 h-5 text-blue-500" />
//                       )}
//                     </motion.div>
//                   </motion.button>
//                   <AnimatePresence>
//                     {openFaqIndex === index && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="mt-2 text-gray-600 pl-2 border-l-2 border-blue-200"
//                       >
//                         {faq.answer}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Contact Form Section */}
//           <motion.div 
//             className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
//             variants={itemVariants}
//           >
//             <motion.div 
//               className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
//               initial={{ scaleX: 0, originX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 0.4, duration: 0.8 }}
//             />
            
//             <div className="p-8">
//               <motion.h2 
//                 className="text-2xl font-bold text-gray-800 mb-6"
//                 variants={itemVariants}
//               >
//                 Contact Support
//               </motion.h2>
              
//               <motion.form 
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//                 variants={containerVariants}
//               >
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Name
//                   </label>
//                   <motion.div 
//                     className="relative"
//                     variants={inputVariants}
//                     animate={focusedField === "name" ? "focus" : "blur"}
//                   >
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       onFocus={() => setFocusedField("name")}
//                       onBlur={() => setFocusedField(null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter your name"
//                       required
//                     />
//                   </motion.div>
//                 </motion.div>
                
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Email
//                   </label>
//                   <motion.div 
//                     className="relative"
//                     variants={inputVariants}
//                     animate={focusedField === "email" ? "focus" : "blur"}
//                   >
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       onFocus={() => setFocusedField("email")}
//                       onBlur={() => setFocusedField(null)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </motion.div>
//                 </motion.div>
                
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Message
//                   </label>
//                   <motion.div 
//                     className="relative"
//                     variants={inputVariants}
//                     animate={focusedField === "message" ? "focus" : "blur"}
//                   >
//                     <textarea
//                       id="message"
//                       name="message"
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       onFocus={() => setFocusedField("message")}
//                       onBlur={() => setFocusedField(null)}
//                       rows={4}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Describe your issue or question"
//                       required
//                     />
//                   </motion.div>
//                 </motion.div>
                
//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
//                   variants={buttonVariants}
//                   whileHover={loading ? "disabled" : "hover"}
//                   whileTap={loading ? "disabled" : "tap"}
//                 >
//                   {loading ? (
//                     <motion.span 
//                       className="flex items-center justify-center gap-2"
//                       animate={{ opacity: [0.6, 1, 0.6] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending...
//                     </motion.span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       <Send className="w-5 h-5" />
//                       Send Message
//                     </span>
//                   )}
//                 </motion.button>
//               </motion.form>
              
//               <AnimatePresence mode="wait">
//                 {message.text && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, height: 0 }}
//                     animate={{ opacity: 1, y: 0, height: "auto" }}
//                     exit={{ opacity: 0, y: 10, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
//                       message.type === "success"
//                         ? "bg-green-50 text-green-800 border border-green-200"
//                         : "bg-red-50 text-red-800 border border-red-200"
//                     }`}
//                   >
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ type: "spring", stiffness: 500, damping: 15 }}
//                     >
//                       {message.type === "success" ? (
//                         <ShieldCheck className="w-5 h-5 text-green-500" />
//                       ) : (
//                         <AlertCircle className="w-5 h-5 text-red-500" />
//                       )}
//                     </motion.div>
//                     <p>{message.text}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>

//           {/* Contact Information */}
//           <motion.div 
//             className="mt-10 text-center"
//             variants={itemVariants}
//           >
//             <motion.div 
//               className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md py-6 px-4"
//               whileHover={{ y: -5 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
//               <div className="space-y-3">
//                 <motion.p 
//                   className="flex items-center justify-center gap-2 text-gray-600"
//                   whileHover={{ scale: 1.05, x: 5 }}
//                 >
//                   <Mail className="w-5 h-5 text-blue-500" />
//                   <span>questions@auditlyai.com</span>
//                 </motion.p>
//                 <motion.p 
//                   className="flex items-center justify-center gap-2 text-gray-600"
//                   whileHover={{ scale: 1.05, x: 5 }}
//                 >
//                   <Mail className="w-5 h-5 text-blue-500" />
//                   <span>info@auditlyai.com</span>
//                 </motion.p>
//                 <motion.p 
//                   className="flex items-center justify-center gap-2 text-gray-600"
//                   whileHover={{ scale: 1.05, x: 5 }}
//                 >
//                   <MessageCircle className="w-5 h-5 text-blue-500" />
//                   <span>Live Chat (Coming Soon)</span>
//                 </motion.p>
//               </div>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default HelpCenter;



import React from 'react';
import { motion } from 'framer-motion';
import { Search, Circle, Package, BarChart3, Rocket, User, Settings, Target, Globe, LineChart } from 'lucide-react';

// Icon Components
const FolderIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

// Header Component
const Header = () => {
  return (
    <header className="bg-blue-600 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center">
          <motion.div 
            className="flex items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-full p-1 mr-3">
              <Circle className="w-8 h-8 text-blue-600 fill-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-white">Loop Help Center</h1>
          </motion.div>
          
          <motion.div 
            className="w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-200" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-700/50 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

// Category Card Component
interface CategoryProps {
  category: {
    id: number;
    title: string;
    icon: React.ReactNode;
    categoryCount?: number;
    articleCount: number;
  };
}

const CategoryCard: React.FC<CategoryProps> = ({ category }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.99]
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="p-6 flex flex-col items-center">
        <motion.div 
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {category.icon}
        </motion.div>
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-3">
          {category.title}
        </h3>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          {category.categoryCount && (
            <div className="flex items-center">
              <FolderIcon className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{category.categoryCount} categories</span>
            </div>
          )}
          <div className="flex items-center">
            <FileTextIcon className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{category.articleCount} articles</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Article Categories Component
const categories = [
  {
    id: 1,
    title: 'Release Notes',
    icon: <Rocket className="w-5 h-5 text-blue-600" />,
    categoryCount: 3,
    articleCount: 25
  },
  {
    id: 2,
    title: 'Getting Started with Loop',
    icon: <User className="w-5 h-5 text-blue-600" />,
    categoryCount: 2,
    articleCount: 24
  },
  {
    id: 3,
    title: 'Loop Admin Settings',
    icon: <Settings className="w-5 h-5 text-blue-600" />,
    categoryCount: 2,
    articleCount: 24
  },
  {
    id: 4,
    title: 'Loop Features',
    icon: <Target className="w-5 h-5 text-blue-600" />,
    categoryCount: 12,
    articleCount: 38
  },
  {
    id: 5,
    title: 'Labels and Shipping',
    icon: <Globe className="w-5 h-5 text-blue-600" />,
    articleCount: 26
  },
  {
    id: 6,
    title: 'Tracking',
    icon: <LineChart className="w-5 h-5 text-blue-600" />,
    articleCount: 6
  }
];

const ArticleCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </motion.div>
  );
};

// Bottom Row Component
const BottomRow = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
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

  return (
    <motion.div
      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-3">
          Product Updates
        </h3>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span>18 articles</span>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-3">
          Analytics & Reporting
        </h3>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span>14 articles</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Help Center Component
const LoopHelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Help Center Articles
        </motion.h1>
        <ArticleCategories />
        <BottomRow />
      </main>
    </div>
  );
};

export default LoopHelpCenter;

