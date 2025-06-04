import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-accent-500" />
              <span className="text-xl font-heading font-bold">FestivalNorge</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Your one-stop destination for discovering the best music and cultural festivals across Norway.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" className="text-gray-400 hover:text-accent-500 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-accent-500 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-accent-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/festivals" className="text-gray-400 hover:text-accent-500 transition-colors">
                  All Festivals
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Festival Calendar
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Festival Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Festival Genres</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/festivals?genre=rock" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Rock
                </Link>
              </li>
              <li>
                <Link to="/festivals?genre=pop" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Pop
                </Link>
              </li>
              <li>
                <Link to="/festivals?genre=electronic" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Electronic
                </Link>
              </li>
              <li>
                <Link to="/festivals?genre=jazz" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Jazz
                </Link>
              </li>
              <li>
                <Link to="/festivals?genre=folk" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Folk
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to get the latest updates on festivals.
            </p>
            <form className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-3 py-2 bg-gray-800 rounded-l-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
                <button
                  type="submit"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} FestivalNorge. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;