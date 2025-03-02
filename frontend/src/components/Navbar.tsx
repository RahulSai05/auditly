// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Profile } from "./Profile";
// import { Lock, MessageCircleQuestion, Home, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useNavigate();

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Animation variants for the mobile menu
//   const menuVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//     exit: { opacity: 0, y: -20 },
//   };

//   return (
//     <header className="border-b py-4 px-6 shadow-md relative bg-white/90 backdrop-blur-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <motion.div
//           onClick={() => router("/")}
//           className="text-2xl cursor-pointer font-bold flex items-center"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>

//             <span style={{ fontSize: '1.7em' }}>a</span>uditly
//           </div>
//           <span className="text-black" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.1em', opacity: 0.8 }}>.</span>
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>
//             <span style={{ fontSize: '1.2em' }}>a</span>i
//           </div>
//         </motion.div>
         

//         {/* Hamburger Menu Button - Only visible on mobile/tablet */}
//         <motion.button
//           onClick={toggleMenu}
//           className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
//           aria-label="Toggle menu"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
//                 lg:bg-transparent bg-white
//                 lg:shadow-none shadow-md
//                 lg:p-0 p-4
//                 lg:mt-0 mt-2
//                 z-50
//                 transition-all duration-300 ease-in-out
//               `}
//             >
//               <ul
//                 className="
//                   lg:flex lg:space-x-6
//                   lg:space-y-0 space-y-4
//                   lg:items-center
//                 "
//               >
//                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/"
//                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <Home className="w-5 h-5" />
//                     Home
//                   </Link>
//                 </motion.li>
//                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/admin/reports/items"
//                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition" 
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <Lock className="w-5 h-5" />
//                     Admin
//                   </Link>
//                 </motion.li>
//                 <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/help"
//                     className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <MessageCircleQuestion className="w-5 h-5" />
//                     Help Center
//                   </Link>
//                 </motion.li>
//                 <motion.li className="lg:ml-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Profile />
//                 </motion.li>
//               </ul>
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
//             className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }

import { useState, useEffect } from "react";
import { Home, Lock, MessageCircleQuestion, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock component for Profile since we don't have the actual implementation
const Profile = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium"
  >
    Profile
  </motion.button>
);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle navigation without react-router-dom
  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // This would use router.push(path) if react-router-dom was set up
    window.location.href = path; // This will actually navigate to the path
  };

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      },
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15
      } 
    },
    tap: { 
      scale: 0.95,
      transition: { 
        duration: 0.1,
      } 
    },
  };

  return (
    <header 
      className={`sticky top-0 z-50 py-4 px-5 shadow-sm transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-md" 
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with enhanced animations */}
        <motion.div
          onClick={() => navigate("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
            <span style={{ fontSize: '1.6em' }}>a</span>uditly
          </div>
          <span className="text-black" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.2em', opacity: 0.8 }}>.</span>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
            <span style={{ fontSize: '1.2em' }}>a</span>i
          </div>
        </motion.div>
         
        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <motion.button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
                <X className="w-6 h-6 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-gray-700" />
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
                lg:p-0 p-5
                lg:mt-0 mt-1
                z-50
                transition-all duration-300 ease-in-out
                border-t lg:border-t-0 border-gray-100
              `}
            >
              <ul
                className="
                  lg:flex lg:space-x-8
                  lg:space-y-0 space-y-5
                  lg:items-center
                "
              >
                <motion.li variants={itemVariants}>
                  <motion.a
                    href="/"
                    className="flex items-center gap-x-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group text-base md:text-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                      <Home className="w-5 h-5 text-blue-600" />
                    </span>
                    <span>Home</span>
                  </motion.a>
                </motion.li>
                
                <motion.li variants={itemVariants}>
                  <motion.a
                    href="/admin/reports/items"
                    className="flex items-center gap-x-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group text-base md:text-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/admin/reports/items");
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </span>
                    <span>Admin</span>
                  </motion.a>
                </motion.li>
                
                <motion.li variants={itemVariants}>
                  <motion.a
                    href="/help"
                    className="flex items-center gap-x-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group text-base md:text-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/help");
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                      <MessageCircleQuestion className="w-5 h-5 text-blue-600" />
                    </span>
                    <span>Help Center</span>
                  </motion.a>
                </motion.li>
                
                <motion.li 
                  className="lg:ml-4"
                  variants={itemVariants}
                >
                  <Profile />
                </motion.li>
              </ul>
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
    </header>
  );
}
