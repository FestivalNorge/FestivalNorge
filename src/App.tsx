import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FestivalProvider } from './context/FestivalContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollManager from './components/common/ScrollManager';

// Pages
import HomePage from './pages/HomePage';
import FestivalsPage from './pages/FestivalsPage';
import FestivalDetailPage from './pages/FestivalDetailPage';
import CalendarPage from './pages/CalendarPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';
import MyFestivalsPage from './pages/MyFestivalsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FestivalProvider>
        <div className="flex flex-col min-h-screen">
          <ScrollManager />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/festivals" element={<FestivalsPage />} />
              <Route path="/festival/:id" element={<FestivalDetailPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/my-festivals" element={<MyFestivalsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </FestivalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;