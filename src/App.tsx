import SignIn from './components/SignIn';
import Header from './components/Header';
import { onAuthStateChanged, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useState, useEffect, JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

// Optional setup for persistent authentication across browser sessions
const setupPersistence = async (auth: Auth) => {
  try {
    // This ensures the user stays signed in even after browser restart
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error("Error setting persistence:", error);
  }
};

// Protected route component
const ProtectedRoute = ({ auth, children }: { auth: Auth; children: JSX.Element }) => {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <LoadingScreen />;
  
  if (!signedIn) return <Navigate to="/signin" />;
  
  return children;
};

function App({ auth }: { auth: Auth }) {
  const [user, setUser] = useState<any>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Set up firebase persistence
  useEffect(() => {
    setupPersistence(auth);
  }, [auth]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitialLoading(false);
    });
    
    return () => unsubscribe();
  }, [auth]);

  // Global listener for sign-in attempts
  useEffect(() => {
    const handleSignInAttempt = () => {
      setIsSigningIn(true);
      
      // Show loading for at least 3 seconds
      setTimeout(() => {
        setIsSigningIn(false);
      }, 3000);
    };
    
    window.addEventListener('signInAttempt', handleSignInAttempt);
    
    return () => {
      window.removeEventListener('signInAttempt', handleSignInAttempt);
    };
  }, []);

  // Show loading during initial app load or signing in
  if (initialLoading || isSigningIn) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn auth={auth} />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute auth={auth}>
              <Header auth={auth} />
            </ProtectedRoute>
          } />
          
          {/* Add more protected routes here */}
          <Route path="/dashboard" element={
            <ProtectedRoute auth={auth}>
              <div>Dashboard Page</div>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute auth={auth}>
              <div>Reports Page</div>
            </ProtectedRoute>
          } />
          
          {/* Catch all other routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;