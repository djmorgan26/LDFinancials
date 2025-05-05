import SignIn from './components/SignIn';
import Header from './components/Header';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

// Create a component to handle the auth state
const AuthHandler = ({ auth }: { auth: Auth }) => {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);
    });
    
    return () => unsubscribe();
  }, [auth]);

  // Handle sign-in attempts
  useEffect(() => {
    // Create a global event listener for sign-in attempts
    const handleSignInAttempt = () => {
      setIsLoading(true);
      
      // Always show loading for at least 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
    
    // Listen for custom event from SignIn component
    window.addEventListener('signInAttempt', handleSignInAttempt);
    
    return () => {
      window.removeEventListener('signInAttempt', handleSignInAttempt);
    };
  }, []);

  // Initial loading before we know auth state
  if (signedIn === null) {
    return null; // Or a minimal initial loader if needed
  }

  // Show loading screen during transition
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If on root path and signed in, show Header
  if (location.pathname === '/' && signedIn) {
    return <Header auth={auth} />;
  }
  
  // If not signed in or on sign in page, show SignIn
  return <SignIn auth={auth} />;
};

function App({ auth }: { auth: Auth }) {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="*" element={<AuthHandler auth={auth} />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;