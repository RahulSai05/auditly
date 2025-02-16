// import { useNavigate } from "react-router-dom";
// import { NotebookPen, ScanQrCode } from "lucide-react";
// const Options = () => {
//   const router = useNavigate();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[75vh] bg-gray-100 p-6">
//       <h2 className="text-3xl mb-6">Choose the best Option for your needs</h2>
//       <div className="grid md:flex gap-6">
//         {/* Quick Scan Option */}
//         <div className="w-[390px] border p-6 hover:text-blue-600 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col">
//           <ScanQrCode size={90} />
//           <h3 className="text-gray-800 text-xl my-5 font-medium">Quick Scan</h3>
//           <p className="text-gray-800 text-md mb-4">
//             Quickly scan your system with an automated scan
//           </p>
//           <button
//             onClick={() => router("/auto/scan")} // ✅ Navigates to Quick Scan page
//             className="hover:bg-[#5986E7] mt-5 border  hover:text-white px-4 py-2 rounded-lg "
//           >
//             Proceed with Quick Scan
//           </button>
//         </div>

//         {/* Manual Entry Option */}
//         <div className="w-[390px] hover:text-blue-600 border p-6 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col">
//           <NotebookPen size={90} />
//           <h3 className="text-gray-800 text-xl my-5 font-medium">
//             Enter Manually
//           </h3>
//           <p className="text-gray-800 text-md mb-4">
//             Enter details manually for a personalized experience
//           </p>
//           <button
//             onClick={() => router("/option/manual")} // ✅ Removed space issue
//             className="hover:bg-[#5986E7] mt-5 border  hover:text-white px-4 py-2 rounded-lg "
//           >
//             Proceed with Manual Entry
//           </button>
//         </div>
//       </div>
//     </div>
//   );


import { useNavigate } from "react-router-dom";
import { NotebookPen, ScanQrCode } from "lucide-react";
const Options = () => {
  const router = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] bg-gray-100 p-6">
      <h2 className="text-3xl mb-6">Choose the best Option for your needs</h2>
      <div className="grid md:flex gap-6">
        {/* Quick Scan Option */}
        <div className="w-[390px] border p-6 hover:text-blue-600 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col">
          <ScanQrCode size={90} />
          <h3 className="text-gray-800 text-xl my-5 font-medium">Quick Scan</h3>
          <p className="text-gray-800 text-md mb-4">
            Quickly scan your system with an automated scan
          </p>
          <button
            onClick={() => router("/auto/scan")} // ✅ Navigates to Quick Scan page
            className="hover:bg-[#5986E7] mt-5 border  hover:text-white px-4 py-2 rounded-lg "
          >
            Proceed with Quick Scan
          </button>
        </div>

        {/* Manual Entry Option */}
        <div className="w-[390px] hover:text-blue-600 border p-6 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col">
          <NotebookPen size={90} />
          <h3 className="text-gray-800 text-xl my-5 font-medium">
            Enter Manually
          </h3>
          <p className="text-gray-800 text-md mb-4">
            Enter details manually for a personalized experience
          </p>
          <button
            onClick={() => router("/option/manual")} // ✅ Removed space issue
            className="hover:bg-[#5986E7] mt-5 border  hover:text-white px-4 py-2 rounded-lg "
          >
            Proceed with Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Options;
// };

// export default Options;
