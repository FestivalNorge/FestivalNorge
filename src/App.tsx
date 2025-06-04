import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FestivalProvider } from './context/FestivalContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import FestivalsPage from './pages/FestivalsPage';
import FestivalDetailPage from './pages/FestivalDetailPage';
import CalendarPage from './pages/CalendarPage';
import MapPage from './pages/MapPage';
import MyFestivalsPage from './pages/MyFestivalsPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FestivalProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <ScrollToTop>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/festivals" element={<FestivalsPage />} />
                  <Route path="/festival/:id" element={<FestivalDetailPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/my-festivals" element={<MyFestivalsPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<AuthPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </ScrollToTop>
            </main>
            <Footer />
          </div>
        </FestivalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;