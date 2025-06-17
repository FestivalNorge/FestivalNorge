// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
  const { lang }   = useParams<{ lang?: string }>();   // "no" | "en" | undefined
  const safeLang   = ['no', 'en'].includes(lang || '') ? lang! : 'no';

  /* If i18next is out of sync, just change it. No navigation. */
  useEffect(() => {
    if (i18n.language !== safeLang) {
      i18n.changeLanguage(safeLang);
    }
  }, [safeLang]);

  /* If the URL completely lacks a language segment, redirect once. */
  if (!lang) {
    return <Navigate to={`/${i18n.language}/home`} replace />;
  }

  return (
    <Routes>
      <Route path="home"      element={<HomePage />} />
      <Route path="festivals" element={<FestivalsPage />} />
      <Route path="festival/:id" element={<FestivalDetailPage />} />
      <Route path="calendar"  element={<CalendarPage />} />
      <Route path="map"       element={<MapPage />} />
      {/* fallbacks */}
      <Route index       element={<Navigate to="home" replace />} />
      <Route path="*"    element={<Navigate to="home" replace />} />
    </Routes>
  );
};

const LangRedirect: React.FC = () => (
  <Navigate to={`/${i18n.language}/home`} replace />
);

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
                {/* root or any path without language → use current i18n language */}
                <Route path="/"  element={<LangRedirect />} />
                <Route path="*"  element={<LangRedirect />} />

                {/* all real routes */}
                <Route path="/:lang/*" element={<LangRoutes />} />
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