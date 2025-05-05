import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/AI_Finance_logo_nobackground_allgreen.png'; // Import your logo

const LoadingScreen: React.FC = () => {
  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-full bg-gray-900 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Your Custom Logo */}
      <motion.div 
        className="mb-12 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
      >
        {/* Logo Image */}
        <img 
          src={logo} 
          alt="AI Finance Logo" 
          className="h-32 w-auto"
        />
      </motion.div>
      
      {/* Skeleton Content */}
      <div className="w-full max-w-2xl px-6">
        {/* Headline Skeleton */}
        <motion.div 
          className="h-8 bg-gray-700 rounded-md w-3/4 mx-auto mb-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        {/* Dashboard Card Skeletons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <motion.div 
              key={item} 
              className="h-28 bg-gray-800 rounded-lg p-4"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: item * 0.2,
                ease: "easeInOut" 
              }}
            >
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-700 rounded-md mt-4"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Loading Bar */}
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-green-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "99%" }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1],
            }}
          ></motion.div>
        </div>
        
        {/* Text */}
        <motion.div 
          className="text-center text-white opacity-80 text-lg"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Preparing your financial insights...
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;