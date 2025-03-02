// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Profile } from "./Profile";
// // import { Lock, MessageCircleQuestion, Home, Menu, X } from "lucide-react";
// // import { motion, AnimatePresence } from "framer-motion";

// // export function Navbar() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const router = useNavigate();

// //   const toggleMenu = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   // Animation variants for the mobile menu
// //   const menuVariants = {
// //     hidden: { opacity: 0, y: -20 },
// //     visible: {
// //       opacity: 1,
// //       y: 0,
// //       transition: {
// //         type: "spring",
// //         stiffness: 100,
// //         damping: 10,
// //       },
// //     },
// //     exit: { opacity: 0, y: -20 },
// //   };

// //   return (
// //     <header className="border-b py-4 px-6 shadow-md relative bg-white/90 backdrop-blur-lg">
// //       <div className="container mx-auto flex justify-between items-center">
// //         {/* Logo */}
// //         <motion.div
// //           onClick={() => router("/")}
// //           className="text-2xl cursor-pointer font-bold flex items-center"
// //           whileHover={{ scale: 1.05 }}
// //           whileTap={{ scale: 0.95 }}
// //         >
// //           <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>

// //             <span style={{ fontSize: '1.7em' }}>a</span>uditly
// //           </div>
// //           <span className="text-black" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.1em', opacity: 0.8 }}>.</span>
// //           <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>
// //             <span style={{ fontSize: '1.2em' }}>a</span>i
// //           </div>
// //         </motion.div>
         

// //         {/* Hamburger Menu Button - Only visible on mobile/tablet */}
// //         <motion.button
// //           onClick={toggleMenu}
// //           className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
// //           aria-label="Toggle menu"
// //           whileHover={{ scale: 1.1 }}
// //           whileTap={{ scale: 0.9 }}
// //         >
// //           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
// //         </motion.button>

// //         {/* Navigation */}
// //         <AnimatePresence>
// //           {(isOpen || window.innerWidth >= 1024) && (
// //             <motion.nav
// //               initial="hidden"
// //               animate="visible"
// //               exit="exit"
// //               variants={menuVariants}
// //               className={`
// //                 lg:block
// //                 ${isOpen ? "block" : "hidden"}
// //                 lg:relative absolute top-full left-0 right-0
// //                 lg:bg-transparent bg-white
// //                 lg:shadow-none shadow-md
// //                 lg:p-0 p-4
// //                 lg:mt-0 mt-2
// //                 z-50
// //                 transition-all duration-300 ease-in-out
// //               `}
// //             >
// //               <ul
// //                 className="
// //                   lg:flex lg:space-x-6
// //                   lg:space-y-0 space-y-4
// //                   lg:items-center
// //                 "
// //               >
// //                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                   <Link
// //                     to="/"
// //                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
// //                     onClick={() => setIsOpen(false)}
// //                   >
// //                     <Home className="w-5 h-5" />
// //                     Home
// //                   </Link>
// //                 </motion.li>
// //                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                   <Link
// //                     to="/admin/reports/items"
// //                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition" 
// //                     onClick={() => setIsOpen(false)}
// //                   >
// //                     <Lock className="w-5 h-5" />
// //                     Admin
// //                   </Link>
// //                 </motion.li>
// //                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                   <Link
// //                     to="/help"
// //                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
// //                     onClick={() => setIsOpen(false)}
// //                   >
// //                     <MessageCircleQuestion className="w-5 h-5" />
// //                     Help Center
// //                   </Link>
// //                 </motion.li>
// //                 <motion.li className="lg:ml-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                   <Profile />
// //                 </motion.li>
// //               </ul>
// //             </motion.nav>
// //           )}
// //         </AnimatePresence>
// //       </div>

// //       {/* Overlay for mobile menu */}
// //       <AnimatePresence>
// //         {isOpen && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
// //             onClick={() => setIsOpen(false)}
// //           />
// //         )}
// //       </AnimatePresence>
// //     </header>
// //   );
// // }


// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Profile } from "./Profile";
// import { Lock, MessageCircleQuestion, Home, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [scrolled, setScrolled] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location.pathname]);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Enhanced animation variants
//   const menuVariants = {
//     hidden: { 
//       opacity: 0,
//       y: -10,
//       transition: {
//         duration: 0.2,
//         ease: [0.6, 0.05, 0.01, 0.99],
//       }
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.3,
//         ease: [0.6, 0.05, 0.01, 0.99],
//         staggerChildren: 0.05,
//       },
//     },
//     exit: { 
//       opacity: 0,
//       y: -10,
//       transition: {
//         duration: 0.2,
//       }
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.3,
//         ease: [0.6, 0.05, 0.01, 0.99],
//       },
//     },
//   };

//   const logoVariants = {
//     hover: { 
//       scale: 1.03,
//       transition: { 
//         duration: 0.3,
//         type: "spring",
//         stiffness: 500,
//         damping: 15
//       } 
//     },
//     tap: { 
//       scale: 0.97,
//       transition: { 
//         duration: 0.1,
//       } 
//     }
//   };

