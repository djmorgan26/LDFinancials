import { Auth, signOut } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGaugeHigh, 
  faMoneyBillTransfer, 
  faChartColumn, 
  faUserCircle, 
  faIdCard, 
  faGear, 
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/AI_Finance_logo_nobackground_allgreen.png';


interface HeaderProps {
  auth: Auth;
}

// Define the link types for TypeScript
interface Link {
  text: string;
  url: string;
  icon: string;
}

interface DropdownOption {
  text: string;
  url: string;
  icon: string;
}

export default function Header({ auth }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountRef = useRef<HTMLLIElement>(null);

  const title = "L&D Financial Dashboard";
  
  const links: Link[] = [
    { text: 'Dashboard', url: '/', icon: 'fa-gauge-high' },
    { text: 'Transactions', url: '/transactions', icon: 'fa-money-bill-transfer' },
    { text: 'Reports', url: '/reports', icon: 'fa-chart-column' },
    { text: 'Account', url: '/account', icon: 'fa-user-circle' },
  ];

  const accountDropdownOptions: DropdownOption[] = [
    { text: 'Profile', url: '/profile', icon: 'fa-id-card' },
    { text: 'Settings', url: '/settings', icon: 'fa-gear' },
    { text: 'Sign Out', url: '/signout', icon: 'fa-right-from-bracket' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Map icons to their corresponding FontAwesome icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fa-gauge-high':
        return faGaugeHigh;
      case 'fa-money-bill-transfer':
        return faMoneyBillTransfer;
      case 'fa-chart-column':
        return faChartColumn;
      case 'fa-user-circle':
        return faUserCircle;
      case 'fa-id-card':
        return faIdCard;
      case 'fa-gear':
        return faGear;
      case 'fa-right-from-bracket':
        return faRightFromBracket;
      default:
        return faUserCircle;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="fixed w-full top-0 left-0 bg-gray-900 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Business Logo & Title */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Business Logo" 
                className="h-16 w-16 mr-2" 
                onError={({ currentTarget }) => { currentTarget.style.display = 'none';
                }}
              /> 
              <h1 className="text-xl font-bold text-green-400">{title}</h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              {links.map((link, index) => ( 
                <li key={index} ref={link.text === 'Account' ? accountRef : null}>
                  {link.text === 'Account' ? (
                    <div
                      className="relative text-gray-300 hover:text-green-400 cursor-pointer"
                      onMouseEnter={() => setIsAccountDropdownOpen(true)}
                      onMouseLeave={() => setIsAccountDropdownOpen(false)}
                    >
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={getIcon(link.icon)} className="mr-2" />
                        {link.text}                        
                      </div>
                      {isAccountDropdownOpen && (
                        <ul className="absolute right-0 mt-2 py-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg">
                          {accountDropdownOptions.map((option, optionIndex) => (
                            <li key={optionIndex}>
                              {option.text === 'Sign Out' ? (
                                <button
                                  onClick={handleSignOut}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                                >
                                  <FontAwesomeIcon icon={getIcon(option.icon)} className="mr-2" />
                                  {option.text}
                                </button>
                              ) : (
                                <a
                                  href={option.url}
                                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                                >
                                  <div className='flex items-center'>
                                    <FontAwesomeIcon icon={getIcon(option.icon)} className="mr-2" />
                                    {option.text}
                                  </div>
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <a 
                      href={link.url} 
                      className="text-gray-300 hover:text-green-400 transition-colors"
                    >
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={getIcon(link.icon)} className="mr-2" />
                        {link.text}
                      </div>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path 
                  fillRule="evenodd" 
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path 
                  fillRule="evenodd" 
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-gray-800 mt-2">
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  {link.text === 'Account' ? (
                    <div className="py-2">
                      <div 
                        className="flex items-center text-gray-300 hover:text-green-400 cursor-pointer mb-2"
                        onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                      >
                        <FontAwesomeIcon icon={getIcon(link.icon)} className="mr-2" />
                        {link.text}
                      </div>
                      
                      {isAccountDropdownOpen && (
                        <ul className="pl-6 space-y-2 border-l border-gray-700">
                          {accountDropdownOptions.map((option, optionIndex) => (
                            <li key={optionIndex}>
                              {option.text === 'Sign Out' ? (
                                <button
                                  onClick={handleSignOut}
                                  className="w-full text-left py-1 text-gray-300 hover:text-green-400 flex items-center"
                                >
                                  <FontAwesomeIcon icon={getIcon(option.icon)} className="mr-2" />
                                  {option.text}
                                </button>
                              ) : (
                                <a 
                                  href={option.url} 
                                  className="flex items-center py-1 text-gray-300 hover:text-green-400"
                                >
                                  <FontAwesomeIcon icon={getIcon(option.icon)} className="mr-2" />
                                  {option.text}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <a 
                      href={link.url} 
                      className="flex items-center py-2 text-gray-300 hover:text-green-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={getIcon(link.icon)} className="mr-2" />
                      {link.text}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}