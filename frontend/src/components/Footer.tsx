import { Link } from "react-router-dom";

export function Footer() {
    return (
      <footer className=" border-t-2  shadow-2xl py-10 mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-blue-400 transition">Return Policy</Link></li>
            </ul>
          </div>
  
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
            </ul>
          </div>
  
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-blue-400 transition">FAQs</Link></li>
              <li><Link to="/help" className="hover:text-blue-400 transition">Help Center</Link></li>
            </ul>
          </div>
  
          {/* Social Media */}
         
        </div>
  
        {/* Copyright Section */}
        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} Auditly. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  