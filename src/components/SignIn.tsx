import React, { useState } from 'react';
import logo from '../assets/AI_Finance_logo_nobackground_allgreen.png';

const SignIn: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div className="flex items-center justify-center h-screen">
        <div
          className={`w-full max-w-md p-12 rounded-lg duration-300 ${
            isHovered ? 'shadow-xl shadow-green-800 border border-green-500 border-opacity-50' : 'shadow-lg shadow-green-200 border border-green-500 border-opacity-50'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)} style={{ backgroundColor: 'transparent' }}
        >
          <div className="flex justify-center mb-10">
            <img src={logo} alt="AI Finance Logo" className="h-32" />
          </div>
          <form className="space-y-6">
             <div className="relative" >
            
            <label htmlFor="email" className="hidden text-gray-700">
                Email
              </label>
           
             <div className="absolute top-0 left-0 h-4 w-4 bg-transparent"></div>
             <div className="absolute top-0 right-0 h-4 w-4 bg-transparent"></div>
              <input
                type="email"
                id="email" style={{ background: 'transparent', border: '2px solid green', borderRadius: '15px', color: 'white' }}
                className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter your email"
                required
              />
        </div>
        <div>
          <label htmlFor="password" className="hidden text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password" style={{ background: 'transparent', border: '2px solid green', borderRadius: '15px', color: 'white' }}
            className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;