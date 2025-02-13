import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import { Lock, MessageCircleQuestion, Home, Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="border-b py-4 px-6 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
        >
          <div>Auditly</div>
        </div>

        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation */}
        <nav
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
            <li>
              <Link
                to="/"
                className="hover:text-blue-400 flex items-center gap-x-3 text-sm md:text-base transition"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="admin/dashboard-tables"
                className="hover:text-blue-400 flex items-center gap-x-3 text-sm md:text-base transition"
                onClick={() => setIsOpen(false)}
              >
                <Lock className="w-5 h-5" />
                Admin
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="hover:text-blue-400 flex items-center gap-x-3 text-sm md:text-base transition"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircleQuestion className="w-5 h-5" />
                Help center
              </Link>
            </li>
            <li className="lg:ml-4">
              <Profile />
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}
