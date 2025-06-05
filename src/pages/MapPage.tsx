import React, { useState, useEffect } from 'react';
import { Festival } from '../types';
import FestivalCard from '../components/common/FestivalCard';
import FestivalMap from '../components/common/FestivalMap';
import { getFestivals } from '../services/festivalService';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const MapPage: React.FC = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setIsLoading(true);
        const data = await getFestivals();
        setFestivals(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch festivals:', err);
        setError('Kunne ikke laste inn festivaler. Prøv igjen senere.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  // Sort festivals with selected one at top
  const sortedFestivals = [...festivals].sort((a, b) => {
    const aSelected = a.id === selectedFestival;
    const bSelected = b.id === selectedFestival;
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster festivaler...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festivalkart</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Se festivaler på kartet over Norge. Trykk på markørene for mer informasjon.
            {festivals.length === 0 && ' Ingen festivaler funnet.'}
          </p>
        </div>
      </div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
          {/* Map section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Kart</h2>
              <div className="h-[400px] sm:h-[500px] w-full rounded-lg overflow-hidden relative bg-white">
                <FestivalMap 
                  festivals={festivals} 
                  zoom={5.3} 
                  scrollWheelZoom={true}
                  center={[60.472, 8.4689]}
                  className="w-full h-full relative"
                  selectedFestivalId={selectedFestival}
                  onClick={(id: string) => setSelectedFestival(id)}
                />
              </div>
            </div>
          </div>

          {/* Festival list section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Festivaler</h2>
              <div className="space-y-4">
                {sortedFestivals.map((festival) => (
                  <div 
                    key={festival.id} 
                    className={`cursor-pointer transition-colors ${
                      festival.id === selectedFestival ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedFestival(festival.id)}
                  >
                    <FestivalCard festival={festival} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;