import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading Auditly.ai</h2>
        <p className="text-gray-500">Please wait while we verify your credentials...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
