import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import { House, MessageCircleQuestion, ShieldHalf } from "lucide-react";

export function Navbar() {
  const router = useNavigate();
  return (
    <header className="border-b py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => router("/")}
          className="text-2xl cursor-pointer font-bold flex items-center"
        >
          <div>Auditly</div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="hover:text-blue-400 flex gap-x-3  mt-1  text-sm md:text-base transition"
              >
                <House />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="admin/dashboard-tables"
                className="hover:text-blue-400 flex gap-x-3 mt-1   text-sm md:text-base transition"
              >
                <ShieldHalf />
                Admin
              </Link>
            </li>
            <li className="hover:text-blue-400 flex gap-x-3 mr-5 mt-1 text-sm md:text-base transition">
              <MessageCircleQuestion />
              Help center
            </li>
            <li>
              <Profile />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