//   const linkVariants = {
//     hover: { 
//       scale: 1.05,
//       color: "#2563eb", // blue-600
//       transition: { 
//         duration: 0.2,
//         type: "spring",
//         stiffness: 400,
//         damping: 10
//       } 
//     },
//     tap: { 
//       scale: 0.95,
//       transition: { 
//         duration: 0.1,
//       } 
//     },
//     initial: {
//       color: "#4b5563", // gray-600
//     }
//   };

//   return (
//     <motion.header 
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ 
//         type: "spring", 
//         stiffness: 300, 
//         damping: 30,
//         delay: 0.1
//       }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled 
//           ? "py-1 bg-white/90 backdrop-blur-lg shadow-md" 
//           : "py-2 bg-white/80 backdrop-blur-md shadow-sm"
//       }`}
//     >
//       <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
//         {/* Logo */}
//         <motion.div
//           onClick={() => navigate("/")}
//           className="text-xl cursor-pointer font-bold flex items-center"
//           variants={logoVariants}
//           whileHover="hover"
//           whileTap="tap"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ 
//             duration: 0.5,
//             delay: 0.2,
//             ease: [0.6, 0.05, 0.01, 0.99],
//           }}
//         >
//           <motion.div 
//             className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" 
//             style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}
//           >
//             <span style={{ fontSize: '1.4em' }}>a</span>uditly
//           </motion.div>
//           <span className="text-black" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.95em', opacity: 0.8 }}>.</span>
//           <motion.div 
//             className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" 
//             style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}
//           >
//             <span style={{ fontSize: '1em' }}>a</span>i
//           </motion.div>
//         </motion.div>
         
//         {/* Hamburger Menu Button - Only visible on mobile/tablet */}
//         <motion.button
//           onClick={toggleMenu}
//           className="lg:hidden p-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 shadow-sm"
//           aria-label="Toggle menu"
//           variants={logoVariants}
//           whileHover="hover"
//           whileTap="tap"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <AnimatePresence mode="wait">
//             {isOpen ? (
//               <motion.div
//                 key="close"
//                 initial={{ rotate: -90, opacity: 0 }}
//                 animate={{ rotate: 0, opacity: 1 }}
//                 exit={{ rotate: 90, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <X className="w-5 h-5 text-blue-600" />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="menu"
//                 initial={{ rotate: 90, opacity: 0 }}
//                 animate={{ rotate: 0, opacity: 1 }}
//                 exit={{ rotate: -90, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Menu className="w-5 h-5 text-blue-600" />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.button>

//         {/* Navigation */}
//         <AnimatePresence>
//           {(isOpen || window.innerWidth >= 1024) && (
//             <motion.nav
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={menuVariants}
//               className={`
//                 lg:block
//                 ${isOpen ? "block" : "hidden"}
//                 lg:relative absolute top-full left-0 right-0
//                 lg:bg-transparent bg-white/95 backdrop-blur-lg
//                 lg:shadow-none shadow-lg
//                 lg:p-0 p-4
//                 lg:mt-0 mt-0
//                 z-50
//                 transition-all duration-300 ease-in-out
//                 border-t lg:border-t-0 border-gray-100
//               `}
//             >
//               <motion.ul
//                 className="
//                   lg:flex lg:space-x-6
//                   lg:space-y-0 space-y-4
//                   lg:items-center
//                 "
//                 variants={menuVariants}
//               >
//                 <motion.li variants={itemVariants}>
//                   <motion.div
//                     variants={linkVariants}
//                     initial="initial"
//                     whileHover="hover"
//                     whileTap="tap"
//                   >
//                     <Link
//                       to="/"
//                       className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-xs md:text-sm"
//                     >
//                       <motion.div
//                         className="p-1 rounded-full bg-blue-50"
//                         whileHover={{ 
//                           backgroundColor: "#dbeafe", // blue-100
//                           transition: { duration: 0.2 }
//                         }}
//                       >
//                         <Home className="w-4 h-4 text-blue-600" />
//                       </motion.div>
//                       <span>Home</span>
//                     </Link>
//                   </motion.div>
//                 </motion.li>
                
//                 <motion.li variants={itemVariants}>
//                   <motion.div
//                     variants={linkVariants}
//                     initial="initial"
//                     whileHover="hover"
//                     whileTap="tap"
//                   >
//                     <Link
//                       to="/admin/reports/items"
//                       className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-xs md:text-sm"
//                     >
//                       <motion.div
//                         className="p-1 rounded-full bg-blue-50"
//                         whileHover={{ 
//                           backgroundColor: "#dbeafe", // blue-100
//                           transition: { duration: 0.2 }
//                         }}
//                       >
//                         <Lock className="w-4 h-4 text-blue-600" />
//                       </motion.div>
//                       <span>Admin</span>
//                     </Link>
//                   </motion.div>
//                 </motion.li>
                
