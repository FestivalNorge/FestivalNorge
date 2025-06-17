import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    UC_UI?: {
      showSecondLayer: () => void;
    };
  }
}

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          {/* Brand */}
          <div className="space-y-2">
          <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-accent-500" />
              <span className="text-xl font-heading font-bold">{t("footer.title")}</span>
            </div>
            <p className="text-gray-400 max-w-xs">
            {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <ul className="space-y-2">
              <li>
                <Link to={`/${i18n.language}/home`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  {t("footer.pages.home")}
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/festivals`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  {t("footer.pages.festivals")}
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/calendar`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  {t("footer.pages.calendar")}
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/map`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  {t("footer.pages.map")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <ul className="space-y-2">
              <li>
                <Link to={`/${i18n.language}/festivals?genre=rock`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  Rock
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/festivals?genre=pop`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  Pop
                </Link>
              </li>
              <li>
                <Link to= {`/${i18n.language}/festivals?genre=electronic`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  Electronic
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/festivals?genre=jazz`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  Jazz
                </Link>
              </li>
              <li>
                <Link to={`/${i18n.language}/festivals?genre=folk`} className="text-gray-400 hover:text-accent-500 transition-colors">
                  Folk
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-gray-400 mb-4">
              {t("footer.newsletter.title")}
            </p>
            <form className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
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
                {t("footer.newsletter.disclaimer")}
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
                {t("footer.info.cookies")}
              </button>
              <Link to={`/${i18n.language}/privacy`} className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                {t("footer.info.privacy")}
              </Link>
              <Link to={`/${i18n.language}/terms`} className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                {t("footer.info.terms")}
              </Link>
              <Link to={`/${i18n.language}/contact`} className="text-gray-400 hover:text-accent-500 text-sm transition-colors">
                {t("footer.info.contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;