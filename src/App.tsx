import { useState, useEffect, JSX } from 'react';
import { Auth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import SignIn from './components/SignIn';
import Header from './components/Header';
import Profile from './components/Profile';
import LoadingScreen from './components/LoadingScreen';
import FinancialDashboard from './components/FinancialDashboard';

// Set up Firebase persistent authentication
const setupPersistence = async (auth: Auth) => {
  try {
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

// Dashboard component that includes Header and FinancialDashboard
const Dashboard = ({ auth }: { auth: Auth }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header auth={auth} />
      <FinancialDashboard auth={auth} />
    </div>
  );
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
              <Dashboard auth={auth} />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute auth={auth}>
              <Profile auth={auth} />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute auth={auth}>
              <Dashboard auth={auth} />
            </ProtectedRoute>
          } />
          
          {/* Add more routes as needed */}
          
          {/* Catch all other routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;