//                 <motion.li variants={itemVariants}>
//                   <motion.div
//                     variants={linkVariants}
//                     initial="initial"
//                     whileHover="hover"
//                     whileTap="tap"
//                   >
//                     <Link
//                       to="/help"
//                       className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-xs md:text-sm"
//                     >
//                       <motion.div
//                         className="p-1 rounded-full bg-blue-50"
//                         whileHover={{ 
//                           backgroundColor: "#dbeafe", // blue-100
//                           transition: { duration: 0.2 }
//                         }}
//                       >
//                         <MessageCircleQuestion className="w-4 h-4 text-blue-600" />
//                       </motion.div>
//                       <span>Help Center</span>
//                     </Link>
//                   </motion.div>
//                 </motion.li>
                
//                 <motion.li 
//                   className="lg:ml-4" 
//                   variants={itemVariants}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <Profile />
//                 </motion.li>
//               </motion.ul>
//             </motion.nav>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Overlay for mobile menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//             onClick={() => setIsOpen(false)}
//           />
//         )}
//       </AnimatePresence>
      
//       {/* Subtle shadow effect instead of the line */}
//       <motion.div 
//         className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-b from-transparent to-black/5"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5, duration: 0.8 }}
//       />
//     </motion.header>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Profile } from "./Profile";
import { Lock, MessageCircleQuestion, Home, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Enhanced animation variants
  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.6, 0.05, 0.01, 0.99],
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.99],
        staggerChildren: 0.05,
      },
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.99],
      },
    },
  };

  const logoVariants = {
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { 
      scale: 0.97,
      transition: { 
        duration: 0.1,
      } 
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      color: "#2563eb", // blue-600
      transition: { 
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      } 
    },
    tap: { 
      scale: 0.95,
      transition: { 
        duration: 0.1,
      } 
    },
    initial: {
      color: "#4b5563", // gray-600
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.1
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "py-1 bg-white/90 backdrop-blur-lg shadow-md" 
          : "py-2 bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          onClick={() => navigate("/")}
          className="text-xl cursor-pointer font-bold flex items-center"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2,
            ease: [0.6, 0.05, 0.01, 0.99],
          }}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" 
            style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}
          >
            <span style={{ fontSize: '1.4em' }}>a</span>uditly
          </motion.div>
          <span className="text-black" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.95em', opacity: 0.8 }}>.</span>
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" 
            style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}
          >
            <span style={{ fontSize: '1em' }}>a</span>i
          </motion.div>
        </motion.div>
         
        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <motion.button
          onClick={toggleMenu}
          className="lg:hidden p-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 shadow-sm"
          aria-label="Toggle menu"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-blue-600" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5 text-blue-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Navigation */}
        <AnimatePresence>
          {(isOpen || window.innerWidth >= 1024) && (
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className={`
                lg:block
                ${isOpen ? "block" : "hidden"}
                lg:relative absolute top-full left-0 right-0
                lg:bg-transparent bg-white/95 backdrop-blur-lg
                lg:shadow-none shadow-lg
                lg:p-0 p-4
                lg:mt-0 mt-0
                z-50
                transition-all duration-300 ease-in-out
                border-t lg:border-t-0 border-gray-100
              `}
            >
              <motion.ul
                className="
                  lg:flex lg:space-x-6
                  lg:space-y-0 space-y-4
                  lg:items-center
                "
                variants={menuVariants}
              >
                <motion.li variants={itemVariants}>
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to="/"
                      className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-sm md:text-base"
                    >
                      <motion.div
                        className="p-1 rounded-full bg-blue-50"
                        whileHover={{ 
                          backgroundColor: "#dbeafe", // blue-100
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Home className="w-4 h-4 text-blue-600" />
                      </motion.div>
                      <span>Home</span>
                    </Link>
                  </motion.div>
                </motion.li>
                
                <motion.li variants={itemVariants}>
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to="/admin/reports/items"
                      className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-sm md:text-base"
                    >
                      <motion.div
                        className="p-1 rounded-full bg-blue-50"
                        whileHover={{ 
                          backgroundColor: "#dbeafe", // blue-100
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Lock className="w-4 h-4 text-blue-600" />
                      </motion.div>
                      <span>Admin</span>
                    </Link>
                  </motion.div>
                </motion.li>
                
                <motion.li variants={itemVariants}>
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to="/help"
                      className="flex items-center gap-x-2 text-gray-600 font-medium transition-all duration-200 text-sm md:text-base"
                    >
                      <motion.div
                        className="p-1 rounded-full bg-blue-50"
                        whileHover={{ 
                          backgroundColor: "#dbeafe", // blue-100
                          transition: { duration: 0.2 }
                        }}
                      >
                        <MessageCircleQuestion className="w-4 h-4 text-blue-600" />
                      </motion.div>
                      <span>Help Center</span>
                    </Link>
                  </motion.div>
                </motion.li>
                
                <motion.li 
                  className="lg:ml-4" 
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Profile />
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Subtle shadow effect instead of the line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-b from-transparent to-black/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </motion.header>
  );
}
