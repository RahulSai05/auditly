import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, LogOut, Mail, ArrowLeft } from "lucide-react";

const IsVerified: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth/session storage
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    localStorage.removeItem("agentId");
    localStorage.removeItem("managerId");
    localStorage.removeItem("organization");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Access Denied
              </h1>
              <p className="text-slate-600 mt-1">
                Your account is not approved yet.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-slate-800 font-medium">
              Your registration is pending approval.
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Please contact your administrator or wait until your access is
              approved. Once approved, log in again.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition font-semibold text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 transition font-semibold text-white"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="mt-6 text-center">
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-800"
              href="mailto:support@auditlyai.com?subject=Auditly%20Access%20Approval%20Request"
            >
              <Mail className="w-4 h-4" />
              Request approval via email
            </a>
            <p className="text-xs text-slate-400 mt-2">
              Error code: 403
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IsVerified;