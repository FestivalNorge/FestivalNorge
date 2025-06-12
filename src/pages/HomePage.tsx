// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Calendar, Map, Star, ArrowRight, MapPin, AlertCircle} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';
import { useLocation } from '../context/LocationContext';
import { getNearbyFestivals, FestivalWithDistance } from '../services/festivalService';

// Skeleton loaders
const FestivalCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const SectionHeaderSkeleton: React.FC = () => (
  <div className="animate-pulse mb-6">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
  </div>
);

const HomePage: React.FC = () => {
  // 1) FestivalContext
  const {popularFestivals, getUpcomingFestivals, loading, error} = useFestival();
  const upcomingFestivals = getUpcomingFestivals();

  // 2) LocationContext
  const { location: userLocation, requestLocation, locationError } = useLocation();

  // 3) Local state for “nearby” workflow
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isFetchingNearby, setIsFetchingNearby] = useState(false);
  const [nearbyFestivals, setNearbyFestivals] = useState<FestivalWithDistance[]>([]);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  // Fire off geolocation when user clicks the button
  const handleRequestLocation = () => {
    setIsRequestingLocation(true);
    setHasRequestedLocation(true);
    requestLocation();
  };

  // Use the same handler for the button click

  // When userLocation changes, fetch nearby festivals
  useEffect(() => {
    if (!userLocation) {
      // If we were requesting location but got no location (error or denied)
      if (hasRequestedLocation) {
        setIsRequestingLocation(false);
      }
      return;
    }

    // We have a location, fetch nearby festivals
    const fetchNearby = async () => {
      try {
        setIsFetchingNearby(true);
        const nearby = await getNearbyFestivals(userLocation, 50); // 50 km radius
        setNearbyFestivals(nearby.slice(0, 3));
      } catch (err) {
        console.error('Error fetching nearby:', err);
      } finally {
        setIsFetchingNearby(false);
        setIsRequestingLocation(false);
      }
    };

    fetchNearby();
  }, [userLocation, hasRequestedLocation]);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70" />
        <div className="container-custom relative z-10">
          <div className="max-w-6xl animate-fade-in">
            <h1 className="text-white mb-6">Utforsk festivaler i hele Norge</h1>
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

      {/* Popular */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <SectionHeaderSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Populære Festivaler</h2>
                <p className="text-gray-600">Oppdag de mest populære festivalene i hele Norge</p>
              </div>
              <Link to="/festivals" className="text-accent-500 hover:text-accent-600 flex items-center">
                <span className="mr-1">Alle Festivaler</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <FestivalCardSkeleton key={i} />)
              : error
              ? (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Kunne ikke laste populære festivaler. Prøv på nytt.</p>
                </div>
              )
              : popularFestivals.map(f => <FestivalCard key={f.id} festival={f} />)}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <SectionHeaderSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Kommende Festivaler</h2>
                <p className="text-gray-600">Planlegg din neste festivalopplevelse</p>
              </div>
              <Link to="/calendar" className="text-accent-500 hover:text-accent-600 flex items-center">
                <span className="mr-1">Kalender</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <FestivalCardSkeleton key={i} />)
              : error
              ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Kunne ikke laste kommende festivaler. Prøv på nytt.</p>
                </div>
              )
              : upcomingFestivals.slice(0, 4).map(f => <FestivalCard key={f.id} festival={f} />)}
          </div>
        </div>
      </section>

      {/* Festivals Near You */}
      <section className="py-20 mb-16">
        <div className="container-custom">
          {!userLocation ? (
            // Step 1: Ask user for permission or show loading
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Finn festivaler i nærheten</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Se hvilke festivaler som arrangeres i nærheten av deg ved å dele din posisjon.
              </p>
              {isRequestingLocation ? (
                <p className="text-center py-2">Henter posisjon…</p>
              ) : (
                <button
                  onClick={handleRequestLocation}
                  className="btn btn-accent inline-flex items-center"
                  disabled={isRequestingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Vis festivaler i nærheten
                </button>
              )}
            </div>
          ) : locationError ? (
            // Show error if there was one
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 text-sm text-yellow-700">{locationError}</p>
              </div>
            </div>
          ) : isFetchingNearby ? (
            // Step 4: Fetching nearby festivals
            <p className="text-center py-8">Laster festivaler i nærheten…</p>
          ) : nearbyFestivals.length > 0 ? (
            // Step 5: Show results
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Festivaler i nærheten av deg</h2>
                <Link to="/map" className="text-accent-500 hover:text-accent-600 flex items-center text-sm">
                  <span className="mr-1">Se alle på kart</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {nearbyFestivals.map(f => (
                  <div key={f.id} className="relative">
                    <FestivalCard 
                      festival={f} 
                      showDistance 
                      distance={f.distance}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Step 6: No festivals found
            <p className="text-gray-600 text-center py-8">Ingen festivaler funnet i nærheten</p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Oppdag, planlegg og nyt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alle Festivaler</h3>
              <p className="text-gray-600">
                Oppdag en samling av musikk- og kulturfestivaler som foregår i hele Norge.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Festivalkalender</h3>
              <p className="text-gray-600">
                Se alle kommende festivaler i kalenderen for å finne den som passer deg.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Festivaler nær deg</h3>
              <p className="text-gray-600">
                Ved å tillate stedslokasjon kan du finne festivaler nær deg.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;