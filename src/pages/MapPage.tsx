import React, { useState, useMemo, useRef, useEffect } from 'react';
import FestivalCard from '../components/common/FestivalCard';
import FestivalMap from '../components/common/FestivalMap';
import { useFestival } from '../context/FestivalContext';
import { Festival } from '../types';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const MapPage: React.FC = () => {
  const { filteredFestivals } = useFestival();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFestival, setSelectedFestival] = useState<string | undefined>(undefined);
  const mapRef = useRef<{ flyTo: (latlng: [number, number], zoom: number, options: any) => void }>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Handle festival selection effects
  useEffect(() => {
    if (selectedFestival && listContainerRef.current) {
      // Scroll to top of the list
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Fly to the selected festival on the map
      const selected = filteredFestivals.find(f => f.id === selectedFestival);
      if (selected?.location?.coordinates && mapRef.current) {
        const { latitude, longitude } = selected.location.coordinates;
        mapRef.current.flyTo([latitude, longitude], 15, {
          duration: 1,
          animate: true
        });
        
        // Trigger a small delay to ensure the map has flown to the location before opening the popup
        const timer = setTimeout(() => {
          // This will be handled by the FestivalMap component's MapCenter effect
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [selectedFestival, filteredFestivals]);

  const handleFestivalClick = (festival: Festival) => {
    setSelectedFestival(festival.id);
  };

  // Memoize the filtered festivals to prevent unnecessary re-renders
  const filteredFestivalsWithSearch = useMemo(() => {
    if (!searchTerm) return filteredFestivals;
    
    const searchLower = searchTerm.toLowerCase();
    return filteredFestivals.filter(festival => 
      festival.name.toLowerCase().includes(searchLower) ||
      festival.location.city.toLowerCase().includes(searchLower)
    );
  }, [filteredFestivals, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const { loading, error } = useFestival();

  if (loading) {
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
    <div className="min-h-screen pt-28 pb-32">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festivalkart</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Se festivaler på kartet over Norge. Trykk på markørene for mer informasjon.
            {filteredFestivals.length === 0 && ' Ingen festivaler funnet.'}
          </p>
        </div>
      </div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
          {/* Map section */}
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Kart</h2>
              <div className="h-[calc(65vh-32px)] w-full rounded-lg overflow-hidden bg-white relative" style={{ zIndex: 1 }}>
                <FestivalMap 
                  ref={mapRef}
                  festivals={filteredFestivalsWithSearch}
                  zoom={5}
                  scrollWheelZoom={true}
                  center={[62.4208, 8.9309]} 
                  selectedFestivalId={selectedFestival}
                  onClick={(id) => id !== '' ? setSelectedFestival(id) : setSelectedFestival(undefined)}
                />
              </div>
            </div>
          </div>

          {/* Festival list section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Festivaler</h2>
              <div className="flex flex-col gap-4 h-[calc(65vh-32px)]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Søk på festivaler..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div 
                  ref={listContainerRef}
                  className="space-y-4 flex-1 overflow-y-auto"
                >
                  {filteredFestivals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Ingen festivaler funnet' : 'Ingen festivaler tilgjengelig'}
                    </div>
                  ) : (
                    <>
                      {/* Selected festival card at the top */}
                      {selectedFestival && filteredFestivals.find(f => f.id === selectedFestival) && (
                        <div 
                          key={`selected-${selectedFestival}`}
                          className="p-1 rounded-lg bg-gradient-to-r from-accent-500 to-accent-400 mb-4"
                          onClick={() => setSelectedFestival(selectedFestival)}
                        >
                          <FestivalCard 
                            festival={filteredFestivals.find(f => f.id === selectedFestival)!} 
                            isSelected={true}
                            onClick={handleFestivalClick}
                          />
                        </div>
                      )}
                      
                      {/* Remaining festivals */}
                      {filteredFestivals
                        .filter(festival => !selectedFestival || festival.id !== selectedFestival)
                        .map((festival) => (
                          <div 
                            key={festival.id}
                            className="cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:ring-1 hover:ring-gray-200 rounded-lg overflow-hidden"
                            onClick={() => setSelectedFestival(festival.id)}
                          >
                            <FestivalCard 
                              festival={festival} 
                              isSelected={false}
                              onClick={handleFestivalClick}
                            />
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;