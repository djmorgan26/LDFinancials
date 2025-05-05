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
  // State to track if mobile menu is open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // References to detect clicks outside the dropdown
  const accountRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      setOpenDropdown(null);
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
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close any open dropdowns when toggling mobile menu
    setOpenDropdown(null);
  };
  
  // Handle clicks outside the dropdowns and mobile menu to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside all dropdown menus
      const isOutsideAccount = accountRef.current && !accountRef.current.contains(event.target as Node);
      const isOutsideDashboard = dashboardRef.current && !dashboardRef.current.contains(event.target as Node);
      const isOutsideReports = reportsRef.current && !reportsRef.current.contains(event.target as Node);
      const isOutsideMobileMenu = mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node);
      
      if (isOutsideAccount && isOutsideDashboard && isOutsideReports) {
        setOpenDropdown(null);
      }
      
      if (isOutsideMobileMenu && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  // Close mobile menu on window resize (if screen becomes larger)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center">
              <img src={logo} alt="AI Finance Logo" className="h-8 md:h-10 mr-2 md:mr-3" />
              <h1 className="text-xl md:text-2xl font-bold text-green-400 truncate">Artificial Finance</h1>
            </div>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Overview</Link>
                  <Link to="/dashboard/transactions" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Transactions</Link>
                  <Link to="/dashboard/budgets" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Budgets</Link>
                  <Link to="/dashboard/goals" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Financial Goals</Link>
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
                  <Link to="/reports/monthly" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Monthly Summary</Link>
                  <Link to="/reports/spending" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Spending Analysis</Link>
                  <Link to="/reports/income" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Income Trends</Link>
                  <Link to="/reports/investments" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Investment Performance</Link>
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
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Settings</Link>
                  <Link to="/connected-accounts" className="block px-4 py-2 text-sm hover:bg-gray-700 transition-colors">Connected Accounts</Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden mt-3 bg-gray-800 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
          >
            {/* Dashboard Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleDropdown('mobile-dashboard')}
                className="flex items-center justify-between w-full px-4 py-3 text-left"
              >
                <span className="font-medium">Dashboard</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'mobile-dashboard' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openDropdown === 'mobile-dashboard' && (
                <div className="bg-gray-900 py-1 pl-8">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Overview
                  </Link>
                  <Link 
                    to="/dashboard/transactions" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Transactions
                  </Link>
                  <Link 
                    to="/dashboard/budgets" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Budgets
                  </Link>
                  <Link 
                    to="/dashboard/goals" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Financial Goals
                  </Link>
                </div>
              )}
            </div>
            
            {/* Reports Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleDropdown('mobile-reports')}
                className="flex items-center justify-between w-full px-4 py-3 text-left"
              >
                <span className="font-medium">Reports</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'mobile-reports' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openDropdown === 'mobile-reports' && (
                <div className="bg-gray-900 py-1 pl-8">
                  <Link 
                    to="/reports/monthly" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Monthly Summary
                  </Link>
                  <Link 
                    to="/reports/spending" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Spending Analysis
                  </Link>
                  <Link 
                    to="/reports/income" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Income Trends
                  </Link>
                  <Link 
                    to="/reports/investments" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Investment Performance
                  </Link>
                </div>
              )}
            </div>
            
            {/* Account Section */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-account')}
                className="flex items-center justify-between w-full px-4 py-3 text-left"
              >
                <span className="font-medium">Account</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform ${openDropdown === 'mobile-account' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openDropdown === 'mobile-account' && (
                <div className="bg-gray-900 py-1 pl-8">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Settings
                  </Link>
                  <Link 
                    to="/connected-accounts" 
                    className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    Connected Accounts
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setOpenDropdown(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;