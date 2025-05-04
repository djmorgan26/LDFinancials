import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 flex items-center justify-center z-50">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
};

export default LoadingScreen;