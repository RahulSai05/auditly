// import { useNavigate } from "react-router-dom";
// import { NotebookPen, ScanQrCode } from "lucide-react";

// const Options = () => {
//   const router = useNavigate();

//   return (
//     <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
//       <div className="mt-12"> {/* Adjust margin-top as needed */}
//         <h2 className="text-3xl mb-6">Choose the best Option for your needs</h2>
//         <div className="flex flex-wrap justify-center gap-6">
//           {/* Quick Scan Option */}
//           <div className="w-full md:w-[390px] border p-6 hover:text-blue-600 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col items-center text-center">
//             <ScanQrCode size={90} className="mb-4" />
//             <h3 className="text-gray-800 text-xl font-medium">Quick Scan</h3>
//             <p className="text-gray-800 mb-4">
//               Quickly scan your system with an automated scan
//             </p>
//             <button
//               onClick={() => router("/auto/scan")}
//               className="mt-auto bg-transparent border hover:bg-[#5986E7] hover:text-white px-4 py-2 rounded-lg transition-colors duration-300"
//             >
//               Proceed with Quick Scan
//             </button>
//           </div>

//           {/* Manual Entry Option */}
//           <div className="w-full md:w-[390px] hover:text-blue-600 border p-6 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col items-center text-center">
//             <NotebookPen size={90} className="mb-4" />
//             <h3 className="text-gray-800 text-xl font-medium">
//               Enter Manually
//             </h3>
//             <p className="text-gray-800 mb-4">
//               Enter details manually for a personalized experience
//             </p>
//             <button
//               onClick={() => router("/option/manual")}
//               className="mt-auto bg-transparent border hover:bg-[#5986E7] hover:text-white px-4 py-2 rounded-lg transition-colors duration-300"
//             >
//               Proceed with Manual Entry
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Options;

import { useNavigate } from "react-router-dom";
import { NotebookPen, ScanQrCode } from "lucide-react";

const Options = () => {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Preferred Option
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the method that best suits your needs. Both options provide comprehensive results tailored to your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Scan Option */}
          <div className="group relative">
            <div className="h-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ScanQrCode size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Quick Scan
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Initiate an automated system scan for quick and efficient results. Perfect for routine checks and basic assessments.
                </p>
                <button
                  onClick={() => router("/auto/scan")}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none"
                >
                  Start Quick Scan
                </button>
              </div>
              <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-blue-100 transition-colors duration-300" />
            </div>
          </div>

          {/* Manual Entry Option */}
          <div className="group relative">
            <div className="h-full bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <NotebookPen size={32} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Manual Entry
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Input your details manually for a more customized and thorough analysis. Ideal for specific requirements and detailed assessments.
                </p>
                <button
                  onClick={() => router("/option/manual")}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 focus:outline-none"
                >
                  Start Manual Entry
                </button>
              </div>
              <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-purple-100 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;

