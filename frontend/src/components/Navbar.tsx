import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
    const router = useNavigate()
  return (
    <header className="border-b py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div onClick={()=>router('/')}  className="text-2xl cursor-pointer font-bold flex items-center">
          <div >Auditly</div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-400 text-sm md:text-base transition">Home</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 text-sm md:text-base transition">Contact Us</Link>
            </li>
            <li>
              <Link to="admin/dashboard-tables" className="hover:text-blue-400 text-sm md:text-base transition">Admin</Link>
            </li>
            <li>
              <Link to="/report" className="hover:text-blue-400 text-sm md:text-base transition">Report</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}