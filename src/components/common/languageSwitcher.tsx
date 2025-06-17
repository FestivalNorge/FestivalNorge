import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/languageContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

const LANGUAGES = [
  { code: 'no', label: 'Norsk' },
  { code: 'en', label: 'English' }
] as const;

// Map our language codes to the corresponding country codes for flag-icons
const COUNTRY_CODES: Record<string, string> = {
  no: 'no',  // Norway
  en: 'gb'   // United Kingdom
};

/**
 * Language dropdown that
 * 1. switches i18next via useLanguage()
 * 2. writes the choice to localStorage ("preferredLanguage")
 * 3. rewrites the URL prefix so routing stays consistent
 */
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: (typeof LANGUAGES)[number]['code']) => {
    setLanguage(code);
    localStorage.setItem('preferredLanguage', code);
    // rewrite URL prefix
    const segments = location.pathname.split('/').slice(2);
    navigate(`/${code}/${segments.join('/')}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Header trigger: globe, selected flag, and label */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 px-4 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition"
      >
        {/* Selected language flag */}
        <span className={`fi fi-${COUNTRY_CODES[language]} rounded-full w-5 h-5`} />
        {/* Selected language label */}
        <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === language)?.label}</span>
      </button>

      {open && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
          <ul className="py-0">
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => handleSelect(l.code)}
                  className={`flex w-full items-center gap-4 px-10 py-2 text-sm hover:bg-gray-100 transition ${language === l.code ? 'bg-gray-100 font-semibold' : ''}`}
                >
                  <span className={`fi fi-${COUNTRY_CODES[l.code]} rounded-full w-4 h-4`} />
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
