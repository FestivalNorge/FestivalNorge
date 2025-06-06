import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, Star, ArrowRight } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';

const HomePage: React.FC = () => {
  const { popularFestivals, getUpcomingFestivals } = useFestival();
  const upcomingFestivals = getUpcomingFestivals();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-6xl animate-fade-in">
            <h1 className="text-white mb-6">
              Opplev Norges beste festivaler
            </h1>
            <p className="text-white/90 text-lg mb-8">
            Finn og utforske de mest spennende musikk- og kulturfestivalene i hele Norge.
            </p>
            
            <div className="max-w-2xl w-full mb-10">
              <SearchBar 
                placeholder="Søk etter festivaler, steder eller sjangere..."
                className="w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/festivals" className="btn btn-accent">
                Alle Festivaler
              </Link>
              <Link to="/map" className="btn btn-outline border-white text-white hover:bg-white/10">
                Kart over festivaler
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Festivals Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Populære Festivaler</h2>
              <p className="text-gray-600">Oppdag de mest populære festivalene i hele Norge</p>
            </div>
            <Link to="/festivals" className="text-accent-500 hover:text-accent-600 flex items-center">
              <span className="mr-1">Alle Festivaler</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularFestivals.slice(0, 3).map(festival => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Festivals */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Kommende Festivaler</h2>
              <p className="text-gray-600">Planlegg din neste festival opplevelse</p>
            </div>
            <Link to="/calendar" className="text-accent-500 hover:text-accent-600 flex items-center">
              <span className="mr-1">Kalender</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFestivals.slice(0, 4).map(festival => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-primary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Oppdag, planlegg og nyt</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Festivaler nær deg</h3>
              <p className="text-gray-600">
                Oppdag en samling av musikk- og kulturfestivaler som foregår nær deg.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chat med andre deltagere</h3>
              <p className="text-gray-600">
                Bli med i gruppechatter med andre som skal til samme festivaler.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lagre favoritter</h3>
              <p className="text-gray-600">
                Opprett en konto for å lagre festivaler, få personlige anbefalinger, påminnelser og mer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;