
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, BookOpen, ClipboardList, BarChart3, Database, Settings, ChevronLeft, X } from 'lucide-react';

// // Document content mapping
// const documentContent: Record<string, string> = {
//   'Getting Started with Auditly AI.docx': `
//     <h2 class="text-2xl font-bold mb-4">📌 Getting Started</h2>
//     <h3 class="text-xl font-semibold mb-3">📘 Introduction to AuditlyAI</h3>
//     <p><strong>What is AuditlyAI?</strong></p>
//     <p class="mb-4">AuditlyAI is an advanced, AI-powered return inspection platform designed specifically to simplify and streamline warehouse return processes. It empowers warehouse staff to efficiently scan returned products using barcode technology, perform accurate inspections by automatically comparing original and returned product images, and make quick, informed decisions.</p>
    
//     <p><strong>Who should use AuditlyAI?</strong></p>
//     <p class="mb-4">AuditlyAI is ideal for warehouse staff who directly handle return inspections, managers and supervisors who oversee return processes, and administrative teams responsible for tracking, reporting, and ensuring smooth operational workflows.</p>
    
//     <h3 class="text-xl font-semibold mb-3">⚙️ Setting Up Your Account</h3>
//     <p><strong>Creating an Account</strong></p>
//     <ol class="list-decimal pl-6 mb-4">
//       <li class="mb-2">Visit Registration Page: Go to auditlyai.com and click on "Register" or "Create Account."</li>
//       <li class="mb-2">Fill in the Required Information:
//         <ul class="list-disc pl-6 mt-1">
//           <li>Username (used for login)</li>
//           <li>First Name and Last Name</li>
//           <li>Gender</li>
//           <li>Valid Email Address</li>
//           <li>Password</li>
//           <li>Organization Name</li>
//         </ul>
//       </li>
//       <li class="mb-2">Submit your Registration: Click on the "Create Account" button at the bottom.</li>
//     </ol>
    
//     <h3 class="text-xl font-semibold mb-3">📌 Activating Your Account</h3>
//     <p class="mb-2">After submitting your registration details:</p>
//     <ol class="list-decimal pl-6 mb-4">
//       <li class="mb-2">Email Verification: An OTP (One-Time Password) will be sent to the email address you provided.</li>
//       <li class="mb-2">OTP Verification: Enter the OTP in the provided field on the AuditlyAI verification page and click on "Verify OTP" to activate your account.</li>
//     </ol>
    
//     <h3 class="text-xl font-semibold mb-3">📌 Logging into Your Account</h3>
//     <ol class="list-decimal pl-6 mb-4">
//       <li class="mb-2">Visit the Login Page: Navigate to auditlyai.com/login.</li>
//       <li class="mb-2">Enter Credentials: Input your Username and Password, then click "Sign in".</li>
//       <li class="mb-2">Forgot Password: Click on "Forgot Password?" and follow the prompts to reset your password.</li>
//     </ol>
    
//     <h3 class="text-xl font-semibold mb-3">📌 Navigating AuditlyAI After Login</h3>
//     <p class="mb-2">After logging in, you land on the Return Inspection Portal homepage where you can:</p>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1">Quickly search inspections by entering an inspection number</li>
//       <li class="mb-1">Start new returns by clicking the "Start New Return" button</li>
//     </ul>
//     <p class="mb-2">Access additional features from the top navigation bar:</p>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1">Home</li>
//       <li class="mb-1">Admin</li>
//       <li class="mb-1">Reports</li>
//       <li class="mb-1">Maintenance</li>
//       <li class="mb-1">Help Center</li>
//       <li class="mb-1">User Notifications</li>
//     </ul>
//   `,
//   'How to Use AuditlyAI – Step-by-Step Workflow Guide.docx': `
//     <h2 class="text-2xl font-bold mb-4">AuditlyAI - Workflow and Step-by-Step Process</h2>
    
//     <h3 class="text-xl font-semibold mb-3">Step 1: Access Return Inspection Portal</h3>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1">Log in to AuditlyAI.</li>
//       <li class="mb-1">Access the Return Inspection Portal.</li>
//       <li class="mb-1">Enter the Inspection Reference Number (generated from a previous inspection) to retrieve existing return details, or click Start New Return to initiate a fresh inspection.</li>
//     </ul>
    
