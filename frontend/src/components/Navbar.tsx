import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import {
  Lock,
  MessageCircleQuestion,
  Home,
  Menu,
  X,
  FileText,
  Construction,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();
  const [userData, setUserData] = useState(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isReportUser, setIsReportUser] = useState(false);
  const [isInspectionUser, setIsInspectionUser] = useState(false);

  useEffect(() => {
    if (userData && Array.isArray(userData["User Type"])) {
      setIsAdmin(userData["User Type"].includes("admin"));
      setIsReportUser(userData["User Type"].includes("reports_user"));
      setIsInspectionUser(userData["User Type"].includes("inpection_user"));
    }
  }, [userData]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <header className="border-b py-4 px-6 shadow-md relative bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: "1.7em" }}>a</span>uditly
          </div>
          <span
            className="text-black"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontSize: "1.1em",
              opacity: 0.8,
            }}
          >
            .
          </span>
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
            style={{
              fontFamily: "Prompt, sans-serif",
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: "1.2em" }}>a</span>i
          </div>
        </motion.div>

        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <motion.button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                lg:bg-transparent bg-white
                lg:shadow-none shadow-md
                lg:p-0 p-4
                lg:mt-0 mt-2
                z-50
                transition-all duration-300 ease-in-out
              `}
            >
              <ul
                className="
                  lg:flex lg:space-x-6
                  lg:space-y-0 space-y-4
                  lg:items-center
                "
              >
                {
                  isInspectionUser ? <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </Link>
                  </motion.li> : ""
                }

                {isAdmin ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/settings/connectors/inbound"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Lock className="w-5 h-5" />
                      Admin
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}

                {isReportUser ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/reports/items"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="w-5 h-5" />
                      Reports
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}
                {isInspectionUser ? (
                  <motion.li
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/admin/settings/item-master-upload"
                      className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Construction className="w-5 h-5" />
                      Maintenance
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}

                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/help-center"
                    className="hover:text-blue-600 flex items-center gap-x-3 text-sm md:text-base transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircleQuestion className="w-5 h-5" />
                    Help Center
                  </Link>
                </motion.li>
                <motion.li
                  className="lg:ml-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
