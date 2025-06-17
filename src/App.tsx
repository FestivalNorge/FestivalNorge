// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import i18n from '@/config/i18n';

import { FestivalProvider } from '@/context/FestivalContext';
import { LocationProvider } from '@/context/LocationContext';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollManager from '@/components/common/ScrollManager';

// Pages
import HomePage            from '@/pages/HomePage';
import FestivalsPage       from '@/pages/FestivalsPage';
import FestivalDetailPage  from '@/pages/FestivalDetailPage';
import CalendarPage        from '@/pages/CalendarPage';
import MapPage             from '@/pages/MapPage';

/* ------------------------------------------------------------------ */
/*  Wrapper: keeps i18next.language === :lang param                    */
/* ------------------------------------------------------------------ */
const LangRoutes: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const safeLang = ['no', 'en'].includes(lang || '') ? lang! : 'no';

  if (i18n.language !== safeLang) {
    i18n.changeLanguage(safeLang);
  }

  return (
    <Routes>
      {/* /:lang/home, /:lang/festivals, … */}
      <Route path="home"                element={<HomePage />} />
      <Route path="festivals"           element={<FestivalsPage />} />
      <Route path="festival/:id"        element={<FestivalDetailPage />} />
      <Route path="calendar"            element={<CalendarPage />} />
      <Route path="map"                 element={<MapPage />} />

      {/* /:lang → /:lang/home */}
      <Route index       element={<Navigate to="home" replace />} />
      {/* anything unknown under the lang → /:lang/home */}
      <Route path="*"    element={<Navigate to="home" replace />} />
    </Routes>
  );
};

/* ------------------------------------------------------------------ */
/*  App                                                               */
/* ------------------------------------------------------------------ */
function App() {
  return (
    <Router>
      <LocationProvider>
        <FestivalProvider>
          <div className="flex flex-col min-h-screen">
            <ScrollManager />
            <Header />

            <main className="flex-grow">
              <Routes>
                {/* language-prefixed subtree */}
                <Route path="/:lang/*" element={<LangRoutes />} />

                {/* any un-prefixed URL → default language (no) */}
                <Route path="*" element={<Navigate to="/no/home" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </FestivalProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;