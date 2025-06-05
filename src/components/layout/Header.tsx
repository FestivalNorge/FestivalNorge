import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <Link 
              to="/"
              className={`font-medium transition-colors hover:text-accent-500 text-gray-700`}
            >
              Hjem
            </Link>
            <Link 
              to="/festivals"
              className={`font-medium transition-colors hover:text-accent-500 text-gray-700`}
            >
              Festivaler
            </Link>
            <Link 
              to="/calendar"
              className={`font-medium transition-colors hover:text-accent-500 text-gray-700`}
            >
              Kalender
            </Link>
            <Link 
              to="/map"
              className={`font-medium transition-colors hover:text-accent-500 text-gray-700`}
            >
              Kart
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <nav className="md:hidden py-4 border-t mt-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                className="font-medium text-gray-200 hover:text-accent-400 py-2"
              >
                Hjem
              </Link>
              <Link 
                to="/festivals"
                className="font-medium text-gray-200 hover:text-accent-400 py-2"
              >
                Festivaler
              </Link>
              <Link 
                to="/calendar"
                className="font-medium text-gray-200 hover:text-accent-400 py-2"
              >
                Kalender
              </Link>
              <Link 
                to="/map"
                className="font-medium text-gray-200 hover:text-accent-400 py-2"
              >
                Kart
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;