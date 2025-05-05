import React, { useState, useEffect, useRef } from 'react';
import { Auth, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import logo from '../assets/AI_Finance_logo_nobackground_allgreen.png';

interface HeaderProps {
  auth: Auth;
}

const Header: React.FC<HeaderProps> = ({ auth }) => {
  // State to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // References to detect clicks outside the dropdown
  const accountRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Toggle dropdown menu
  const toggleDropdown = (menu: string) => {
    if (openDropdown === menu) {
      setOpenDropdown(null); // Close if it's already open
    } else {
      setOpenDropdown(menu); // Open the clicked menu
    }
  };
  
  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside all dropdown menus
      const isOutsideAccount = accountRef.current && !accountRef.current.contains(event.target as Node);
      const isOutsideDashboard = dashboardRef.current && !dashboardRef.current.contains(event.target as Node);
      const isOutsideReports = reportsRef.current && !reportsRef.current.contains(event.target as Node);
      
      if (isOutsideAccount && isOutsideDashboard && isOutsideReports) {
        setOpenDropdown(null);
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
          <div className="flex items-center">
            <img src={logo} alt="AI Finance Logo" className="h-12 mr-4" />
            <h1 className="text-2xl font-bold text-green-400">Artificial Finance</h1>
          </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {/* Dashboard Dropdown */}
            <div className="relative" ref={dashboardRef}>
              <button 
                onClick={() => toggleDropdown('dashboard')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-md ${
                  openDropdown === 'dashboard' 
                    ? 'bg-green-700 text-white' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <span>Dashboard</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'dashboard' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dashboard Dropdown Menu */}
              {openDropdown === 'dashboard' && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-700">Overview</Link>
                  <Link to="/dashboard/transactions" className="block px-4 py-2 text-sm hover:bg-gray-700">Transactions</Link>
                  <Link to="/dashboard/budgets" className="block px-4 py-2 text-sm hover:bg-gray-700">Budgets</Link>
                  <Link to="/dashboard/goals" className="block px-4 py-2 text-sm hover:bg-gray-700">Financial Goals</Link>
                </div>
              )}
            </div>
            
            {/* Reports Dropdown */}
            <div className="relative" ref={reportsRef}>
              <button 
                onClick={() => toggleDropdown('reports')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-md ${
                  openDropdown === 'reports' 
                    ? 'bg-green-700 text-white' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <span>Reports</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'reports' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Reports Dropdown Menu */}
              {openDropdown === 'reports' && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link to="/reports/monthly" className="block px-4 py-2 text-sm hover:bg-gray-700">Monthly Summary</Link>
                  <Link to="/reports/spending" className="block px-4 py-2 text-sm hover:bg-gray-700">Spending Analysis</Link>
                  <Link to="/reports/income" className="block px-4 py-2 text-sm hover:bg-gray-700">Income Trends</Link>
                  <Link to="/reports/investments" className="block px-4 py-2 text-sm hover:bg-gray-700">Investment Performance</Link>
                </div>
              )}
            </div>
            
            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button 
                onClick={() => toggleDropdown('account')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-md ${
                  openDropdown === 'account' 
                    ? 'bg-green-700 text-white' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <span>Account</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'account' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Account Dropdown Menu */}
              {openDropdown === 'account' && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-700">Settings</Link>
                  <Link to="/connected-accounts" className="block px-4 py-2 text-sm hover:bg-gray-700">Connected Accounts</Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;