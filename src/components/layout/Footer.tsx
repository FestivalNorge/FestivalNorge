import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail } from 'lucide-react';

declare global {
  interface Window {
    UC_UI?: {
      showSecondLayer: () => void;
    };
  }
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          {/* Brand */}
          <div className="space-y-2">
          <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-accent-500" />
              <span className="text-xl font-heading font-bold">StageFinder</span>
            </div>
            <p className="text-gray-400 max-w-xs">
            Din destinasjon for å oppdage de beste musikk- og kulturfestivalene i hele Norge.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Hjem
                </Link>
              </li>
              <li>
                <Link to="/festivals" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Alle Festivaler
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Festival Kalender
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Festival Kart
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
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
            <p className="text-gray-400 mb-4">
              Abonner på vårt nyhetsbrev for å få oppdatert informasjon om festivaler.
            </p>
            <form className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Din e-postadresse"
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
                Vi respekterer ditt personvern. Du kan avslutte når du vil.
              </p>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} StageFinder
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => window.UC_UI && window.UC_UI.showSecondLayer()}
                className="text-gray-400 hover:text-accent-500 text-sm transition-colors"
              >
                Administrer cookies
              </button>
              <Link to="/privacy" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Personvern
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Vilkår og betingelser
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                Kontakt Oss
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;