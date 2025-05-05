import React, { useState, useEffect } from 'react';
import { Auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/AI_Finance_logo_nobackground_allgreen.png';

const provider = new GoogleAuthProvider();

interface SignInProps {
  auth: Auth;
}

const SignIn: React.FC<SignInProps> = ({ auth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Trigger loading screen and handle Google sign-in
  const handleGoogleSignIn = async () => {
    // Dispatch custom event to trigger loading screen
    window.dispatchEvent(new Event('signInAttempt'));
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };
  
  // Handle regular email/password sign-in
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dispatch custom event to trigger loading screen
    window.dispatchEvent(new Event('signInAttempt'));
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email/password", error);
    }
  };

  useEffect(() => {
    const tagline = document.getElementById('tagline');
    const handleMouseMove = (e: MouseEvent) => {
        if (tagline) {
            const x = e.clientX;
            const width = window.innerWidth;
            const percentX = Math.round((x / width) * 100);
            tagline.style.backgroundImage = `linear-gradient(to right, #ffffff, #00ff00 ${percentX}%, #ffffff)`;
        }
    };

    // Wait for the next tick to ensure DOM is ready
    requestAnimationFrame(() => {
        document.addEventListener('mousemove', handleMouseMove);
    });

    // Cleanup function to remove event listener
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
    };
}, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div id="tagline" className="text-white text-center text-6xl my-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-green-500 to-white">
        Reimagine your finances with the power of AI
      </div>
      <div
        className={`w-full max-w-sm p-8 rounded-lg duration-300 ${
          isHovered
            ? 'shadow-xl shadow-green-800 border border-green-500 border-opacity-50'
            : 'shadow-lg shadow-green-200 border border-green-500 border-opacity-50'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)} 
        style={{ backgroundColor: 'transparent' }}>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="AI Finance Logo" className="h-24" />
          </div>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
             <div className="relative">
              <label htmlFor="email" className="hidden text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'transparent', border: '2px solid green', borderRadius: '15px', color: 'white' }}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
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
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                style={{ background: 'transparent', border: '2px solid green', borderRadius: '15px', color: 'white' }}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
              Sign In
            </button>
            
            {/* Divider with text */}
            <div className="relative flex items-center justify-center mt-4 mb-3">
              <div className="flex-grow border-t border-green-300 opacity-30"></div>
              <span className="flex-shrink mx-3 text-green-300 text-xs">Other sign-in options</span>
              <div className="flex-grow border-t border-green-300 opacity-30"></div>
            </div>
            
            {/* Google sign-in button as logo */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none transition-all duration-300"
                aria-label="Sign in with Google"
              >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24"
                  className="google-icon"
                >
                  <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4" 
                  />
                  <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853" 
                  />
                  <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05" 
                  />
                  <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335" 
                  />
                </svg>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default SignIn;