//     <h3 class="text-xl font-semibold mb-3">Step 2: Choose Inspection Method</h3>
//     <p class="mb-2">AuditlyAI provides two ways to begin an inspection:</p>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1"><strong>Quick Scan:</strong> Use your device camera to scan a barcode of product. The system will auto-fetch product details once the barcode is read.</li>
//       <li class="mb-1"><strong>Manual Entry:</strong> Enter the Return Order Number manually to retrieve the same set of product details.</li>
//     </ul>
    
//     <h3 class="text-xl font-semibold mb-3">Step 3: Review Product Information</h3>
//     <p class="mb-2">Once the number is entered or scanned, AuditlyAI displays product details:</p>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1">General Information (Sales Order, Order Line, Quantity)</li>
//       <li class="mb-1">Return Information (Return Order Number, Quantity)</li>
//       <li class="mb-1">Shipping/Product Info (Serial Number, Address)</li>
//       <li class="mb-1">Dimensions (Length, Breadth, Height, Weight)</li>
//     </ul>
//     <p class="mb-4">Click Continue to proceed.</p>
//   `,
//   'Reports & Analytics.docx': `
//     <h2 class="text-2xl font-bold mb-4">Reports & Analytics Overview</h2>
//     <p class="mb-4">The Reports section in AuditlyAI offers a centralized hub where users can view and analyze return inspection-related data. This area is essential for warehouse staff, supervisors, and administrators who want to monitor activities, audit return cases, and draw insights from processed inspections.</p>
    
//     <h3 class="text-xl font-semibold mb-3">Key features in the Reports module include:</h3>
//     <ul class="list-disc pl-6 mb-4">
//       <li class="mb-1"><strong>Visual Records:</strong> Each report lists detailed entries for inspections, returns, and item tracking.</li>
//       <li class="mb-1"><strong>Filters and Search:</strong> Users can filter reports using fields such as receipt number, product condition, and return order number. This makes it easy to locate specific records.</li>
//       <li class="mb-1"><strong>Export Options:</strong> Users can download inspection and return data in XLSX or PDF formats for further offline analysis or documentation.</li>
//     </ul>
//   `,
//   'Manual Data Ingestion.docx': `
//     <h2 class="text-2xl font-bold mb-4">Manual Data Ingestion</h2>
//     <p class="mb-4">The <strong>Manual Data Ingestion</strong> module allows users to upload and manage data files related to returns processing. This section is especially useful for administrators or team members who handle bulk data entry from external systems or files.</p>
    
//     <h3 class="text-xl font-semibold mb-3">🔹 What It Does</h3>
//     <p class="mb-4">This feature enables users to upload various types of data through CSV files. These uploads help populate or update the system with key information required for return inspections and analytics.</p>
//   `,
//   'Inbound Outbound Document.docx': `
//     <h2 class="text-2xl font-bold mb-4">Inbound, Data Mapping Rules, and Outbound Integration in Auditly.ai</h2>
//     <p class="mb-4">Auditly.ai supports seamless integration between external analytics platforms like Power BI and the internal SQL database through configurable <strong>Inbound</strong> and <strong>Outbound</strong> connectors, aided by <strong>Data Mapping Rules</strong>. These tools empower users to automate data flows, maintain up-to-date records, and ensure accurate reporting on the frontend.</p>
//   `,
//   'Email Configurations.docx': `
//     <h2 class="text-2xl font-bold mb-4">✉️ Email Configurations</h2>
//     <p class="mb-4"><strong>Manage team-level communication for smooth internal collaboration</strong></p>
    
//     <p class="mb-4">The <strong>Email Configurations</strong> module in Auditly.ai enables centralized management of official communication channels across various teams. This section helps businesses keep team emails organized and editable --- ensuring that relevant teams receive messages from automated alerts, customer interactions, or internal triggers.</p>
//   `,
//   'API Configurations.docx': `
//     <h2 class="text-2xl font-bold mb-4">🔐 API Configurations</h2>
//     <p class="mb-4"><strong>Automate data sync with secure, token-based API access</strong></p>
    
