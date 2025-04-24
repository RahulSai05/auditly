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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Circle, Package, BarChart3, Rocket, User, Settings, Target, Globe, LineChart, FileText, Database, Mail, Code, ClipboardList, Layers, BookOpen } from 'lucide-react';

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
            <h1 className="text-xl font-bold text-white">AuditlyAI Help Center</h1>
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
    articleCount?: number;
    articles?: Array<{ title: string; content: string }>;
  };
  onClick?: (category: any) => void;
}

const CategoryCard: React.FC<CategoryProps> = ({ category, onClick }) => {
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
      onClick={() => onClick && onClick(category)}
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
            <span>{category.articleCount || category.articles?.length || 0} articles</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Article Card Component
const ArticleCard = ({ article, onClick }: { article: any, onClick: () => void }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer hover:bg-gray-50"
      whileHover={{ x: 5 }}
      onClick={onClick}
    >
      <div className="flex items-center">
        <FileTextIcon className="w-4 h-4 mr-2 text-blue-500" />
        <h4 className="text-md font-medium text-gray-800">{article.title}</h4>
      </div>
    </motion.div>
  );
};

// Article Modal Component
const ArticleModal = ({ article, onClose }: { article: any, onClose: () => void }) => {
  // Document content mapping
  const documentContent: Record<string, string> = {
    'Getting Started with Auditly AI.docx': `
      <h2 class="text-2xl font-bold mb-4">📌 Getting Started</h2>
      <h3 class="text-xl font-semibold mb-3">📘 Introduction to AuditlyAI</h3>
      <p><strong>What is AuditlyAI?</strong></p>
      <p class="mb-4">AuditlyAI is an advanced, AI-powered return inspection platform designed specifically to simplify and streamline warehouse return processes. It empowers warehouse staff to efficiently scan returned products using barcode technology, perform accurate inspections by automatically comparing original and returned product images, and make quick, informed decisions.</p>
      
      <p><strong>Who should use AuditlyAI?</strong></p>
      <p class="mb-4">AuditlyAI is ideal for warehouse staff who directly handle return inspections, managers and supervisors who oversee return processes, and administrative teams responsible for tracking, reporting, and ensuring smooth operational workflows.</p>
      
      <h3 class="text-xl font-semibold mb-3">⚙️ Setting Up Your Account</h3>
      <p><strong>Creating an Account</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Visit Registration Page: Go to auditlyai.com and click on "Register" or "Create Account."</li>
        <li class="mb-2">Fill in the Required Information:
          <ul class="list-disc pl-6 mt-1">
            <li>Username (used for login)</li>
            <li>First Name and Last Name</li>
            <li>Gender</li>
            <li>Valid Email Address</li>
            <li>Password</li>
            <li>Organization Name</li>
          </ul>
        </li>
        <li class="mb-2">Submit your Registration: Click on the "Create Account" button at the bottom.</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">📌 Activating Your Account</h3>
      <p class="mb-2">After submitting your registration details:</p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Email Verification: An OTP (One-Time Password) will be sent to the email address you provided.</li>
        <li class="mb-2">OTP Verification: Enter the OTP in the provided field on the AuditlyAI verification page and click on "Verify OTP" to activate your account.</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">📌 Logging into Your Account</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Visit the Login Page: Navigate to auditlyai.com/login.</li>
        <li class="mb-2">Enter Credentials: Input your Username and Password, then click "Sign in".</li>
        <li class="mb-2">Forgot Password: Click on "Forgot Password?" and follow the prompts to reset your password.</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">📌 Navigating AuditlyAI After Login</h3>
      <p class="mb-2">After logging in, you land on the Return Inspection Portal homepage where you can:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Quickly search inspections by entering an inspection number</li>
        <li class="mb-1">Start new returns by clicking the "Start New Return" button</li>
      </ul>
      <p class="mb-2">Access additional features from the top navigation bar:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Home</li>
        <li class="mb-1">Admin</li>
        <li class="mb-1">Reports</li>
        <li class="mb-1">Maintenance</li>
        <li class="mb-1">Help Center</li>
        <li class="mb-1">User Notifications</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">🛡️ Roles and Permissions Overview</h3>
      <p class="mb-2">AuditlyAI offers a simplified and secure user-role system designed to manage user access efficiently within your organization. Three primary roles are available:</p>
      
      <p class="font-semibold mt-4 mb-2">✅ Admin Access</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Default Role: Automatically assigned to new users upon their first login.</li>
        <li class="mb-1">Capabilities: Admin users have full control to manage the roles and permissions of other users.</li>
        <li class="mb-1">Restrictions: Admin users cannot modify their own permissions.</li>
      </ul>
      
      <p class="font-semibold mt-4 mb-2">📈 Reports Access</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Capabilities: Users assigned Reports access can exclusively view and manage reporting functionalities within AuditlyAI.</li>
        <li class="mb-1">Restrictions: Users with Reports access do not have the capability to change user permissions or perform administrative tasks.</li>
      </ul>
      
      <p class="font-semibold mt-4 mb-2">🔧 Inspection Access</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Capabilities: Inspection users can exclusively perform data ingestion and maintenance tasks.</li>
        <li class="mb-1">Restrictions: Inspection users do not have access to reports or user management functionalities.</li>
      </ul>
    `,
    'How to Use AuditlyAI – Step-by-Step Workflow Guide.docx': `
      <h2 class="text-2xl font-bold mb-4">AuditlyAI - Workflow and Step-by-Step Process</h2>
      
      <h3 class="text-xl font-semibold mb-3">Step 1: Access Return Inspection Portal</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Log in to AuditlyAI.</li>
        <li class="mb-1">Access the Return Inspection Portal.</li>
        <li class="mb-1">Enter the Inspection Reference Number (generated from a previous inspection) to retrieve existing return details, or click Start New Return to initiate a fresh inspection.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 2: Choose Inspection Method</h3>
      <p class="mb-2">AuditlyAI provides two ways to begin an inspection:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1"><strong>Quick Scan:</strong> Use your device camera to scan a barcode of product. The system will auto-fetch product details once the barcode is read.</li>
        <li class="mb-1"><strong>Manual Entry:</strong> Enter the Return Order Number manually to retrieve the same set of product details.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 3: Review Product Information</h3>
      <p class="mb-2">Once the number is entered or scanned, AuditlyAI displays product details:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">General Information (Sales Order, Order Line, Quantity)</li>
        <li class="mb-1">Return Information (Return Order Number, Quantity)</li>
        <li class="mb-1">Shipping/Product Info (Serial Number, Address)</li>
        <li class="mb-1">Dimensions (Length, Breadth, Height, Weight)</li>
      </ul>
      <p class="mb-4">Click Continue to proceed.</p>
      
      <h3 class="text-xl font-semibold mb-3">Step 4: Conduct Product Inspection</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Check and record the conditions of:
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Package Condition: Factory Seal, Tears, Missing Packages.</li>
            <li class="mb-1">Product Condition: Assess the physical state of the product.</li>
            <li class="mb-1">Surface Issues: Note any visible damages or issues.</li>
          </ul>
        </li>
        <li class="mb-1">After selecting applicable conditions, click Continue.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 5: Upload Product Images</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Capture and upload clear images of the product (front and back).</li>
        <li class="mb-1">Ensure images clearly display product conditions and damages.</li>
        <li class="mb-1">Click Continue once uploads are complete.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 6: Compare Product Images</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">AuditlyAI automatically analyzes uploaded images.</li>
        <li class="mb-1">Displays detailed comparison results, highlighting differences between original and returned product conditions.</li>
        <li class="mb-1">Review provided similarity scores and difference overlays.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 7: Review Inspection Summary</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Confirm the overall condition classification provided by AuditlyAI (e.g., Damaged).</li>
        <li class="mb-1">Validate media verification results.</li>
        <li class="mb-1">Ensure all provided information is accurate.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Step 8: Submit Inspection</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">After final verification, click Submit.</li>
        <li class="mb-1">Receive a confirmation message with the Inspection Reference Number.</li>
        <li class="mb-1">Await email notification for final inspection results.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Next Steps:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Keep your Inspection Reference Number for future inquiries and tracking purposes.</li>
        <li class="mb-1">Regularly check your email or AuditlyAI dashboard for updates regarding your inspection.</li>
      </ul>
    `,
    'Reports & Analytics.docx': `
      <h2 class="text-2xl font-bold mb-4">Reports & Analytics Overview</h2>
      <p class="mb-4">The Reports section in AuditlyAI offers a centralized hub where users can view and analyze return inspection-related data. This area is essential for warehouse staff, supervisors, and administrators who want to monitor activities, audit return cases, and draw insights from processed inspections.</p>
      
      <h3 class="text-xl font-semibold mb-3">Key features in the Reports module include:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1"><strong>Visual Records:</strong> Each report lists detailed entries for inspections, returns, and item tracking.</li>
        <li class="mb-1"><strong>Filters and Search:</strong> Users can filter reports using fields such as receipt number, product condition, and return order number. This makes it easy to locate specific records.</li>
        <li class="mb-1"><strong>Export Options:</strong> Users can download inspection and return data in XLSX or PDF formats for further offline analysis or documentation.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Included under Reports are the following key sections:</h3>
      
      <p class="font-semibold mt-4 mb-2">1. Items</p>
      <p class="mb-4">Displays a list of products with details like item numbers, descriptions, and configurations. Users can search and export data.</p>
      
      <p class="font-semibold mt-4 mb-2">2. Customer Serials</p>
      <p class="mb-4">Shows serial numbers associated with return orders for traceability.</p>
      
      <p class="font-semibold mt-4 mb-2">3. Returns</p>
      <p class="mb-4">Provides return transaction information such as return order number, quantity, and associated details.</p>
      
      <p class="font-semibold mt-4 mb-2">4. Auditly Inspections</p>
      <p class="mb-4">Lists completed inspections with receipt numbers, customer details, item condition, and status updates. Users can track inspection progress and view uploaded images.</p>
      
      <p class="font-semibold mt-4 mb-2">5. Item Image Viewer</p>
      <p class="mb-4">Allows users to enter an item number and view corresponding original product images. This helps verify the visual condition of items for comparison.</p>
      
      <p class="mb-4">This module provides transparency, accuracy, and quick reference points for all users engaged in the return inspection workflow.</p>
    `,
    'Manual Data Ingestion.docx': `
      <h2 class="text-2xl font-bold mb-4">Manual Data Ingestion</h2>
      <p class="mb-4">The <strong>Manual Data Ingestion</strong> module allows users to upload and manage data files related to returns processing. This section is especially useful for administrators or team members who handle bulk data entry from external systems or files.</p>
      
      <h3 class="text-xl font-semibold mb-3">🔹 What It Does</h3>
      <p class="mb-4">This feature enables users to upload various types of data through CSV files. These uploads help populate or update the system with key information required for return inspections and analytics.</p>
      
      <h3 class="text-xl font-semibold mb-3">🔹 Available Upload Sections</h3>
      <p class="mb-2">You'll find the following upload options (may vary based on your organization's configuration):</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1"><strong>Item Master Upload</strong> -- Upload general item-related details.</li>
        <li class="mb-1"><strong>Customer Serial Upload</strong> -- Ingest data linked to specific customer serial numbers.</li>
        <li class="mb-1"><strong>Item Image Upload</strong> -- Upload original item images for comparison during inspection.</li>
        <li class="mb-1"><strong>Return Upload</strong> -- Load return-related information such as RMA or sales order details.</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">🔹 How to Use</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Navigate to <strong>Maintenance > Manual Data Ingestion</strong>.</li>
        <li class="mb-2">Select the desired upload category.</li>
        <li class="mb-2">Click on the upload area to <strong>browse</strong> or <strong>drag and drop</strong> your CSV file.</li>
        <li class="mb-2">Once uploaded, data can be validated and reviewed in the respective reports section.</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">✅ Best Practices</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Always use the predefined CSV format provided by your admin or support team.</li>
        <li class="mb-1">Double-check field values and column headers before uploading.</li>
        <li class="mb-1">Confirm that files do not contain duplicates unless overwriting is intended.</li>
      </ul>
    `,
    'Inbound Outbound Document.docx': `
      <h2 class="text-2xl font-bold mb-4">Inbound, Data Mapping Rules, and Outbound Integration in Auditly.ai</h2>
      <p class="mb-4">Auditly.ai supports seamless integration between external analytics platforms like Power BI and the internal SQL database through configurable <strong>Inbound</strong> and <strong>Outbound</strong> connectors, aided by <strong>Data Mapping Rules</strong>. These tools empower users to automate data flows, maintain up-to-date records, and ensure accurate reporting on the frontend.</p>
      
      <h3 class="text-xl font-semibold mb-3">Inbound Integration</h3>
      <p class="mb-4">The <strong>Inbound</strong> module allows users to pull data from an external system (like Power BI) into the database. This is particularly helpful for keeping product master data (such as items, serials, and returns) synchronized.</p>
      
      <h4 class="text-lg font-semibold mb-2">Typical Use Case</h4>
      <p class="mb-4">Suppose a client uses Power BI to manage their items. Every time they add new items or update existing ones, they want that data reflected in database to support reporting and inspection functionalities.</p>
      
      <h4 class="text-lg font-semibold mb-2">Step-by-Step Process</h4>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2"><strong>Connect Power BI Account</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">The user logs into their Power BI account via Auditly.</li>
            <li class="mb-1">They provide the <strong>Workspace ID</strong> and <strong>Dataset ID</strong> that contains the required data.</li>
          </ul>
        </li>
        <li class="mb-2"><strong>Define Data Mapping Rules</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Under <strong>Data Mapping Rules</strong>, the user selects the source table from Power BI.</li>
            <li class="mb-1">Provides the destination SQL table name (e.g., item).</li>
            <li class="mb-1">Maps each <strong>Power BI field</strong> (right side) to the appropriate <strong>SQL column</strong> (left side).</li>
          </ul>
        </li>
        <li class="mb-2"><strong>Use a Time-based Filter</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">A last_updated_dt field (or similar) is used to load only new or updated records from Power BI since the last successful sync.</li>
          </ul>
        </li>
        <li class="mb-2"><strong>Save Mapping and Schedule</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">After saving, the user gets a <strong>Mapping Name</strong>.</li>
            <li class="mb-1">This Mapping Name can be used in <strong>Inbound Automate</strong> to schedule automated data pulls.</li>
          </ul>
        </li>
        <li class="mb-2"><strong>Automation</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Auditly uses this setup to regularly ingest updated Power BI data into the SQL table without manual intervention.</li>
          </ul>
        </li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">Outbound Integration</h3>
      <p class="mb-4">The <strong>Outbound</strong> module enables users to export data from the database to external platforms like Power BI, Azure, or D365.</p>
      
      <h4 class="text-lg font-semibold mb-2">Use Case</h4>
      <p class="mb-4">If a user wishes to perform advanced visualizations or reporting in Power BI using data maintained in Auditly (such as inspections or inventory), the outbound connector pushes selected tables to Power BI.</p>
      
      <h4 class="text-lg font-semibold mb-2">Process</h4>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2"><strong>Select Destination</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Choose the outbound destination like Power BI, Azure, or D365.</li>
            <li class="mb-1">Authenticate the external system account.</li>
          </ul>
        </li>
        <li class="mb-2"><strong>Map and Sync</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Select the SQL table (e.g., returns, items, customer_serials).</li>
            <li class="mb-1">Configure export rules.</li>
            <li class="mb-1">Schedule the export using <strong>Outbound Automate</strong>.</li>
          </ul>
        </li>
      </ol>
      <p class="mb-4">This ensures that your external BI tools always have the latest warehouse or inspection data for real-time dashboards and business insights.</p>
      
      <h3 class="text-xl font-semibold mb-3">Key Benefits</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1"><strong>Automation:</strong> Both inbound and outbound tasks can be scheduled, reducing manual efforts.</li>
        <li class="mb-1"><strong>Accuracy:</strong> Mapping ensures that data fields from source and destination are aligned properly.</li>
        <li class="mb-1"><strong>Scalability:</strong> New datasets and destinations (e.g., Azure, D365) can be added easily.</li>
        <li class="mb-1"><strong>Efficiency:</strong> Only updated data gets pulled/pushed, improving sync times and avoiding redundancy.</li>
      </ul>
      
      <p class="mb-4">This setup is ideal for businesses that rely on both internal applications and external BI tools for day-to-day operations, analytics, and strategic decision-making.</p>
    `,
    'Email Configurations.docx': `
      <h2 class="text-2xl font-bold mb-4">✉️ Email Configurations</h2>
      <p class="mb-4"><strong>Manage team-level communication for smooth internal collaboration</strong></p>
      
      <p class="mb-4">The <strong>Email Configurations</strong> module in Auditly.ai enables centralized management of official communication channels across various teams. This section helps businesses keep team emails organized and editable --- ensuring that relevant teams receive messages from automated alerts, customer interactions, or internal triggers.</p>
      
      <h3 class="text-xl font-semibold mb-3">🔧 What you can do here:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1"><strong>Add or update team email addresses</strong><br>
        Whether you onboard a new team (like Logistics or QA) or restructure departments, you can modify existing names and email addresses without needing technical support.</li>
        <li class="mb-1"><strong>Assign descriptive team roles</strong><br>
        Each email box includes a short description to help users understand the purpose of the team (e.g., <em>Sales inquiries</em>, <em>System maintenance</em>, <em>Security concerns</em>, etc.).</li>
        <li class="mb-1"><strong>Quick communication options</strong>
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">🖊️ <strong>Edit</strong>: Update the team name, purpose, or associated email.</li>
            <li class="mb-1">📤 <strong>Send Email</strong>: Launches a quick email window to directly reach that team.</li>
          </ul>
        </li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">🧩 Common Use Cases:</h3>
      <div class="overflow-x-auto mb-4">
        <table class="min-w-full border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Team</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Description</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Email Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border-b">Customer Support</td>
              <td class="px-4 py-2 border-b">Handles customer inquiries and support requests</td>
              <td class="px-4 py-2 border-b">support@auditlyai.com</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border-b">Development Team</td>
              <td class="px-4 py-2 border-b">For technical issues or maintenance discussions</td>
              <td class="px-4 py-2 border-b">johndev@auditlyai.com</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border-b">Sales</td>
              <td class="px-4 py-2 border-b">Business partnerships and outreach communication</td>
              <td class="px-4 py-2 border-b">sales@auditlyai.com</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border-b">Security</td>
              <td class="px-4 py-2 border-b">Reports related to compliance or security threats</td>
              <td class="px-4 py-2 border-b">security@auditlyai.com</td>
            </tr>
            <tr>
              <td class="px-4 py-2">Testing</td>
              <td class="px-4 py-2">Day-to-day coordination of logistics/testing teams</td>
              <td class="px-4 py-2">test@auditlyai.com</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 class="text-xl font-semibold mb-3">📝 Why it's helpful:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">No need to reach out to IT or support teams to update department contacts.</li>
        <li class="mb-1">Ensures emails always reach the <strong>right team</strong>.</li>
        <li class="mb-1">Useful when onboarding new employees or realigning team responsibilities.</li>
      </ul>
    `,
    'API Configurations.docx': `
      <h2 class="text-2xl font-bold mb-4">🔐 API Configurations</h2>
      <p class="mb-4"><strong>Automate data sync with secure, token-based API access</strong></p>
      
      <p class="mb-4">The <strong>API Configurations</strong> section in Auditly.ai allows you to connect your external applications or databases to the platform securely using tokens and predefined API endpoints. This helps in seamless, real-time data flow without needing to manually upload files.</p>
      
      <h3 class="text-xl font-semibold mb-3">1️⃣ API Token Management</h3>
      <p class="mb-4"><strong>Generate and manage secure access tokens for authentication</strong></p>
      
      <p class="mb-4">When working with APIs, secure access is critical. Auditly provides an easy way to generate authentication tokens that uniquely identify and authorize users or systems.</p>
      
      <h4 class="text-lg font-semibold mb-2">👉 How it works:</h4>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Enter your <strong>name</strong> and <strong>email</strong> in the "Generate New Token" section.</li>
        <li class="mb-1">Click <strong>Generate Token</strong> to create a new access token.</li>
        <li class="mb-1">The system will generate:
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">A <strong>Customer ID</strong></li>
            <li class="mb-1">A <strong>Token</strong> linked to that user</li>
          </ul>
        </li>
      </ul>
      <p class="mb-4">⚠️ Each API call requires this token to be passed in the header for authorization.</p>
      <p class="mb-4">Once a token is generated, users can integrate external systems or workflows (like automated item uploads) which will <strong>automatically update the Auditly database</strong> in the background.</p>
      
      <h3 class="text-xl font-semibold mb-3">2️⃣ API Endpoints</h3>
      <p class="mb-4"><strong>Submit data directly to the system through secure endpoints</strong></p>
      
      <p class="mb-4">This section lists available REST-based API endpoints that your system can use to push data into Auditly in <strong>JSON format</strong>.</p>
      <p class="mb-4">Each endpoint is specific to a data type and provides the exact URL you need to call.</p>
      
      <h4 class="text-lg font-semibold mb-2">📦 Available Endpoints:</h4>
      <div class="overflow-x-auto mb-4">
        <table class="min-w-full border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">API Name</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Functionality Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border-b"><strong>Update Item Data</strong></td>
              <td class="px-4 py-2 border-b">Allows sending item data (like item number, brand, configuration) directly to the platform.</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border-b"><strong>Update Customer Serials</strong></td>
              <td class="px-4 py-2 border-b">Lets you submit or update customer serial numbers.</td>
            </tr>
            <tr>
              <td class="px-4 py-2"><strong>Update Returns Data</strong></td>
              <td class="px-4 py-2">Enables submission of return-related information to the system.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Each of these APIs is <strong>POST-only</strong> (used to send data).</li>
        <li class="mb-1">Tokens generated in the API Token section are required to authenticate these requests.</li>
        <li class="mb-1">You can copy each endpoint and use them in external integrations or scripts.</li>
      </ul>
      
      <p class="mb-4">📘 Tip: Make sure your payload format matches the expected JSON schema for each endpoint.</p>
      
      <h3 class="text-xl font-semibold mb-3">🚀 Example Use Case:</h3>
      <p class="mb-4">You have a third-party application where product returns are logged. By using the <strong>"Update Returns Data"</strong> endpoint and an API token, you can automatically push those entries to Auditly.ai --- ensuring real-time reflection of the data without manual uploads.</p>
    `,
    'User Maintenance.docx': `
      <h2 class="text-2xl font-bold mb-4">🔧 Users Maintenance</h2>
      
      <p class="mb-4">The <strong>Users Maintenance</strong> module is a central dashboard for administrators to manage and control access for users within Auditly.ai. It ensures a secure and structured experience for all users while offering flexibility to scale across multiple teams and organizations.</p>
      
      <h3 class="text-xl font-semibold mb-3">👥 New User Onboarding</h3>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">When a user logs in for the first time, a new entry is automatically created in the Users Maintenance list.</li>
        <li class="mb-1">Each user is tagged with:
          <ul class="list-disc pl-6 mt-1">
            <li class="mb-1">Username</li>
            <li class="mb-1">First Name and Last Name</li>
            <li class="mb-1">Gender</li>
            <li class="mb-1">Email</li>
            <li class="mb-1">Associated <strong>Organization</strong></li>
          </ul>
        </li>
      </ul>
      <p class="mb-4">🔄 <strong>Default behavior</strong>: All users are onboarded with full access unless restricted by an Admin.</p>
      
      <h3 class="text-xl font-semibold mb-3">🔐 Access Control (Role-Based Permissions)</h3>
      <p class="mb-4">Each user can be assigned specific roles via checkbox permissions:</p>
      
      <div class="overflow-x-auto mb-4">
        <table class="min-w-full border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Role</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border-b"><strong>Admin</strong></td>
              <td class="px-4 py-2 border-b">Grants full platform control, including user management and settings changes</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border-b"><strong>Reports</strong></td>
              <td class="px-4 py-2 border-b">Grants access to all reporting modules and data views</td>
            </tr>
            <tr>
              <td class="px-4 py-2"><strong>Inspection</strong></td>
              <td class="px-4 py-2">Allows the user to perform product inspections and upload findings</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="mb-4">Only users with <strong>Admin access</strong> can update, revoke, or grant these permissions to others.</p>
      <p class="mb-4">✅ The grid-like layout enables quick toggling of permissions using simple checkboxes.</p>
      
      <h3 class="text-xl font-semibold mb-3">🌐 Future Enhancement: Organization-Based RBAC</h3>
      <p class="mb-4">In upcoming versions, <strong>organization-specific access rules</strong> will be introduced:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-1">Users will only view or interact with records tied to their organization.</li>
        <li class="mb-1">Admins can restrict access across departments or external clients securely.</li>
        <li class="mb-1">Ideal for multi-tenant use across different warehouses, franchises, or partners.</li>
      </ul>
      
      <p class="mb-4">This module is a foundational layer for ensuring <strong>controlled data access</strong>, <strong>user responsibility</strong>, and <strong>operational clarity</strong> as your company scales.</p>
    `
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: documentContent[article.content] || '<p>Content not available</p>' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Category View Component
const CategoryView = ({ category, onBack, onArticleClick }: { category: any, onBack: () => void, onArticleClick: (article: any) => void }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
      </div>
      
      <div className="space-y-3">
        {category.articles?.map((article: any, index: number) => (
          <ArticleCard 
            key={index} 
            article={article} 
            onClick={() => onArticleClick(article)}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Main Help Center Component
const AuditlyHelpCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [view, setView] = useState<'categories' | 'category' | 'article'>('categories');

  // Updated categories array with AuditlyAI documentation
  const categories = [
    {
      id: 1,
      title: 'Getting Started',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      articles: [
        { title: 'Introduction to AuditlyAI', content: 'Getting Started with Auditly AI.docx' },
        { title: 'Account Setup', content: 'Getting Started with Auditly AI.docx' },
        { title: 'Login & Navigation', content: 'Getting Started with Auditly AI.docx' }
      ]
    },
    {
      id: 2,
      title: 'Workflow Guide',
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      articles: [
        { title: 'Return Inspection Process', content: 'How to Use AuditlyAI – Step-by-Step Workflow Guide.docx' }
      ]
    },
    {
      id: 3,
      title: 'Reports & Analytics',
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      articles: [
        { title: 'Reports Overview', content: 'Reports & Analytics.docx' },
        { title: 'Exporting Data', content: 'Reports & Analytics.docx' }
      ]
    },
    {
      id: 4,
      title: 'Data Management',
      icon: <Database className="w-5 h-5 text-blue-600" />,
      articles: [
        { title: 'Manual Data Ingestion', content: 'Manual Data Ingestion.docx' },
        { title: 'Inbound/Outbound Integration', content: 'Inbound Outbound Document.docx' }
      ]
    },
    {
      id: 5,
      title: 'Configuration',
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      articles: [
        { title: 'Email Configurations', content: 'Email Configurations.docx' },
        { title: 'API Configurations', content: 'API Configurations.docx' },
        { title: 'User Maintenance', content: 'User Maintenance.docx' }
      ]
    },
    {
      id: 6,
      title: 'Release Notes',
      icon: <Rocket className="w-5 h-5 text-blue-600" />,
      categoryCount: 3,
      articleCount: 25
    },
    {
      id: 7,
      title: 'Admin Settings',
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      categoryCount: 2,
      articleCount: 24
    },
    {
      id: 8,
      title: 'Features',
      icon: <Target className="w-5 h-5 text-blue-600" />,
      categoryCount: 12,
      articleCount: 38
    }
  ];

  const handleCategoryClick = (category: any) => {
    if (category.articles) {
      setSelectedCategory(category);
      setView('category');
    }
  };

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setView('article');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView('categories');
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    setView(selectedCategory ? 'category' : 'categories');
  };

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

        {view === 'categories' && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={handleCategoryClick}
              />
            ))}
          </motion.div>
        )}

        {view === 'category' && selectedCategory && (
          <CategoryView 
            category={selectedCategory} 
            onBack={handleBackToCategories}
            onArticleClick={handleArticleClick}
          />
        )}

        {view === 'article' && selectedArticle && (
          <ArticleModal 
            article={selectedArticle} 
            onClose={handleCloseArticle}
          />
        )}

        {/* Bottom row for additional categories */}
        {view === 'categories' && (
          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LineChart className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-3">
                Analytics & Reporting
              </h3>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span>14 articles</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AuditlyHelpCenter;
