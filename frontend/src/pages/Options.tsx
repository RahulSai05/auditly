
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ScanQrCode, NotebookPen } from 'lucide-react';

// const Options = () => {
//   const router = useNavigate();

//   return (
//     <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
//       <h2 className="text-3xl mb-6">Choose the best Option for your needs</h2>
//       <div className="flex flex-wrap justify-center gap-6">
//         <OptionCard
//           icon={<ScanQrCode size={90} />}
//           title="Quick Scan"
//           description="Quickly scan your system with an automated scan"
//           onClick={() => router("/auto/scan")}
//         />
//         <OptionCard
//           icon={<NotebookPen size={90} />}
//           title="Enter Manually"
//           description="Enter details manually for a personalized experience"
//           onClick={() => router("/option/manual")}
//         />
//       </div>
//     </div>
//   );
// };

// const OptionCard = ({ icon, title, description, onClick }) => (
//   <div className="w-full md:w-[390px] border p-6 hover:text-blue-600 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col items-center text-center">
//     {icon}
//     <h3 className="text-xl my-5">{title}</h3>
//     <p>{description}</p>
//     <button
//       onClick={onClick}
//       className="mt-auto bg-transparent hover:bg-[#5986E7] border border-transparent hover:text-white px-4 py-2 rounded-lg transition-colors"
//     >
//       Proceed
//     </button>
//   </div>
// );

// export default Options;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanQrCode, NotebookPen } from 'lucide-react';

const Options = () => {
  const router = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
      <h2 className="text-3xl mb-6">Choose the best Option for your needs</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <OptionCard
          icon={<ScanQrCode size={90} />}
          title="Quick Scan"
          description="Quickly scan your system with an automated scan"
          onClick={() => router("/auto/scan")}
          buttonStyle="hover:bg-[#5986E7] mt-5 border hover:text-white px-4 py-2 rounded-lg"
        />
        <OptionCard
          icon={<NotebookPen size={90} />}
          title="Enter Manually"
          description="Enter details manually for a personalized experience"
          onClick={() => router("/option/manual")}
          buttonStyle="hover:bg-[#5986E7] mt-5 border hover:text-white px-4 py-2 rounded-lg"
        />
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, description, onClick, buttonStyle }) => (
  <div className="w-full md:w-[390px] border p-6 hover:text-blue-600 bg-[#F9FAFB] shadow-2xl h-[329px] rounded-lg flex flex-col items-center text-center">
    {icon}
    <h3 className="text-xl my-5">{title}</h3>
    <p>{description}</p>
    <button
      onClick={onClick}
      className={`bg-transparent ${buttonStyle} transition-colors`}
    >
      Proceed
    </button>
  </div>
);

export default Options;