//     <p class="mb-4">The <strong>API Configurations</strong> section in Auditly.ai allows you to connect your external applications or databases to the platform securely using tokens and predefined API endpoints. This helps in seamless, real-time data flow without needing to manually upload files.</p>
//   `,
//   'User Maintenance.docx': `
//     <h2 class="text-2xl font-bold mb-4">🔧 Users Maintenance</h2>
    
//     <p class="mb-4">The <strong>Users Maintenance</strong> module is a central dashboard for administrators to manage and control access for users within Auditly.ai. It ensures a secure and structured experience for all users while offering flexibility to scale across multiple teams and organizations.</p>
//   `
// };

// // File Icon Component
// const FileIcon = ({ className }: { className?: string }) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//     className={className}
//   >
//     <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//     <polyline points="14 2 14 8 20 8" />
//     <line x1="16" y1="13" x2="8" y2="13" />
//     <line x1="16" y1="17" x2="8" y2="17" />
//     <line x1="10" y1="9" x2="8" y2="9" />
//   </svg>
// );

// // Define interfaces for type safety
// interface Article {
//   title: string;
//   content: string;
// }

// interface Category {
//   id: number;
//   title: string;
//   icon: React.ReactNode;
//   articles: Article[];
// }

// // Category Card Component
// const CategoryCard: React.FC<{ 
//   category: Category; 
//   onClick: (category: Category) => void;
//   delay: number;
// }> = ({ category, onClick, delay }) => {
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: [0.25, 0.1, 0.25, 1.0],
//         delay
//       }
//     },
//     hover: {
//       y: -5,
//       boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//       transition: {
//         duration: 0.2,
//         ease: "easeOut"
//       }
//     }
//   };

//   return (
//     <motion.div
//       className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-gray-100"
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       whileHover="hover"
//       onClick={() => onClick(category)}
//     >
//       <div className="p-6">
//         <div className="flex items-start mb-4">
//           <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 text-blue-600">
//             {category.icon}
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               {category.title}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {category.articles.length} {category.articles.length === 1 ? 'article' : 'articles'}
//             </p>
//           </div>
//         </div>
//         <ul className="space-y-2">
//           {category.articles.slice(0, 2).map((article, index) => (
//             <li key={index} className="flex items-center text-sm text-gray-600">
//               <FileIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
//               <span className="truncate">{article.title}</span>
//             </li>
//           ))}
//           {category.articles.length > 2 && (
//             <li className="text-xs text-blue-600 font-medium pt-1">
//               + {category.articles.length - 2} more
//             </li>
//           )}
//         </ul>
//       </div>
//     </motion.div>
//   );
// };

// // Article Card Component
// const ArticleCard: React.FC<{
//   article: Article; 
//   onClick: () => void;
//   index: number;
// }> = ({ article, onClick, index }) => {
//   return (
//     <motion.div
//       className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 cursor-pointer hover:bg-gray-50"
//       initial={{ opacity: 0, x: -10 }}
//       animate={{ 
//         opacity: 1, 
//         x: 0,
//         transition: { delay: 0.1 * index, duration: 0.3 }
//       }}
//       whileHover={{ x: 5 }}
//       onClick={onClick}
//     >
//       <div className="flex items-center">
//         <FileIcon className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
//         <h4 className="text-md font-medium text-gray-800">{article.title}</h4>
//       </div>
//     </motion.div>
//   );
// };

// // Article Modal Component
// const ArticleModal: React.FC<{
//   article: Article;
//   onClose: () => void;
// }> = ({ article, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <motion.div 
//         className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.95, y: 20 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//       >
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="overflow-y-auto p-6">
//           <div 
//             className="prose prose-blue max-w-none"
//             dangerouslySetInnerHTML={{ __html: documentContent[article.content] || '<p>Content not available</p>' }}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // Category View Component
// const CategoryView: React.FC<{
//   category: Category;
//   onBack: () => void;
//   onArticleClick: (article: Article) => void;
// }> = ({ category, onBack, onArticleClick }) => {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center mb-6">
//         <button 
//           onClick={onBack}
//           className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4 group"
//         >
//           <ChevronLeft className="h-5 w-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
//           <span>Back to Categories</span>
//         </button>
//       </div>
      
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
      
