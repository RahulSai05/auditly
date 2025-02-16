
import { useNavigate } from "react-router-dom";
import { NotebookPen, ScanQrCode } from "lucide-react";

const Options = () => {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Get Started</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Preferred Option
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the method that best suits your needs. Both options provide comprehensive results tailored to your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Scan Option */}
          <div className="group relative flex">
            <div className="h-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex-1 flex flex-col">
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ScanQrCode size={32} className="text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Quick Scan
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                  Initiate an automated system scan for quick and efficient results. Perfect for routine checks and basic assessments.
                </p>
                <button
                  onClick={() => router("/auto/scan")}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Quick Scan
                </button>
              </div>
            </div>
          </div>

          {/* Manual Entry Option */}
          <div className="group relative flex">
            <div className="h-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex-1 flex flex-col">
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <NotebookPen size={32} className="text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Manual Entry
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                  Input your details manually for a more customized and thorough analysis. Ideal for specific requirements and detailed assessments.
                </p>
                <button
                  onClick={() => router("/option/manual")}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Manual Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;

