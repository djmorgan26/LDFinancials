import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
  logo?: string;
  links?: { text: string; url: string }[];
}

const Header: React.FC<HeaderProps> = ({
  title = 'My App',
  logo,
  links = [
    { text: 'Home', url: '/' },
    { text: 'About', url: '/about' },
    { text: 'Contact', url: '/contact' },
  ],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-gray-100 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center">
          {logo ? (
            <img src={logo} alt={`${title} logo`} className="h-8 w-auto" />
          ) : (
            <span className="text-xl font-bold text-indigo-400">{title}</span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url} 
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <nav className="px-4 py-3">
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="block py-2 text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;