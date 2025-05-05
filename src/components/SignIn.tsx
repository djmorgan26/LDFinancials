import React, { useState, useEffect, useRef } from 'react';
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
  const taglineRef = useRef<HTMLDivElement>(null);
  
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
  
  // Set up the glow effect
  useEffect(() => {
    const tagline = taglineRef.current;
    if (!tagline) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = tagline.getBoundingClientRect();
      
      // Calculate the position of the mouse relative to the tagline
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate the center position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate the distance from the center (for radial effect)
      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      
      // Create a radial gradient that follows the mouse
      tagline.style.backgroundImage = `
        radial-gradient(
          circle at ${mouseX}px ${mouseY}px,
          #00ff00 0%,
          rgba(0, 255, 0, 0.8) 10%,
          rgba(255, 255, 255, 0.9) 25%,
          rgba(255, 255, 255, 0.7) 50%,
          rgba(255, 255, 255, 0.5) 75%
        )
      `;
      
      // Add a subtle 3D tilt effect based on mouse position
      const tiltX = (distY / centerY) * 5; // Max 5 degrees tilt
      const tiltY = -(distX / centerX) * 5; // Negative for correct tilt direction
      
      tagline.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    
    // Set initial gradient
    tagline.style.backgroundImage = `
      radial-gradient(
        circle at 50% 50%,
        #00ff00 0%,
        rgba(0, 255, 0, 0.8) 10%,
        rgba(255, 255, 255, 0.9) 25%,
        rgba(255, 255, 255, 0.7) 50%,
        rgba(255, 255, 255, 0.5) 75%
      )
    `;
    
    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center rounded-2xl overflow-hidden shadow-2xl">
        {/* Tagline Section - Takes up most space */}
        <div 
          ref={taglineRef}
          className="w-full md:w-2/3 h-64 md:h-auto p-8 flex items-center justify-center bg-clip-text bg-blend-screen transition-transform duration-200 ease-out"
          style={{ 
            backgroundColor: 'transparent',
            minHeight: '50vh'
          }}
        >
          <h1 className="text-transparent text-4xl md:text-6xl lg:text-7xl font-bold text-center leading-tight">
            Artificial Finance<br/>Powered By AI
          </h1>
        </div>
        
        {/* Sign-in Form Section */}
        <div 
          className={`w-full md:w-1/3 bg-gray-900 p-6 md:p-8 self-stretch flex flex-col transition-all duration-300 ${
            isHovered
              ? 'shadow-xl shadow-green-800 border-l border-green-500 border-opacity-50'
              : 'shadow-lg shadow-green-200 border-l border-green-500 border-opacity-30'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-center mb-6">
            <img src={logo} alt="AI Finance Logo" className="h-16 md:h-20" />
          </div>
          
          <form className="space-y-4 flex-grow" onSubmit={handleFormSubmit}>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: '2px solid green', 
                  borderRadius: '12px', 
                  color: 'white',
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
                }}
                className="w-full px-3 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Email"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: '2px solid green', 
                  borderRadius: '12px', 
                  color: 'white',
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
                }}
                className="w-full px-3 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-medium transition-colors duration-300"
            >
              Sign In
            </button>
            
            {/* Divider with text */}
            <div className="relative flex items-center justify-center mt-4 mb-3">
              <div className="flex-grow border-t border-green-300 opacity-30"></div>
              <span className="flex-shrink mx-3 text-green-300 text-xs">or</span>
              <div className="flex-grow border-t border-green-300 opacity-30"></div>
            </div>
            
            {/* Google sign-in button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center bg-transparent border-2 border-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 hover:bg-opacity-10 focus:outline-none transition-all duration-300"
            >
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;