//       <div className="space-y-3">
//         {category.articles.map((article, index) => (
//           <ArticleCard 
//             key={index} 
//             index={index}
//             article={article} 
//             onClick={() => onArticleClick(article)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main Help Center Component
// const AuditlyHelpCenter: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
//   const [view, setView] = useState<'categories' | 'category' | 'article'>('categories');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<Category[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   // Categories data
//   const categories: Category[] = [
//     {
//       id: 1,
//       title: 'Getting Started',
//       icon: <BookOpen className="w-6 h-6" />,
//       articles: [
//         { title: 'Introduction to AuditlyAI', content: 'Getting Started with Auditly AI.docx' },
//         { title: 'Account Setup', content: 'Getting Started with Auditly AI.docx' },
//         { title: 'Login & Navigation', content: 'Getting Started with Auditly AI.docx' }
//       ]
//     },
//     {
//       id: 2,
//       title: 'Workflow Guide',
//       icon: <ClipboardList className="w-6 h-6" />,
//       articles: [
//         { title: 'Return Inspection Process', content: 'How to Use AuditlyAI – Step-by-Step Workflow Guide.docx' }
//       ]
//     },
//     {
//       id: 3,
//       title: 'Reports & Analytics',
//       icon: <BarChart3 className="w-6 h-6" />,
//       articles: [
//         { title: 'Reports Overview', content: 'Reports & Analytics.docx' },
//         { title: 'Exporting Data', content: 'Reports & Analytics.docx' }
//       ]
//     },
//     {
//       id: 4,
//       title: 'Data Management',
//       icon: <Database className="w-6 h-6" />,
//       articles: [
//         { title: 'Manual Data Ingestion', content: 'Manual Data Ingestion.docx' },
//         { title: 'Inbound/Outbound Integration', content: 'Inbound Outbound Document.docx' }
//       ]
//     },
//     {
//       id: 5,
//       title: 'Configuration',
//       icon: <Settings className="w-6 h-6" />,
//       articles: [
//         { title: 'Email Configurations', content: 'Email Configurations.docx' },
//         { title: 'API Configurations', content: 'API Configurations.docx' },
//         { title: 'User Maintenance', content: 'User Maintenance.docx' }
//       ]
//     }
//   ];

//   // Filter categories and articles based on search query
//   useEffect(() => {
//     if (!searchQuery) {
//       setSearchResults(categories);
//       setIsSearching(false);
//       return;
//     }

//     setIsSearching(true);
//     const query = searchQuery.toLowerCase();

//     const filtered = categories.map(category => {
//       // Filter articles within each category
//       const filteredArticles = category.articles.filter(article => 
//         article.title.toLowerCase().includes(query) ||
//         (documentContent[article.content] || '').toLowerCase().includes(query)
//       );
      
//       // Return a new category object with filtered articles
//       return {
//         ...category,
//         articles: filteredArticles
//       };
//     }).filter(category => 
//       // Keep only categories with matching name or with some matching articles
//       category.title.toLowerCase().includes(query) || 
//       category.articles.length > 0
//     );

//     setSearchResults(filtered);
//   }, [searchQuery]);

//   const handleCategoryClick = (category: Category) => {
//     setSelectedCategory(category);
//     setView('category');
//   };

//   const handleArticleClick = (article: Article) => {
//     setSelectedArticle(article);
//     setView('article');
//   };

//   const handleBackToCategories = () => {
//     setSelectedCategory(null);
//     setView('categories');
//   };

//   const handleCloseArticle = () => {
//     setSelectedArticle(null);
//     setView(selectedCategory ? 'category' : 'categories');
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">AuditlyAI Documentation</h1>
          
