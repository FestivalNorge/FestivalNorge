import i18n from 'i18next';
import HttpBackend          from 'i18next-http-backend';
import LanguageDetector     from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    /* ----------------------------------
       Languages
    ---------------------------------- */
    supportedLngs: ['no', 'en'],
    fallbackLng: 'no',               // ← always fall back to Norwegian
    // we’ll override initialLng via localStorage check below

    /* ----------------------------------
       Namespaces
    ---------------------------------- */
    ns: ['translation'],
    defaultNS: 'translation',

    /* ----------------------------------
       Backend path
    ---------------------------------- */
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },

    /* ----------------------------------
       Detection order
       1) localStorage ("preferredLanguage")
       2) URL path  => /no/home
       3) browser   => "nb-NO"
    ---------------------------------- */
    detection: {
      order: ['localStorage', 'path', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      lookupFromPathIndex: 1,
      caches: ['localStorage']
    },

    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

/* -------------------------------------------------------
   Custom rule: if localStorage *already* says "en" we want
   English, otherwise stick with fallback ("no").
-------------------------------------------------------- */
const stored = localStorage.getItem('preferredLanguage');
if (stored === 'en' && i18n.language !== 'en') {
  i18n.changeLanguage('en');
}

export default i18n;