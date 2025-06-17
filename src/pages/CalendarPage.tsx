import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFestival } from '../context/FestivalContext';
import CalendarView from '../components/common/CalendarView';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CalendarPage: React.FC = () => {
  const { festivals } = useFestival();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node) &&
          genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
        setIsGenreOpen(false);
      }
    };

    // Add event listener when any dropdown is open
    if (isLocationOpen || isGenreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen, isGenreOpen]);

  // Get unique locations and genres from festivals
  const { locations, genres } = useMemo(() => {
    const locationSet = new Set<string>();
    const genreSet = new Set<string>();

    festivals.forEach(festival => {
      if (festival.location?.city) {
        locationSet.add(festival.location.city);
      }
      festival.genres?.forEach(genre => genreSet.add(genre));
    });

    return {
      locations: Array.from(locationSet).sort(),
      genres: Array.from(genreSet).sort()
    };
  }, [festivals]);

  // Filter festivals based on selected filters
  const filteredFestivals = useMemo(() => {
    return festivals.filter(festival => {
      const matchesLocation = selectedLocation === 'all' || 
        festival.location?.city === selectedLocation;
      
      const matchesGenre = selectedGenre === 'all' || 
        festival.genres?.includes(selectedGenre);
      
      return matchesLocation && matchesGenre;
    });
  }, [festivals, selectedLocation, selectedGenre]);

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('calendar.title')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            {t('calendar.description')}
          </p>
          
          {/* Filters */}
          <div className="w-full mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Location Filter */}
              <div className="relative flex-1" ref={locationRef}>
                <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('calendar.filter_city.title')}
                </label>
                <div className="relative">
                  <button
                    id="location-filter"
                    type="button"
                    className="flex items-center justify-between w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => {
                      setIsLocationOpen(!isLocationOpen);
                      if (isGenreOpen) setIsGenreOpen(false);
                    }}
                  >
                    <span className="truncate">{selectedLocation === 'all' ? t('calendar.filter_city.placeholder') : selectedLocation}</span>
                    <ChevronDown className={`w-5 h-5 ml-2 flex-shrink-0 transition-transform ${isLocationOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isLocationOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="py-1 max-h-60 overflow-auto">
                        <button
                          key="all-locations"
                          className={`block w-full text-left px-4 py-2.5 text-base ${selectedLocation === 'all' ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => {
                            setSelectedLocation('all');
                            setIsLocationOpen(false);
                          }}
                        >
                          {t('calendar.filter_city.placeholder')}
                        </button>
                        {locations.map((location) => (
                          <button
                            key={location}
                            className={`block w-full text-left px-4 py-2.5 text-base ${selectedLocation === location ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => {
                              setSelectedLocation(location);
                              setIsLocationOpen(false);
                            }}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="relative flex-1" ref={genreRef}>
                <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('calendar.filter_genre.title')}
                </label>
                <div className="relative">
                  <button
                    id="genre-filter"
                    type="button"
                    className="flex items-center justify-between w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => {
                      setIsGenreOpen(!isGenreOpen);
                      if (isLocationOpen) setIsLocationOpen(false);
                    }}
                  >
                    <span className="truncate">{selectedGenre === 'all' ? t('calendar.filter_genre.placeholder') : selectedGenre}</span>
                    <ChevronDown className={`w-5 h-5 ml-2 flex-shrink-0 transition-transform ${isGenreOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isGenreOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="py-1 max-h-60 overflow-auto">
                        <button
                          key="all-genres"
                          className={`block w-full text-left px-4 py-2.5 text-base ${selectedGenre === 'all' ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => {
                            setSelectedGenre('all');
                            setIsGenreOpen(false);
                          }}
                        >
                          {t('calendar.filter_genre.placeholder')}
                        </button>
                        {genres.map((genre) => (
                          <button
                            key={genre}
                            className={`block w-full text-left px-4 py-2.5 text-base ${selectedGenre === genre ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => {
                              setSelectedGenre(genre);
                              setIsGenreOpen(false);
                            }}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Component */}
        <CalendarView festivals={filteredFestivals} />
      </div>
    </div>
  );
};

export default CalendarPage;