import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Custom Link component that scrolls to top when clicked
const ScrollLink: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md"
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-heading font-bold text-primary-500">
              FestivalNorge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ScrollLink 
              to="/"
              className="font-medium transition-colors hover:text-accent-500 text-gray-700"
            >
              Home
            </ScrollLink>
            <ScrollLink 
              to="/festivals"
              className="font-medium transition-colors hover:text-accent-500 text-gray-700"
            >
              Festivals
            </ScrollLink>
            <ScrollLink 
              to="/calendar"
              className="font-medium transition-colors hover:text-accent-500 text-gray-700"
            >
              Calendar
            </ScrollLink>
            <ScrollLink 
              to="/map"
              className="font-medium transition-colors hover:text-accent-500 text-gray-700"
            >
              Map
            </ScrollLink>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <ScrollLink 
                  to="/my-festivals"
                  className={`font-medium transition-colors hover:text-accent-500 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  My Festivals
                </ScrollLink>
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <span className="font-medium text-primary-500">
                    {user?.name}
                  </span>
                  <button 
                    onClick={logout}
                    className="p-1 rounded-full hover:bg-gray-100 group-hover:text-accent-500"
                    aria-label="Log out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                className="font-medium text-gray-700 hover:text-accent-500 py-2"
              >
                Home
              </Link>
              <Link 
                to="/festivals"
                className="font-medium text-gray-700 hover:text-accent-500 py-2"
              >
                Festivals
              </Link>
              <Link 
                to="/calendar"
                className="font-medium text-gray-700 hover:text-accent-500 py-2"
              >
                Calendar
              </Link>
              <Link 
                to="/map"
                className="font-medium text-gray-700 hover:text-accent-500 py-2"
              >
                Map
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/my-festivals"
                    className="font-medium text-gray-700 hover:text-accent-500 py-2"
                  >
                    My Festivals
                  </Link>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-primary-500">
                        {user?.name}
                      </span>
                    </div>
                    <button 
                      onClick={logout}
                      className="text-accent-500 hover:text-accent-600 flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary w-full mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;