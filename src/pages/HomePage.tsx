import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, Star, ArrowRight } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import SearchBar from '../components/common/SearchBar';
import FestivalCard from '../components/common/FestivalCard';
import Newsletter from '../components/common/Newsletter';

const HomePage: React.FC = () => {
  const { popularFestivals, getUpcomingFestivals } = useFestival();
  const upcomingFestivals = getUpcomingFestivals();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-white mb-4">
              Oppdag Norges beste festivaler
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Your one-stop destination for finding and exploring the most exciting music 
              and cultural festivals across Norway.
            </p>
            
            <div className="max-w-xl mb-8">
              <SearchBar />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/festivals" className="btn btn-accent">
                Browse All Festivals
              </Link>
              <Link to="/map" className="btn btn-outline border-white text-white hover:bg-white/10">
                View Festival Map
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      
      {/* Popular Festivals Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Festivals</h2>
              <p className="text-gray-600">Discover the most popular festivals in Norway</p>
            </div>
            <Link to="/festivals" className="text-accent-500 hover:text-accent-600 flex items-center">
              <span className="mr-1">View All</span>
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
      
      {/* Featured Festival */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Festival</h2>
              <p className="text-gray-600">Don't miss out on this amazing experience</p>
            </div>
          </div>
          
          <FestivalCard festival={popularFestivals[0]} featured />
        </div>
      </section>
      
      {/* Upcoming Festivals */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Festivals</h2>
              <p className="text-gray-600">Plan your next festival experience</p>
            </div>
            <Link to="/calendar" className="text-accent-500 hover:text-accent-600 flex items-center">
              <span className="mr-1">Calendar View</span>
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
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Discover, Plan, and Enjoy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Festivals</h3>
              <p className="text-gray-600">
                Explore a comprehensive database of music and cultural festivals happening across Norway.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find Nearby Events</h3>
              <p className="text-gray-600">
                Discover festivals happening near you with our interactive map and location-based search.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Create an account to bookmark festivals, get personalized recommendations, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container-custom max-w-xl">
          <Newsletter />
        </div>
      </section>
    </>
  );
};

export default HomePage;