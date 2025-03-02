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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Profile } from "./Profile";
import { Lock, MessageCircleQuestion, Home, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants for the navbar
  const navbarVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  // Animation variants for the mobile menu
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren"
      },
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
  };

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Logo animation variants
  const logoVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { scale: 0.95 }
  };

  // Text reveal animation for logo
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5
      }
    })
  };

  // Check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.header 
      className={`fixed w-full py-3 px-6 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-white/90 backdrop-blur-sm"
      }`}
      initial="initial"
      animate="animate"
      variants={navbarVariants}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
          variants={logoVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent flex items-baseline" 
               style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>
            {["a", "u", "d", "i", "t", "l", "y"].map((letter, i) => (
              <motion.span 
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  fontSize: letter === 'a' ? '1.7em' : '1em',
                  display: 'inline-block'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.span 
            className="text-black mx-1" 
            style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.1em', opacity: 0.8 }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 5
            }}
          >
            .
          </motion.span>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" 
               style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 400, opacity: 0.9 }}>
            {["a", "i"].map((letter, i) => (
              <motion.span 
                key={i}
                custom={i + 8}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  fontSize: letter === 'a' ? '1.2em' : '1em',
                  display: 'inline-block'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <motion.button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.9 }}
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
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 items-center">
            {[
              { to: "/", icon: <Home className="w-5 h-5" />, text: "Home" },
              { to: "/admin/reports/items", icon: <Lock className="w-5 h-5" />, text: "Admin" },
              { to: "/help", icon: <MessageCircleQuestion className="w-5 h-5" />, text: "Help Center" },
            ].map((item, index) => (
              <motion.li key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-x-2 text-base transition-all duration-300 relative group ${
                    isActive(item.to) 
                      ? "text-blue-600 font-medium" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -10, 10, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {item.icon}
                  </motion.span>
                  {item.text}
                  
                  {/* Animated underline */}
                  {isActive(item.to) ? (
                    <motion.div 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeNavUnderline"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  ) : (
                    <motion.div 
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"
                    />
                  )}
                </Link>
              </motion.li>
            ))}
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Profile />
            </motion.li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg overflow-hidden z-50"
            >
              <ul className="flex flex-col p-4 space-y-3">
                {[
                  { to: "/", icon: <Home className="w-5 h-5" />, text: "Home" },
                  { to: "/admin/reports/items", icon: <Lock className="w-5 h-5" />, text: "Admin" },
                  { to: "/help", icon: <MessageCircleQuestion className="w-5 h-5" />, text: "Help Center" },
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="w-full"
                  >
                    <Link
                      to={item.to}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                        isActive(item.to)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-x-3">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                        <span className="font-medium">{item.text}</span>
                      </div>
                      <motion.div
                        animate={{ x: isActive(item.to) ? 0 : -5, opacity: isActive(item.to) ? 1 : 0 }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={itemVariants} className="pt-2 border-t">
                  <div className="p-2">
                    <Profile />
                  </div>
                </motion.li>
              </ul>
            </motion.div>
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
            className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
