import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music } from 'lucide-react';

// Custom Link component that scrolls to top when clicked
const ScrollLink = ({ to, children, ...props }: any) => {
  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Link to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const handleMenuToggle = () => {
    if (mobileMenuOpen) {
      setIsClosing(true);
      // Wait for the animation to complete before hiding the menu
      setTimeout(() => {
        setMobileMenuOpen(false);
        setIsClosing(false);
      }, 300); // Match this duration with the CSS transition duration
    } else {
      setMobileMenuOpen(true);
    }
  };
  const location = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100 bg-white shadow-md"
      style={{ height: '64px' }}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-heading font-bold text-primary-500">
              FestivalNorge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <ScrollLink 
              to="/"
              className="font-medium text-gray-700 transition-colors hover:text-accent-500"
            >
              Hjem
            </ScrollLink>
            <ScrollLink 
              to="/festivals"
              className="font-medium text-gray-700 transition-colors hover:text-accent-500"
            >
              Festivaler
            </ScrollLink>
            <ScrollLink 
              to="/calendar"
              className="font-medium text-gray-700 transition-colors hover:text-accent-500"
            >
              Kalender
            </ScrollLink>
            <ScrollLink 
              to="/map"
              className="font-medium text-gray-700 transition-colors hover:text-accent-500"
            >
              Kart
            </ScrollLink>
            
            
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed left-0 right-0 z-40 md:hidden"
            style={{
              top: '64px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <nav className={`w-full ${isClosing ? 'animate-slide-up' : 'animate-slide-down'}`}>
              <div className="flex flex-col space-y-1 p-2">
                <Link 
                  to="/"
                  className="font-medium text-gray-700 hover:text-accent-500 py-2 px-4 text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hjem
                </Link>
                <Link 
                  to="/festivals"
                  className="font-medium text-gray-700 hover:text-accent-500 py-2 px-4 text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Festivaler
                </Link>
                <Link 
                  to="/calendar"
                  className="font-medium text-gray-700 hover:text-accent-500 py-2 px-4 text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kalender
                </Link>
                <Link 
                  to="/map"
                  className="font-medium text-gray-700 hover:text-accent-500 py-2 px-4 text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kart
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;