//           <div className="relative max-w-xl">
//             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search documentation..."
//               className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           {view === 'categories' && (
//             <motion.div 
//               key="categories"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               {isSearching && searchQuery && (
//                 <div className="mb-6">
//                   <h2 className="text-lg font-medium text-gray-700 mb-3">
//                     Search results for "{searchQuery}"
//                   </h2>
//                   {searchResults.length === 0 && (
//                     <p className="text-gray-500">No results found. Try a different search term.</p>
//                   )}
//                 </div>
//               )}
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map((category, index) => (
//                   <CategoryCard 
//                     key={category.id} 
//                     category={category} 
//                     onClick={handleCategoryClick}
//                     delay={0.1 * index}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {view === 'category' && selectedCategory && (
//             <motion.div
//               key="category"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <CategoryView 
//                 category={selectedCategory} 
//                 onBack={handleBackToCategories}
//                 onArticleClick={handleArticleClick}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {view === 'article' && selectedArticle && (
//             <ArticleModal 
//               article={selectedArticle} 
//               onClose={handleCloseArticle}
//             />
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default AuditlyHelpCenter;



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ClipboardList, BarChart3, Database, Settings, ChevronLeft, X } from 'lucide-react';

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
  `,
  'Manual Data Ingestion.docx': `
    <h2 class="text-2xl font-bold mb-4">Manual Data Ingestion</h2>
    <p class="mb-4">The <strong>Manual Data Ingestion</strong> module allows users to upload and manage data files related to returns processing. This section is especially useful for administrators or team members who handle bulk data entry from external systems or files.</p>
    
    <h3 class="text-xl font-semibold mb-3">🔹 What It Does</h3>
    <p class="mb-4">This feature enables users to upload various types of data through CSV files. These uploads help populate or update the system with key information required for return inspections and analytics.</p>
  `,
  'Inbound Outbound Document.docx': `
    <h2 class="text-2xl font-bold mb-4">Inbound, Data Mapping Rules, and Outbound Integration in Auditly.ai</h2>
    <p class="mb-4">Auditly.ai supports seamless integration between external analytics platforms like Power BI and the internal SQL database through configurable <strong>Inbound</strong> and <strong>Outbound</strong> connectors, aided by <strong>Data Mapping Rules</strong>. These tools empower users to automate data flows, maintain up-to-date records, and ensure accurate reporting on the frontend.</p>
  `,
  'Email Configurations.docx': `
    <h2 class="text-2xl font-bold mb-4">✉️ Email Configurations</h2>
    <p class="mb-4"><strong>Manage team-level communication for smooth internal collaboration</strong></p>
    
    <p class="mb-4">The <strong>Email Configurations</strong> module in Auditly.ai enables centralized management of official communication channels across various teams. This section helps businesses keep team emails organized and editable --- ensuring that relevant teams receive messages from automated alerts, customer interactions, or internal triggers.</p>
  `,
  'API Configurations.docx': `
    <h2 class="text-2xl font-bold mb-4">🔐 API Configurations</h2>
    <p class="mb-4"><strong>Automate data sync with secure, token-based API access</strong></p>
    
    <p class="mb-4">The <strong>API Configurations</strong> section in Auditly.ai allows you to connect your external applications or databases to the platform securely using tokens and predefined API endpoints. This helps in seamless, real-time data flow without needing to manually upload files.</p>
  `,
  'User Maintenance.docx': `
    <h2 class="text-2xl font-bold mb-4">🔧 Users Maintenance</h2>
    
    <p class="mb-4">The <strong>Users Maintenance</strong> module is a central dashboard for administrators to manage and control access for users within Auditly.ai. It ensures a secure and structured experience for all users while offering flexibility to scale across multiple teams and organizations.</p>
  `
};

// File Icon Component
const FileIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www3.org/2000/svg" 
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

// Define interfaces for type safety
interface Article {
  title: string;
  content: string;
}

interface Category {
  id: number;
  title: string;
  icon: React.ReactNode;
  articles: Article[];
}

// Category Card Component
const CategoryCard: React.FC<{ 
  category: Category; 
  onClick: (category: Category) => void;
  delay: number;
}> = ({ category, onClick, delay }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
        delay
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-gray-100"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(category)}
    >
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 text-blue-600">
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {category.title}
            </h3>
            <p className="text-sm text-gray-500">
              {category.articles.length} {category.articles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
        <ul className="space-y-2">
          {category.articles.slice(0, 2).map((article, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <FileIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
              <span className="truncate">{article.title}</span>
            </li>
          ))}
          {category.articles.length > 2 && (
            <li className="text-xs text-blue-600 font-medium pt-1">
              + {category.articles.length - 2} more
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

// Article Card Component
const ArticleCard: React.FC<{
  article: Article; 
  onClick: () => void;
  index: number;
}> = ({ article, onClick, index }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 cursor-pointer hover:bg-gray-50"
      initial={{ opacity: 0, x: -10 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        transition: { delay: 0.1 * index, duration: 0.3 }
      }}
      whileHover={{ x: 5 }}
      onClick={onClick}
    >
      <div className="flex items-center">
        <FileIcon className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
        <h4 className="text-md font-medium text-gray-800">{article.title}</h4>
      </div>
    </motion.div>
  );
};

// Article Modal Component
const ArticleModal: React.FC<{
  article: Article;
  onClose: () => void;
}> = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: documentContent[article.content] || '<p>Content not available</p>' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Category View Component
const CategoryView: React.FC<{
  category: Category;
  onBack: () => void;
  onArticleClick: (article: Article) => void;
}> = ({ category, onBack, onArticleClick }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4 group"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Categories</span>
        </button>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
      
      <div className="space-y-3">
        {category.articles.map((article, index) => (
          <ArticleCard 
            key={index} 
            index={index}
            article={article} 
            onClick={() => onArticleClick(article)}
          />
        ))}
      </div>
    </div>
  );
};

// Main Help Center Component
const AuditlyHelpCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [view, setView] = useState<'categories' | 'category' | 'article'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Categories data
  const categories: Category[] = [
    {
      id: 1,
      title: 'Getting Started',
      icon: <BookOpen className="w-6 h-6" />,
      articles: [
        { title: 'Introduction to AuditlyAI', content: 'Getting Started with Auditly AI.docx' },
        { title: 'Account Setup', content: 'Getting Started with Auditly AI.docx' },
        { title: 'Login & Navigation', content: 'Getting Started with Auditly AI.docx' }
      ]
    },
    {
      id: 2,
      title: 'Workflow Guide',
      icon: <ClipboardList className="w-6 h-6" />,
      articles: [
        { title: 'Return Inspection Process', content: 'How to Use AuditlyAI – Step-by-Step Workflow Guide.docx' }
      ]
    },
    {
      id: 3,
      title: 'Reports & Analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      articles: [
        { title: 'Reports Overview', content: 'Reports & Analytics.docx' },
        { title: 'Exporting Data', content: 'Reports & Analytics.docx' }
      ]
    },
    {
      id: 4,
      title: 'Data Management',
      icon: <Database className="w-6 h-6" />,
      articles: [
        { title: 'Manual Data Ingestion', content: 'Manual Data Ingestion.docx' },
        { title: 'Inbound/Outbound Integration', content: 'Inbound Outbound Document.docx' }
      ]
    },
    {
      id: 5,
      title: 'Configuration',
      icon: <Settings className="w-6 h-6" />,
      articles: [
        { title: 'Email Configurations', content: 'Email Configurations.docx' },
        { title: 'API Configurations', content: 'API Configurations.docx' },
        { title: 'User Maintenance', content: 'User Maintenance.docx' }
      ]
    }
  ];

  // Filter categories and articles based on search query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(categories);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();

    const filtered = categories.map(category => {
      // Filter articles within each category
      const filteredArticles = category.articles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        (documentContent[article.content] || '').toLowerCase().includes(query)
      );
      
      // Return a new category object with filtered articles
      return {
        ...category,
        articles: filteredArticles
      };
    }).filter(category => 
      // Keep only categories with matching name or with some matching articles
      category.title.toLowerCase().includes(query) || 
      category.articles.length > 0
    );

    setSearchResults(filtered);
  }, [searchQuery]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView('category');
  };

  const handleArticleClick = (article: Article) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header with Search Bar */}
      <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">AuditlyAI Documentation</h1>
            
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'categories' && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4"
            >
              {isSearching && searchQuery && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Search results for "{searchQuery}"
                  </h2>
                  {searchResults.length === 0 && (
                    <p className="text-gray-500">No results found. Try a different search term.</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((category, index) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onClick={handleCategoryClick}
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {view === 'category' && selectedCategory && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <CategoryView 
                category={selectedCategory} 
                onBack={handleBackToCategories}
                onArticleClick={handleArticleClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'article' && selectedArticle && (
            <ArticleModal 
              article={selectedArticle} 
              onClose={handleCloseArticle}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AuditlyHelpCenter;
